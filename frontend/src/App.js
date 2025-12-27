import React, { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';

// Job Seeker Screens
import LandingScreen from './components/screens/LandingScreen';
import LoginScreen from './components/screens/LoginScreen';
import BasicInfoScreen from './components/screens/BasicInfoScreen';
import EmploymentStatusScreen from './components/screens/EmploymentStatusScreen';
import LocationPreferencesScreen from './components/screens/LocationPreferencesScreen';
import SalaryPreferencesScreen from './components/screens/SalaryPreferencesScreen';
import CVQuestion1Screen from './components/screens/CVQuestion1Screen';
import CVQuestion2Screen from './components/screens/CVQuestion2Screen';
import CVQuestion3Screen from './components/screens/CVQuestion3Screen';
import CVCompletedScreen from './components/screens/CVCompletedScreen';
import MyQRCodeScreen from './components/screens/MyQRCodeScreen';
import JobListScreen from './components/screens/JobListScreen';
import JobDetailsScreen from './components/screens/JobDetailsScreen';
import InterestSentScreen from './components/screens/InterestSentScreen';
import CalendarInviteScreen from './components/screens/CalendarInviteScreen';
import CoursesScreen from './components/screens/CoursesScreen';

// Employer Screens
import CompanyInfoScreen from './components/screens/CompanyInfoScreen';
import EmployerDashboardScreen from './components/screens/EmployerDashboardScreen';
import CreateJobScreen from './components/screens/CreateJobScreen';
import JobRequirementsScreen from './components/screens/JobRequirementsScreen';
import CompanyQRCodeScreen from './components/screens/CompanyQRCodeScreen';
import CandidateListScreen from './components/screens/CandidateListScreen';

// Admin Panel
import AdminPanel from './components/AdminPanel';

function App() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userType, setUserType] = useState(null);
  
  // Admin mode
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Job seeker profile state
  const [profile, setProfile] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [coursesCompleted, setCoursesCompleted] = useState({
    online: false,
    physical: false,
  });
  
  // Employer state
  const [companyInfo, setCompanyInfo] = useState({});
  const [jobData, setJobData] = useState({});
  
  // Calculate profile completeness
  const calculateProfilePercentage = () => {
    let percentage = 50; // Base after completing CV
    if (coursesCompleted.online) percentage += 25;
    if (coursesCompleted.physical) percentage += 25;
    return percentage;
  };
  
  // Navigation handler
  const handleNavigate = (screen, type) => {
    if (type) {
      setUserType(type);
    }
    setCurrentScreen(screen);
  };
  
  // Update profile handler
  const handleUpdateProfile = (data) => {
    setProfile(prev => ({ ...prev, ...data }));
  };
  
  // Update company handler
  const handleUpdateCompany = (data) => {
    setCompanyInfo(prev => ({ ...prev, ...data }));
  };
  
  // Update job handler
  const handleUpdateJob = (data) => {
    setJobData(prev => ({ ...prev, ...data }));
  };
  
  // Complete course handler
  const handleCompleteCourse = (courseType) => {
    setCoursesCompleted(prev => ({
      ...prev,
      [courseType]: true,
    }));
  };
  
  // Render screen based on current state
  const renderScreen = () => {
    try {
      switch (currentScreen) {
        // Landing & Login
        case 'landing':
          return <LandingScreen onNavigate={handleNavigate} />;
        case 'login':
          return <LoginScreen onNavigate={handleNavigate} userType={userType} />;
        
        // Job Seeker Flow
        case 'basicInfo':
          return <BasicInfoScreen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
        case 'employmentStatus':
          return <EmploymentStatusScreen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
        case 'locationPreferences':
          return <LocationPreferencesScreen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
        case 'salaryPreferences':
          return <SalaryPreferencesScreen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} profile={profile} />;
        case 'cvQuestion1':
          return <CVQuestion1Screen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
        case 'cvQuestion2':
          return <CVQuestion2Screen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
        case 'cvQuestion3':
          return <CVQuestion3Screen onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
        case 'cvCompleted':
          return <CVCompletedScreen onNavigate={handleNavigate} profilePercentage={calculateProfilePercentage()} />;
        case 'myQRCode':
          return <MyQRCodeScreen onNavigate={handleNavigate} profilePercentage={calculateProfilePercentage()} />;
        case 'jobList':
          return <JobListScreen onNavigate={handleNavigate} onSelectJob={setSelectedJob} profilePercentage={calculateProfilePercentage()} />;
        case 'jobDetails':
          return <JobDetailsScreen onNavigate={handleNavigate} selectedJob={selectedJob} />;
        case 'interestSent':
          return <InterestSentScreen onNavigate={handleNavigate} />;
        case 'calendarInvite':
          return <CalendarInviteScreen onNavigate={handleNavigate} />;
        case 'courses':
          return <CoursesScreen onNavigate={handleNavigate} coursesCompleted={coursesCompleted} onCompleteCourse={handleCompleteCourse} />;
        
        // Employer Flow
        case 'companyInfo':
          return <CompanyInfoScreen onNavigate={handleNavigate} onUpdateCompany={handleUpdateCompany} />;
        case 'employerDashboard':
          return <EmployerDashboardScreen onNavigate={handleNavigate} />;
        case 'createJob':
          return <CreateJobScreen onNavigate={handleNavigate} onUpdateJob={handleUpdateJob} />;
        case 'jobRequirements':
          return <JobRequirementsScreen onNavigate={handleNavigate} />;
        case 'companyQRCode':
          return <CompanyQRCodeScreen onNavigate={handleNavigate} />;
        case 'candidateList':
          return <CandidateListScreen onNavigate={handleNavigate} />;
        
        default:
          return <LandingScreen onNavigate={handleNavigate} />;
      }
    } catch (error) {
      return (
        <div className="p-6 text-center">
          <h1 className="text-xl font-bold text-destructive mb-2">Error loading screen</h1>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button 
            onClick={() => setCurrentScreen('landing')}
            className="mt-4 text-primary underline"
          >
            Tillbaka till start
          </button>
        </div>
      );
    }
  };
  
  return (
    <MobileFrame>
      {renderScreen()}
    </MobileFrame>
  );
}

export default App;
