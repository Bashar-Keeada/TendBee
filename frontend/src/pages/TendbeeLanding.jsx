import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, ChevronDown, Check, Play,
  Zap, Users, Shield, BarChart3, ArrowRight, Globe,
  Sparkles, Clock, Target, Brain, Lock, Database, LineChart,
  Building2, Award, CheckCircle, Star, TrendingUp, Cpu,
  FileCheck, Server, RefreshCw, Layers, ArrowUpRight,
  Quote, Calendar, Mail, Phone, MapPin, Linkedin, Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// TendBee Logo - Minimalist line-art bee style with darker golden color
const TendbeeLogo = ({ className = "h-8", dark = false, showTagline = true }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative">
      <svg className="w-12 h-12" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Minimalist line-art bee - flowing curves */}
        
        {/* Left wing loop */}
        <path 
          d="M30 35 Q10 25 18 12 Q24 5 30 15" 
          stroke={dark ? "#92400E" : "#F59E0B"} 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Right wing loop */}
        <path 
          d="M30 35 Q50 25 42 12 Q36 5 30 15" 
          stroke={dark ? "#92400E" : "#F59E0B"} 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Body drop shape */}
        <path 
          d="M30 35 Q25 45 30 55 Q35 45 30 35" 
          stroke={dark ? "#92400E" : "#F59E0B"} 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Antennae - X shape */}
        <path 
          d="M26 8 L30 14 L34 8" 
          stroke={dark ? "#92400E" : "#F59E0B"} 
          strokeWidth="2" 
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M27 5 L30 10 L33 5" 
          stroke={dark ? "#92400E" : "#F59E0B"} 
          strokeWidth="1.5" 
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
    <div>
      <span className={`font-bold text-2xl tracking-tight ${dark ? 'text-foreground' : 'text-white'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Tend<span style={{ color: '#F59E0B' }}>Bee</span>
      </span>
      {dark && showTagline && <span className="text-[10px] text-muted-foreground block -mt-0.5 tracking-widest uppercase">Enterprise AI Recruitment</span>}
    </div>
  </div>
);

// Client logos (placeholder companies)
const clientLogos = [
  { name: 'Volvo', width: 100 },
  { name: 'Ericsson', width: 90 },
  { name: 'IKEA', width: 70 },
  { name: 'Spotify', width: 90 },
  { name: 'Klarna', width: 80 },
  { name: 'H&M', width: 60 },
];

export default function TendbeeLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`nav-enterprise ${scrolled ? 'nav-scrolled' : 'nav-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <TendbeeLogo dark={scrolled} />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#platform" className={`font-medium transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>Platform</a>
              <div className="relative group">
                <button className={`font-medium flex items-center gap-1 transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>
                  Solutions <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                  <a href="#enterprise" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">
                    <Building2 className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium text-foreground">Enterprise</p>
                      <p className="text-xs text-muted-foreground">For large organizations</p>
                    </div>
                  </a>
                  <a href="#public" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">
                    <Globe className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium text-foreground">Public Sector</p>
                      <p className="text-xs text-muted-foreground">Government & municipalities</p>
                    </div>
                  </a>
                  <a href="#staffing" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">
                    <Users className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium text-foreground">Staffing Agencies</p>
                      <p className="text-xs text-muted-foreground">Scale your placements</p>
                    </div>
                  </a>
                </div>
              </div>
              <a href="#customers" className={`font-medium transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>Customers</a>
              <a href="#pricing" className={`font-medium transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>Pricing</a>
              <a href="#investors" className={`font-medium transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>Investors</a>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <a href="https://app.tendbee.se" target="_blank" rel="noopener noreferrer" className={`font-medium transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>Login</a>
              <a href="https://app.tendbee.se/demo" target="_blank" rel="noopener noreferrer" className={scrolled ? 'btn-enterprise' : 'btn-white'}>
                Request Demo
              </a>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="px-4 py-4 space-y-3">
              <a href="#platform" className="block py-2 text-foreground font-medium">Platform</a>
              <a href="#solutions" className="block py-2 text-foreground font-medium">Solutions</a>
              <a href="#customers" className="block py-2 text-foreground font-medium">Customers</a>
              <a href="#pricing" className="block py-2 text-foreground font-medium">Pricing</a>
              <a href="#investors" className="block py-2 text-foreground font-medium">Investors</a>
              <button className="btn-enterprise w-full mt-4">Request Demo</button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
      <section className="hero-enterprise min-h-screen flex items-center pt-20 relative">
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="absolute inset-0 grid-pattern" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Now expanding globally • Series A funded</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Enterprise AI Recruitment
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-[hsl(217_91%_70%)] to-[hsl(192_91%_60%)] bg-clip-text text-transparent">Built for Scale</span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/70 mb-4 max-w-2xl">
              Tendbee transforms enterprise hiring with AI-driven candidate matching, 
              automated workflows, and predictive analytics — trusted by Fortune 500 
              companies and government organizations worldwide.
            </p>
            
            <p className="text-base text-white/50 mb-8 max-w-2xl">
              SOC 2 Type II • GDPR Compliant • ISO 27001 Certified
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="btn-enterprise text-lg">
                Request Enterprise Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-outline-enterprise text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                <Play className="w-5 h-5" />
                Watch Product Tour
              </button>
            </div>
            
            {/* Trust Metrics */}
            <div className="flex flex-wrap items-center gap-8 lg:gap-12">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-white/50">Enterprise clients</p>
              </div>
              <div className="w-px h-12 bg-white/20 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-white">2M+</p>
                <p className="text-sm text-white/50">Candidates matched</p>
              </div>
              <div className="w-px h-12 bg-white/20 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-white">40%</p>
                <p className="text-sm text-white/50">Faster time-to-hire</p>
              </div>
              <div className="w-px h-12 bg-white/20 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-white">23</p>
                <p className="text-sm text-white/50">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Client Logos */}
      <section className="py-16 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">Trusted by industry leaders</p>
          <div className="logo-strip">
            {['VOLVO', 'ERICSSON', 'IKEA', 'SPOTIFY', 'KLARNA', 'H&M', 'NORTHVOLT', 'SEB'].map((name, i) => (
              <div key={i} className="px-6 py-3 bg-background rounded-lg border border-border">
                <span className="text-lg font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors" style={{ fontFamily: 'Space Grotesk' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Key Stats */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '40%', label: 'Reduction in time-to-hire', icon: Clock },
              { value: '60%', label: 'Lower recruitment costs', icon: TrendingUp },
              { value: '95%', label: 'Candidate satisfaction', icon: Star },
              { value: '3x', label: 'More qualified applicants', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <p className="stat-number mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Platform Section */}
      <section id="platform" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Cpu className="w-4 h-4" />
              AI-Powered Platform
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              One platform for the entire
              <span className="gradient-text"> hiring lifecycle</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From job posting to onboarding, Tendbee streamlines every step with 
              intelligent automation and real-time insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Candidate Matching', desc: 'Our proprietary ML models analyze 50+ data points to match candidates with 94% accuracy.', icon: Brain },
              { title: 'Automated Screening', desc: 'Reduce manual screening by 80% with intelligent filters and customizable criteria.', icon: FileCheck },
              { title: 'Interview Scheduling', desc: 'Eliminate back-and-forth with smart calendar sync and automated reminders.', icon: Calendar },
              { title: 'Predictive Analytics', desc: 'Forecast hiring needs, identify bottlenecks, and optimize your recruitment funnel.', icon: LineChart },
              { title: 'ATS Integration', desc: 'Seamless integration with Workday, SAP SuccessFactors, Oracle HCM, and 50+ systems.', icon: Layers },
              { title: 'Talent Pool CRM', desc: 'Build and nurture your candidate database with automated engagement campaigns.', icon: Database },
            ].map((feature, i) => (
              <div key={i} className="feature-card-enterprise">
                <div className="feature-icon">
                  <feature.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enterprise Solutions */}
      <section id="enterprise" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                Enterprise Grade
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                Built for enterprise
                <span className="gradient-text"> complexity</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're hiring 100 or 10,000 people annually, Tendbee scales 
                with your needs while maintaining security, compliance, and governance.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'SSO & SCIM provisioning with all major identity providers',
                  'Role-based access control with granular permissions',
                  'Dedicated customer success manager & 24/7 support',
                  'Custom SLA with 99.9% uptime guarantee',
                  'On-premise deployment options available',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              
              <button className="btn-enterprise">
                Contact Enterprise Sales
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-primary rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Security & Compliance</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'SOC 2 Type II', icon: Shield },
                    { label: 'ISO 27001', icon: Award },
                    { label: 'GDPR', icon: Lock },
                    { label: 'CCPA', icon: FileCheck },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                      <badge.icon className="w-6 h-6" />
                      <span className="font-medium">{badge.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-white/70 text-sm">
                    Annual third-party penetration testing • Data residency in EU, US, or APAC • End-to-end encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Public Sector Section */}
      <section id="public" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&h=400&fit=crop" 
                alt="Government building" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <Globe className="w-4 h-4" />
                Public Sector
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                Trusted by government
                <span className="gradient-text"> organizations</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tendbee meets the stringent requirements of public sector hiring, 
                including accessibility standards, procurement compliance, and 
                transparent audit trails.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Compliant with public procurement regulations',
                  'WCAG 2.1 AA accessibility certified',
                  'Full audit logging for transparency',
                  'Multi-language support (25+ languages)',
                  'Integration with government HR systems',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              
              <button className="btn-outline-enterprise">
                Download Public Sector Guide
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="customers" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              Trusted by <span className="gradient-text">industry leaders</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See how enterprises worldwide are transforming their recruitment with Tendbee.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: "Tendbee reduced our time-to-hire by 45% while improving candidate quality. It's transformed how we scale our teams globally.", name: "Maria Lindberg", title: "VP of Talent Acquisition", company: "Global Tech Corp", metric: "45% faster hiring" },
              { quote: "The AI matching is remarkably accurate. We've seen a 3x improvement in offer acceptance rates since implementing Tendbee.", name: "Johan Eriksson", title: "Chief People Officer", company: "Nordic Bank Group", metric: "3x better matches" },
              { quote: "As a municipality, compliance is critical. Tendbee gives us the transparency and audit capabilities we need while streamlining processes.", name: "Anna Svensson", title: "HR Director", company: "Stockholm Municipality", metric: "100% compliant" },
            ].map((testimonial, i) => (
              <div key={i} className="testimonial-enterprise">
                <div className="mb-6">
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    {testimonial.metric}
                  </span>
                </div>
                <p className="text-foreground mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Investor Section */}
      <section id="investors" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                For Investors
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                Scaling globally with
                <span className="text-accent"> strong fundamentals</span>
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Tendbee is backed by leading European VCs and is rapidly expanding 
                into new markets. We're building the future of enterprise recruitment.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'ARR Growth', value: '180% YoY' },
                  { label: 'Net Revenue Retention', value: '135%' },
                  { label: 'Enterprise Clients', value: '500+' },
                  { label: 'Markets', value: '23 countries' },
                ].map((metric, i) => (
                  <div key={i} className="p-4 bg-white/10 rounded-xl">
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className="text-sm text-white/60">{metric.label}</p>
                  </div>
                ))}
              </div>
              
              <button className="btn-white">
                Request Investor Materials
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6">Backed by</h3>
              <div className="space-y-4">
                {[
                  { name: 'Sequoia Capital', type: 'Lead Investor, Series A' },
                  { name: 'EQT Ventures', type: 'Series A' },
                  { name: 'Northzone', type: 'Seed' },
                ].map((investor, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="font-semibold">{investor.name}</span>
                    <span className="text-sm text-white/60">{investor.type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/60">
                  Total funding: <span className="text-white font-semibold">$45M</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global Expansion */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              Global Presence
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              Operating in <span className="gradient-text">23 countries</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From Stockholm to Singapore, Tendbee powers enterprise recruitment across the globe.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              '🇸🇪 Sweden', '🇳🇴 Norway', '🇩🇰 Denmark', '🇫🇮 Finland',
              '🇩🇪 Germany', '🇬🇧 UK', '🇫🇷 France', '🇳🇱 Netherlands',
              '🇺🇸 USA', '🇨🇦 Canada', '🇦🇺 Australia', '🇸🇬 Singapore',
            ].map((country, i) => (
              <div key={i} className="p-4 bg-background rounded-xl border border-border text-center">
                <span className="text-foreground font-medium">{country}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Expanding to <span className="font-semibold text-foreground">10 new markets</span> in 2025
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-enterprise py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                Ready to transform your hiring?
              </h2>
              <p className="text-white/70">
                Join 500+ enterprise organizations using Tendbee to build exceptional teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-white text-lg">
                Request Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-outline-enterprise text-lg border-white/30 text-white hover:bg-white/10">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <TendbeeLogo className="h-10 mb-4" />
              <p className="text-white/60 mb-6 max-w-sm">
                Enterprise AI recruitment platform trusted by Fortune 500 companies 
                and government organizations worldwide.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">AI Matching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Public Sector</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Staffing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Healthcare</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Tendbee AB. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
