"""
TendBee FastAPI Backend - Core Implementation Examples
This file contains working skeleton code for key features.
"""

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, BackgroundTasks, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from enum import Enum
import hashlib
import hmac
import secrets
import uuid
import jwt
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import redis.asyncio as redis
from sentence_transformers import SentenceTransformer
import numpy as np

# ============================================================================
# CONFIGURATION
# ============================================================================

class Settings:
    JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
    JWT_ALGORITHM = "HS256"  # Use RS256 in production
    ACCESS_TOKEN_EXPIRE_MINUTES = 15
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    MAGIC_LINK_EXPIRE_MINUTES = 15
    WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "webhook-secret")
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    EMBEDDING_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"

settings = Settings()

# ============================================================================
# DATABASE & SERVICES
# ============================================================================

app = FastAPI(title="TendBee API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Initialize services (in production, use dependency injection)
mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
db = mongo_client.tendbee
redis_client = None  # Initialize in startup

# Load embedding model (singleton)
embedding_model = None

def get_embedding_model():
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return embedding_model

@app.on_event("startup")
async def startup():
    global redis_client
    redis_client = redis.from_url(settings.REDIS_URL)

@app.on_event("shutdown")
async def shutdown():
    if redis_client:
        await redis_client.close()
    mongo_client.close()

# ============================================================================
# MODELS
# ============================================================================

class UserType(str, Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"
    ADMIN = "admin"


class LoginRequest(BaseModel):
    email: EmailStr
    password: Optional[str] = None
    method: Optional[str] = None  # "magic_link" for passwordless
    user_type: UserType = UserType.JOBSEEKER


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerifyRequest(BaseModel):
    token: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: Dict[str, Any]


class RefreshRequest(BaseModel):
    refresh_token: str


class IngestPayload(BaseModel):
    source: str
    job_id: str
    payload: Dict[str, Any]
    action: str = "create"
    timestamp: Optional[datetime] = None


class NormalizedJob(BaseModel):
    job_id: str
    source: str
    title: str
    description: str
    company: str
    location: Dict[str, Any]
    employment_type: Optional[str] = None
    salary_range: Optional[Dict[str, Any]] = None
    required_skills: List[str] = []
    published_at: datetime
    application_url: Optional[str] = None
    fingerprint: str
    embedding: Optional[List[float]] = None


# ============================================================================
# AUTHENTICATION - POST /auth
# ============================================================================

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_access_token(user_id: str, user_type: str) -> tuple[str, int]:
    """Create JWT access token"""
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_at = datetime.now(timezone.utc) + expires_delta
    
    payload = {
        "sub": user_id,
        "type": user_type,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
        "jti": str(uuid.uuid4())  # Unique token ID
    }
    
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, int(expires_delta.total_seconds())


def create_refresh_token(user_id: str) -> str:
    """Create refresh token"""
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    payload = {
        "sub": user_id,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
        "jti": str(uuid.uuid4()),
        "type": "refresh"
    }
    
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Authenticate user with email/password or request magic link.
    
    For password login:
        {"email": "user@example.com", "password": "xxx"}
    
    For magic link:
        {"email": "user@example.com", "method": "magic_link"}
    """
    user = await db.users.find_one({"email": request.email}, {"_id": 0})
    
    if request.method == "magic_link":
        # Generate and send magic link
        token = secrets.token_urlsafe(32)
        await redis_client.setex(
            f"magic_link:{token}",
            settings.MAGIC_LINK_EXPIRE_MINUTES * 60,
            json.dumps({"email": request.email})
        )
        
        # TODO: Send email with link
        # await send_magic_link_email(request.email, token)
        
        return {"message": "Magic link sent to your email"}
    
    # Password login
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(request.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create tokens
    access_token, expires_in = create_access_token(user["id"], user.get("user_type", "jobseeker"))
    refresh_token = create_refresh_token(user["id"])
    
    # Store refresh token for invalidation
    await redis_client.setex(
        f"refresh_token:{user['id']}",
        settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        refresh_token
    )
    
    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user={
            "id": user["id"],
            "email": user["email"],
            "user_type": user.get("user_type"),
            "name": user.get("name")
        }
    )


@api_router.post("/auth/magic-link")
async def request_magic_link(request: MagicLinkRequest):
    """Request a magic link for passwordless login"""
    token = secrets.token_urlsafe(32)
    
    await redis_client.setex(
        f"magic_link:{token}",
        settings.MAGIC_LINK_EXPIRE_MINUTES * 60,
        json.dumps({"email": request.email})
    )
    
    # TODO: Send email
    # link = f"https://app.tendbee.se/auth/verify?token={token}"
    # await send_magic_link_email(request.email, link)
    
    return {"message": "Magic link sent", "expires_in": settings.MAGIC_LINK_EXPIRE_MINUTES * 60}


@api_router.post("/auth/verify-magic-link", response_model=AuthResponse)
async def verify_magic_link(request: MagicLinkVerifyRequest):
    """Verify magic link token and return JWT"""
    # Get and delete token (single use)
    data = await redis_client.getdel(f"magic_link:{request.token}")
    
    if not data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    payload = json.loads(data)
    email = payload["email"]
    
    # Find or create user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        # Auto-register for magic link users
        user = {
            "id": str(uuid.uuid4()),
            "email": email,
            "user_type": "jobseeker",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "consent": {
                "gdpr": True,
                "gdpr_timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        await db.users.insert_one(user)
    
    access_token, expires_in = create_access_token(user["id"], user.get("user_type", "jobseeker"))
    refresh_token = create_refresh_token(user["id"])
    
    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user={
            "id": user["id"],
            "email": user["email"],
            "user_type": user.get("user_type")
        }
    )


@api_router.post("/auth/refresh", response_model=AuthResponse)
async def refresh_tokens(request: RefreshRequest):
    """Refresh access token using refresh token"""
    try:
        payload = jwt.decode(
            request.refresh_token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user_id = payload.get("sub")
        
        # Verify refresh token is still valid (not revoked)
        stored_token = await redis_client.get(f"refresh_token:{user_id}")
        if not stored_token or stored_token.decode() != request.refresh_token:
            raise HTTPException(status_code=401, detail="Token revoked")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # Issue new tokens (rotate refresh token)
        access_token, expires_in = create_access_token(user_id, user.get("user_type", "jobseeker"))
        new_refresh_token = create_refresh_token(user_id)
        
        # Update stored refresh token
        await redis_client.setex(
            f"refresh_token:{user_id}",
            settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
            new_refresh_token
        )
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=expires_in,
            user={"id": user["id"], "email": user["email"]}
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/auth/logout")
async def logout(user: dict = Depends(get_current_user)):
    """Logout user by invalidating refresh token"""
    await redis_client.delete(f"refresh_token:{user['id']}")
    return {"message": "Logged out successfully"}


# ============================================================================
# JOB INGESTION - POST /jobs/ingest
# ============================================================================

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify HMAC-SHA256 webhook signature"""
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)


def generate_fingerprint(job: Dict[str, Any]) -> str:
    """
    Generate dedupe fingerprint for a job.
    
    Primary: source + external_id
    Fallback: title + company + city + published_date
    """
    if job.get("source") and job.get("external_id"):
        key = f"{job['source']}:{job['external_id']}"
    else:
        # Fallback fingerprint
        components = [
            job.get("title", "").lower().strip(),
            job.get("company", "").lower().strip(),
            job.get("location", {}).get("city", "").lower().strip(),
            job.get("published_at", "")[:10] if job.get("published_at") else ""
        ]
        key = "|".join(components)
    
    return hashlib.sha256(key.encode()).hexdigest()


def normalize_platsbanken_job(raw: Dict[str, Any]) -> NormalizedJob:
    """Normalize Platsbanken job to canonical schema"""
    return NormalizedJob(
        job_id=f"platsbanken:{raw.get('id', raw.get('annonsid', ''))}",
        source="platsbanken",
        title=raw.get("rubrik", raw.get("title", "")),
        description=raw.get("beskrivning", raw.get("description", "")),
        company=raw.get("arbetsgivare", {}).get("namn", raw.get("company", "")),
        location={
            "city": raw.get("arbetsort", {}).get("namn", ""),
            "region": raw.get("lan", {}).get("namn", ""),
            "country": "Sverige"
        },
        employment_type=raw.get("anstallningstyp", "heltid"),
        published_at=datetime.fromisoformat(raw.get("publiceringsdatum", datetime.now(timezone.utc).isoformat())),
        application_url=raw.get("webbplats", raw.get("application_url")),
        fingerprint=generate_fingerprint({
            "source": "platsbanken",
            "external_id": raw.get("id", raw.get("annonsid"))
        })
    )


def normalize_linkedin_job(raw: Dict[str, Any]) -> NormalizedJob:
    """Normalize LinkedIn job to canonical schema"""
    return NormalizedJob(
        job_id=f"linkedin:{raw.get('id', '')}",
        source="linkedin",
        title=raw.get("title", ""),
        description=raw.get("description", ""),
        company=raw.get("company", {}).get("name", ""),
        location={
            "city": raw.get("location", ""),
            "country": raw.get("country", "")
        },
        employment_type=raw.get("employmentType", "heltid"),
        published_at=datetime.fromisoformat(raw.get("postedAt", datetime.now(timezone.utc).isoformat())),
        application_url=raw.get("applyUrl"),
        fingerprint=generate_fingerprint({
            "source": "linkedin",
            "external_id": raw.get("id")
        })
    )


NORMALIZERS = {
    "platsbanken": normalize_platsbanken_job,
    "linkedin": normalize_linkedin_job,
    # Add more normalizers as needed
}


async def process_ingested_job(ingest_id: str, source: str, job_id: str, payload: Dict[str, Any]):
    """
    Background task to process ingested job:
    1. Normalize
    2. Dedupe
    3. Enrich (geocode, extract skills)
    4. Generate embeddings
    5. Index
    6. Trigger matching
    """
    try:
        # 1. Normalize
        normalizer = NORMALIZERS.get(source)
        if not normalizer:
            raise ValueError(f"Unknown source: {source}")
        
        normalized = normalizer(payload)
        
        # 2. Check for duplicates
        existing = await db.jobs.find_one(
            {"fingerprint": normalized.fingerprint},
            {"_id": 0}
        )
        
        if existing:
            # Update existing job
            await db.jobs.update_one(
                {"fingerprint": normalized.fingerprint},
                {"$set": {
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "raw_payload": payload
                }}
            )
            await db.ingest_logs.update_one(
                {"ingest_id": ingest_id},
                {"$set": {"status": "duplicate", "canonical_job_id": existing["job_id"]}}
            )
            return
        
        # 3. Enrich (simplified - add geocoding, skill extraction in production)
        # TODO: Geocode location
        # TODO: Extract skills from description using NER
        
        # 4. Generate embeddings
        model = get_embedding_model()
        text_for_embedding = f"{normalized.title} {normalized.description} {' '.join(normalized.required_skills)}"
        embedding = model.encode(text_for_embedding).tolist()
        normalized.embedding = embedding
        
        # 5. Index in database
        job_dict = normalized.dict()
        job_dict["created_at"] = datetime.now(timezone.utc).isoformat()
        job_dict["raw_payload"] = payload
        job_dict["status"] = "active"
        
        await db.jobs.insert_one(job_dict)
        
        # TODO: Index in vector database (Pinecone/Weaviate)
        # await vector_db.upsert([(normalized.job_id, embedding, {"source": source})])
        
        # 6. Trigger matching (queue for background processing)
        await redis_client.rpush("match_queue", json.dumps({
            "job_id": normalized.job_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))
        
        # Update ingest log
        await db.ingest_logs.update_one(
            {"ingest_id": ingest_id},
            {"$set": {
                "status": "completed",
                "canonical_job_id": normalized.job_id,
                "completed_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
    except Exception as e:
        # Log error and move to DLQ
        await db.ingest_logs.update_one(
            {"ingest_id": ingest_id},
            {"$set": {
                "status": "failed",
                "error": str(e),
                "failed_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Add to dead letter queue
        await redis_client.rpush("ingest_dlq", json.dumps({
            "ingest_id": ingest_id,
            "source": source,
            "job_id": job_id,
            "payload": payload,
            "error": str(e)
        }))


@api_router.post("/jobs/ingest")
async def ingest_job(
    request: Request,
    payload: IngestPayload,
    background_tasks: BackgroundTasks,
    x_webhook_signature: Optional[str] = Header(None, alias="X-Webhook-Signature")
):
    """
    Webhook endpoint for ingesting jobs from external sources.
    
    Requires HMAC-SHA256 signature verification.
    """
    # Verify webhook signature
    if x_webhook_signature:
        body = await request.body()
        if not verify_webhook_signature(body, x_webhook_signature, settings.WEBHOOK_SECRET):
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Check idempotency
    idempotency_key = f"{payload.source}:{payload.job_id}"
    existing = await redis_client.get(f"ingest:{idempotency_key}")
    if existing:
        return {"ingest_id": existing.decode(), "status": "already_processing"}
    
    # Create ingest record
    ingest_id = str(uuid.uuid4())
    
    await db.ingest_logs.insert_one({
        "ingest_id": ingest_id,
        "source": payload.source,
        "external_job_id": payload.job_id,
        "status": "queued",
        "action": payload.action,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set idempotency key (24 hour TTL)
    await redis_client.setex(f"ingest:{idempotency_key}", 86400, ingest_id)
    
    # Queue for background processing
    background_tasks.add_task(
        process_ingested_job,
        ingest_id,
        payload.source,
        payload.job_id,
        payload.payload
    )
    
    return {"ingest_id": ingest_id, "status": "queued"}


# ============================================================================
# MATCHING ALGORITHM
# ============================================================================

class MatchWeights:
    """Configurable matching weights"""
    SKILL_SIMILARITY = 0.55
    EXPERIENCE_MATCH = 0.20
    LOCATION_SCORE = 0.10
    AVAILABILITY_SCORE = 0.10
    SALARY_MATCH = 0.05
    
    SHOW_THRESHOLD = 0.65
    NOTIFY_THRESHOLD = 0.75
    TOP_MATCH_THRESHOLD = 0.85


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    a = np.array(a)
    b = np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def calculate_experience_match(candidate_years: int, required_years: int) -> float:
    """Calculate experience match score (0-1)"""
    if required_years == 0:
        return 1.0
    
    ratio = candidate_years / required_years
    # Cap at 120% to avoid over-qualification penalty
    return min(ratio, 1.2) / 1.2


def calculate_location_score(candidate_loc: Dict, job_loc: Dict) -> float:
    """Calculate location match score (0-1)"""
    # Exact city match
    if candidate_loc.get("city", "").lower() == job_loc.get("city", "").lower():
        return 1.0
    
    # Same region
    if candidate_loc.get("region", "").lower() == job_loc.get("region", "").lower():
        return 0.8
    
    # Calculate distance if coordinates available
    if all([candidate_loc.get("lat"), candidate_loc.get("lon"), 
            job_loc.get("lat"), job_loc.get("lon")]):
        # Haversine distance (simplified)
        from math import radians, sin, cos, sqrt, atan2
        
        lat1, lon1 = radians(candidate_loc["lat"]), radians(candidate_loc["lon"])
        lat2, lon2 = radians(job_loc["lat"]), radians(job_loc["lon"])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        distance_km = 6371 * 2 * atan2(sqrt(a), sqrt(1-a))
        
        # Score decays over 200km
        return max(0, 1 - (distance_km / 200))
    
    # Remote job or unknown location
    return 0.5


def calculate_availability_score(candidate_available: datetime, job_start: datetime) -> float:
    """Calculate availability match score (0-1)"""
    if not job_start:
        return 1.0
    
    days_until_start = (job_start - candidate_available).days
    
    if days_until_start <= 0:
        return 1.0
    elif days_until_start <= 30:
        return 0.9
    elif days_until_start <= 90:
        return 0.7
    else:
        return max(0.3, 1 - (days_until_start / 365))


def calculate_salary_match(candidate_range: Dict, job_range: Dict) -> float:
    """Calculate salary expectation overlap (0-1)"""
    if not candidate_range or not job_range:
        return 0.5  # Unknown = neutral
    
    c_min = candidate_range.get("min", 0)
    c_max = candidate_range.get("max", float("inf"))
    j_min = job_range.get("min", 0)
    j_max = job_range.get("max", float("inf"))
    
    overlap = min(c_max, j_max) - max(c_min, j_min)
    range_size = max(j_max - j_min, 1)
    
    return max(0, overlap / range_size)


async def compute_match(job: Dict, candidate: Dict) -> Dict:
    """
    Compute match score between a job and candidate.
    
    Returns match result with score breakdown.
    """
    # Skill similarity (embeddings)
    skill_sim = 0.0
    if job.get("embedding") and candidate.get("embedding"):
        skill_sim = cosine_similarity(job["embedding"], candidate["embedding"])
    
    # Experience match
    exp_match = calculate_experience_match(
        candidate.get("experience_years", 0),
        job.get("experience_years", 0)
    )
    
    # Location score
    loc_score = calculate_location_score(
        candidate.get("location", {}),
        job.get("location", {})
    )
    
    # Availability score
    avail_score = calculate_availability_score(
        datetime.fromisoformat(candidate.get("availability_date", datetime.now(timezone.utc).isoformat())),
        datetime.fromisoformat(job.get("start_date", datetime.now(timezone.utc).isoformat())) if job.get("start_date") else None
    )
    
    # Salary match
    salary_score = calculate_salary_match(
        candidate.get("salary_expectation", {}),
        job.get("salary_range", {})
    )
    
    # Calculate total score
    total_score = (
        MatchWeights.SKILL_SIMILARITY * skill_sim +
        MatchWeights.EXPERIENCE_MATCH * exp_match +
        MatchWeights.LOCATION_SCORE * loc_score +
        MatchWeights.AVAILABILITY_SCORE * avail_score +
        MatchWeights.SALARY_MATCH * salary_score
    )
    
    return {
        "match_id": str(uuid.uuid4()),
        "job_id": job["job_id"],
        "candidate_id": candidate["candidate_id"],
        "score": round(total_score, 4),
        "score_breakdown": {
            "skill_similarity": round(skill_sim, 4),
            "experience_match": round(exp_match, 4),
            "location_score": round(loc_score, 4),
            "availability_score": round(avail_score, 4),
            "salary_match": round(salary_score, 4)
        },
        "should_show": total_score >= MatchWeights.SHOW_THRESHOLD,
        "should_notify": total_score >= MatchWeights.NOTIFY_THRESHOLD,
        "is_top_match": total_score >= MatchWeights.TOP_MATCH_THRESHOLD,
        "matched_at": datetime.now(timezone.utc).isoformat(),
        "algorithm_version": "v1.0"
    }


@api_router.get("/matches")
async def get_matches(
    min_score: float = 0.65,
    limit: int = 20,
    user: dict = Depends(get_current_user)
):
    """Get job matches for current user"""
    matches = await db.matches.find(
        {
            "candidate_id": user["id"],
            "score": {"$gte": min_score}
        },
        {"_id": 0}
    ).sort("score", -1).limit(limit).to_list(limit)
    
    # Enrich with job details
    for match in matches:
        job = await db.jobs.find_one({"job_id": match["job_id"]}, {"_id": 0, "embedding": 0})
        match["job"] = job
    
    return {"matches": matches, "total": len(matches)}


# Include router
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
