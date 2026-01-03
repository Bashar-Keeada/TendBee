"""
Embedding Generation & Vector DB Indexing Examples
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any, Optional
import asyncio
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============================================================================
# EMBEDDING GENERATION
# ============================================================================

class EmbeddingService:
    """
    Service for generating embeddings from text.
    Uses multilingual sentence-transformers for Swedish/English support.
    """
    
    # Recommended models for Swedish recruitment context
    MODELS = {
        "default": "paraphrase-multilingual-MiniLM-L12-v2",  # Fast, good quality
        "high_quality": "paraphrase-multilingual-mpnet-base-v2",  # Better quality, slower
        "swedish": "KBLab/sentence-bert-swedish-cased",  # Swedish-specific
    }
    
    def __init__(self, model_name: str = "default"):
        self.model_name = self.MODELS.get(model_name, model_name)
        self._model = None
    
    @property
    def model(self) -> SentenceTransformer:
        """Lazy load model"""
        if self._model is None:
            logger.info(f"Loading embedding model: {self.model_name}")
            self._model = SentenceTransformer(self.model_name)
        return self._model
    
    def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    
    def embed_texts(self, texts: List[str], batch_size: int = 32) -> List[List[float]]:
        """Generate embeddings for multiple texts (batched)"""
        embeddings = self.model.encode(
            texts, 
            convert_to_numpy=True,
            batch_size=batch_size,
            show_progress_bar=len(texts) > 100
        )
        return embeddings.tolist()
    
    def embed_job(self, job: Dict[str, Any]) -> List[float]:
        """
        Generate embedding for a job posting.
        Combines title, description, and skills for comprehensive representation.
        """
        # Construct text representation
        parts = [
            f"Jobbtitel: {job.get('title', '')}",
            f"Beskrivning: {job.get('description', '')[:2000]}",  # Truncate long descriptions
            f"Företag: {job.get('company', '')}",
            f"Plats: {job.get('location', {}).get('city', '')}",
        ]
        
        # Add skills
        skills = job.get('required_skills', []) + job.get('preferred_skills', [])
        if skills:
            parts.append(f"Kompetenser: {', '.join(skills)}")
        
        text = "\n".join(parts)
        return self.embed_text(text)
    
    def embed_candidate(self, candidate: Dict[str, Any]) -> List[float]:
        """
        Generate embedding for a candidate profile.
        Combines CV text, skills, and experience.
        """
        parts = [
            candidate.get('cv_text', '')[:3000],  # CV text
            candidate.get('headline', ''),
            candidate.get('summary', '')[:1000],
        ]
        
        # Add skills
        skills = [s.get('name', s) if isinstance(s, dict) else s 
                  for s in candidate.get('skills', [])]
        if skills:
            parts.append(f"Kompetenser: {', '.join(skills)}")
        
        # Add experience
        for exp in candidate.get('experience', [])[:5]:
            parts.append(f"{exp.get('title', '')} på {exp.get('company', '')}")
        
        # Add education
        for edu in candidate.get('education', [])[:3]:
            parts.append(f"{edu.get('degree', '')} från {edu.get('institution', '')}")
        
        text = "\n".join(filter(None, parts))
        return self.embed_text(text)


# ============================================================================
# VECTOR DATABASE INTEGRATION
# ============================================================================

@dataclass
class VectorSearchResult:
    """Result from vector similarity search"""
    id: str
    score: float
    metadata: Dict[str, Any]


class PineconeVectorDB:
    """
    Pinecone vector database integration.
    Recommended for production use - managed, scalable, fast.
    """
    
    def __init__(self, api_key: str, environment: str, index_name: str):
        import pinecone
        
        pinecone.init(api_key=api_key, environment=environment)
        self.index = pinecone.Index(index_name)
        self.index_name = index_name
    
    async def upsert(self, vectors: List[tuple]):
        """
        Upsert vectors into index.
        
        Args:
            vectors: List of (id, embedding, metadata) tuples
        """
        # Pinecone expects list of dicts
        formatted = [
            {
                "id": v[0],
                "values": v[1],
                "metadata": v[2] if len(v) > 2 else {}
            }
            for v in vectors
        ]
        
        # Batch upsert (Pinecone limit: 100 vectors per request)
        batch_size = 100
        for i in range(0, len(formatted), batch_size):
            batch = formatted[i:i+batch_size]
            self.index.upsert(vectors=batch)
            logger.info(f"Upserted {len(batch)} vectors")
    
    async def query(
        self, 
        embedding: List[float], 
        top_k: int = 10,
        filter_dict: Optional[Dict] = None,
        include_metadata: bool = True
    ) -> List[VectorSearchResult]:
        """
        Query for similar vectors.
        
        Args:
            embedding: Query vector
            top_k: Number of results
            filter_dict: Metadata filters (e.g., {"source": "platsbanken"})
            include_metadata: Include metadata in results
        """
        results = self.index.query(
            vector=embedding,
            top_k=top_k,
            filter=filter_dict,
            include_metadata=include_metadata
        )
        
        return [
            VectorSearchResult(
                id=match.id,
                score=match.score,
                metadata=match.metadata or {}
            )
            for match in results.matches
        ]
    
    async def delete(self, ids: List[str]):
        """Delete vectors by ID"""
        self.index.delete(ids=ids)


class WeaviateVectorDB:
    """
    Weaviate vector database integration.
    Good for self-hosted deployments with advanced features.
    """
    
    def __init__(self, url: str, api_key: Optional[str] = None):
        import weaviate
        
        auth = weaviate.AuthApiKey(api_key) if api_key else None
        self.client = weaviate.Client(url=url, auth_client_secret=auth)
        self._ensure_schema()
    
    def _ensure_schema(self):
        """Create schema if not exists"""
        job_schema = {
            "class": "Job",
            "vectorizer": "none",  # We provide our own vectors
            "properties": [
                {"name": "job_id", "dataType": ["string"]},
                {"name": "source", "dataType": ["string"]},
                {"name": "title", "dataType": ["string"]},
                {"name": "company", "dataType": ["string"]},
                {"name": "city", "dataType": ["string"]},
            ]
        }
        
        candidate_schema = {
            "class": "Candidate",
            "vectorizer": "none",
            "properties": [
                {"name": "candidate_id", "dataType": ["string"]},
                {"name": "city", "dataType": ["string"]},
                {"name": "experience_years", "dataType": ["int"]},
            ]
        }
        
        for schema in [job_schema, candidate_schema]:
            if not self.client.schema.exists(schema["class"]):
                self.client.schema.create_class(schema)
    
    async def upsert_job(self, job_id: str, embedding: List[float], metadata: Dict):
        """Upsert a job vector"""
        self.client.data_object.create(
            class_name="Job",
            data_object=metadata,
            vector=embedding,
            uuid=job_id
        )
    
    async def query_jobs(
        self, 
        embedding: List[float], 
        top_k: int = 10,
        where_filter: Optional[Dict] = None
    ) -> List[VectorSearchResult]:
        """Query similar jobs"""
        query = (
            self.client.query
            .get("Job", ["job_id", "title", "company", "city"])
            .with_near_vector({"vector": embedding})
            .with_limit(top_k)
            .with_additional(["distance"])
        )
        
        if where_filter:
            query = query.with_where(where_filter)
        
        result = query.do()
        
        jobs = result.get("data", {}).get("Get", {}).get("Job", [])
        return [
            VectorSearchResult(
                id=job.get("job_id"),
                score=1 - job.get("_additional", {}).get("distance", 0),
                metadata=job
            )
            for job in jobs
        ]


class PgVectorDB:
    """
    PostgreSQL with pgvector extension.
    Good for simpler deployments, lower cost.
    """
    
    def __init__(self, connection_string: str):
        import asyncpg
        self.connection_string = connection_string
        self._pool = None
    
    async def connect(self):
        import asyncpg
        self._pool = await asyncpg.create_pool(self.connection_string)
        
        # Ensure extension and table exist
        async with self._pool.acquire() as conn:
            await conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS job_embeddings (
                    id SERIAL PRIMARY KEY,
                    job_id VARCHAR(255) UNIQUE NOT NULL,
                    embedding vector(384),  -- Adjust dimension for your model
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS job_embedding_idx 
                ON job_embeddings 
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100)
            """)
    
    async def upsert(self, job_id: str, embedding: List[float], metadata: Dict):
        """Upsert job embedding"""
        import json
        
        async with self._pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO job_embeddings (job_id, embedding, metadata)
                VALUES ($1, $2, $3)
                ON CONFLICT (job_id) 
                DO UPDATE SET embedding = $2, metadata = $3
            """, job_id, str(embedding), json.dumps(metadata))
    
    async def query(
        self, 
        embedding: List[float], 
        top_k: int = 10
    ) -> List[VectorSearchResult]:
        """Query similar jobs using cosine distance"""
        async with self._pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT job_id, metadata, 1 - (embedding <=> $1) as score
                FROM job_embeddings
                ORDER BY embedding <=> $1
                LIMIT $2
            """, str(embedding), top_k)
            
            return [
                VectorSearchResult(
                    id=row["job_id"],
                    score=float(row["score"]),
                    metadata=row["metadata"] or {}
                )
                for row in rows
            ]


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

