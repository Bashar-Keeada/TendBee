/**
 * EXEMPEL: Hur du integrerar Backend API i React-komponenter
 * 
 * Denna fil visar hur du kan uppdatera dina befintliga komponenter
 * för att använda det riktiga backend API:et istället för mock data.
 */

import React, { useState, useEffect } from 'react';
import { jobseekerAPI, jobAPI, companyAPI, interestAPI, calendarAPI } from '@/services/api';
import { useAPI } from '@/hooks/useAPI';

// =================================================================
// EXEMPEL 1: Skapa en jobbsökarprofil (BasicInfoScreen)
// =================================================================
export function ExampleBasicInfoWithAPI({ onNavigate, onSetJobseekerId }) {
  const { loading, error, execute } = useAPI();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    phone: '',
  });

  const handleSubmit = async () => {
    try {
      // Skapa profil i databasen
      const profile = await execute(() => jobseekerAPI.create({
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: parseInt(formData.age),
        phone: formData.phone,
      }));
      
      // Spara jobseeker ID för framtida API-anrop
      onSetJobseekerId(profile.id);
      
      // Navigera till nästa steg
      onNavigate('employmentStatus');
    } catch (err) {
      console.error('Kunde inte skapa profil:', err);
    }
  };

  return (
    <div>
      {error && <p className="text-destructive">{error}</p>}
      {/* ... dina form-fält ... */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Skapar...' : 'Fortsätt'}
      </button>
    </div>
  );
}


// =================================================================
// EXEMPEL 2: Uppdatera jobbsökarprofil (EmploymentStatusScreen)
// =================================================================
export function ExampleUpdateProfileWithAPI({ jobseekerId, onNavigate }) {
  const { loading, error, execute } = useAPI();
  
  const handleUpdateProfile = async (updateData) => {
    try {
      await execute(() => jobseekerAPI.update(jobseekerId, updateData));
      onNavigate('locationPreferences');
    } catch (err) {
      console.error('Kunde inte uppdatera profil:', err);
    }
  };

  // Exempel: Uppdatera arbetsstatus
  const saveEmploymentStatus = () => {
    handleUpdateProfile({
      is_employed: false,
      months_unemployed: 6,
      is_registered_af: true,
      af_supports: ['rusta', 'praktik'],
    });
  };

  return (
    <div>
      {/* ... dina UI-komponenter ... */}
      <button onClick={saveEmploymentStatus} disabled={loading}>
        {loading ? 'Sparar...' : 'Fortsätt'}
      </button>
    </div>
  );
}


// =================================================================
// EXEMPEL 3: Hämta matchade jobb (JobListScreen)
// =================================================================
export function ExampleJobListWithAPI({ jobseekerId, onNavigate, onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMatchedJobs() {
      try {
        // Hämta jobb med AI-matchningspoäng
        const matchedJobs = await jobAPI.getMatched(jobseekerId);
        setJobs(matchedJobs);
      } catch (err) {
        setError('Kunde inte hämta jobb');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (jobseekerId) {
      fetchMatchedJobs();
    }
  }, [jobseekerId]);

  if (loading) return <div>Laddar jobb...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Rekommenderade jobb</h1>
      {jobs.map((job) => (
        <div key={job.id} onClick={() => {
          onSelectJob(job);
          onNavigate('jobDetails');
        }}>
          <h3>{job.title}</h3>
          <p>{job.company_name}</p>
          <span className={job.match_score >= 85 ? 'match-high' : 'match-medium'}>
            {job.match_score}% match
          </span>
        </div>
      ))}
    </div>
  );
}


