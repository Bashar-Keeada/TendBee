/**
 * Admin API Service
 * Handles all admin-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// ===================== ADMIN API =====================

export const adminAPI = {
  // Stats
  getStats: () => fetchAPI('/api/admin/stats'),
  getActivity: (limit = 50) => fetchAPI(`/api/admin/activity?limit=${limit}`),
  
  // Jobseekers
  listJobseekers: (params = {}) => {
    const query = new URLSearchParams(params);
    return fetchAPI(`/api/admin/jobseekers?${query}`);
  },
  deleteJobseeker: (id) => fetchAPI(`/api/admin/jobseekers/${id}`, { method: 'DELETE' }),
  
  // Companies
  listCompanies: (params = {}) => {
    const query = new URLSearchParams(params);
    return fetchAPI(`/api/admin/companies?${query}`);
  },
  deleteCompany: (id) => fetchAPI(`/api/admin/companies/${id}`, { method: 'DELETE' }),
  
  // Jobs
  listJobs: (params = {}) => {
    const query = new URLSearchParams(params);
    return fetchAPI(`/api/admin/jobs?${query}`);
  },
  toggleJobActive: (id) => fetchAPI(`/api/admin/jobs/${id}/toggle-active`, { method: 'PUT' }),
  deleteJob: (id) => fetchAPI(`/api/admin/jobs/${id}`, { method: 'DELETE' }),
  
  // Interests
  listInterests: (params = {}) => {
    const query = new URLSearchParams(params);
    return fetchAPI(`/api/admin/interests?${query}`);
  },
  updateInterestStatus: (id, status) => 
    fetchAPI(`/api/admin/interests/${id}/status?status=${status}`, { method: 'PUT' }),
};

export default adminAPI;
