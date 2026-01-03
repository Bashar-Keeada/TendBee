# TendBee Technical Architecture

## Overview

TendBee is a GDPR-compliant recruitment platform that matches job seekers with employers using AI-powered matching algorithms. This document describes the technical architecture, data flows, and implementation recommendations.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Web App    │  │  Mobile App  │  │  Employer    │  │    Admin     │    │
│  │   (React)    │  │   (React)    │  │   Portal     │  │   Dashboard  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
└─────────┼──────────────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │                  │
          └──────────────────┴────────┬─────────┴──────────────────┘
                                      │
                              ┌───────▼───────┐
                              │   CDN/WAF     │
                              │  (Cloudflare) │
                              └───────┬───────┘
                                      │
┌─────────────────────────────────────┼─────────────────────────────────────┐
│                             API GATEWAY                                    │
│  ┌──────────────────────────────────▼──────────────────────────────────┐  │
│  │                    Kong / AWS API Gateway                            │  │
│  │  • Rate Limiting  • Auth  • Request Validation  • SSL Termination   │  │
│  └──────────────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼─────────────────────────────────────┐
│                          APPLICATION LAYER                                 │
│                                     │                                      │
│  ┌──────────────┐  ┌──────────────┐ │ ┌──────────────┐  ┌──────────────┐  │
│  │   Auth       │  │    Jobs      │ │ │   Match      │  │    Admin     │  │
│  │   Service    │  │   Service    │◄┼►│   Service    │  │   Service    │  │
│  │  (FastAPI)   │  │  (FastAPI)   │ │ │  (FastAPI)   │  │  (FastAPI)   │  │
│  └──────┬───────┘  └──────┬───────┘ │ └──────┬───────┘  └──────┬───────┘  │
│         │                 │         │        │                 │          │
│  ┌──────┴─────────────────┴─────────┴────────┴─────────────────┴──────┐   │
│  │                         Message Queue (Redis/RabbitMQ)             │   │
│  └────────────────────────────────┬───────────────────────────────────┘   │
│                                   │                                       │
│  ┌────────────────────────────────▼───────────────────────────────────┐   │
│  │                     Background Workers (Celery)                     │   │
│  │  • Job Ingestion  • Embedding Generation  • Match Computation      │   │
│  │  • Email Notifications  • GDPR Export  • Analytics                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼─────────────────────────────────────┐
│                            DATA LAYER                                      │
│                                     │                                      │
│  ┌──────────────┐  ┌──────────────┐ │ ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   MongoDB    │ │ │  Pinecone/   │  │    Redis     │  │
│  │  (Primary)   │  │  (Documents) │ │ │  Weaviate    │  │   (Cache)    │  │
│  │              │  │              │ │ │  (Vectors)   │  │              │  │
│  │  • Users     │  │  • Raw Jobs  │ │ │  • Job Emb.  │  │  • Sessions  │  │
│  │  • Jobs      │  │  • Audit Logs│ │ │  • Cand.Emb. │  │  • Rate Lim. │  │
│  │  • Matches   │  │  • Consents  │ │ │              │  │  • Job Cache │  │
│  │  • Payments  │  │              │ │ │              │  │              │  │
│  └──────────────┘  └──────────────┘ │ └──────────────┘  └──────────────┘  │
│                                     │                                      │
│  ┌──────────────┐  ┌──────────────┐ │ ┌──────────────────────────────────┐│
│  │ Elasticsearch│  │     S3       │ │ │        Monitoring & Logs         ││
│  │  (Search)    │  │   (Files)    │ │ │  Prometheus • Grafana • Sentry   ││
│  └──────────────┘  └──────────────┘ │ └──────────────────────────────────┘│
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼─────────────────────────────────────┐
│                       EXTERNAL INTEGRATIONS                                │
│                                     │                                      │
│  ┌──────────────┐  ┌──────────────┐ │ ┌──────────────┐  ┌──────────────┐  │
│  │ Platsbanken  │  │   LinkedIn   │ │ │    Indeed    │  │   Partner    │  │
│  │     API      │  │    (RSS)     │ │ │    (API)     │  │    Feeds     │  │
│  │              │  │              │ │ │              │  │              │  │
│  │  Official    │  │  Requires    │ │ │  Requires    │  │   Custom     │  │
│  │  Partner     │  │  Agreement   │ │ │  Agreement   │  │   Webhooks   │  │
│  └──────────────┘  └──────────────┘ │ └──────────────┘  └──────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Recommended Stack

