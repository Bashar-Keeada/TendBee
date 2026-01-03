# Data Retention & Governance Policy

## Purpose

This policy defines data retention periods, anonymization procedures, and governance rules for TendBee to ensure GDPR compliance while enabling business analytics and service improvement.

## Scope

Applies to all personal data, business data, and system data processed by TendBee.

---

## Data Classification

### Category 1: Personal Identifiable Information (PII)

Direct identifiers that can identify an individual:
- Name, email, phone number
- Date of birth, national ID
- Profile photo
- Physical address
- CV content (may contain PII)

### Category 2: Sensitive Personal Data (Special Categories)

- Gender (when used for analytics)
- Disability status
- Ethnic origin (never collected)
- Health information (never collected)

### Category 3: Behavioral Data

- Job search history
- Application history
- Match interactions
- Login history

### Category 4: Business Data

- Employer company information
- Job postings
- Transaction records
- Contracts

### Category 5: System Data

- Audit logs
- Error logs
- Performance metrics
- Security events

---

## Retention Periods

| Data Type | Active User | After Deletion Request | After Inactivity | Legal Basis |
|-----------|-------------|------------------------|------------------|-------------|
| **Job Seeker PII** | During use | 30 days | 24 months | Consent |
| **Employer PII** | During use | 30 days | 36 months | Contract |
| **CV Files** | During use | Immediate | 24 months | Consent |
| **Profile Photo** | During use | Immediate | 24 months | Consent |
| **Job Applications** | 24 months | Anonymize | 24 months | Legitimate interest |
| **Match History** | 36 months | Anonymize | 24 months | Legitimate interest |
| **Consent Records** | 7 years | Anonymize, keep | 7 years | Legal requirement |
| **Transaction Records** | 7 years | Keep (legal) | 7 years | Legal requirement |
| **Job Postings** | 12 months active | Keep (no PII) | 12 months | Legitimate interest |
| **Audit Logs** | 7 years | Anonymize | 7 years | Legal requirement |
| **Error Logs** | 90 days | Keep (no PII) | 90 days | Legitimate interest |
| **Analytics Data** | Indefinite | Anonymized only | Anonymized | Legitimate interest |

---

## Anonymization Procedures

### Full Anonymization

Used when data must be retained for analytics but user identity must be removed:

```python
def anonymize_user(user_data):
    return {
        "id": generate_anonymous_id(),  # New random ID
        "region": user_data.get("region"),  # Keep for geo analytics
        "experience_years": bucket_value(user_data.get("experience_years"), [0, 2, 5, 10]),
        "registration_year": user_data.get("created_at")[:4],  # Year only
        "user_type": user_data.get("user_type"),
        # All PII fields removed
    }

def bucket_value(value, buckets):
    """Convert exact value to bucket for k-anonymity"""
    for bucket in sorted(buckets, reverse=True):
        if value >= bucket:
            return f"{bucket}+"
    return f"<{buckets[0]}"
```

### Pseudonymization

Used when data linkage must be possible for limited purposes:

```python
def pseudonymize_user(user_id, purpose):
    """Create purpose-specific pseudonym"""
    salt = get_purpose_salt(purpose)  # Different salt per purpose
    return hashlib.sha256(f"{user_id}{salt}".encode()).hexdigest()[:16]
```

### Data Fields Treatment

| Field | Anonymization Method |
|-------|---------------------|
| Name | Delete |
| Email | Delete |
| Phone | Delete |
| Date of Birth | Keep year only or delete |
| Address | Keep city/region only |
| Salary | Convert to salary band |
| Experience | Convert to bucket (0-2, 2-5, 5-10, 10+) |
| Skills | Keep (not PII) |
| Job Title | Keep (not PII) |
| Company Name | Keep for employer, delete for candidate |
| CV Text | Delete |
| Profile Photo | Delete |
| IP Address | Delete or truncate to /24 |
| User Agent | Delete |

---

## Deletion Procedures

### User-Initiated Deletion (GDPR Art. 17)

**Timeline:** Complete within 30 days (target: 7 days)

**Process:**

1. **Verification**
   - Confirm user identity
   - Check for pending obligations (open transactions, contracts)

2. **Pre-Deletion**
   - Cancel active subscriptions
   - Notify relevant employers (anonymized)
   - Generate final data export (optional)

3. **Data Deletion**
   ```
   DELETE: users, profiles, cv_files, profile_images
   ANONYMIZE: matches, applications, feedback
   KEEP: consent_records (anonymized), transactions (legal)
   ```

4. **Verification**
   - Audit all data stores
   - Verify deletion from backups (per policy)
   - Generate deletion certificate

5. **Confirmation**
   - Send confirmation email
   - Log deletion event

