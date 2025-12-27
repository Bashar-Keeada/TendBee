import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminAPI } from '@/services/adminAPI';
import { 
  Users, Building2, Briefcase, Heart, TrendingUp, Activity,
  Search, Trash2, Eye, ToggleLeft, ToggleRight, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle2,
  UserCheck, UserX, Clock, Award, Settings, Home, List,
  FileText, Calendar, Shield, LogOut, Menu, X
} from 'lucide-react';

// Tab types
const TABS = {
  DASHBOARD: 'dashboard',
  JOBSEEKERS: 'jobseekers',
  COMPANIES: 'companies',
  JOBS: 'jobs',
  INTERESTS: 'interests',
};

export function AdminPanel({ onExit }) {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const renderContent = () => {
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <DashboardTab />;
      case TABS.JOBSEEKERS:
        return <JobseekersTab />;
      case TABS.COMPANIES:
        return <CompaniesTab />;
      case TABS.JOBS:
        return <JobsTab />;
      case TABS.INTERESTS:
        return <InterestsTab />;
      default:
        return <DashboardTab />;
    }
  };
  
  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-foreground text-background transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-background/10 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold">Admin Panel</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-background/10 rounded-lg"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {[
            { id: TABS.DASHBOARD, icon: Home, label: 'Dashboard' },
            { id: TABS.JOBSEEKERS, icon: Users, label: 'Jobbsökare' },
            { id: TABS.COMPANIES, icon: Building2, label: 'Företag' },
            { id: TABS.JOBS, icon: Briefcase, label: 'Jobb' },
            { id: TABS.INTERESTS, icon: Heart, label: 'Ansökningar' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-background/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        {/* Exit Button */}
        <div className="p-2 border-t border-background/10">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background/10 text-destructive"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Avsluta Admin</span>}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

// ===================== DASHBOARD TAB =====================
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, activityData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getActivity(20),
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Uppdatera
        </Button>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Jobbsökare" value={stats?.overview?.total_jobseekers || 0} color="primary" />
        <StatCard icon={Building2} label="Företag" value={stats?.overview?.total_companies || 0} color="secondary" />
        <StatCard icon={Briefcase} label="Totalt Jobb" value={stats?.overview?.total_jobs || 0} color="accent" />
        <StatCard icon={CheckCircle2} label="Aktiva Jobb" value={stats?.overview?.active_jobs || 0} color="secondary" />
        <StatCard icon={Heart} label="Ansökningar" value={stats?.overview?.total_interests || 0} color="primary" />
        <StatCard icon={Calendar} label="Inbjudningar" value={stats?.overview?.total_invites || 0} color="accent" />
      </div>
      
      {/* Recent Activity & Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Senaste veckan
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats?.recent_activity?.new_jobseekers || 0}</p>
              <p className="text-xs text-muted-foreground">Nya jobbsökare</p>
            </div>
            <div className="text-center p-3 bg-secondary/5 rounded-lg">
              <p className="text-2xl font-bold text-secondary">{stats?.recent_activity?.new_jobs || 0}</p>
              <p className="text-xs text-muted-foreground">Nya jobb</p>
            </div>
            <div className="text-center p-3 bg-accent/5 rounded-lg">
              <p className="text-2xl font-bold text-accent">{stats?.recent_activity?.new_interests || 0}</p>
              <p className="text-xs text-muted-foreground">Ansökningar</p>
            </div>
          </div>
        </div>
        
        {/* Jobseeker Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Jobbsökarstatistik
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-secondary" /> I arbete
              </span>
              <span className="font-semibold">{stats?.jobseeker_breakdown?.employed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <UserX className="w-4 h-4 text-accent" /> Arbetslösa
              </span>
              <span className="font-semibold">{stats?.jobseeker_breakdown?.unemployed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" /> AF-registrerade
              </span>
              <span className="font-semibold">{stats?.jobseeker_breakdown?.af_registered || 0}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Application Status Breakdown */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Ansökningsstatus
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard label="Väntande" value={stats?.interest_breakdown?.pending || 0} color="bg-yellow-500" />
          <StatusCard label="Granskade" value={stats?.interest_breakdown?.reviewed || 0} color="bg-blue-500" />
          <StatusCard label="Intervju" value={stats?.interest_breakdown?.interview || 0} color="bg-purple-500" />
          <StatusCard label="Anställda" value={stats?.interest_breakdown?.hired || 0} color="bg-green-500" />
        </div>
      </div>
      
      {/* Activity Feed */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Senaste aktivitet
        </h2>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {activity.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                item.type === 'new_jobseeker' ? 'bg-primary' :
                item.type === 'new_company' ? 'bg-secondary' :
                item.type === 'new_job' ? 'bg-accent' : 'bg-muted-foreground'
              }`} />
              <span className="text-sm text-foreground flex-1">{item.message}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleDateString('sv-SE')}
              </span>
            </div>
          ))}
          {activity.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Ingen aktivitet ännu</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== JOBSEEKERS TAB =====================
function JobseekersTab() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  
  useEffect(() => {
    loadData();
  }, [page, search]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await adminAPI.listJobseekers({
        search: search || undefined,
        skip: page * limit,
        limit,
      });
      setData(result);
    } catch (err) {
      console.error('Failed to load jobseekers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Är du säker på att du vill radera denna jobbsökare?')) return;
    try {
      await adminAPI.deleteJobseeker(id);
      loadData();
    } catch (err) {
      alert('Kunde inte radera: ' + err.message);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Jobbsökare</h1>
        <Badge variant="outline">{data.total} totalt</Badge>
      </div>
      
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Sök på namn eller telefon..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Namn</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Telefon</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Städer</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Skapad</th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Laddar...</td></tr>
            ) : data.data.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Inga jobbsökare hittades</td></tr>
            ) : (
              data.data.map((js) => (
                <tr key={js.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-foreground">{js.first_name} {js.last_name}</p>
                      <p className="text-xs text-muted-foreground">{js.age} år</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{js.phone}</td>
                  <td className="p-3">
                    {js.is_employed ? (
                      <Badge className="bg-secondary/15 text-secondary border-0">I arbete</Badge>
                    ) : (
                      <Badge className="bg-accent/15 text-accent border-0">Arbetslös</Badge>
                    )}
                    {js.is_registered_af && (
                      <Badge className="bg-primary/15 text-primary border-0 ml-1">AF</Badge>
                    )}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {js.cities?.slice(0, 2).join(', ') || '-'}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(js.created_at).toLocaleDateString('sv-SE')}
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(js.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination 
        total={data.total} 
        page={page} 
        limit={limit} 
        onPageChange={setPage} 
      />
    </div>
  );
}

// ===================== COMPANIES TAB =====================
function CompaniesTab() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  
  useEffect(() => {
    loadData();
  }, [page, search]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await adminAPI.listCompanies({
        search: search || undefined,
        skip: page * limit,
        limit,
      });
      setData(result);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Är du säker? Detta raderar även alla jobb för företaget.')) return;
    try {
      await adminAPI.deleteCompany(id);
      loadData();
    } catch (err) {
      alert('Kunde inte radera: ' + err.message);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Företag</h1>
        <Badge variant="outline">{data.total} totalt</Badge>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Sök på företagsnamn eller org.nr..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Företag</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Org.nr</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Kontakt</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Bransch</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Jobb</th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Laddar...</td></tr>
            ) : data.data.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Inga företag hittades</td></tr>
            ) : (
              data.data.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-foreground">{c.company_name}</p>
                      <p className="text-xs text-muted-foreground">{c.city}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{c.org_number}</td>
                  <td className="p-3">
                    <p className="text-sm text-foreground">{c.contact_person}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{c.industry}</td>
                  <td className="p-3">
                    <Badge variant="outline">{c.job_count || 0}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination total={data.total} page={page} limit={limit} onPageChange={setPage} />
    </div>
  );
}

// ===================== JOBS TAB =====================
function JobsTab() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  
  useEffect(() => {
    loadData();
  }, [page, search]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await adminAPI.listJobs({
        search: search || undefined,
        skip: page * limit,
        limit,
      });
      setData(result);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleJobActive(id);
      loadData();
    } catch (err) {
      alert('Kunde inte ändra status: ' + err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Är du säker på att du vill radera detta jobb?')) return;
    try {
      await adminAPI.deleteJob(id);
      loadData();
    } catch (err) {
      alert('Kunde inte radera: ' + err.message);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Jobb</h1>
        <Badge variant="outline">{data.total} totalt</Badge>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Sök på titel eller plats..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Titel</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Företag</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Plats</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Ansökningar</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Laddar...</td></tr>
            ) : data.data.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Inga jobb hittades</td></tr>
            ) : (
              data.data.map((j) => (
                <tr key={j.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3">
                    <p className="font-medium text-foreground">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.employment_type}</p>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{j.company_name}</td>
                  <td className="p-3 text-sm text-muted-foreground">{j.location}</td>
                  <td className="p-3">
                    <Badge variant="outline">{j.interest_count || 0}</Badge>
                  </td>
                  <td className="p-3">
                    {j.is_active ? (
                      <Badge className="bg-secondary/15 text-secondary border-0">Aktiv</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-0">Inaktiv</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleToggle(j.id)}>
                      {j.is_active ? (
                        <ToggleRight className="w-4 h-4 text-secondary" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(j.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination total={data.total} page={page} limit={limit} onPageChange={setPage} />
    </div>
  );
}

// ===================== INTERESTS TAB =====================
function InterestsTab() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  
  const statuses = ['pending', 'reviewed', 'interview', 'rejected', 'hired'];
  const statusLabels = {
    pending: 'Väntande',
    reviewed: 'Granskad',
    interview: 'Intervju',
    rejected: 'Avvisad',
    hired: 'Anställd',
  };
  
  useEffect(() => {
    loadData();
  }, [page, statusFilter]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await adminAPI.listInterests({
        status: statusFilter || undefined,
        skip: page * limit,
        limit,
      });
      setData(result);
    } catch (err) {
      console.error('Failed to load interests:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateInterestStatus(id, newStatus);
      loadData();
    } catch (err) {
      alert('Kunde inte ändra status: ' + err.message);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Ansökningar</h1>
        <Badge variant="outline">{data.total} totalt</Badge>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setStatusFilter(''); setPage(0); }}
        >
          Alla
        </Button>
        {statuses.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setStatusFilter(s); setPage(0); }}
          >
            {statusLabels[s]}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={loadData} className="ml-auto">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Jobbsökare</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Jobb</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Företag</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Datum</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Ändra status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Laddar...</td></tr>
            ) : data.data.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Inga ansökningar hittades</td></tr>
            ) : (
              data.data.map((i) => (
                <tr key={i.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{i.jobseeker_name || '-'}</td>
                  <td className="p-3 text-sm text-muted-foreground">{i.job_title || '-'}</td>
                  <td className="p-3 text-sm text-muted-foreground">{i.company_name || '-'}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(i.created_at).toLocaleDateString('sv-SE')}
                  </td>
                  <td className="p-3">
                    <Badge className={`border-0 ${
                      i.status === 'hired' ? 'bg-green-500/15 text-green-600' :
                      i.status === 'interview' ? 'bg-purple-500/15 text-purple-600' :
                      i.status === 'reviewed' ? 'bg-blue-500/15 text-blue-600' :
                      i.status === 'rejected' ? 'bg-red-500/15 text-red-600' :
                      'bg-yellow-500/15 text-yellow-600'
                    }`}>
                      {statusLabels[i.status] || i.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={i.status}
                      onChange={(e) => handleStatusChange(i.id, e.target.value)}
                      className="text-sm border border-border rounded-lg px-2 py-1 bg-background"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination total={data.total} page={page} limit={limit} onPageChange={setPage} />
    </div>
  );
}

// ===================== HELPER COMPONENTS =====================

function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
  };
  
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusCard({ label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Pagination({ total, page, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Visar {page * limit + 1}-{Math.min((page + 1) * limit, total)} av {total}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

export default AdminPanel;
