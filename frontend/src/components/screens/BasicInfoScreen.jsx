import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, Camera, User, X } from 'lucide-react';

export const BasicInfoScreen = ({ onNavigate, onUpdateProfile, onUpdate }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    gender: '',
    profileImage: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Hantera bilduppladdning
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validera filtyp
      if (!file.type.startsWith('image/')) {
        alert('Vänligen välj en bildfil');
        return;
      }
      // Validera filstorlek (max 5MB)
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

  // Ta bort bild
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
  
  return (
    <ScreenContainer hasFooter>
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
        <Label className="form-label text-center block mb-3">Profilbild (valfritt)</Label>
        <div className="relative w-28 h-28 mx-auto">
          <div 
            className={`profile-picture-upload ${previewUrl ? 'has-image' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Profilbild" />
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
          {previewUrl && (
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
          <Label className="form-label">Kön</Label>
          <div className="grid grid-cols-2 gap-3">
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
          <Label htmlFor="age" className="form-label">Ålder</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            min="16"
            max="100"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="form-input"
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
