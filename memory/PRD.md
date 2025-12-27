# AI-Baserad Jobbmatchningsplattform - PRD

## Overview
A mobile-first clickable app prototype for an AI-based job matching platform that connects job seekers and employers through AI matching and QR codes. Built as a visual prototype (frontend only) designed to be shown to developers as a product handoff.

## Tech Stack
- React with JavaScript
- Tailwind CSS v3
- shadcn/ui components
- Lucide React for icons
- State management via React useState

## Design System

### Color Scheme (HSL format)
- **Primary (Job Seekers)**: Blue - `217 91% 60%` (#2563eb)
- **Secondary (Employers)**: Green - `160 84% 39%` (#10b981)
- **Accent (Highlights/Match)**: Orange - `38 92% 50%` (#f59e0b)
- **Background**: White - `0 0% 100%`
- **Foreground**: Dark gray - `220 14% 10%`
- **Muted**: Soft gray - `220 14% 96%`

### Typography
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700
- Scandinavian minimal design aesthetic

### UI Components
- iPhone frame wrapper (390x844px)
- Progress bars for onboarding flows
- Profile completeness circular indicator
- Option cards with selection states
- Match badges with color coding (green >85%, orange 70-84%)
- Sticky footers for primary actions
- Info boxes with icon highlights

## Features Implemented

### Job Seeker Flow (15+ screens)
1. **Landing Screen** - Role selection (Job seeker/Employer/QR scan)
2. **Login Screen** - BankID mock authentication
3. **Basic Info** - Name, age, phone (Step 1/7)
4. **Employment Status** - Current work status with conditional AF support options (Step 2/7)
5. **Location Preferences** - Country/city selection with remote work option (Step 3/7)
6. **Salary Preferences** - Slider for min salary with negotiable option (Step 4/7)
7. **CV Question 1** - Job categories/experience (Step 5/7)
8. **CV Question 2** - Language skills (Step 6/7)
9. **CV Question 3** - Availability, work types, driver's license (Step 7/7)
10. **CV Completed** - Success screen with profile percentage and next steps
11. **My QR Code** - Personal QR code for quick applications
12. **Job List** - Recommended jobs with AI match percentages
13. **Job Details** - Full job description with requirements and benefits
14. **Interest Sent** - Confirmation screen with next steps
15. **Calendar Invite** - Mock calendar invitation from employer
16. **Courses** - Profile improvement through courses (Keeada Academy)

### Employer Flow (7 screens)
1. **Login Screen** - BankID mock (green theme)
2. **Company Info** - Company details form
3. **Dashboard** - Overview with stats and activity
4. **Create Job** - Job posting form
5. **Job Requirements** - Define candidate requirements
6. **Company QR Code** - QR code for quick applications
7. **Candidate List** - Matched candidates with filtering

## Key Interactions
- Full navigation between all screens via state management
- Conditional form fields (employment status → AF options)
- Multi-select options with visual feedback
- Profile completeness tracking (50% → 75% → 100%)
- Course completion tracking
- Match score color coding

## Mock Data
- 3 sample job listings with different match scores
- 3 sample candidates with skills and availability
- Country/city configurations for Sweden, Norway, Denmark, USA

## File Structure
```
/app/frontend/src/
├── App.js                          # Main app with routing
├── index.css                       # Design system tokens
├── config/
│   └── appConfig.js               # Country configs, mock data
├── components/
│   ├── MobileFrame.jsx            # iPhone frame wrapper
│   ├── ScreenContainer.jsx        # Layout wrapper
│   ├── ProgressBar.jsx            # Step progress indicator
│   ├── ProfileCompleteness.jsx    # Circular progress widget
│   └── screens/
│       ├── LandingScreen.jsx
│       ├── LoginScreen.jsx
│       ├── BasicInfoScreen.jsx
│       ├── EmploymentStatusScreen.jsx
│       ├── LocationPreferencesScreen.jsx
│       ├── SalaryPreferencesScreen.jsx
│       ├── CVQuestion1Screen.jsx
│       ├── CVQuestion2Screen.jsx
│       ├── CVQuestion3Screen.jsx
│       ├── CVCompletedScreen.jsx
│       ├── MyQRCodeScreen.jsx
│       ├── JobListScreen.jsx
│       ├── JobDetailsScreen.jsx
│       ├── InterestSentScreen.jsx
│       ├── CalendarInviteScreen.jsx
│       ├── CoursesScreen.jsx
│       ├── CompanyInfoScreen.jsx
│       ├── EmployerDashboardScreen.jsx
│       ├── CreateJobScreen.jsx
│       ├── JobRequirementsScreen.jsx
│       ├── CompanyQRCodeScreen.jsx
│       └── CandidateListScreen.jsx
```

## Notes
- This is a **frontend-only prototype** with mock data
- No backend integration - all state is managed in React
- BankID login is a visual mock, no actual authentication
- QR codes are visual representations using Lucide icons
- AI matching percentages are pre-defined in mock data
- Swedish language throughout the UI
