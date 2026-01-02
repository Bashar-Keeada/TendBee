import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all screens
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { BasicInfoScreen } from './screens/BasicInfoScreen';
import { EmploymentStatusScreen } from './screens/EmploymentStatusScreen';
import { LocationPreferencesScreen } from './screens/LocationPreferencesScreen';
import { SalaryPreferencesScreen } from './screens/SalaryPreferencesScreen';
import { CVQuestion1Screen } from './screens/CVQuestion1Screen';
import { CVQuestion2Screen } from './screens/CVQuestion2Screen';
import { CVQuestion3Screen } from './screens/CVQuestion3Screen';
import { CVCompletedScreen } from './screens/CVCompletedScreen';
import { CoursesScreen } from './screens/CoursesScreen';
import { MyQRCodeScreen } from './screens/MyQRCodeScreen';
import { JobListScreen } from './screens/JobListScreen';
import { JobDetailsScreen } from './screens/JobDetailsScreen';
import { InterestSentScreen } from './screens/InterestSentScreen';
import { CompanyInfoScreen } from './screens/CompanyInfoScreen';
import { EmployerDashboardScreen } from './screens/EmployerDashboardScreen';
import { CreateJobScreen } from './screens/CreateJobScreen';
import { JobRequirementsScreen } from './screens/JobRequirementsScreen';
import { CandidateListScreen } from './screens/CandidateListScreen';
import { CalendarInviteScreen } from './screens/CalendarInviteScreen';
import { CompanyQRCodeScreen } from './screens/CompanyQRCodeScreen';

// Admin Panel
import { AdminPanel } from './AdminPanel';

export function JobMatchingApp() {
  const navigate = useNavigate();
  
  // State for screen navigation
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userType, setUserType] = useState(null); // 'jobseeker' or 'employer'
  const [userData, setUserData] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  
  // Handle navigation between screens
  const handleNavigate = (screen, data) => {
    // If navigating to login, set user type
    if (screen === 'login' && data) {
      setUserType(data);
    }
    
    // Handle special data passing
    if (screen === 'jobDetails' && data) {
      setSelectedJob(data);
    }
    
    if (screen === 'candidateCalendar' && data) {
      setSelectedCandidate(data);
    }
    
    if (screen === 'jobRequirements' && data?.jobId) {
      setCurrentJobId(data.jobId);
    }
    
    setCurrentScreen(screen);
  };
  
  // Update user data during registration flow
  const handleUpdateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };
  
  // Update company data
  const handleUpdateCompanyData = (newData) => {
    setCompanyData(prev => prev ? { ...prev, ...newData } : newData);
  };
  
  // Go back to home/landing page
  const handleBackToHome = () => {
    navigate('/');
  };
  
  // Render current screen based on state
  const renderScreen = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      userType,
    };
    
    switch (currentScreen) {
      // Landing & Auth
      case 'landing':
        return <LandingScreen {...commonProps} />;
      case 'login':
        return <LoginScreen {...commonProps} />;
      
      // Jobseeker Flow
      case 'basicInfo':
        return (
          <BasicInfoScreen 
            {...commonProps} 
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'employmentStatus':
        return (
          <EmploymentStatusScreen 
            {...commonProps}
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'locationPreferences':
        return (
          <LocationPreferencesScreen 
            {...commonProps}
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'salaryPreferences':
        return (
          <SalaryPreferencesScreen 
            {...commonProps}
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'cvQuestion1':
        return (
          <CVQuestion1Screen 
            {...commonProps}
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'cvQuestion2':
        return (
          <CVQuestion2Screen 
            {...commonProps}
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'cvQuestion3':
        return (
          <CVQuestion3Screen 
            {...commonProps}
            userData={userData}
            onUpdate={handleUpdateUserData}
          />
        );
      case 'cvCompleted':
        return (
          <CVCompletedScreen 
            {...commonProps}
            userData={userData}
          />
        );
      case 'courses':
        return (
          <CoursesScreen 
            {...commonProps}
            userData={userData}
          />
        );
      case 'myQRCode':
        return (
          <MyQRCodeScreen 
            {...commonProps}
            userData={userData}
          />
        );
      case 'jobList':
        return (
          <JobListScreen 
            {...commonProps}
            userData={userData}
          />
        );
      case 'jobDetails':
        return (
          <JobDetailsScreen 
            {...commonProps}
            job={selectedJob}
            userData={userData}
          />
        );
      case 'interestSent':
        return (
          <InterestSentScreen 
            {...commonProps}
            job={selectedJob}
          />
        );
      
      // Employer Flow
      case 'companyInfo':
        return (
          <CompanyInfoScreen 
            {...commonProps}
            companyData={companyData}
            onUpdate={handleUpdateCompanyData}
          />
        );
      case 'employerDashboard':
        return (
          <EmployerDashboardScreen 
            {...commonProps}
            companyData={companyData}
          />
        );
      case 'createJob':
        return (
          <CreateJobScreen 
            {...commonProps}
            companyData={companyData}
          />
        );
      case 'jobRequirements':
        return (
          <JobRequirementsScreen 
            {...commonProps}
            jobId={currentJobId}
            companyData={companyData}
          />
        );
      case 'candidateList':
        return (
          <CandidateListScreen 
            {...commonProps}
            companyData={companyData}
          />
        );
      case 'candidateCalendar':
        return (
          <CalendarInviteScreen 
            {...commonProps}
            candidate={selectedCandidate}
          />
        );
      case 'companyQRCode':
        return (
          <CompanyQRCodeScreen 
            {...commonProps}
            companyData={companyData}
          />
        );
      
      // Admin Panel
      case 'admin':
        return <AdminPanel onExit={() => handleNavigate('landing')} />;
      
      default:
        return <LandingScreen {...commonProps} />;
    }
  };
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      {renderScreen()}
    </div>
  );
}

export default JobMatchingApp;
