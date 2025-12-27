from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum


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
    time: str
    duration_minutes: int = 60
    location: str
    description: Optional[str] = None


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
    
    # Calculate match scores and add company names
    matched_jobs = []
    for job in jobs:
        match_score = calculate_match_score(jobseeker, job)
        
        # Get company name
        company = await db.companies.find_one({"id": job.get('company_id')}, {"_id": 0})
        company_name = company.get('company_name') if company else "Okänt företag"
        
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
    
    # Get all jobseekers
    jobseekers = await db.jobseekers.find({}, {"_id": 0}).to_list(100)
    
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
