# Admin UI Requirements

## Overview

The TendBee Admin Dashboard provides administrative control over the recruitment platform, including connector management, job ingestion monitoring, user management, and GDPR compliance tools.

## User Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|------------------|
| Super Admin | Full system access | All permissions |
| Admin | Operational management | Users, Jobs, Connectors, GDPR |
| Support | Customer support | Users (read), GDPR export |
| Analyst | Data analysis | Analytics, Reports (read-only) |

## Module Requirements

### 1. Dashboard Overview

**Purpose:** High-level system health and KPIs at a glance.

**Features:**
- Real-time metrics cards:
  - Total active jobs
  - Jobs ingested today
  - Active candidates
  - Matches generated today
  - Error rate
- System health indicators (API, DB, Queue, Vector DB)
- Recent alerts and notifications
- Quick action buttons

**Widgets:**
```
┌────────────────────────────────────────────────────────────┐
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  12,456  │ │    847   │ │   5,234  │ │  15,678  │    │
│  │  Jobs    │ │ Ingested │ │ Candidates│ │ Matches  │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                            │
│  ┌───────────────────────────┐ ┌───────────────────────────┐  │
│  │   Ingestion Rate (24h)    │ │     System Health        │  │
│  │   [==========] 95%       │ │   API: ✔  DB: ✔  Q: ✔   │  │
│  └───────────────────────────┘ └───────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

### 2. Connector Management

**Purpose:** Configure and monitor job source connectors.

**Features:**

#### 2.1 Connector List
- Table view of all connectors
- Columns: Name, Source, Status, Last Fetch, Jobs (24h), Errors (24h), Actions
- Status indicators: Active (green), Paused (yellow), Error (red)
- Quick actions: Pause/Resume, Test, View Logs

#### 2.2 Connector Details
- Configuration form:
  - Name
  - Source type (dropdown)
  - API URL
  - API Key (masked, with reveal option)
  - Fetch interval
  - Rate limit
  - Region/category filters
- Test connection button
- Activity chart (jobs fetched over time)
- Recent errors list

#### 2.3 Connector Logs
- Real-time log viewer
- Filter by: Level (info/warn/error), Time range
- Search within logs
- Download logs

**API Endpoints:**
```
GET    /api/admin/connectors
GET    /api/admin/connectors/:id
POST   /api/admin/connectors
PUT    /api/admin/connectors/:id
DELETE /api/admin/connectors/:id
POST   /api/admin/connectors/:id/test
POST   /api/admin/connectors/:id/pause
POST   /api/admin/connectors/:id/resume
GET    /api/admin/connectors/:id/logs
```

---

### 3. Ingestion Monitoring

**Purpose:** Monitor job ingestion pipeline and handle failures.

**Features:**

#### 3.1 Ingestion Dashboard
- Real-time ingestion rate chart
- Queue depth indicator
- Success/failure rate pie chart
- Recent ingestions table

#### 3.2 Ingest Log Viewer
- Table with columns: ID, Source, External ID, Status, Time, Duration
- Filters: Source, Status, Date range
- Click to view details:
  - Raw payload (JSON viewer)
  - Normalized output
  - Error details
  - Processing steps

#### 3.3 Dead Letter Queue (DLQ)
- List of failed ingestions
- Bulk actions: Retry, Delete
- Individual actions: View, Edit payload, Retry
- Error categorization

#### 3.4 Reindex Controls
- Select jobs to reindex
- Full reindex option (with confirmation)
- Progress indicator
- Reindex history

**API Endpoints:**
```
GET    /api/admin/ingest-logs
GET    /api/admin/ingest-logs/:id
GET    /api/admin/dlq
POST   /api/admin/dlq/retry
POST   /api/admin/dlq/retry/:id
DELETE /api/admin/dlq/:id
POST   /api/admin/reindex
GET    /api/admin/reindex/status
```

---

### 4. Manual Review Queue

**Purpose:** Handle items requiring human review.

**Features:**

#### 4.1 Review Queue
- Table with columns: ID, Type, Source, Reason, Created, Assigned To, Actions
- Filter by: Type, Status, Assigned To
- Sort by: Priority, Age
- Bulk assign to reviewer

#### 4.2 Review Item Detail
- Side-by-side view: Original vs Normalized
- Diff highlighting for duplicates
- Action buttons:
  - Approve (accept as-is)
  - Edit & Approve (modify and save)
  - Reject (delete)
  - Merge (for duplicates)
- Add notes/comments
- View related items

#### 4.3 Review Types
- Parse errors: Jobs that failed normalization
- Duplicate review: Potential duplicates needing confirmation
- Quality check: Low-quality jobs flagged by ML
- Reported content: User-reported inappropriate jobs

**API Endpoints:**
```
GET    /api/admin/review-queue
GET    /api/admin/review-queue/:id
POST   /api/admin/review-queue/:id/approve
POST   /api/admin/review-queue/:id/reject
POST   /api/admin/review-queue/:id/merge
PUT    /api/admin/review-queue/:id/assign
```

---

### 5. GDPR Controls

**Purpose:** Manage GDPR compliance and data subject requests.

**Features:**

#### 5.1 Request Management
- List of GDPR requests
- Columns: ID, Type, User, Status, Requested, Deadline, Assigned
- Status badges with days remaining
- Quick actions: Process, View Details

#### 5.2 Export Request Processing
- User data preview
- Export format selection (JSON)
- Generate export button
- Download link (time-limited)
- Send to user via email

#### 5.3 Deletion Request Processing
- Data preview (what will be deleted)
- Confirmation checklist:
  - [ ] Active subscriptions cancelled
  - [ ] No pending transactions
  - [ ] Matches anonymized
  - [ ] Consent records preserved (anonymized)
- Execute deletion button
- Audit log entry

#### 5.4 Consent Dashboard
- Consent statistics by type
- Consent history viewer
- Consent text version management

**API Endpoints:**
```
GET    /api/admin/gdpr/requests
GET    /api/admin/gdpr/requests/:id
POST   /api/admin/gdpr/export/:user_id
POST   /api/admin/gdpr/delete/:user_id
GET    /api/admin/gdpr/consent-stats
GET    /api/admin/gdpr/consent-history/:user_id
```

---

### 6. Match Feedback & ML Training

**Purpose:** Review match quality and improve ML model.

**Features:**

#### 6.1 Match Quality Dashboard
- Match score distribution chart
- Feedback statistics (relevant/not relevant)
- A/B test results for different weights

#### 6.2 Feedback Review
- List of matches with feedback
- Filter by: Feedback type, Score range, Date
- View match details:
  - Job summary
  - Candidate summary (anonymized)
  - Score breakdown
  - User feedback

#### 6.3 Weight Configuration
- Current weights display
- Weight adjustment sliders
- Preview impact on sample matches
- Deploy new weights (with rollback option)

#### 6.4 Training Data Export
- Export feedback data for ML training
- Select date range
- Download as CSV/JSON

**API Endpoints:**
```
GET    /api/admin/matches/feedback
GET    /api/admin/matches/stats
GET    /api/admin/matches/weights
PUT    /api/admin/matches/weights
POST   /api/admin/matches/export-training-data
```

---

### 7. User Management

**Purpose:** Manage job seekers, employers, and admin users.

**Features:**

#### 7.1 User List
- Tabbed view: Job Seekers, Employers, Admins
- Search by: Email, Name, ID
- Filter by: Status, Registration date, Plus membership
- Columns: Name, Email, Type, Status, Registered, Last Active

#### 7.2 User Details
- Profile information (read-only for most fields)
- Account status controls: Activate, Suspend, Delete
- Activity log
- Support notes
- GDPR actions: Export, Delete

#### 7.3 Admin User Management
- Create admin accounts
- Assign roles and permissions
- Reset password / 2FA
- View admin activity log

**API Endpoints:**
```
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/status
DELETE /api/admin/users/:id
GET    /api/admin/users/:id/activity
POST   /api/admin/admins
PUT    /api/admin/admins/:id
```

---

### 8. Analytics & Reports

**Purpose:** Business intelligence and reporting.

**Features:**

#### 8.1 Standard Dashboards
- User acquisition funnel
- Job source performance
- Match quality over time
- Geographic distribution
- Industry breakdown

#### 8.2 Custom Reports
- Report builder with drag-and-drop
- Saved reports
- Scheduled email reports
- Export to CSV/PDF

#### 8.3 Data Monetization Preview
- Aggregated market insights
- Salary trends by role/region
- Skill demand analysis
- All data anonymized

---

## Technical Requirements

### Authentication
- SSO integration (Google Workspace, Azure AD)
- 2FA required for all admin accounts
- Session timeout: 30 minutes
- Audit logging for all actions

### Security
- Role-based access control (RBAC)
- IP allowlist option
- PII masking in logs
- Encryption at rest for sensitive data

### Performance
- Page load < 2 seconds
- Real-time updates via WebSocket
- Infinite scroll for large lists
- Client-side caching

### Tech Stack Recommendation
- Frontend: React + TypeScript + TailwindCSS
- State: React Query for server state
- Charts: Recharts or Tremor
- Tables: TanStack Table
- Forms: React Hook Form + Zod

---

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

---

## Localization

- Primary: Swedish
- Secondary: English
- Date/time format: Swedish locale
- Currency: SEK
