import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, Camera, X, Shield, Crown, Lock, Eye, EyeOff, Sparkles, Loader2, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

export const BasicInfoScreen = ({ onNavigate, onUpdateProfile, onUpdate, isPlusMember = false, onPlusActivated }) => {
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('monthly');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Check for payment success on URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      // Poll for payment status
      pollPaymentStatus(sessionId);
    }
  }, []);
  
  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 10;
    
    if (attempts >= maxAttempts) {
      console.error('Payment status check timed out');
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/payments/status/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.payment_status === 'paid') {
          setPaymentSuccess(true);
          onPlusActivated?.();
          // Clear URL params
          window.history.replaceState({}, '', window.location.pathname);
          setTimeout(() => setPaymentSuccess(false), 5000);
        } else if (data.status !== 'expired') {
          // Keep polling
          setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };
  
  const handleUpgradeToPlusClick = async () => {
    setIsProcessingPayment(true);
    
    try {
      const userId = localStorage.getItem('tendbee_user_id');
      const response = await fetch(`${BACKEND_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: selectedPackage,
          origin_url: window.location.origin,
          user_id: userId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        const error = await response.json();
        alert(error.detail || 'Kunde inte starta betalning');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ett fel uppstod. Försök igen.');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
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

  // Hantera bilduppladdning - nu med backend-lagring
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Vänligen välj en bildfil');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Bilden får max vara 5MB');
      return;
    }
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload to backend
    setIsUploadingImage(true);
    try {
      const userId = localStorage.getItem('tendbee_user_id');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      if (userId) {
        formDataUpload.append('user_id', userId);
      }
      
      const response = await fetch(`${BACKEND_URL}/api/upload/profile-image`, {
        method: 'POST',
        body: formDataUpload
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, profileImage: data.url }));
        onUpdate?.({ profileImage: data.url });
        console.log('Image uploaded:', data.url);
      } else {
        const error = await response.json();
        alert(error.detail || 'Kunde inte ladda upp bilden');
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ett fel uppstod vid uppladdning');
      setPreviewUrl(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = async () => {
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, profileImage: null }));
    onUpdate?.({ profileImage: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Delete from backend if user is logged in
    const userId = localStorage.getItem('tendbee_user_id');
    if (userId) {
      try {
        await fetch(`${BACKEND_URL}/api/upload/profile-image/${userId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !isProcessingPayment && setShowPlusModal(false)}>
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

        {/* Package Selection */}
        <div className="space-y-2 mb-4">
          <button
            onClick={() => setSelectedPackage('monthly')}
            className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
              selectedPackage === 'monthly' 
                ? 'border-amber-500 bg-amber-50' 
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Månadsvis</p>
                <p className="text-sm text-gray-500">Betala månadsvis, avsluta när som helst</p>
              </div>
              <p className="text-lg font-bold text-gray-900">49 kr<span className="text-sm font-normal text-gray-500">/mån</span></p>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedPackage('yearly')}
            className={`w-full p-3 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
              selectedPackage === 'yearly' 
                ? 'border-amber-500 bg-amber-50' 
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-bl-lg">
              Spara 17%
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Årsvis</p>
                <p className="text-sm text-gray-500">2 månader gratis!</p>
              </div>
              <p className="text-lg font-bold text-gray-900">490 kr<span className="text-sm font-normal text-gray-500">/år</span></p>
            </div>
          </button>
        </div>

        <Button 
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          onClick={handleUpgradeToPlusClick}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Laddar betalning...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Uppgradera till Plus
            </>
          )}
        </Button>

        <button 
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          onClick={() => setShowPlusModal(false)}
          disabled={isProcessingPayment}
        >
          Kanske senare
        </button>
      </div>
    </div>
  );

  // Payment Success Toast
  const PaymentSuccessToast = () => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-pulse">
      <Check className="w-5 h-5" />
      <span className="font-medium">Grattis! Du är nu Tendbee Plus-medlem!</span>
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
      {paymentSuccess && <PaymentSuccessToast />}

      {/* Back Button */}
      <button 
        onClick={() => onNavigate('login')}
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={1} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Grundläggande information
        </h1>
        <p className="text-gray-500">
          Berätta lite om dig själv
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-gray-700 text-center block mb-4">
          Profilbild (valfritt)
          {formData.hideProfileImage && (
            <span className="ml-2 text-xs text-amber-600 font-normal">(Dold för arbetsgivare)</span>
          )}
        </Label>
        <div className="relative w-32 h-32 mx-auto">
          <div 
            className={`profile-picture-upload ${previewUrl ? 'has-image' : ''} ${formData.hideProfileImage ? 'opacity-50' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploadingImage ? (
              <div className="flex flex-col items-center text-amber-500">
                <Loader2 className="w-8 h-8 mb-1 animate-spin" />
                <span className="text-xs font-medium">Laddar upp...</span>
              </div>
            ) : previewUrl ? (
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
                <Camera className="w-10 h-10 mb-2" />
                <span className="text-xs font-medium">Lägg till foto</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploadingImage}
            />
          </div>
          {previewUrl && !formData.hideProfileImage && !isUploadingImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Form */}
      <div className="space-y-6">
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
          <div className="flex gap-3">
            <div className="flex items-center justify-center px-4 h-12 bg-gray-100 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600">
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
      <div className="mt-10 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900">Integritetsskydd</h3>
          </div>
          {!isPlusMember && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <Crown className="w-3.5 h-3.5" />
              Plus
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Bli bedömd på dina kompetenser - inte ditt utseende, kön eller ålder. 
          <span className="text-amber-600 font-medium"> Världens första jobb-app som bekämpar diskriminering.</span>
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
            className="w-full mt-5 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01] group"
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #fcd34d'
            }}
          >
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-700">Uppgradera till Plus för 49 kr/mån</span>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
      
      {/* Footer Button */}
      <div className="mt-10 pb-6">
        <button 
          className="w-full h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
          style={{
            background: isValid 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
              : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            boxShadow: isValid 
              ? '0 12px 35px -8px rgba(245, 158, 11, 0.5)'
              : '0 4px 12px -4px rgba(0, 0, 0, 0.1)'
          }}
          disabled={!isValid}
          onClick={handleContinue}
        >
          <span>Fortsätt</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </ScreenContainer>
  );
};

export default BasicInfoScreen;