### Automatic Deletion (Inactivity)

**Trigger:** No login for 24 months

**Process:**

1. **Warning Emails**
   - 3 months before: "We miss you" email
   - 1 month before: "Account will be deleted" email
   - 1 week before: Final warning

2. **Soft Deletion**
   - Mark account as inactive
   - Remove from matching pool
   - Remove from search indexes

3. **Hard Deletion (30 days after soft delete)**
   - Apply full deletion procedure
   - Anonymize for analytics

---

## Data Governance Rules

### Access Control

| Role | PII Access | Analytics Access | Export |
|------|------------|-----------------|--------|
| Support Agent | Read (own tickets) | No | No |
| Admin | Read | Read | Yes (audit log) |
| Data Analyst | No | Anonymized only | Yes (anonymized) |
| DPO | Full (audit only) | Full | Yes (audit log) |
| Engineering | No (production) | Anonymized | Test data only |

### Data Processing Principles

1. **Purpose Limitation**
   - Data used only for stated purposes
   - New purposes require new consent

2. **Data Minimization**
   - Collect only necessary data
   - Regular review of collected fields

3. **Storage Limitation**
   - Enforce retention periods automatically
   - Monthly retention audit

4. **Accuracy**
   - Allow users to update their data
   - Verify employer data annually

5. **Integrity & Confidentiality**
   - Encryption at rest and in transit
   - Access logging
   - Regular security audits

---

## Analytics & Monetization Guidelines

### Permitted Analytics Use

1. **Internal Product Improvement**
   - Matching algorithm training
   - UX optimization
   - Feature prioritization

2. **Aggregate Market Insights**
   - Salary benchmarks by role/region
   - Skill demand trends
   - Hiring velocity by industry
   - Always k-anonymized (k ≥ 10)

3. **Partner Reports (with consent)**
   - Anonymized candidate pool demographics
   - Application funnel metrics
   - Time-to-hire benchmarks

### Prohibited Uses

- Selling individual-level data
- Sharing PII with third parties (except as needed for service)
- Profiling for non-recruitment purposes
- Cross-matching with external datasets without consent

### Monetization Framework

If offering market insights as a product:

1. **Aggregation Requirements**
   - Minimum 10 data points per cell (k-anonymity)
   - No demographic breakdowns below regional level
   - Remove outliers that could identify individuals

2. **Consent**
   - Separate consent for analytics inclusion
   - Easy opt-out mechanism
   - Clear explanation of what data is used

3. **Output Review**
   - Manual review of any public reports
   - DPO sign-off on new insight products

---

## Backup & Recovery

### Backup Retention

| Backup Type | Retention | PII Handling |
|-------------|-----------|---------------|
| Daily | 7 days | Full data |
| Weekly | 4 weeks | Full data |
| Monthly | 12 months | Anonymized |
| Yearly | 7 years | Anonymized |

### Deletion from Backups

For GDPR deletion requests:

1. **Immediate:** Delete from live databases
2. **7 days:** Delete from daily backups
3. **30 days:** Delete from weekly backups
4. **Compensating control:** Maintain deletion log; if backup is restored, re-apply deletions

---

## Audit & Compliance

### Regular Audits

| Audit Type | Frequency | Responsible |
|------------|-----------|-------------|
| Retention compliance | Monthly | Automated + DPO review |
| Access audit | Quarterly | Security team |
| Consent validity | Quarterly | DPO |
| Third-party processing | Annually | Legal + DPO |
| Full GDPR audit | Annually | External auditor |

### Audit Log Requirements

Log the following for all PII operations:

```json
{
  "timestamp": "2025-01-01T12:00:00Z",
  "actor": "admin_user_123",
  "action": "view_user_pii",
  "target_user": "user_456",
  "fields_accessed": ["email", "phone"],
  "justification": "support_ticket_789",
  "ip_address": "192.168.1.1"
}
```

---

## Incident Response

### Data Breach Procedure

1. **Detection & Containment** (< 1 hour)
   - Isolate affected systems
   - Preserve evidence
   - Notify security team

2. **Assessment** (< 24 hours)
   - Identify affected data subjects
   - Determine breach severity
   - Document timeline

3. **Notification** (< 72 hours)
   - Report to Datainspektionen if required
   - Notify affected users if high risk
   - Document decisions

4. **Remediation**
   - Fix vulnerability
   - Update procedures
   - Post-incident review

---

## Policy Review

This policy is reviewed:
- Annually (minimum)
- After significant regulatory changes
- After significant product changes
- After security incidents

**Last Updated:** 2025-01-01
**Next Review:** 2026-01-01
**Policy Owner:** Data Protection Officer
**Approved By:** [Name], CEO
