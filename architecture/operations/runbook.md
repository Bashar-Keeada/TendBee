# TendBee Operations Runbook

## Quick Reference

### Service URLs

| Service | Production | Staging |
|---------|------------|----------|
| API | api.tendbee.se | staging-api.tendbee.se |
| Web App | app.tendbee.se | staging.tendbee.se |
| Admin | admin.tendbee.se | staging-admin.tendbee.se |
| Grafana | grafana.tendbee.se | - |
| Sentry | sentry.io/tendbee | - |

### Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| On-call | Rotating | [PagerDuty] | oncall@tendbee.se |
| CTO | [Name] | +46... | cto@tendbee.se |
| DPO | [Name] | +46... | dpo@tendbee.se |

---

## 1. Job Ingestion Issues

### 1.1 Connector Not Fetching Jobs

**Symptoms:**
- No new jobs from source in > 2 hours
- Connector status shows `error` in admin

**Diagnosis:**
```bash
# Check connector logs
kubectl logs -l app=connector-worker --tail=100

# Check last successful fetch
curl -H "Authorization: Bearer $TOKEN" \
  https://api.tendbee.se/v1/admin/connectors/platsbanken
```

**Resolution:**

1. **API Key Expired**
   - Rotate key in admin UI
   - Verify with manual test fetch

2. **Rate Limited (HTTP 429)**
   - Check current backoff timer
   - Wait for backoff to expire
   - Consider reducing fetch frequency

3. **Source API Down**
   - Check source status page
   - Enable fallback RSS feed if available
   - Alert team if extended outage

4. **Network Issues**
   - Check pod network connectivity
   - Verify DNS resolution
   - Check firewall rules

### 1.2 High DLQ (Dead Letter Queue) Count

**Symptoms:**
- DLQ count > 100 jobs
- Alert: "Ingestion DLQ threshold exceeded"

**Diagnosis:**
```bash
# Check DLQ contents
redis-cli LRANGE ingest:dlq 0 10

# Get error breakdown
curl https://api.tendbee.se/v1/admin/ingest-logs?status=failed&limit=100 | \
  jq 'group_by(.error_type) | map({error: .[0].error_type, count: length})'
```

**Resolution:**

1. **Parsing Errors**
   - Review failed payloads in admin
   - Update normalizer for schema changes
   - Reprocess after fix

2. **Validation Errors**
   - Check for missing required fields
   - Update connector to handle edge cases

3. **Transient Errors**
   ```bash
   # Retry all DLQ items
   curl -X POST https://api.tendbee.se/v1/admin/dlq/retry-all
   ```

---

## 2. Matching Issues

### 2.1 Match Quality Degraded

**Symptoms:**
- Increased "not relevant" feedback
- Lower click-through on matches

**Diagnosis:**
```bash
# Check match score distribution
curl https://api.tendbee.se/v1/admin/metrics/match-distribution

# Review recent feedback
curl https://api.tendbee.se/v1/admin/match-feedback?days=7
```

**Resolution:**

1. **Embedding Model Issues**
   - Verify embedding service health
   - Check model version consistency
   - Rebuild embeddings if model was updated

2. **Weight Imbalance**
   - Review A/B test results
   - Adjust scoring weights in config
   - Deploy updated weights

3. **Data Quality**
   - Check for incomplete profiles
   - Verify skill taxonomy is current
   - Run data quality report

### 2.2 Matching Too Slow

**Symptoms:**
- Match computation > 5 seconds
- Queue depth increasing

**Diagnosis:**
```bash
# Check vector DB latency
curl https://api.tendbee.se/v1/health/vector-db

# Check worker performance
kubectl top pods -l app=match-worker
```

**Resolution:**

1. **Scale Workers**
   ```bash
   kubectl scale deployment match-worker --replicas=5
   ```

2. **Vector DB Issues**
   - Check Pinecone dashboard
   - Consider index optimization
   - Review query patterns

3. **Batch Optimization**
   - Increase batch size for bulk matching
   - Enable async matching for new jobs

---

## 3. Database Issues

### 3.1 PostgreSQL High CPU/Connections

**Symptoms:**
- Database CPU > 80%
- Connection pool exhausted