// =================================================================
// EXEMPEL 4: Visa intresse för jobb (JobDetailsScreen)
// =================================================================
export function ExampleShowInterestWithAPI({ job, jobseekerId, onNavigate }) {
  const { loading, error, execute } = useAPI();

  const handleShowInterest = async () => {
    try {
      await execute(() => interestAPI.create({
        job_id: job.id,
        jobseeker_id: jobseekerId,
      }));
      
      onNavigate('interestSent');
    } catch (err) {
      // Felhantering - t.ex. redan visat intresse
      console.error('Kunde inte visa intresse:', err);
    }
  };

  return (
    <button onClick={handleShowInterest} disabled={loading}>
      {loading ? 'Skickar...' : 'Jag är intresserad'}
    </button>
  );
}


// =================================================================
// EXEMPEL 5: Skapa företag (CompanyInfoScreen)
// =================================================================
export function ExampleCreateCompanyWithAPI({ onNavigate, onSetCompanyId }) {
  const { loading, error, execute } = useAPI();
  const [formData, setFormData] = useState({
    company_name: '',
    org_number: '',
    contact_person: '',
    email: '',
    phone: '',
    city: '',
    industry: '',
  });

  const handleSubmit = async () => {
    try {
      const company = await execute(() => companyAPI.create(formData));
      onSetCompanyId(company.id);
      onNavigate('employerDashboard');
    } catch (err) {
      console.error('Kunde inte skapa företag:', err);
    }
  };

  return (
    <div>
      {/* ... form fields ... */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Skapar...' : 'Fortsätt'}
      </button>
    </div>
  );
}


// =================================================================
// EXEMPEL 6: Hämta matchade kandidater (CandidateListScreen)
// =================================================================
export function ExampleCandidateListWithAPI({ jobId }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const { candidateAPI } = await import('@/services/api');
        const matched = await candidateAPI.getMatched(jobId);
        setCandidates(matched);
      } catch (err) {
        console.error('Kunde inte hämta kandidater:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, [jobId]);

  if (loading) return <div>Laddar kandidater...</div>;

  return (
    <div>
      <h1>Matchande kandidater</h1>
      {candidates.map((candidate) => (
        <div key={candidate.id}>
          <h3>{candidate.first_name} {candidate.last_name}</h3>
          <span>{candidate.match_score}% match</span>
          <p>Erfarenhet: {candidate.job_categories.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}


// =================================================================
// EXEMPEL 7: Skicka kalenderinbjudan (CandidateListScreen)
// =================================================================
export function ExampleSendCalendarInviteWithAPI({ candidate, job, companyId }) {
  const { loading, execute } = useAPI();

  const handleInvite = async () => {
    try {
      await execute(() => calendarAPI.create({
        job_id: job.id,
        jobseeker_id: candidate.id,
        company_id: companyId,
        title: `Intervju - ${job.title}`,
        date: '2025-01-15',
        time: '10:00',
        duration_minutes: 60,
        location: job.location,
        description: 'Välkommen till intervju!',
      }));
      
      alert('Inbjudan skickad!');
    } catch (err) {
      console.error('Kunde inte skicka inbjudan:', err);
    }
  };

  return (
    <button onClick={handleInvite} disabled={loading}>
      {loading ? 'Skickar...' : 'Bjud in till intervju'}
    </button>
  );
}


// =================================================================
// FULL INTEGRATION EXAMPLE: App.js med API State
// =================================================================
/*
function App() {
  // User state
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userType, setUserType] = useState(null);
  
  // API IDs - sparas efter skapande
  const [jobseekerId, setJobseekerId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  
  // Ladda från localStorage vid start
  useEffect(() => {
    const savedJobseekerId = localStorage.getItem('jobseekerId');
    const savedCompanyId = localStorage.getItem('companyId');
    if (savedJobseekerId) setJobseekerId(savedJobseekerId);
    if (savedCompanyId) setCompanyId(savedCompanyId);
  }, []);
  
  // Spara till localStorage
  useEffect(() => {
    if (jobseekerId) localStorage.setItem('jobseekerId', jobseekerId);
    if (companyId) localStorage.setItem('companyId', companyId);
  }, [jobseekerId, companyId]);

  // ... resten av din App logik
}
*/
