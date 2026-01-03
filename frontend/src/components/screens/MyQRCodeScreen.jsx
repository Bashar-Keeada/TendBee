import React, { useRef, useCallback, useState, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { ChevronLeft, Share2, Info, Search, Download, Check, Shield, Crown, Eye } from 'lucide-react';

// Generera ett anonymt ID
const generateAnonymousId = () => {
  const adjectives = ['Snabb', 'Stark', 'Klok', 'Pålitlig', 'Driven', 'Flexibel', 'Noggrann', 'Effektiv'];
  const animals = ['Björn', 'Varg', 'Örn', 'Räv', 'Älg', 'Lo', 'Falk', 'Uggla'];
  const number = Math.floor(Math.random() * 1000);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}${number}`;
};

export const MyQRCodeScreen = ({ onNavigate, profilePercentage = 20, userData = {} }) => {
  const canvasContainerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [anonymousId] = useState(() => generateAnonymousId());
  
  // Kontrollera om användaren har Plus och valt anonymitet
  const isPlusMember = userData?.isPlusMember || false;
  const useAnonymousId = userData?.useAnonymousId || false;
  const hideProfileImage = userData?.hideProfileImage || false;
  
  // Generera en unik profil-URL
  const profileId = useAnonymousId ? anonymousId : 'erik-svensson-12345';
  const profileUrl = `${window.location.origin}/app?profile=${profileId}`;
  
  // Visa namn eller anonym ID
  const displayName = useAnonymousId ? anonymousId : (userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'Erik Svensson');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleShare = useCallback(async () => {
    const shareData = {
      title: useAnonymousId ? `Profil: ${anonymousId}` : 'Min profil på Tendbee',
      text: 'Se min profil och kontakta mig för jobbmöjligheter!',
      url: profileUrl
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(profileUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipboardErr) {
          alert('Kopiera denna länk: ' + profileUrl);
        }
      }
    }
  }, [profileUrl, useAnonymousId, anonymousId]);

  const handleDownload = useCallback(() => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    
    if (canvas) {
      try {
        const paddedCanvas = document.createElement('canvas');
        const padding = 32;
        const textHeight = useAnonymousId ? 60 : 0;
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2 + textHeight;
        
        const ctx = paddedCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
        ctx.drawImage(canvas, padding, padding);
        
        // Lägg till anonym ID om aktiverat
        if (useAnonymousId) {
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 20px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`🛡️ ${anonymousId}`, paddedCanvas.width / 2, canvas.height + padding + 40);
        }
        
        const dataUrl = paddedCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = useAnonymousId ? `anonym-qr-${anonymousId}.png` : 'min-qr-kod-tendbee.png';
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 100);
        
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
      } catch (err) {
        console.error('Nedladdningsfel:', err);
        alert('Kunde inte ladda ner QR-koden. Försök igen.');
      }
    } else {
      alert('QR-koden laddas fortfarande. Vänta en sekund och försök igen.');
    }
  }, [useAnonymousId, anonymousId]);

  return (
    <ScreenContainer hasFooter>
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('cvCompleted')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Profile Completeness */}
      <ProfileCompleteness percentage={profilePercentage} className="mb-6" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Min QR-kod
        </h1>
        <p className="text-muted-foreground">
          Visa denna kod för arbetsgivare
        </p>
      </div>

      {/* Anonymous Mode Badge */}
      {useAnonymousId && (
        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
          <Shield className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Anonymt läge aktiverat</span>
          <Crown className="w-4 h-4 text-amber-500" />
        </div>
      )}
      
      {/* QR Code */}
      <div className="qr-container mb-6 animate-scale-in">
        <QRCodeSVG 
          value={profileUrl}
          size={180}
          level="H"
          includeMargin={false}
          bgColor="transparent"
          fgColor="#1e293b"
        />
      </div>

      {/* Hidden Canvas for Download */}
      <div 
        ref={canvasContainerRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, visibility: 'hidden', pointerEvents: 'none' }}
      >
        <QRCodeCanvas
          value={profileUrl}
          size={512}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      
      {/* Name / Anonymous ID */}
      <div className="text-center mb-6">
        {useAnonymousId ? (
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <p className="font-semibold text-foreground text-lg">{anonymousId}</p>
          </div>
        ) : (
          <>
            {!hideProfileImage && userData?.profileImage && (
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-amber-400">
                <img src={userData.profileImage} alt="Profil" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="font-semibold text-foreground text-lg">{displayName}</p>
          </>
        )}
        <p className="text-sm text-muted-foreground">
          {userData?.jobCategory || 'Lager & Logistik'}
        </p>
      </div>
      
      {/* Info Box */}
      <div className="info-box info-box-primary mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Hur funkar det?</p>
            <p className="text-sm text-muted-foreground">
              {useAnonymousId 
                ? 'Arbetsgivare ser bara dina kompetenser och erfarenheter - inte ditt namn, kön eller ålder. Du blir kontaktad via appen.'
                : 'När en arbetsgivare skannar din QR-kod får de direkt tillgång till din profil och kan kontakta dig för jobb.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Status */}
      {(userData?.hideGender || userData?.hideAge || hideProfileImage) && (
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700 text-sm">Dold information</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userData?.hideGender && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Kön dolt</span>
            )}
            {userData?.hideAge && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Ålder dold</span>
            )}
            {hideProfileImage && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Bild dold</span>
            )}
          </div>
        </div>
      )}

      {/* Download Button */}
      <Button 
        variant="secondary"
        size="lg"
        className="w-full h-12 mb-3"
        onClick={handleDownload}
        disabled={!isReady}
      >
        {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
        {downloaded ? 'Nedladdad!' : 'Ladda ner QR-kod'}
      </Button>
      
      {/* Share Button */}
      <Button 
        variant="outline"
        size="lg"
        className="w-full h-12 mb-3"
        onClick={handleShare}
      >
        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        {copied ? 'Länk kopierad!' : 'Dela QR-kod'}
      </Button>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            size="lg"
            className="w-full h-14"
            onClick={() => onNavigate('jobList')}
          >
            <Search className="w-5 h-5" />
            Se jobb
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default MyQRCodeScreen;
