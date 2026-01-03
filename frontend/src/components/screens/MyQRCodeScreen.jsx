import React, { useRef, useCallback, useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { ChevronLeft, Share2, Info, Search, Download, Check } from 'lucide-react';

export const MyQRCodeScreen = ({ onNavigate, profilePercentage = 50 }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  // Generera en unik profil-URL baserat på användardata
  const profileUrl = `${window.location.origin}/app?profile=erik-svensson-12345`;
  
  // Dela QR-kod/länk
  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Min profil på Tendbee',
      text: 'Se min profil och kontakta mig för jobbmöjligheter!',
      url: profileUrl
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: kopiera till urklipp
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // Om delning avbryts av användaren, ignorera felet
      if (err.name !== 'AbortError') {
        console.error('Delningsfel:', err);
        // Försök kopiera till urklipp som fallback
        try {
          await navigator.clipboard.writeText(profileUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipboardErr) {
          console.error('Kunde inte kopiera:', clipboardErr);
        }
      }
    }
  }, [profileUrl]);

  // Ladda ner QR-kod som PNG
  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      // Skapa en ny canvas med vit bakgrund och padding
      const paddedCanvas = document.createElement('canvas');
      const padding = 32;
      paddedCanvas.width = canvas.width + padding * 2;
      paddedCanvas.height = canvas.height + padding * 2;
      
      const ctx = paddedCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
      ctx.drawImage(canvas, padding, padding);
      
      const url = paddedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'min-qr-kod-tendbee.png';
      link.href = url;
      link.click();
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    }
  }, []);

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
      
      {/* QR Code - Nu med riktig QR-kod! */}
      <div className="qr-container mb-6 animate-scale-in" ref={qrRef}>
        {/* Synlig SVG QR-kod */}
        <QRCodeSVG 
          value={profileUrl}
          size={192}
          level="H"
          includeMargin={false}
          bgColor="transparent"
          fgColor="currentColor"
          className="text-foreground"
        />
        {/* Dold Canvas QR-kod för nedladdning */}
        <div className="hidden">
          <QRCodeCanvas
            value={profileUrl}
            size={512}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>
      
      {/* Name placeholder */}
      <div className="text-center mb-6">
        <p className="font-semibold text-foreground text-lg">Erik Svensson</p>
        <p className="text-sm text-muted-foreground">Lager & Logistik</p>
      </div>
      
      {/* Info Box */}
      <div className="info-box info-box-primary mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Hur funkar det?</p>
            <p className="text-sm text-muted-foreground">
              När en arbetsgivare skannar din QR-kod får de direkt tillgång till din profil och kan kontakta dig för jobb.
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Button 
        variant="secondary"
        size="lg"
        className="w-full h-12 mb-3"
        onClick={handleDownload}
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
