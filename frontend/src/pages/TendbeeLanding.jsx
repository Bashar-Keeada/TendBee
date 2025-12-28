import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, ChevronDown, Check, 
  Zap, Users, Shield, BarChart3, ArrowRight,
  Sparkles, Clock, Target, Brain, Lock, Database, LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Bee SVG Component
const BeeMascot = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bee Body */}
    <ellipse cx="100" cy="110" rx="50" ry="45" fill="#FFD93D"/>
    {/* Stripes */}
    <path d="M60 95 Q100 85 140 95" stroke="#1a1a1a" strokeWidth="12" fill="none"/>
    <path d="M55 115 Q100 105 145 115" stroke="#1a1a1a" strokeWidth="12" fill="none"/>
    <path d="M60 135 Q100 125 140 135" stroke="#1a1a1a" strokeWidth="12" fill="none"/>
    {/* Head */}
    <circle cx="100" cy="55" r="35" fill="#FFD93D"/>
    {/* Eyes */}
    <circle cx="85" cy="50" r="12" fill="white"/>
    <circle cx="115" cy="50" r="12" fill="white"/>
    <circle cx="87" cy="52" r="6" fill="#1a1a1a"/>
    <circle cx="117" cy="52" r="6" fill="#1a1a1a"/>
    {/* Glasses */}
    <circle cx="85" cy="50" r="15" stroke="#8B4513" strokeWidth="3" fill="none"/>
    <circle cx="115" cy="50" r="15" stroke="#8B4513" strokeWidth="3" fill="none"/>
    <path d="M100 50 L100 50" stroke="#8B4513" strokeWidth="3"/>
    {/* Antennae */}
    <path d="M85 25 Q80 10 75 5" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <path d="M115 25 Q120 10 125 5" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <circle cx="75" cy="5" r="4" fill="#1a1a1a"/>
    <circle cx="125" cy="5" r="4" fill="#1a1a1a"/>
    {/* Wings */}
    <ellipse cx="55" cy="90" rx="25" ry="15" fill="rgba(255,255,255,0.6)" transform="rotate(-30 55 90)"/>
    <ellipse cx="145" cy="90" rx="25" ry="15" fill="rgba(255,255,255,0.6)" transform="rotate(30 145 90)"/>
    {/* Smile */}
    <path d="M90 65 Q100 75 110 65" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    {/* Arms holding magnifying glass */}
    <ellipse cx="150" cy="100" rx="8" ry="6" fill="#FFD93D"/>
    <circle cx="170" cy="85" r="15" stroke="#8B4513" strokeWidth="4" fill="rgba(200,230,255,0.3)"/>
    <path d="M180 95 L195 110" stroke="#8B4513" strokeWidth="4"/>
  </svg>
);

