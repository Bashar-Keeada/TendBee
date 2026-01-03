import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, Camera, X, Shield, Crown, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export const BasicInfoScreen = ({ onNavigate, onUpdateProfile, onUpdate, isPlusMember = false }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    gender: '',
    profileImage: null,
    // Integritetsinställningar (Plus-funktioner)
    hideGender: false,
    hideAge: false,
    hideProfileImage: false,
    useAnonymousId: false,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPlusModal, setShowPlusModal] = useState(false);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Hantera integritetstoggle - kräver Plus-medlemskap
  const handlePrivacyToggle = (field) => {
    if (!isPlusMember) {
      setShowPlusModal(true);
      return;
    }
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Hantera bilduppladdning
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vänligen välj en bildfil');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Bilden får max vara 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, profileImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const isValid = formData.firstName && formData.lastName && formData.age && formData.phone && formData.gender;
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateProfile?.(formData);
      onUpdate?.(formData);
      onNavigate('employmentStatus');
    }
  };

  const genderOptions = [
    { value: 'man', label: 'Man' },
    { value: 'kvinna', label: 'Kvinna' },
    { value: 'annat', label: 'Annat' },
    { value: 'vill_ej_ange', label: 'Vill ej ange' },
  ];

  // Plus Modal Component
  const PlusModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPlusModal(false)}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tendbee Plus</h3>
          <p className="text-gray-600 text-sm">
            Skydda din integritet och bli bedömd på dina kompetenser - inte ditt utseende, kön eller ålder.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-700">Dölj kön, ålder och bild</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <Eye className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-700">Anonym visnings-ID</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-700">Bli matchad på kompetens</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-gray-900">49 kr<span className="text-sm font-normal text-gray-500">/månad</span></p>
        </div>

        <Button 
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          onClick={() => {
            // TODO: Implementera betalning
            setShowPlusModal(false);
            alert('Betalningsfunktion kommer snart!');
          }}
        >
          <Crown className="w-5 h-5 mr-2" />
          Uppgradera till Plus
        </Button>

        <button 
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
          onClick={() => setShowPlusModal(false)}
        >
          Kanske senare
        </button>
      </div>
    </div>
  );

  // Privacy Toggle Component
  const PrivacyToggle = ({ label, description, field, icon: Icon }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData[field] ? 'bg-amber-100' : 'bg-gray-200'}`}>
          <Icon className={`w-4 h-4 ${formData[field] ? 'text-amber-600' : 'text-gray-500'}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isPlusMember && <Lock className="w-4 h-4 text-gray-400" />}
        <Switch 
          checked={formData[field]}
          onCheckedChange={() => handlePrivacyToggle(field)}
          disabled={!isPlusMember}
          className={isPlusMember ? '' : 'opacity-50'}
        />
      </div>
    </div>
  );
  
  return (
    <ScreenContainer hasFooter>
      {showPlusModal && <PlusModal />}

      {/* Back Button */}
      <button 
        onClick={() => onNavigate('login')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={1} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Grundläggande information
        </h1>
        <p className="text-muted-foreground">
          Berätta lite om dig själv
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-6">
        <Label className="form-label text-center block mb-3">
          Profilbild (valfritt)
          {formData.hideProfileImage && (
            <span className="ml-2 text-xs text-amber-600 font-normal">(Dold för arbetsgivare)</span>
          )}
        </Label>
        <div className="relative w-28 h-28 mx-auto">
          <div 
            className={`profile-picture-upload ${previewUrl ? 'has-image' : ''} ${formData.hideProfileImage ? 'opacity-50' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Profilbild" />
                {formData.hideProfileImage && (
                  <div className="absolute inset-0 bg-gray-900/60 rounded-full flex items-center justify-center">
                    <EyeOff className="w-8 h-8 text-white" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs">Lägg till</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {previewUrl && !formData.hideProfileImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Form */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="form-label">Förnamn</Label>
            <Input
              id="firstName"
              placeholder="Erik"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="form-label">Efternamn</Label>
            <Input
              id="lastName"
              placeholder="Svensson"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Kön */}
        <div>
          <Label className="form-label">
            Kön
            {formData.hideGender && (
              <span className="ml-2 text-xs text-amber-600 font-normal">(Dold för arbetsgivare)</span>
            )}
          </Label>
          <div className={`grid grid-cols-2 gap-3 ${formData.hideGender ? 'opacity-50' : ''}`}>
            {genderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('gender', option.value)}
                className={`option-card justify-center ${formData.gender === option.value ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="age" className="form-label">
            Ålder
            {formData.hideAge && (
              <span className="ml-2 text-xs text-amber-600 font-normal">(Dold för arbetsgivare)</span>
            )}
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            min="16"
            max="100"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className={`form-input ${formData.hideAge ? 'opacity-50' : ''}`}
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="form-label">Telefonnummer</Label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center px-4 h-12 bg-muted rounded-xl border border-border text-sm font-medium text-muted-foreground">
              +46
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="70 123 45 67"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="form-input flex-1"
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings - Plus Feature */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Integritetsskydd</h3>
          </div>
          {!isPlusMember && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              Plus
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Bli bedömd på dina kompetenser - inte ditt utseende, kön eller ålder. Världens första jobb-app som bekämpar diskriminering.
        </p>

        <div className="space-y-3">
          <PrivacyToggle 
            label="Dölj kön"
            description="Arbetsgivare ser inte ditt kön"
            field="hideGender"
            icon={Shield}
          />
          <PrivacyToggle 
            label="Dölj ålder"
            description="Arbetsgivare ser inte din ålder"
            field="hideAge"
            icon={Shield}
          />
          <PrivacyToggle 
            label="Dölj profilbild"
            description="Arbetsgivare ser inte din bild"
            field="hideProfileImage"
            icon={EyeOff}
          />
          <PrivacyToggle 
            label="Anonym visnings-ID"
            description="Visa anonymt ID istället för namn"
            field="useAnonymousId"
            icon={Eye}
          />
        </div>

        {!isPlusMember && (
          <button
            onClick={() => setShowPlusModal(true)}
            className="w-full mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 flex items-center justify-center gap-2 hover:from-amber-100 hover:to-amber-200 transition-all"
          >
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-700">Uppgradera till Plus för 49 kr/månad</span>
          </button>
        )}
      </div>
      
      {/* Footer Button */}
      <div className="mt-8 pb-4">
        <button 
          className="w-full h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            boxShadow: '0 10px 30px -5px rgba(245, 158, 11, 0.4)'
          }}
          disabled={!isValid}
          onClick={handleContinue}
        >
          Fortsätt
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </ScreenContainer>
  );
};

export default BasicInfoScreen;
