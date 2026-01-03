# Fallback Strategies for Job Source APIs

## Overview

When official API access is unavailable or restricted, TendBee implements a prioritized fallback strategy to ensure continuous job data flow while maintaining legal and ethical compliance.

## Priority Order

1. **Official API** (Preferred)
2. **Official RSS/Atom Feeds**
3. **Third-Party Aggregators**
4. **Partner Agreements**
5. **Legal Scraping** (Last Resort)

---

## Source-Specific Strategies

### 1. Arbetsförmedlingen (Platsbanken)

**Status:** ✅ Official API Available

**Primary Strategy:**
- Use Platsbanken Open API (free, no authentication required)
- API Docs: https://jobsearch.api.jobtechdev.se/
- Rate limit: Generous, no documented hard limits
- Real-time data with webhook support

**Implementation:**
```python
# Platsbanken API Example
base_url = "https://jobsearch.api.jobtechdev.se"
endpoint = "/search"
params = {
    "offset": 0,
    "limit": 100,
    "published-after": "2025-01-01T00:00:00"
}
```

**Fallback:**
- RSS feed (limited data)
- Direct partnership with Arbetsförmedlingen

---

### 2. LinkedIn

**Status:** ⚠️ Restricted API (Partner Only)

**Official Options:**
1. **LinkedIn Talent Solutions Partner** (Recommended)
   - Requires partnership agreement
   - Full API access
   - Cost: Enterprise pricing
   - Contact: business.linkedin.com/talent-solutions/partners

2. **LinkedIn Jobs Posting API**
   - For posting jobs, not reading
   - Not suitable for ingestion

**Fallback Strategies:**

1. **RSS/Atom Feeds (Limited)**
   - LinkedIn company pages have RSS feeds
   - Limited to company-specific jobs
   - Example: `https://www.linkedin.com/jobs/rss?company=tendbee`

2. **Third-Party Aggregators**
   - Adzuna API (includes LinkedIn jobs)
   - Jooble API
   - These aggregate from multiple sources

3. **Job Board Data Providers**
   - Companies like Theirstack, Coresignal, or People Data Labs
   - Provide job posting data (verify licensing)

**⚠️ DO NOT:**
- Scrape LinkedIn directly (violates ToS)
- Use unauthorized API access
- Store LinkedIn data longer than permitted

**Recommended Action:**
- Apply for LinkedIn Talent Solutions partnership
- Use aggregators as interim solution
- Prioritize direct employer integrations

---

### 3. Indeed

**Status:** ⚠️ Restricted API (Publisher Only)

**Official Options:**
1. **Indeed Publisher Program**
   - Requires publisher agreement
   - XML feed access
   - Revenue share model
   - Apply: https://www.indeed.com/publisher

2. **Indeed Apply Integration**
   - For employers to receive applications
   - Not for job aggregation

**Fallback Strategies:**

1. **Indeed Publisher XML Feed**
   - Requires approval
   - Provides job listings with backlinks
   - Must display Indeed branding

2. **Third-Party Aggregators**
   - Same as LinkedIn
   - Adzuna, Jooble include Indeed jobs

3. **Employer Direct Feeds**
   - Partner with employers directly
   - Get jobs before they're posted to Indeed

**⚠️ DO NOT:**
- Scrape Indeed (they actively block and may take legal action)
- Republish Indeed content without attribution

**Recommended Action:**
- Apply for Indeed Publisher Program
- Focus on direct employer partnerships
- Use aggregators for gap coverage

---

### 4. Other Swedish Job Boards

#### Blocket Jobb
**Status:** No public API
**Strategy:**
- Partner agreement for feed access
- Blocket is owned by Schibsted - contact business development

#### Karriarföretagen (formerly Stepstone Sweden)
**Status:** Partner API available
**Strategy:**
- Contact for API access
- Usually requires commercial agreement