| Component | Technology | Rationale |
|-----------|------------|------------|
| **API Framework** | FastAPI (Python) | Async support, automatic OpenAPI docs, type hints |
| **Primary Database** | PostgreSQL 15+ | ACID compliance, JSONB support, mature ecosystem |
| **Document Store** | MongoDB | Flexible schema for raw payloads, audit logs |
| **Vector Database** | Pinecone or Weaviate | Purpose-built for embeddings, fast ANN search |
| **Cache/Queue** | Redis | Sessions, rate limiting, job queue |
| **Search Engine** | Elasticsearch | Full-text search, faceted search |
| **Task Queue** | Celery with Redis | Background job processing, scheduling |
| **File Storage** | AWS S3 / GCS | CV uploads, exports, images |
| **Email** | SendGrid / AWS SES | Transactional emails, magic links |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting, dashboards |
| **Error Tracking** | Sentry | Exception tracking, performance monitoring |
| **Auth** | JWT + OAuth2 / PKCE | Stateless auth, mobile support |

### Alternative Options

| Component | Alternative | When to Use |
|-----------|-------------|-------------|
| Vector DB | Milvus, Qdrant, pgvector | Self-hosted, cost control |
| Search | OpenSearch, Meilisearch | Self-hosted, simpler setup |
| Queue | RabbitMQ, AWS SQS | Enterprise features, managed service |
| Primary DB | CockroachDB | Global distribution |

## Data Flow: Job Ingestion

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Source    │────►│  Connector  │────►│   Queue     │────►│   Worker    │
│   (API)     │     │  (Fetch)    │     │  (Redis)    │     │  (Process)  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                    ┌───────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Normalize  │────►│   Dedupe    │────►│   Enrich    │────►│   Embed     │
│  (Schema)   │     │ (Fingerprint)│    │  (Geocode)  │     │ (ML Model)  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                    ┌───────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Index     │────►│   Match     │────►│   Notify    │
│ (DB+Vector) │     │  (Compute)  │     │  (Email)    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Ingestion Steps Detail

1. **Connector** - Fetches jobs from source API using stored credentials
2. **Queue** - Jobs queued with idempotency key (`source:job_id`)
3. **Normalize** - Map source fields to canonical JobAd schema
4. **Dedupe** - Generate fingerprint, check for duplicates:
   - Primary: `sha256(source + external_id)`
   - Fallback: `sha256(title + company + city + published_date)`
5. **Enrich** - Geocode location, extract skills via NER, map to taxonomy
6. **Embed** - Generate vector embedding using sentence-transformers
7. **Index** - Write to PostgreSQL + Vector DB + Elasticsearch
8. **Match** - Trigger matching for new job
9. **Notify** - Send notifications to matched candidates

## Matching Algorithm

### Score Formula

```
score = 0.55 × skill_similarity
      + 0.20 × experience_match
      + 0.10 × location_score
      + 0.10 × availability_score
      + 0.05 × salary_match
```

### Component Calculations

#### Skill Similarity (55%)
```python
skill_sim = cosine_similarity(
    embed(candidate.skills + candidate.cv_text),
    embed(job.required_skills + job.description)
)
```

#### Experience Match (20%)
```python
if job.experience_years == 0:
    exp_match = 1.0
else:
    ratio = candidate.experience_years / job.experience_years
    exp_match = min(ratio, 1.2) / 1.2  # Cap at 120%
```