**Diagnosis:**
```sql
-- Active queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND query NOT LIKE '%pg_stat%'
ORDER BY duration DESC;

-- Connection count
SELECT count(*) FROM pg_stat_activity;
```

**Resolution:**

1. **Kill Long Queries**
   ```sql
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
   WHERE duration > interval '5 minutes';
   ```

2. **Add Read Replica**
   - Route read queries to replica
   - Update connection strings

3. **Optimize Queries**
   - Review slow query log
   - Add missing indexes
   - Update query plans

### 3.2 MongoDB Space Issues

**Diagnosis:**
```bash
mongo --eval "db.stats()" tendbee
```

**Resolution:**
- Archive old audit logs
- Compact collections
- Increase storage if needed

---

## 4. Security Incidents

### 4.1 Suspected Breach

**Immediate Actions:**

1. **Isolate affected systems**
   ```bash
   kubectl scale deployment api --replicas=0
   ```

2. **Preserve evidence**
   - Snapshot all logs
   - Preserve database state
   - Document timeline

3. **Notify stakeholders**
   - Security team
   - CTO
   - DPO (if PII involved)

4. **GDPR Notification (if PII breach)**
   - Report to Datainspektionen within 72 hours
   - Notify affected users if high risk

### 4.2 Rate Limiting/DDoS

**Symptoms:**
- Unusual traffic spike
- 429 responses increasing

**Resolution:**

1. **Enable stricter rate limits**
   ```bash
   kubectl set env deployment/api RATE_LIMIT=10
   ```

2. **Block suspicious IPs**
   - Update WAF rules
   - Add to blocklist

3. **Scale if legitimate traffic**
   ```bash
   kubectl scale deployment api --replicas=10
   ```

---

## 5. GDPR Operations

### 5.1 Data Export Request

```bash
# Trigger export
curl -X POST https://api.tendbee.se/v1/admin/gdpr/export \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"user_id": "uid_xxx"}'

# Check status
curl https://api.tendbee.se/v1/admin/gdpr/export/status/export_id
```

Timeline: Complete within 30 days (target: 7 days)

### 5.2 Data Deletion Request

```bash
# Queue deletion
curl -X POST https://api.tendbee.se/v1/admin/gdpr/delete \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"user_id": "uid_xxx", "reason": "user_request"}'

# Verify deletion
curl https://api.tendbee.se/v1/admin/gdpr/delete/status/delete_id
```

Timeline: Complete within 30 days (target: 7 days)

---

## 6. Deployment

### 6.1 Standard Deployment

```bash
# Build and push
docker build -t tendbee/api:v1.2.3 .
docker push tendbee/api:v1.2.3

# Deploy
kubectl set image deployment/api api=tendbee/api:v1.2.3

# Verify
kubectl rollout status deployment/api
```

### 6.2 Rollback

```bash
# Immediate rollback
kubectl rollout undo deployment/api

# Rollback to specific version
kubectl rollout undo deployment/api --to-revision=5
```

---

## 7. Monitoring Alerts

### Alert Response Matrix

| Alert | Severity | Response Time | Escalation |
|-------|----------|---------------|------------|
| API Down | P1 | 5 min | Immediate |
| Error Rate > 5% | P2 | 15 min | 30 min |
| Ingestion Stopped | P2 | 30 min | 2 hours |
| DLQ > 100 | P3 | 2 hours | Next day |
| Disk > 80% | P3 | 4 hours | Next day |
| Certificate Expiry | P3 | 1 week | - |

### Grafana Dashboards

- **API Overview**: Response times, error rates, throughput
- **Ingestion**: Jobs/hour, success rate, queue depth
- **Matching**: Match scores, feedback, latency
- **Infrastructure**: CPU, memory, disk, network

---

## 8. Backup & Recovery

### Daily Backups

- PostgreSQL: Automated snapshots (RDS)
- MongoDB: mongodump to S3
- Vector DB: Pinecone managed
- Files: S3 versioning enabled

### Recovery Procedures

```bash
# Restore PostgreSQL to point in time
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier tendbee-prod \
  --target-db-instance-identifier tendbee-recovered \
  --restore-time "2025-01-01T12:00:00Z"

# Restore MongoDB
mongorestore --uri $MONGO_URI --archive=backup.gz --gzip
```

RTO: 4 hours | RPO: 1 hour