async def example_index_job():
    """Example: Index a new job"""
    
    # Initialize services
    embedding_service = EmbeddingService()
    vector_db = PineconeVectorDB(
        api_key="your-api-key",
        environment="us-west1-gcp",
        index_name="tendbee-jobs"
    )
    
    # Sample job
    job = {
        "job_id": "platsbanken:12345",
        "title": "Systemutvecklare Python",
        "description": "Vi söker en erfaren Python-utvecklare...",
        "company": "Tech AB",
        "location": {"city": "Stockholm"},
        "required_skills": ["Python", "FastAPI", "PostgreSQL"],
    }
    
    # Generate embedding
    embedding = embedding_service.embed_job(job)
    
    # Index in vector database
    await vector_db.upsert([
        (job["job_id"], embedding, {
            "source": "platsbanken",
            "city": job["location"]["city"],
            "company": job["company"]
        })
    ])
    
    print(f"Indexed job: {job['job_id']}")


async def example_find_matching_jobs():
    """Example: Find jobs matching a candidate"""
    
    embedding_service = EmbeddingService()
    vector_db = PineconeVectorDB(
        api_key="your-api-key",
        environment="us-west1-gcp",
        index_name="tendbee-jobs"
    )
    
    # Sample candidate
    candidate = {
        "candidate_id": "uid_abc",
        "cv_text": "Jag är en erfaren Python-utvecklare med 5 års erfarenhet...",
        "skills": ["Python", "Django", "PostgreSQL", "Docker"],
        "experience": [
            {"title": "Senior Developer", "company": "Startup AB"}
        ]
    }
    
    # Generate candidate embedding
    embedding = embedding_service.embed_candidate(candidate)
    
    # Search for matching jobs
    results = await vector_db.query(
        embedding=embedding,
        top_k=20,
        filter_dict={"city": "Stockholm"}  # Optional filter
    )
    
    print(f"Found {len(results)} matching jobs:")
    for r in results:
        print(f"  - {r.id}: score={r.score:.3f}")
    
    return results


if __name__ == "__main__":
    # Run examples
    asyncio.run(example_index_job())
    asyncio.run(example_find_matching_jobs())
