import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  
  // State for screen navigation
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userType, setUserType] = useState(null); // 'jobseeker' or 'employer'
  const [userData, setUserData] = useState({
    // Grunduppgifter (basic info) - fylls i under registrering
    basicInfoCompleted: false,
    // Kurser
    onlineCourseCompleted: false,
    practicalCourseCompleted: false,
    // CV-förbättringar
    skills: [],
    education: [],
    experience: [],
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);

  // Beräkna profilprocent baserat på alla kategorier
  // Fördelning:
  // - Grunduppgifter: 20%
  // - Online kurs: 15%
  // - Praktik/Ansökan: 15%
  // - Kompetenser & Certifikat: 20%
  // - Utbildning: 15%
  // - Erfarenhet: 15%
  // Total: 100%
  const profilePercentage = useMemo(() => {
    let percentage = 0;
    
    // Grunduppgifter (20%) - antar att det är klart om man har gått genom registreringen
    if (userData.basicInfoCompleted) {
      percentage += 20;
    }
    
    // Online kurs (15%)
    if (userData.onlineCourseCompleted) {
      percentage += 15;
    }
    
    // Praktik/Ansökan (15%)
    if (userData.practicalCourseCompleted) {
      percentage += 15;
    }
    
    // Kompetenser & Certifikat (20%) - max 20% om man har minst 3 kompetenser
    const skillsCount = userData.skills?.length || 0;
    if (skillsCount > 0) {
      const skillsPercentage = Math.min(skillsCount * 7, 20); // ~7% per kompetens, max 20%
      percentage += skillsPercentage;
    }
    
    // Utbildning (15%) - max 15% om man har minst 2 utbildningar
    const educationCount = userData.education?.length || 0;
    if (educationCount > 0) {
      const educationPercentage = Math.min(educationCount * 8, 15); // ~8% per utbildning, max 15%
      percentage += educationPercentage;
    }
    
    // Erfarenhet (15%) - max 15% om man har minst 2 erfarenheter
    const experienceCount = userData.experience?.length || 0;
    if (experienceCount > 0) {
      const experiencePercentage = Math.min(experienceCount * 8, 15); // ~8% per erfarenhet, max 15%
      percentage += experiencePercentage;
    }
    
    return Math.min(Math.round(percentage), 100);
  }, [userData]);

  // Handle URL-based navigation for testing
  useEffect(() => {
    const screen = searchParams.get('screen');
    if (screen) {
      setCurrentScreen(screen);
      // Set appropriate user type based on screen
      if (['myQRCode', 'cvCompleted', 'jobList', 'jobDetails', 'courses'].includes(screen)) {
        setUserType('jobseeker');
        // Simulera att grunduppgifter är klara för testning
        setUserData(prev => ({ ...prev, basicInfoCompleted: true }));
      } else if (['companyQRCode', 'employerDashboard', 'candidateList'].includes(screen)) {
        setUserType('employer');
      }
    }
  }, [searchParams]);
  
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

    // Markera grunduppgifter som klara när man kommer till cvCompleted
    if (screen === 'cvCompleted' && !userData.basicInfoCompleted) {
      setUserData(prev => ({ ...prev, basicInfoCompleted: true }));
    }
    
    setCurrentScreen(screen);
  };
  
  // Update user data during registration flow
  const handleUpdateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  // Hantera kursavslutning
  const handleCompleteCourse = (courseType) => {
    if (courseType === 'online') {
      setUserData(prev => ({ ...prev, onlineCourseCompleted: true }));
    } else if (courseType === 'physical') {
      setUserData(prev => ({ ...prev, practicalCourseCompleted: true }));
    }
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
      profilePercentage, // Skicka profilprocent till alla skärmar
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
            onUpdate={handleUpdateUserData}
            onCompleteCourse={handleCompleteCourse}
            coursesCompleted={{
              online: userData.onlineCourseCompleted,
              physical: userData.practicalCourseCompleted,
            }}
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6 py-8">
        {renderScreen()}
      </div>
    </div>
  );
}

export default JobMatchingApp;