#### Location Score (10%)
```python
if candidate.city == job.city:
    location = 1.0
elif candidate.region == job.region:
    location = 0.8
else:
    distance = haversine(candidate.coords, job.coords)
    location = max(0, 1 - (distance / 200))  # Decay over 200km
```

#### Availability Score (10%)
```python
days_until_start = (job.start_date - candidate.availability).days
if days_until_start <= 0:
    availability = 1.0
elif days_until_start <= 30:
    availability = 0.9
elif days_until_start <= 90:
    availability = 0.7
else:
    availability = max(0.3, 1 - (days_until_start / 365))
```

#### Salary Match (5%)
```python
overlap = min(candidate.max, job.max) - max(candidate.min, job.min)
range_size = max(job.max - job.min, 1)
salary = max(0, overlap / range_size)
```

### Thresholds

| Threshold | Value | Action |
|-----------|-------|--------|
| Show match | ≥ 0.65 | Display to candidate |
| Notify | ≥ 0.75 | Send push/email notification |
| Top match | ≥ 0.85 | Highlight as "excellent match" |

### Tuning

- A/B test threshold values
- Use match feedback to retrain weights
- Monitor accept/reject rates by score band

## Security Architecture

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────►│   Login  │────►│   Auth   │────►│   JWT    │
│          │     │  Request │     │  Service │     │  Token   │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                                   Access Token (15min) │
                                   Refresh Token (7d)   │
                                                        ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   API    │◄────│  Bearer  │◄────│   JWT    │◄────│  Client  │
│  Access  │     │  Header  │     │  Verify  │     │  Request │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Transport | TLS 1.3, HSTS |
| Auth tokens | JWT RS256, 15min TTL |
| Refresh tokens | Secure httpOnly cookie, 7d TTL |
| Password | bcrypt, min 8 chars |
| Rate limiting | 100 req/min per IP |
| Webhook signing | HMAC-SHA256 |
| Secrets | AWS Secrets Manager / Vault |
| Audit logging | All write operations logged |

## GDPR Compliance

### Data Subject Rights

| Right | Implementation |
|-------|----------------|
| Access (Art. 15) | `/gdpr/export` - JSON export of all data |
| Rectification (Art. 16) | Profile edit endpoints |
| Erasure (Art. 17) | `/gdpr/delete` - Full data deletion |
| Portability (Art. 20) | Machine-readable export |
| Object (Art. 21) | Consent withdrawal endpoint |

### Consent Recording

```json
{
  "consent_id": "uuid",
  "user_id": "uuid",
  "consent_type": "gdpr_processing",
  "granted": true,
  "timestamp": "2025-01-01T12:00:00Z",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "consent_text_version": "v1.2",
  "withdrawal_timestamp": null
}
```

### Data Retention

| Data Type | Retention | After Deletion |
|-----------|-----------|----------------|
| Active user PII | While active + 2 years | Full erasure |
| Inactive user PII | 2 years after last login | Anonymize |
| Match history | 3 years | Anonymize for analytics |
| Audit logs | 7 years | Keep (no PII) |
| Payment records | 7 years (legal) | Keep |

## Scaling Considerations

### Horizontal Scaling

- API services: Kubernetes with HPA
- Workers: Scale based on queue depth
- Database: Read replicas for queries
- Vector DB: Sharding by job category/region

### Performance Targets

| Metric | Target |
|--------|--------|
| API latency (p95) | < 200ms |
| Search latency | < 500ms |
| Match computation | < 2s per job |
| Ingestion throughput | > 1000 jobs/min |
| Uptime | 99.9% |

## Cost Estimation (Monthly)

| Component | Specification | Est. Cost |
|-----------|---------------|------------|
| Compute (API) | 4x m5.large | $300 |
| Database (RDS) | db.r5.large | $400 |
| Vector DB | Pinecone S1 | $70 |
| Redis | cache.m5.large | $150 |
| Elasticsearch | 3x data nodes | $300 |
| Storage | 500GB S3 | $15 |
| Bandwidth | 1TB | $90 |
| **Total** | | **~$1,325** |

*Costs vary by region and usage patterns*