// Logo Component
const TendbeeLogo = ({ className = "h-8", dark = false }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill={dark ? "#fff" : "hsl(82 75% 55%)"}  />
      <path d="M15 18 Q20 15 25 18 Q28 22 25 26 Q20 30 15 26 Q12 22 15 18" fill={dark ? "hsl(160 35% 25%)" : "hsl(160 35% 25%)"}/>
      <circle cx="17" cy="20" r="2" fill="white"/>
      <circle cx="23" cy="20" r="2" fill="white"/>
      <path d="M16 12 Q14 8 12 6" stroke={dark ? "hsl(160 35% 25%)" : "hsl(160 35% 25%)"} strokeWidth="2"/>
      <path d="M24 12 Q26 8 28 6" stroke={dark ? "hsl(160 35% 25%)" : "hsl(160 35% 25%)"} strokeWidth="2"/>
    </svg>
    <span className={`font-bold text-xl ${dark ? 'text-white' : 'text-foreground'}`}>TENDBEE</span>
  </div>
);

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <TendbeeLogo />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#home" className="nav-link">Home</a>
              <a href="#about" className="nav-link">About</a>
              <div className="relative group">
                <button className="nav-link flex items-center gap-1">
                  Our solutions <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a href="#features" className="block px-4 py-3 hover:bg-muted rounded-t-xl">AI Matching</a>
                  <a href="#features" className="block px-4 py-3 hover:bg-muted">Talent Pool</a>
                  <a href="#features" className="block px-4 py-3 hover:bg-muted rounded-b-xl">Analytics</a>
                </div>
              </div>
              <a href="#event" className="nav-link">Event</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
            
            <div className="hidden lg:block">
              <Button className="btn-primary">
                Start for free
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block py-2 nav-link">Home</a>
              <a href="#about" className="block py-2 nav-link">About</a>
              <a href="#features" className="block py-2 nav-link">Our solutions</a>
              <a href="#event" className="block py-2 nav-link">Event</a>
              <a href="#contact" className="block py-2 nav-link">Contact</a>
              <Button className="btn-primary w-full mt-4">Start for free</Button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
      <section id="home" className="hero-section min-h-screen flex items-center pt-20">
        <div className="hero-circles" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                AI that finds the right candidate – faster and smarter
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-4">
                Tendbee streamlines recruitment with AI-driven matches and a candidate journey that actually works.
              </p>
              <p className="text-base text-white/70 mb-8">
                Cut time from job posting to hire. Tendbee prioritizes candidates based on requirements, skills, and fit – all in a simple workflow that saves time and improves hiring decisions.
              </p>
              <Button className="btn-primary text-lg px-8 py-4">
                Start for Free
              </Button>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <div className="animate-float">
                <BeeMascot className="w-80 h-80" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Strip */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Smarter Candidate Matching", desc: "Instantly identify top candidates based on skills, experience and culture fit — powered by AI.", icon: Brain },
              { title: "Cut Time-to-Hire by 50%", desc: "Automate sourcing, shortlisting and communication to fill positions faster with less manual work.", icon: Clock },
              { title: "Better Hiring Decisions", desc: "Make confident, data-driven hiring choices with transparent candidate scoring and built-in analytics.", icon: Target },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop" 
                alt="Business handshake" 
                className="rounded-2xl shadow-xl"
              />
              <img 
                src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=200&fit=crop" 
                alt="Creative thinking" 
                className="absolute -bottom-8 -right-8 rounded-xl shadow-lg border-4 border-background w-48 hidden md:block"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TendbeeLogo className="h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Recruitment is broken. We're here to fix it.
              </h2>
              <p className="text-muted-foreground mb-6">
                Hiring has become time-consuming, expensive, and unpredictable. Tendbee uses AI to simplify every step — from job posting to candidate selection — so you can focus on building great teams.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Save Time – Shortlist candidates automatically.",
                  "Increase Accuracy – Match based on skills, experience and fit.",
                  "Collaborate Better – All communication and feedback in one place."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="btn-outline">
                See How It Works <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "It's very easy to open an account and start your journey.", icon: Zap },
              { step: "2", title: "Complete your profile", desc: "Complete your profile with all the info to get attention of client.", icon: Users },
              { step: "3", title: "Apply job or hire", desc: "Apply & get your preferable jobs with all the requirements and get it.", icon: Target },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="step-icon mx-auto mb-6">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.step}. {item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Key Features */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Title */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Key Features</h2>
              <div className="w-16 h-1 bg-primary mb-6" />
              <p className="text-muted-foreground mb-8">Features That Make a Difference</p>
              <Button className="btn-outline">
                Explore All Features <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {/* Right columns - Feature cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { title: "AI Matching", desc: "Smart shortlist with reasoning for every candidate", icon: Brain, variant: "green" },
                { title: "Talent Pool", desc: "Build your own candidate network and reuse past applicants", icon: Users, variant: "dark" },
                { title: "GDPR Compliant", desc: "Data protection and privacy agreements as standard", icon: Lock, variant: "green" },
                { title: "Analytics & Reports", desc: "Track time-to-hire, bottlenecks, and conversion sources", icon: LineChart, variant: "dark" },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className={`feature-card ${
                    feature.variant === 'green' ? 'feature-card-green' : 'feature-card-dark'
                  }`}
                >
                  <feature.icon className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className={feature.variant === 'green' ? 'text-primary/80' : 'text-white/70'}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            Results from Early Customers
          </h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">HR Manager</h4>
                  <p className="text-muted-foreground">Pilot Company</p>
                </div>
              </div>
              <blockquote className="text-xl text-foreground italic mb-6">
                "With Tendbee we cut our screening time in half."
              </blockquote>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Faster shortlisting</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">More relevant applicants per role</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Recruiter satisfaction</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BeeMascot className="w-64 h-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="hidden sm:block">
                <div className="flex items-center gap-3">
                  <TendbeeLogo dark className="h-10" />
                  <BeeMascot className="w-16 h-16" />
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ready to Try AI Recruitment?</h2>
                <p className="text-white/70">Get started for free in minutes and experience the difference.</p>
              </div>
            </div>
            <Button className="btn-primary text-lg px-8 py-4 whitespace-nowrap">
              Start for Free
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary hover:text-primary transition-colors">Login</a></li>
                <li><a href="#" className="text-secondary hover:text-primary transition-colors">Register</a></li>
                <li><a href="#" className="text-secondary hover:text-primary transition-colors">Jobs</a></li>
                <li><a href="#" className="text-secondary hover:text-primary transition-colors">Event</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Career Growth</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Training sessions</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <TendbeeLogo className="h-8" />
              </div>
              <p className="text-muted-foreground max-w-md">
                Tendbee is an AI-powered recruitment platform that helps companies find and hire top talent faster — from job posting to final selection.
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">Copyright © 2025 Tendbee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
