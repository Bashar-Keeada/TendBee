import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, ArrowRight, Building2, Mail, Phone, MapPin } from 'lucide-react';

const industries = [
  'Lager & Logistik',
  'Bygg & Anläggning',
  'Restaurang & Hotell',
  'Vård & Omsorg',
  'IT & Teknik',
  'Detaljhandel',
  'Transport',
  'Tillverkning',
  'Övrigt',
];

export const CompanyInfoScreen = ({ onNavigate, onUpdateCompany }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    orgNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    industry: '',
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const isValid = formData.companyName && formData.orgNumber && 
    formData.contactPerson && formData.email && formData.industry;
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateCompany?.(formData);
      onNavigate('employerDashboard');
    }
  };
  
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('login')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Företagsinformation
        </h1>
        <p className="text-muted-foreground">
          Berätta om ditt företag
        </p>
      </div>
      
      {/* Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="form-label">
            <Building2 className="w-4 h-4 inline mr-2" />
            Företagsnamn
          </Label>
          <Input
            id="companyName"
            placeholder="AB Företaget"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <Label htmlFor="orgNumber" className="form-label">Organisationsnummer</Label>
          <Input
            id="orgNumber"
            placeholder="XXXXXX-XXXX"
            value={formData.orgNumber}
            onChange={(e) => handleChange('orgNumber', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <Label htmlFor="contactPerson" className="form-label">Kontaktperson</Label>
          <Input
            id="contactPerson"
            placeholder="Anna Andersson"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email" className="form-label">
              <Mail className="w-4 h-4 inline mr-1" />
              E-post
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="info@foretag.se"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="form-label">
              <Phone className="w-4 h-4 inline mr-1" />
              Telefon
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08-123 45 67"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="city" className="form-label">
            <MapPin className="w-4 h-4 inline mr-2" />
            Stad
          </Label>
          <Input
            id="city"
            placeholder="Stockholm"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <Label htmlFor="industry" className="form-label">Bransch</Label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-foreground focus:border-secondary focus:outline-none"
          >
            <option value="">Välj bransch</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            variant="secondary"
            size="lg"
            className="w-full h-14"
            disabled={!isValid}
            onClick={handleContinue}
          >
            Fortsätt
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default CompanyInfoScreen;