#### Academic Positions
**Status:** RSS feeds available
**Strategy:**
- Use RSS feeds for academic job coverage
- Consider partnership for API access

---

## Third-Party Aggregator Options

### Recommended Aggregators

| Provider | Coverage | API Quality | Pricing | Notes |
|----------|----------|-------------|---------|-------|
| **Adzuna** | Good (30+ countries) | Good | Usage-based | Good Swedish coverage |
| **Jooble** | Excellent (70+ countries) | Basic | Contact | Widget or API |
| **CareerJet** | Good | Basic | Contact | Requires partnership |
| **Neuvoo/Talent** | Good | Good | Contact | Now part of Talent.com |

### Implementation Considerations

1. **Data Quality**
   - Aggregators may have stale data
   - Duplicates across sources common
   - Our dedupe pipeline handles this

2. **Attribution Requirements**
   - Most require source attribution
   - Link back to original posting
   - Display partner logos if required

3. **Legal Compliance**
   - Review each provider's terms
   - Ensure GDPR compliance
   - Document data processing agreements

---

## Legal Scraping Guidelines

**⚠️ USE ONLY AS LAST RESORT**

If scraping is absolutely necessary:

### Legal Requirements

1. **Check robots.txt**
   - Respect disallow directives
   - Example: `https://example.com/robots.txt`

2. **Terms of Service Review**
   - Have legal counsel review site ToS
   - Document scraping justification

3. **Rate Limiting**
   - Maximum 1 request per second
   - Implement exponential backoff
   - Use rotating user agents (within reason)

4. **Data Minimization**
   - Only collect necessary fields
   - Don't store personal data
   - Delete raw HTML after extraction

### Technical Implementation

```python
# Ethical scraping example
import requests
import time
from urllib.robotparser import RobotFileParser

def check_robots_txt(base_url, path):
    rp = RobotFileParser()
    rp.set_url(f"{base_url}/robots.txt")
    rp.read()
    return rp.can_fetch("*", f"{base_url}{path}")

def scrape_with_limits(url, delay=2):
    if not check_robots_txt(url, "/jobs"):
        raise Exception("Blocked by robots.txt")
    
    time.sleep(delay)  # Respectful delay
    response = requests.get(url, headers={
        "User-Agent": "TendBee-Bot/1.0 (contact@tendbee.se)"
    })
    return response
```

### Documentation Requirements

- Legal review sign-off
- Data processing record
- Source attribution plan
- Incident response plan (if blocked)

---

## Partnership Proposal Template

When approaching job boards for partnership:

```
Subject: Partnership Proposal - TendBee Job Matching Platform

Dear [Job Board] Partnership Team,

I'm writing from TendBee, a Swedish recruitment platform specializing in 
AI-powered job matching with a focus on reducing discrimination in hiring.

We would like to explore a data partnership that would:

1. Increase exposure for your job listings to our candidate base
2. Drive qualified traffic to your platform
3. Provide attribution and backlinks to original postings
4. Share anonymized matching insights to improve job quality

Our platform currently serves X candidates and Y employers in Sweden, 
with a focus on [specific sectors].

We are fully GDPR compliant and maintain strict data handling practices.

I would welcome the opportunity to discuss how we can create value for 
both our platforms.

Best regards,
[Name]
TendBee
```

---

## Summary Decision Matrix

| Source | Official API | Aggregator | Scrape |
|--------|-------------|------------|--------|
| Platsbanken | ✔️ Use | N/A | No |
| LinkedIn | ❌ Partner only | ✔️ Adzuna | ❌ Never |
| Indeed | ❌ Publisher only | ✔️ Adzuna | ❌ Never |
| Blocket | ❌ Partner only | Maybe | Legal review |
| Academic | RSS available | N/A | Limited, legal |
| Direct employers | ✔️ Best option | N/A | N/A |

**Key Principle:** Always prefer official channels. Build employer relationships for exclusive, high-quality job data.
