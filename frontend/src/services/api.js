/**
 * API Service for Jobbmatchning Platform
 * Handles all communication with the backend API
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ===================== JOBSEEKER API =====================

export const jobseekerAPI = {
  /**
   * Create a new job seeker profile
   */
  create: async (data) => {
    return fetchAPI('/api/jobseekers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Get a job seeker profile by ID
   */
  get: async (id) => {
    return fetchAPI(`/api/jobseekers/${id}`);
  },
  
  /**
   * Update a job seeker profile
   */
  update: async (id, data) => {
    return fetchAPI(`/api/jobseekers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * List all job seekers with optional filters
   */
  list: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/api/jobseekers?${params}`);
  },
};

// ===================== COMPANY API =====================

export const companyAPI = {
  /**
   * Create a new company
   */
  create: async (data) => {
    return fetchAPI('/api/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Get a company by ID
   */
  get: async (id) => {
    return fetchAPI(`/api/companies/${id}`);
  },
  
  /**
   * List all companies
   */
  list: async () => {
    return fetchAPI('/api/companies');
  },
};

// ===================== JOB API =====================

export const jobAPI = {
  /**
   * Create a new job posting
   */
  create: async (data) => {
    return fetchAPI('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Get a job by ID
   */
  get: async (id) => {
    return fetchAPI(`/api/jobs/${id}`);
  },
  
  /**
   * List all jobs with optional filters
   */
  list: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/api/jobs?${params}`);
  },
  
  /**
   * Get jobs matched to a job seeker with AI match scores
   */
  getMatched: async (jobseekerId, limit = 20) => {
    return fetchAPI(`/api/jobs/matched/${jobseekerId}?limit=${limit}`);
  },
};

// ===================== CANDIDATE API =====================

export const candidateAPI = {
  /**
   * Get candidates matched to a job with AI match scores
   */
  getMatched: async (jobId, limit = 20) => {
    return fetchAPI(`/api/candidates/matched/${jobId}?limit=${limit}`);
  },
};

// ===================== INTEREST API =====================

export const interestAPI = {
  /**
   * Create a new job interest (job seeker applies)
   */
  create: async (data) => {
    return fetchAPI('/api/interests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Get all interests for a job
   */
  getByJob: async (jobId) => {
    return fetchAPI(`/api/interests/job/${jobId}`);
  },
  
  /**
   * Get all interests from a job seeker
   */
  getByJobseeker: async (jobseekerId) => {
    return fetchAPI(`/api/interests/jobseeker/${jobseekerId}`);
  },
};

// ===================== CALENDAR API =====================

export const calendarAPI = {
  /**
   * Create a calendar invite (interview invitation)
   */
  create: async (data) => {
    return fetchAPI('/api/calendar-invites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Get all calendar invites for a job seeker
   */
  getByJobseeker: async (jobseekerId) => {
    return fetchAPI(`/api/calendar-invites/jobseeker/${jobseekerId}`);
  },
  
  /**
   * Respond to a calendar invite
   */
  respond: async (inviteId, status) => {
    return fetchAPI(`/api/calendar-invites/${inviteId}/respond?status=${status}`, {
      method: 'PUT',
    });
  },
};

// ===================== STATS API =====================

export const statsAPI = {
  /**
   * Get dashboard stats for an employer
   */
  getEmployerStats: async (companyId) => {
    return fetchAPI(`/api/stats/employer/${companyId}`);
  },
};

// ===================== HEALTH CHECK =====================

export const healthCheck = async () => {
  return fetchAPI('/api/health');
};

// Default export with all APIs
export default {
  jobseeker: jobseekerAPI,
  company: companyAPI,
  job: jobAPI,
  candidate: candidateAPI,
  interest: interestAPI,
  calendar: calendarAPI,
  stats: statsAPI,
  healthCheck,
};
