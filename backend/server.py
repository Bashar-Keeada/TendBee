from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum
import hashlib
import secrets


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'jobbmatchning')]

# Create the main app
app = FastAPI(
    title="Jobbmatchning API",
    description="AI-baserad jobbmatchningsplattform API",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ===================== ENUMS =====================
class UserType(str, Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"

class EmploymentStatus(str, Enum):
    EMPLOYED = "employed"
    UNEMPLOYED = "unemployed"

class JobType(str, Enum):
    FULLTIME = "fulltime"
    PARTTIME = "parttime"
    EVENING = "evening"
    WEEKEND = "weekend"


# ===================== MODELS =====================

# ----- User/Profile Models -----
class JobSeekerProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    age: int
    phone: str
    email: Optional[str] = None
    
    # Employment Status
    is_employed: bool = False
    months_unemployed: Optional[int] = None
    is_registered_af: Optional[bool] = None
    af_supports: List[str] = []
    praktik_duration: Optional[int] = None
    praktik_start_date: Optional[str] = None
    
    # Location Preferences
    country: str = "Sverige"
    cities: List[str] = []
    remote_work: bool = False
    
    # Salary Preferences
    min_salary: int = 25000
    salary_negotiable: bool = False
    
    # Experience & Skills
    job_categories: List[str] = []
    languages: List[str] = []
    
    # Availability
    start_date: Optional[str] = None
    work_types: List[str] = []
    has_drivers_license: bool = False
    has_car: bool = False
    
    # Course completions
    online_course_completed: bool = False
    physical_course_completed: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JobSeekerCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    phone: str
    email: Optional[str] = None

class JobSeekerUpdate(BaseModel):
    is_employed: Optional[bool] = None
    months_unemployed: Optional[int] = None
    is_registered_af: Optional[bool] = None
    af_supports: Optional[List[str]] = None
    praktik_duration: Optional[int] = None
    praktik_start_date: Optional[str] = None
    country: Optional[str] = None
    cities: Optional[List[str]] = None
    remote_work: Optional[bool] = None
    min_salary: Optional[int] = None
    salary_negotiable: Optional[bool] = None
    job_categories: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    start_date: Optional[str] = None
    work_types: Optional[List[str]] = None
    has_drivers_license: Optional[bool] = None
    has_car: Optional[bool] = None
    online_course_completed: Optional[bool] = None
    physical_course_completed: Optional[bool] = None


# ----- Company Models -----
class Company(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    org_number: str
    contact_person: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: str
    industry: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CompanyCreate(BaseModel):
    company_name: str
    org_number: str
    contact_person: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: str
    industry: str


# ----- Job Models -----
class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    title: str
    location: str
    employment_type: str  # fulltime, parttime, etc.
    salary_min: int
    salary_max: int
    description: str
    
    # Requirements
    experience_level: str = "none"  # none, junior, mid, senior
    required_languages: List[str] = []
    requires_drivers_license: bool = False
    start_immediately: bool = False
    
    # Status
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JobCreate(BaseModel):
    company_id: str
    title: str
    location: str
    employment_type: str
    salary_min: int
    salary_max: int
    description: str
    experience_level: str = "none"
    required_languages: List[str] = []
    requires_drivers_license: bool = False
    start_immediately: bool = False

class JobWithMatch(Job):
    match_score: int = 0
    company_name: Optional[str] = None


# ----- Interest/Application Models -----
class JobInterest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    jobseeker_id: str
    status: str = "pending"  # pending, reviewed, interview, rejected, hired
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JobInterestCreate(BaseModel):
    job_id: str
    jobseeker_id: str


# ----- Calendar Invite Models -----
class CalendarInvite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    jobseeker_id: str
    company_id: str
    title: str
    date: str
    time: str
    duration_minutes: int = 60
    location: str
    description: Optional[str] = None
    status: str = "pending"  # pending, accepted, declined
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CalendarInviteCreate(BaseModel):
    job_id: str
    jobseeker_id: str
    company_id: str
    title: str
    date: str
    duration_minutes: int = 60
    location: str
    description: Optional[str] = None


# ----- Auth Models -----
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    user_type: str = "jobseeker"  # jobseeker or employer

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    user_type: str
    profile_id: Optional[str] = None
    created_at: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None


# ===================== AUTH HELPER FUNCTIONS =====================

# Get salt from environment variable
SALT_SECRET = os.environ.get('SALT_SECRET', 'tendbee_default_salt_2025')

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt"""
    return hashlib.sha256(f"{password}{SALT_SECRET}".encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def generate_token() -> str:
    """Generate a simple session token"""
    return secrets.token_urlsafe(32)


# ===================== HELPER FUNCTIONS =====================

def calculate_match_score(jobseeker: dict, job: dict) -> int:
    """Calculate AI match score between jobseeker and job"""
    score = 0
    max_score = 0
    
    # Location match (25 points)
    max_score += 25
    job_location = job.get('location', '').lower()
    for city in jobseeker.get('cities', []):
        if city.lower() in job_location:
            score += 25
            break
    if jobseeker.get('remote_work') and 'distans' in job_location.lower():
        score += 25
    
    # Job category match (25 points)
    max_score += 25
    job_title = job.get('title', '').lower()
    for category in jobseeker.get('job_categories', []):
        if category.lower() in job_title or 'lager' in job_title and 'warehouse' in category.lower():
            score += 25
            break
    
    # Language match (20 points)
    max_score += 20
    required_langs = job.get('required_languages', [])
    seeker_langs = jobseeker.get('languages', [])
    if required_langs:
        matching_langs = set([l.lower() for l in required_langs]) & set([l.lower() for l in seeker_langs])
        if matching_langs:
            score += int(20 * len(matching_langs) / len(required_langs))
    else:
        score += 20  # No language requirement
    
    # Driver's license match (10 points)
    max_score += 10
    if job.get('requires_drivers_license'):
        if jobseeker.get('has_drivers_license'):
            score += 10
    else:
        score += 10  # Not required
    
    # Work type match (10 points)
    max_score += 10
    job_type = job.get('employment_type', '')
    seeker_types = jobseeker.get('work_types', [])
    if job_type in seeker_types or not seeker_types:
        score += 10
    
    # Salary match (10 points)
    max_score += 10
    job_salary_max = job.get('salary_max', 0)
    seeker_min_salary = jobseeker.get('min_salary', 0)
    if job_salary_max >= seeker_min_salary or jobseeker.get('salary_negotiable'):
        score += 10
    
    # Calculate percentage
    if max_score > 0:
        return int((score / max_score) * 100)
    return 50  # Default score


async def serialize_doc(doc: dict) -> dict:
    """Serialize MongoDB document for JSON response"""
    if doc and '_id' in doc:
        del doc['_id']
    if doc and 'created_at' in doc and isinstance(doc['created_at'], str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    if doc and 'updated_at' in doc and isinstance(doc['updated_at'], str):
        doc['updated_at'] = datetime.fromisoformat(doc['updated_at'])
    return doc


# ===================== API ROUTES =====================

# ----- Health Check -----
@api_router.get("/")
async def root():
    return {"message": "Jobbmatchning API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}


# ----- Auth Routes -----
@api_router.post("/auth/register", response_model=AuthResponse)
async def register_user(input: UserRegister):
    """Register a new user"""
    # Check if email already exists
    existing = await db.users.find_one({"email": input.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email redan registrerad")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(input.password)
    token = generate_token()
    
    user_doc = {
        "id": user_id,
        "email": input.email.lower(),
        "password": hashed_pwd,
        "first_name": input.first_name,
        "last_name": input.last_name,
        "user_type": input.user_type,
        "profile_id": None,
        "token": token,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Also create a jobseeker profile if user_type is jobseeker
    profile_id = None
    if input.user_type == "jobseeker":
        profile = JobSeekerProfile(
            first_name=input.first_name,
            last_name=input.last_name,
            age=0,  # Will be updated later
            phone="",  # Will be updated later
            email=input.email.lower()
        )
        profile_doc = profile.model_dump()
        profile_doc['created_at'] = profile_doc['created_at'].isoformat()
        profile_doc['updated_at'] = profile_doc['updated_at'].isoformat()
        await db.jobseekers.insert_one(profile_doc)
        profile_id = profile.id
        
        # Update user with profile_id
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"profile_id": profile_id}}
        )
    
    return AuthResponse(
        success=True,
        message="Konto skapat!",
        user=UserResponse(
            id=user_id,
            email=input.email.lower(),
            first_name=input.first_name,
            last_name=input.last_name,
            user_type=input.user_type,
            profile_id=profile_id,
            created_at=user_doc['created_at']
        ),
        token=token
    )

@api_router.post("/auth/login", response_model=AuthResponse)
async def login_user(input: UserLogin):
    """Login a user"""
    # Find user by email
    user = await db.users.find_one({"email": input.email.lower()}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Fel email eller lösenord")
    
    # Verify password
    if not verify_password(input.password, user['password']):
        raise HTTPException(status_code=401, detail="Fel email eller lösenord")
    
    # Generate new token
    token = generate_token()
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {"token": token}}
    )
    
    return AuthResponse(
        success=True,
        message="Inloggning lyckades!",
        user=UserResponse(
            id=user['id'],
            email=user['email'],
            first_name=user['first_name'],
            last_name=user['last_name'],
            user_type=user['user_type'],
            profile_id=user.get('profile_id'),
            created_at=user['created_at']
        ),
        token=token
    )

@api_router.get("/auth/me")
async def get_current_user(token: str = Query(...)):
    """Get current user by token"""
    user = await db.users.find_one({"token": token}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    return UserResponse(
        id=user['id'],
        email=user['email'],
        first_name=user['first_name'],
        last_name=user['last_name'],
        user_type=user['user_type'],
        profile_id=user.get('profile_id'),
        created_at=user['created_at']
    )

@api_router.post("/auth/logout")
async def logout_user(token: str = Query(...)):
    """Logout a user"""
    result = await db.users.update_one(
        {"token": token},
        {"$set": {"token": None}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    return {"success": True, "message": "Utloggad"}


# ----- Google OAuth Routes -----
@api_router.post("/auth/google/session")
async def google_oauth_session(session_id: str = Query(...)):
    """
    Process Google OAuth session_id from Emergent Auth.
    Creates user if doesn't exist, returns auth token.
    """
    import httpx
    
    # Get user data from Emergent Auth
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Ogiltig Google session")
        
        google_data = response.json()
    
    email = google_data.get("email", "").lower()
    name = google_data.get("name", "")
    picture = google_data.get("picture", "")
    
    # Split name into first and last name
    name_parts = name.split(" ", 1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    token = generate_token()
    
    if existing_user:
        # Update existing user with new token
        await db.users.update_one(
            {"email": email},
            {"$set": {"token": token, "picture": picture}}
        )
        user_id = existing_user['id']
        profile_id = existing_user.get('profile_id')
    else:
        # Create new user
        user_id = str(uuid.uuid4())
        
        user_doc = {
            "id": user_id,
            "email": email,
            "password": None,  # No password for OAuth users
            "first_name": first_name,
            "last_name": last_name,
            "user_type": "jobseeker",
            "profile_id": None,
            "token": token,
            "picture": picture,
            "auth_provider": "google",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(user_doc)
        
        # Create jobseeker profile
        profile = JobSeekerProfile(
            first_name=first_name,
            last_name=last_name,
            age=0,
            phone="",
            email=email
        )
        profile_doc = profile.model_dump()
        profile_doc['created_at'] = profile_doc['created_at'].isoformat()
        profile_doc['updated_at'] = profile_doc['updated_at'].isoformat()
        await db.jobseekers.insert_one(profile_doc)
        profile_id = profile.id
        
        # Update user with profile_id
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"profile_id": profile_id}}
        )
    
    return AuthResponse(
        success=True,
        message="Google-inloggning lyckades!",
        user=UserResponse(
            id=user_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            user_type="jobseeker",
            profile_id=profile_id,
            created_at=datetime.now(timezone.utc).isoformat()
        ),
        token=token
    )


# ----- BankID Mock Routes -----
class BankIDInitRequest(BaseModel):
    personal_number: Optional[str] = None  # Swedish personal number (personnummer)

class BankIDStatusResponse(BaseModel):
    status: str  # pending, complete, failed
    order_ref: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None

@api_router.post("/auth/bankid/init")
async def bankid_init(input: BankIDInitRequest = None):
    """
    Initialize BankID authentication (MOCK).
    In production, this would call the real BankID API.
    """
    # Generate a mock order reference
    order_ref = f"bankid_{uuid.uuid4().hex[:16]}"
    
    # Store pending BankID session
    await db.bankid_sessions.insert_one({
        "order_ref": order_ref,
        "status": "pending",
        "personal_number": input.personal_number if input else None,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "order_ref": order_ref,
        "status": "pending",
        "message": "Öppna BankID-appen på din mobil"
    }

@api_router.post("/auth/bankid/collect")
async def bankid_collect(order_ref: str = Query(...)):
    """
    Check BankID authentication status (MOCK).
    In production, this would poll the real BankID API.
    """
    # Find the session
    session = await db.bankid_sessions.find_one({"order_ref": order_ref}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="BankID-session hittades inte")
    
    # For mock: automatically complete after first poll
    if session['status'] == 'pending':
        # Generate mock user data
        mock_first_name = "Anna"
        mock_last_name = "Svensson"
        mock_email = f"bankid_{uuid.uuid4().hex[:8]}@tendbee.se"
        
        token = generate_token()
        user_id = str(uuid.uuid4())
        
        # Create user
        user_doc = {
            "id": user_id,
            "email": mock_email,
            "password": None,
            "first_name": mock_first_name,
            "last_name": mock_last_name,
            "user_type": "jobseeker",
            "profile_id": None,
            "token": token,
            "auth_provider": "bankid",
            "personal_number": session.get('personal_number'),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(user_doc)
        
        # Create jobseeker profile
        profile = JobSeekerProfile(
            first_name=mock_first_name,
            last_name=mock_last_name,
            age=0,
            phone="",
            email=mock_email
        )
        profile_doc = profile.model_dump()
        profile_doc['created_at'] = profile_doc['created_at'].isoformat()
        profile_doc['updated_at'] = profile_doc['updated_at'].isoformat()
        await db.jobseekers.insert_one(profile_doc)
        profile_id = profile.id
        
        # Update user with profile_id
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"profile_id": profile_id}}
        )
        
        # Update session status
        await db.bankid_sessions.update_one(
            {"order_ref": order_ref},
            {"$set": {"status": "complete", "user_id": user_id}}
        )
        
        return BankIDStatusResponse(
            status="complete",
            order_ref=order_ref,
            user=UserResponse(
                id=user_id,
                email=mock_email,
                first_name=mock_first_name,
                last_name=mock_last_name,
                user_type="jobseeker",
                profile_id=profile_id,
                created_at=user_doc['created_at']
            ),
            token=token
        )
    
    return BankIDStatusResponse(
        status=session['status'],
        order_ref=order_ref
    )


# ----- Job Seeker Routes -----
@api_router.post("/jobseekers", response_model=JobSeekerProfile)
async def create_jobseeker(input: JobSeekerCreate):
    """Create a new job seeker profile"""
    profile = JobSeekerProfile(**input.model_dump())
    doc = profile.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.jobseekers.insert_one(doc)
    return profile

@api_router.get("/jobseekers/{jobseeker_id}", response_model=JobSeekerProfile)
async def get_jobseeker(jobseeker_id: str):
    """Get a job seeker profile by ID"""
    doc = await db.jobseekers.find_one({"id": jobseeker_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Jobbsökare hittades inte")
    return await serialize_doc(doc)

@api_router.put("/jobseekers/{jobseeker_id}", response_model=JobSeekerProfile)
async def update_jobseeker(jobseeker_id: str, update: JobSeekerUpdate):
    """Update a job seeker profile"""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.jobseekers.update_one(
        {"id": jobseeker_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Jobbsökare hittades inte")
    
    doc = await db.jobseekers.find_one({"id": jobseeker_id}, {"_id": 0})
    return await serialize_doc(doc)

@api_router.get("/jobseekers", response_model=List[JobSeekerProfile])
async def list_jobseekers(
    city: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=50, le=100)
):
    """List all job seekers with optional filters"""
    query = {}
    if city:
        query["cities"] = city
    if category:
        query["job_categories"] = category
    
    docs = await db.jobseekers.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return [await serialize_doc(doc) for doc in docs]


# ----- Company Routes -----
@api_router.post("/companies", response_model=Company)
async def create_company(input: CompanyCreate):
    """Create a new company"""
    company = Company(**input.model_dump())
    doc = company.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.companies.insert_one(doc)
    return company

@api_router.get("/companies/{company_id}", response_model=Company)
async def get_company(company_id: str):
    """Get a company by ID"""
    doc = await db.companies.find_one({"id": company_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Företag hittades inte")
    return await serialize_doc(doc)

@api_router.get("/companies", response_model=List[Company])
async def list_companies(limit: int = Query(default=50, le=100)):
    """List all companies"""
    docs = await db.companies.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return [await serialize_doc(doc) for doc in docs]


# ----- Job Routes -----
@api_router.post("/jobs", response_model=Job)
async def create_job(input: JobCreate):
    """Create a new job posting"""
    job = Job(**input.model_dump())
    doc = job.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.jobs.insert_one(doc)
    return job

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    """Get a job by ID"""
    doc = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Jobb hittades inte")
    return await serialize_doc(doc)

@api_router.get("/jobs", response_model=List[Job])
async def list_jobs(
    company_id: Optional[str] = None,
    location: Optional[str] = None,
    is_active: bool = True,
    limit: int = Query(default=50, le=100)
):
    """List all jobs with optional filters"""
    query = {"is_active": is_active}
    if company_id:
        query["company_id"] = company_id
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    docs = await db.jobs.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return [await serialize_doc(doc) for doc in docs]

@api_router.get("/jobs/matched/{jobseeker_id}", response_model=List[JobWithMatch])
async def get_matched_jobs(jobseeker_id: str, limit: int = Query(default=20, le=50)):
    """Get jobs matched to a job seeker with AI match scores"""
    # Get jobseeker profile
    jobseeker = await db.jobseekers.find_one({"id": jobseeker_id}, {"_id": 0})
    if not jobseeker:
        raise HTTPException(status_code=404, detail="Jobbsökare hittades inte")
    
    # Get active jobs
    jobs = await db.jobs.find({"is_active": True}, {"_id": 0}).to_list(100)
    
    # Batch fetch all companies to avoid N+1 query problem
    company_ids = [job.get('company_id') for job in jobs if job.get('company_id')]
    companies = await db.companies.find({"id": {"$in": company_ids}}, {"_id": 0}).to_list(len(company_ids))
    company_map = {c.get('id'): c for c in companies}
    
    # Calculate match scores and add company names
    matched_jobs = []
    for job in jobs:
        match_score = calculate_match_score(jobseeker, job)
        
        # Get company name from pre-fetched map
        company = company_map.get(job.get('company_id'), {})
        company_name = company.get('company_name', "Okänt företag")
        
        job_with_match = JobWithMatch(
            **await serialize_doc(job),
            match_score=match_score,
            company_name=company_name
        )
        matched_jobs.append(job_with_match)
    
    # Sort by match score descending
    matched_jobs.sort(key=lambda x: x.match_score, reverse=True)
    
    return matched_jobs[:limit]


# ----- Candidate Matching for Employers -----
class CandidateWithMatch(JobSeekerProfile):
    match_score: int = 0

@api_router.get("/candidates/matched/{job_id}", response_model=List[CandidateWithMatch])
async def get_matched_candidates(job_id: str, limit: int = Query(default=20, le=50)):
    """Get candidates matched to a job with AI match scores"""
    # Get job
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Jobb hittades inte")
    
    # Get jobseekers with projection for required fields only
    jobseekers = await db.jobseekers.find({}, {
        "_id": 0,
        "id": 1,
        "first_name": 1,
        "last_name": 1,
        "age": 1,
        "phone": 1,
        "email": 1,
        "cities": 1,
        "country": 1,
        "remote_work": 1,
        "job_categories": 1,
        "languages": 1,
        "has_drivers_license": 1,
        "work_types": 1,
        "min_salary": 1,
        "salary_negotiable": 1,
        "cv_summary": 1,
        "cv_experience": 1,
        "cv_skills": 1,
        "created_at": 1,
        "updated_at": 1
    }).to_list(limit)
    
    # Calculate match scores
    matched_candidates = []
    for seeker in jobseekers:
        match_score = calculate_match_score(seeker, job)
        candidate = CandidateWithMatch(
            **await serialize_doc(seeker),
            match_score=match_score
        )
        matched_candidates.append(candidate)
    
    # Sort by match score descending
    matched_candidates.sort(key=lambda x: x.match_score, reverse=True)
    
    return matched_candidates[:limit]


# ----- Interest/Application Routes -----
@api_router.post("/interests", response_model=JobInterest)
async def create_interest(input: JobInterestCreate):
    """Job seeker expresses interest in a job"""
    # Check if already interested
    existing = await db.interests.find_one({
        "job_id": input.job_id,
        "jobseeker_id": input.jobseeker_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Du har redan visat intresse för detta jobb")
    
    interest = JobInterest(**input.model_dump())
    doc = interest.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.interests.insert_one(doc)
    return interest

@api_router.get("/interests/job/{job_id}", response_model=List[JobInterest])
async def get_job_interests(job_id: str):
    """Get all interests for a job"""
    docs = await db.interests.find({"job_id": job_id}, {"_id": 0}).to_list(100)
    return [await serialize_doc(doc) for doc in docs]

@api_router.get("/interests/jobseeker/{jobseeker_id}", response_model=List[JobInterest])
async def get_jobseeker_interests(jobseeker_id: str):
    """Get all interests from a job seeker"""
    docs = await db.interests.find({"jobseeker_id": jobseeker_id}, {"_id": 0}).to_list(100)
    return [await serialize_doc(doc) for doc in docs]


# ----- Calendar Invite Routes -----
@api_router.post("/calendar-invites", response_model=CalendarInvite)
async def create_calendar_invite(input: CalendarInviteCreate):
    """Create a calendar invite (interview invitation)"""
    invite = CalendarInvite(**input.model_dump())
    doc = invite.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.calendar_invites.insert_one(doc)
    return invite

@api_router.get("/calendar-invites/jobseeker/{jobseeker_id}", response_model=List[CalendarInvite])
async def get_jobseeker_invites(jobseeker_id: str):
    """Get all calendar invites for a job seeker"""
    docs = await db.calendar_invites.find({"jobseeker_id": jobseeker_id}, {"_id": 0}).to_list(100)
    return [await serialize_doc(doc) for doc in docs]

@api_router.put("/calendar-invites/{invite_id}/respond")
async def respond_to_invite(invite_id: str, status: str = Query(..., regex="^(accepted|declined)$")):
    """Accept or decline a calendar invite"""
    result = await db.calendar_invites.update_one(
        {"id": invite_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inbjudan hittades inte")
    return {"message": f"Inbjudan {status}"}


# ----- Dashboard Stats -----
@api_router.get("/stats/employer/{company_id}")
async def get_employer_stats(company_id: str):
    """Get dashboard stats for an employer"""
    active_jobs = await db.jobs.count_documents({"company_id": company_id, "is_active": True})
    
    # Get job IDs for this company
    jobs = await db.jobs.find({"company_id": company_id}, {"id": 1}).to_list(100)
    job_ids = [j['id'] for j in jobs]
    
    # Count interests/applications
    total_interests = await db.interests.count_documents({"job_id": {"$in": job_ids}})
    
    # Count total candidates (estimate based on matching)
    total_candidates = await db.jobseekers.count_documents({})
    
    return {
        "active_jobs": active_jobs,
        "total_interests": total_interests,
        "matching_candidates": total_candidates
    }


# ===================== ADMIN API ROUTES =====================

# ----- Admin Stats -----
@api_router.get("/admin/stats")
async def get_admin_stats():
    """Get overall platform statistics for admin dashboard"""
    total_jobseekers = await db.jobseekers.count_documents({})
    total_companies = await db.companies.count_documents({})
    total_jobs = await db.jobs.count_documents({})
    active_jobs = await db.jobs.count_documents({"is_active": True})
    total_interests = await db.interests.count_documents({})
    total_invites = await db.calendar_invites.count_documents({})
    
    # Get recent activity (last 7 days)
    from datetime import timedelta
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    
    new_jobseekers = await db.jobseekers.count_documents({"created_at": {"$gte": week_ago}})
    new_jobs = await db.jobs.count_documents({"created_at": {"$gte": week_ago}})
    new_interests = await db.interests.count_documents({"created_at": {"$gte": week_ago}})
    
    # Employment status breakdown
    employed = await db.jobseekers.count_documents({"is_employed": True})
    unemployed = await db.jobseekers.count_documents({"is_employed": False})
    af_registered = await db.jobseekers.count_documents({"is_registered_af": True})
    
    # Interest status breakdown
    pending_interests = await db.interests.count_documents({"status": "pending"})
    reviewed_interests = await db.interests.count_documents({"status": "reviewed"})
    interview_interests = await db.interests.count_documents({"status": "interview"})
    hired_interests = await db.interests.count_documents({"status": "hired"})
    
    return {
        "overview": {
            "total_jobseekers": total_jobseekers,
            "total_companies": total_companies,
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_interests": total_interests,
            "total_invites": total_invites,
        },
        "recent_activity": {
            "new_jobseekers": new_jobseekers,
            "new_jobs": new_jobs,
            "new_interests": new_interests,
        },
        "jobseeker_breakdown": {
            "employed": employed,
            "unemployed": unemployed,
            "af_registered": af_registered,
        },
        "interest_breakdown": {
            "pending": pending_interests,
            "reviewed": reviewed_interests,
            "interview": interview_interests,
            "hired": hired_interests,
        }
    }


# ----- Admin Jobseeker Management -----
@api_router.get("/admin/jobseekers")
async def admin_list_jobseekers(
    search: Optional[str] = None,
    is_employed: Optional[bool] = None,
    is_registered_af: Optional[bool] = None,
    city: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    skip: int = 0,
    limit: int = Query(default=20, le=100)
):
    """Admin: List all jobseekers with filtering and pagination"""
    query = {}
    
    if search:
        query["$or"] = [
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
        ]
    if is_employed is not None:
        query["is_employed"] = is_employed
    if is_registered_af is not None:
        query["is_registered_af"] = is_registered_af
    if city:
        query["cities"] = city
    
    sort_direction = -1 if sort_order == "desc" else 1
    
    total = await db.jobseekers.count_documents(query)
    docs = await db.jobseekers.find(query, {"_id": 0}) \
        .sort(sort_by, sort_direction) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": [await serialize_doc(doc) for doc in docs]
    }


@api_router.delete("/admin/jobseekers/{jobseeker_id}")
async def admin_delete_jobseeker(jobseeker_id: str):
    """Admin: Delete a jobseeker and related data"""
    # Delete related interests
    await db.interests.delete_many({"jobseeker_id": jobseeker_id})
    # Delete related calendar invites
    await db.calendar_invites.delete_many({"jobseeker_id": jobseeker_id})
    # Delete jobseeker
    result = await db.jobseekers.delete_one({"id": jobseeker_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jobbsökare hittades inte")
    
    return {"message": "Jobbsökare och relaterad data har raderats"}


# ----- Admin Company Management -----
@api_router.get("/admin/companies")
async def admin_list_companies(
    search: Optional[str] = None,
    industry: Optional[str] = None,
    city: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    skip: int = 0,
    limit: int = Query(default=20, le=100)
):
    """Admin: List all companies with filtering and pagination"""
    query = {}
    
    if search:
        query["$or"] = [
            {"company_name": {"$regex": search, "$options": "i"}},
            {"org_number": {"$regex": search, "$options": "i"}},
            {"contact_person": {"$regex": search, "$options": "i"}},
        ]
    if industry:
        query["industry"] = industry
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    sort_direction = -1 if sort_order == "desc" else 1
    
    total = await db.companies.count_documents(query)
    docs = await db.companies.find(query, {"_id": 0}) \
        .sort(sort_by, sort_direction) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    # Batch get job counts using aggregation
    company_ids = [doc.get('id') for doc in docs]
    job_counts_pipeline = [
        {"$match": {"company_id": {"$in": company_ids}}},
        {"$group": {"_id": "$company_id", "count": {"$sum": 1}}}
    ]
    job_counts_result = await db.jobs.aggregate(job_counts_pipeline).to_list(len(company_ids))
    job_count_map = {item['_id']: item['count'] for item in job_counts_result}
    
    # Add job count for each company
    companies = []
    for doc in docs:
        company = await serialize_doc(doc)
        company["job_count"] = job_count_map.get(company["id"], 0)
        companies.append(company)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": companies
    }


@api_router.delete("/admin/companies/{company_id}")
async def admin_delete_company(company_id: str):
    """Admin: Delete a company and related data"""
    # Get all jobs for this company
    jobs = await db.jobs.find({"company_id": company_id}, {"id": 1}).to_list(100)
    job_ids = [j['id'] for j in jobs]
    
    # Delete related interests
    await db.interests.delete_many({"job_id": {"$in": job_ids}})
    # Delete related calendar invites
    await db.calendar_invites.delete_many({"company_id": company_id})
    # Delete jobs
    await db.jobs.delete_many({"company_id": company_id})
    # Delete company
    result = await db.companies.delete_one({"id": company_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Företag hittades inte")
    
    return {"message": "Företag och relaterad data har raderats"}


# ----- Admin Job Management -----
@api_router.get("/admin/jobs")
async def admin_list_jobs(
    search: Optional[str] = None,
    company_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    employment_type: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    skip: int = 0,
    limit: int = Query(default=20, le=100)
):
    """Admin: List all jobs with filtering and pagination"""
    query = {}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    if company_id:
        query["company_id"] = company_id
    if is_active is not None:
        query["is_active"] = is_active
    if employment_type:
        query["employment_type"] = employment_type
    
    sort_direction = -1 if sort_order == "desc" else 1
    
    total = await db.jobs.count_documents(query)
    docs = await db.jobs.find(query, {"_id": 0}) \
        .sort(sort_by, sort_direction) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    # Batch fetch companies and interest counts
    job_ids = [doc.get('id') for doc in docs]
    company_ids = [doc.get('company_id') for doc in docs if doc.get('company_id')]
    
    # Batch fetch companies
    companies = await db.companies.find({"id": {"$in": company_ids}}, {"_id": 0}).to_list(len(company_ids))
    company_map = {c.get('id'): c for c in companies}
    
    # Batch get interest counts using aggregation
    interest_counts_pipeline = [
        {"$match": {"job_id": {"$in": job_ids}}},
        {"$group": {"_id": "$job_id", "count": {"$sum": 1}}}
    ]
    interest_counts_result = await db.interests.aggregate(interest_counts_pipeline).to_list(len(job_ids))
    interest_count_map = {item['_id']: item['count'] for item in interest_counts_result}
    
    # Add company name and interest count for each job
    jobs = []
    for doc in docs:
        job = await serialize_doc(doc)
        company = company_map.get(job.get("company_id"), {})
        job["company_name"] = company.get("company_name", "Okänt")
        job["interest_count"] = interest_count_map.get(job["id"], 0)
        jobs.append(job)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": jobs
    }


@api_router.put("/admin/jobs/{job_id}/toggle-active")
async def admin_toggle_job_active(job_id: str):
    """Admin: Toggle job active status"""
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Jobb hittades inte")
    
    new_status = not job.get("is_active", True)
    await db.jobs.update_one({"id": job_id}, {"$set": {"is_active": new_status}})
    
    return {"message": f"Jobb {'aktiverat' if new_status else 'inaktiverat'}", "is_active": new_status}


@api_router.delete("/admin/jobs/{job_id}")
async def admin_delete_job(job_id: str):
    """Admin: Delete a job and related data"""
    # Delete related interests
    await db.interests.delete_many({"job_id": job_id})
    # Delete related calendar invites
    await db.calendar_invites.delete_many({"job_id": job_id})
    # Delete job
    result = await db.jobs.delete_one({"id": job_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jobb hittades inte")
    
    return {"message": "Jobb och relaterad data har raderats"}


# ----- Admin Interest/Application Management -----
@api_router.get("/admin/interests")
async def admin_list_interests(
    status: Optional[str] = None,
    job_id: Optional[str] = None,
    jobseeker_id: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    skip: int = 0,
    limit: int = Query(default=20, le=100)
):
    """Admin: List all interests/applications with filtering"""
    query = {}
    
    if status:
        query["status"] = status
    if job_id:
        query["job_id"] = job_id
    if jobseeker_id:
        query["jobseeker_id"] = jobseeker_id
    
    sort_direction = -1 if sort_order == "desc" else 1
    
    total = await db.interests.count_documents(query)
    docs = await db.interests.find(query, {"_id": 0}) \
        .sort(sort_by, sort_direction) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    # Enrich with jobseeker and job info
    interests = []
    for doc in docs:
        interest = await serialize_doc(doc)
        
        # Get jobseeker info
        jobseeker = await db.jobseekers.find_one({"id": interest.get("jobseeker_id")}, {"_id": 0})
        if jobseeker:
            interest["jobseeker_name"] = f"{jobseeker.get('first_name', '')} {jobseeker.get('last_name', '')}"
        
        # Get job info
        job = await db.jobs.find_one({"id": interest.get("job_id")}, {"_id": 0})
        if job:
            interest["job_title"] = job.get("title", "")
            company = await db.companies.find_one({"id": job.get("company_id")}, {"_id": 0})
            interest["company_name"] = company.get("company_name") if company else ""
        
        interests.append(interest)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": interests
    }


@api_router.put("/admin/interests/{interest_id}/status")
async def admin_update_interest_status(interest_id: str, status: str = Query(..., regex="^(pending|reviewed|interview|rejected|hired)$")):
    """Admin: Update interest/application status"""
    result = await db.interests.update_one(
        {"id": interest_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Intresse hittades inte")
    
    return {"message": f"Status uppdaterad till {status}"}


# ----- Admin Activity Log -----
@api_router.get("/admin/activity")
async def admin_get_activity(limit: int = Query(default=50, le=100)):
    """Admin: Get recent platform activity"""
    activities = []
    
    # Get recent jobseekers
    recent_jobseekers = await db.jobseekers.find({}, {"_id": 0}) \
        .sort("created_at", -1).limit(10).to_list(10)
    for js in recent_jobseekers:
        activities.append({
            "type": "new_jobseeker",
            "message": f"Ny jobbsökare: {js.get('first_name', '')} {js.get('last_name', '')}",
            "timestamp": js.get("created_at"),
            "id": js.get("id")
        })
    
    # Get recent companies
    recent_companies = await db.companies.find({}, {"_id": 0}) \
        .sort("created_at", -1).limit(10).to_list(10)
    for c in recent_companies:
        activities.append({
            "type": "new_company",
            "message": f"Nytt företag: {c.get('company_name', '')}",
            "timestamp": c.get("created_at"),
            "id": c.get("id")
        })
    
    # Get recent jobs
    recent_jobs = await db.jobs.find({}, {"_id": 0}) \
        .sort("created_at", -1).limit(10).to_list(10)
    for j in recent_jobs:
        activities.append({
            "type": "new_job",
            "message": f"Nytt jobb: {j.get('title', '')}",
            "timestamp": j.get("created_at"),
            "id": j.get("id")
        })
    
    # Get recent interests
    recent_interests = await db.interests.find({}, {"_id": 0}) \
        .sort("created_at", -1).limit(10).to_list(10)
    for i in recent_interests:
        activities.append({
            "type": "new_interest",
            "message": "Nytt jobbintresse",
            "timestamp": i.get("created_at"),
            "id": i.get("id")
        })
    
    # Sort by timestamp and return
    activities.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return activities[:limit]


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
