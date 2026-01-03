# Test Cases & QA Checklist

## End-to-End Tests

### 1. Job Ingestion Pipeline

```gherkin
Feature: Job Ingestion
  
  Scenario: Ingest job from Platsbanken
    Given the Platsbanken connector is configured
    When a new job is published on Platsbanken
    Then the job should be fetched within 15 minutes
    And the job should be normalized to canonical schema
    And the job should have a valid fingerprint
    And the job should have embeddings generated
    And the job should be indexed in search
    And the job should appear in relevant candidate matches

  Scenario: Duplicate job detection
    Given a job exists in the system with fingerprint "abc123"
    When the same job is ingested again
    Then a new record should NOT be created
    And the existing record should be updated
    And the ingest log should show "duplicate_detected"

  Scenario: Handle source API errors
    Given the source API returns 503
    When the connector attempts to fetch
    Then the request should be retried with exponential backoff
    And after 3 failures the job should go to DLQ
    And an alert should be triggered
```

### 2. Matching System

```gherkin
Feature: Job-Candidate Matching

  Scenario: Match computation for new job
    Given a candidate with skills ["Python", "FastAPI", "PostgreSQL"]
    And experience of 5 years
    And location Stockholm
    When a job requiring ["Python", "Django"] is created
    And the job is located in Stockholm
    Then a match should be computed
    And the skill_similarity should be > 0.7
    And the location_score should be 1.0
    And the total score should be > 0.65

  Scenario: Privacy-protected matching (TendBee Plus)
    Given a Plus member with privacy enabled
    When they are matched with a job
    Then the employer should see anonymous_id instead of name
    And age, gender, and photo should be hidden
    And skills and experience should be visible
```

### 3. Authentication

```gherkin
Feature: Authentication

  Scenario: Magic link login
    Given a registered user with email "test@example.com"
    When they request a magic link
    Then an email should be sent within 30 seconds
    And the link should expire after 15 minutes
    When they click the valid link
    Then they should receive JWT tokens
    And be redirected to dashboard

  Scenario: Token refresh
    Given a user with valid refresh token
    When the access token expires
    And they request token refresh
    Then a new access token should be issued
    And the old refresh token should be invalidated

  Scenario: Invalid token rejection
    Given an expired or tampered JWT
    When used to access protected endpoint
    Then response should be 401 Unauthorized
    And no data should be exposed
```

---

## API Test Cases

### Authentication API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| Login with valid credentials | POST | /auth/login | 200, tokens |
| Login with invalid password | POST | /auth/login | 401 |
| Login with non-existent email | POST | /auth/login | 401 |
| Request magic link | POST | /auth/magic-link | 200 |
| Verify valid magic link | POST | /auth/verify-magic-link | 200, tokens |
| Verify expired magic link | POST | /auth/verify-magic-link | 401 |
| Refresh with valid token | POST | /auth/refresh | 200, new tokens |
| Refresh with invalid token | POST | /auth/refresh | 401 |
| Logout | POST | /auth/logout | 200 |

### Jobs API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| List jobs (public) | GET | /jobs | 200, paginated list |
| Search jobs with filters | POST | /jobs/search | 200, filtered results |
| Get job details | GET | /jobs/{id} | 200, job object |
| Get non-existent job | GET | /jobs/invalid | 404 |
| Ingest job (valid signature) | POST | /jobs/ingest | 202 |
| Ingest job (invalid signature) | POST | /jobs/ingest | 401 |
| Ingest job (rate limited) | POST | /jobs/ingest | 429 |

### GDPR API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| Get consent status | GET | /gdpr/consent | 200 |
| Update consent | PUT | /gdpr/consent | 200 |
| Request data export | POST | /gdpr/export | 202 |
| Request deletion | POST | /gdpr/delete | 202 |
| Deletion without confirmation | POST | /gdpr/delete | 400 |

---

## Security Tests

### Authentication Security

- [ ] Password hashing uses bcrypt with cost >= 12
- [ ] JWT uses RS256 algorithm
- [ ] Access tokens expire in 15 minutes
- [ ] Refresh tokens expire in 7 days
- [ ] Refresh token rotation on use
- [ ] Failed login rate limiting (5 attempts/15 min)
- [ ] Magic links are single-use
- [ ] Magic links expire in 15 minutes

### API Security

- [ ] All endpoints use HTTPS
- [ ] CORS configured correctly
- [ ] No sensitive data in URL parameters
- [ ] SQL injection protection
- [ ] XSS protection in responses
- [ ] Rate limiting on all public endpoints
- [ ] Webhook signature verification
- [ ] Input validation on all endpoints

### Data Security

- [ ] PII encrypted at rest
- [ ] Database connections use TLS
- [ ] API keys stored in secrets manager
- [ ] No credentials in logs
- [ ] Audit logging for sensitive operations

---

## GDPR Compliance Tests

### Consent

- [ ] Consent recorded with timestamp, IP, user agent
- [ ] Consent text version tracked
- [ ] Separate consent for each purpose
- [ ] No pre-checked consent boxes
- [ ] Consent withdrawal available

### Data Subject Rights

- [ ] Export provides all user data in JSON
- [ ] Export includes consent history
- [ ] Deletion removes all PII
- [ ] Deletion preserves anonymized analytics
- [ ] Deletion confirmation sent

### Data Minimization

- [ ] Only necessary data collected
- [ ] Retention periods enforced
- [ ] Automatic anonymization after retention

---

## Performance Tests

### Load Testing

```yaml
scenarios:
  - name: "API Load Test"
    executor: "constant-arrival-rate"
    rate: 100
    duration: "5m"
    targets:
      - url: "/api/jobs"
        method: "GET"
      - url: "/api/jobs/search"
        method: "POST"

  - name: "Match Computation"
    executor: "shared-iterations"
    iterations: 1000
    targets:
      - url: "/api/matches/compute"
        method: "POST"
```

### Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| API p50 latency | < 50ms | < 100ms |
| API p95 latency | < 200ms | < 500ms |
| API p99 latency | < 500ms | < 1s |
| Search latency | < 200ms | < 500ms |
| Match computation | < 2s | < 5s |
| Error rate | < 0.1% | < 1% |

---

## Connector Reliability Tests

### Platsbanken Connector

- [ ] Handles pagination correctly
- [ ] Respects rate limits
- [ ] Retries on transient errors
- [ ] Handles API schema changes gracefully
- [ ] Logs all errors with context
- [ ] Idempotent re-processing

### Error Handling

- [ ] HTTP 429 triggers backoff
- [ ] HTTP 5xx retried 3 times
- [ ] HTTP 4xx logged and skipped
- [ ] Network timeout handled
- [ ] Invalid payload goes to DLQ
- [ ] DLQ reprocessing works

---

## Pre-Release Checklist

### Before Deployment

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Security scan completed
- [ ] Performance tests meet targets
- [ ] GDPR compliance verified
- [ ] Documentation updated
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

### After Deployment

- [ ] Health checks passing
- [ ] Error rate stable
- [ ] Key metrics within range
- [ ] Sample transactions verified
- [ ] Connector sync working
- [ ] No new errors in Sentry
