import React, { useRef, useCallback, useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, Download, Share2, Info, Printer, Building2, Check } from 'lucide-react';

export const CompanyQRCodeScreen = ({ onNavigate }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  // Generera en unik företags-URL
  const companyUrl = `${window.location.origin}/app?company=arlanda-logistics-ab`;
  
  // Dela QR-kod/länk
  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Lediga jobb hos Arlanda Logistics AB',
      text: 'Se våra lediga tjänster och ansök direkt!',
      url: companyUrl
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: kopiera till urklipp
        await navigator.clipboard.writeText(companyUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // Om delning avbryts av användaren, ignorera felet
      if (err.name !== 'AbortError') {
        console.error('Delningsfel:', err);
        // Försök kopiera till urklipp som fallback
        try {
          await navigator.clipboard.writeText(companyUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipboardErr) {
          console.error('Kunde inte kopiera:', clipboardErr);
        }
      }
    }
  }, [companyUrl]);

  // Ladda ner QR-kod som PNG (högupplöst för utskrift)
  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      // Skapa en ny canvas med vit bakgrund, padding och företagsnamn
      const paddedCanvas = document.createElement('canvas');
      const padding = 48;
      const textHeight = 60;
      paddedCanvas.width = canvas.width + padding * 2;
      paddedCanvas.height = canvas.height + padding * 2 + textHeight;
      
      const ctx = paddedCanvas.getContext('2d');
      
      // Vit bakgrund
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
      
      // QR-kod
      ctx.drawImage(canvas, padding, padding);
      
      // Företagsnamn under QR-koden
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Arlanda Logistics AB', paddedCanvas.width / 2, canvas.height + padding + 40);
      
      const url = paddedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'foretag-qr-kod-tendbee.png';
      link.href = url;
      link.click();
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    }
  }, []);

  return (
    <ScreenContainer>
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('employerDashboard')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Företagets QR-kod
        </h1>
        <p className="text-muted-foreground">
          Låt kandidater ansöka direkt
        </p>
      </div>
      
      {/* QR Code - Nu med riktig QR-kod! */}
      <div className="qr-container mb-6 animate-scale-in" ref={qrRef}>
        {/* Synlig SVG QR-kod */}
        <QRCodeSVG 
          value={companyUrl}
          size={192}
          level="H"
          includeMargin={false}
          bgColor="transparent"
          fgColor="currentColor"
          className="text-foreground"
        />
        {/* Dold Canvas QR-kod för nedladdning (högupplöst) */}
        <div className="hidden">
          <QRCodeCanvas
            value={companyUrl}
            size={512}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>
      
      {/* Company Info */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-secondary" />
          <p className="font-semibold text-foreground text-lg">Arlanda Logistics AB</p>
        </div>
        <p className="text-sm text-muted-foreground">3 aktiva jobb</p>
      </div>
      
      {/* Tips */}
      <div className="info-box info-box-secondary mb-6">
        <div className="flex items-start gap-3">
          <Printer className="w-5 h-5 text-secondary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Tips!</p>
            <p className="text-sm text-muted-foreground">
              Skriv ut denna QR-kod och sätt upp på arbetsplatsen. Kandidater kan skanna för att se era lediga tjänster och ansöka direkt.
            </p>
          </div>
        </div>
      </div>
      
      {/* Info Box */}
      <div className="info-box info-box-primary mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Hur funkar det?</p>
            <p className="text-sm text-muted-foreground">
              När någon skannar koden kommer de direkt till era lediga tjänster och kan ansöka med sin profil.
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="secondary"
          size="lg"
          className="w-full h-12"
          onClick={handleDownload}
        >
          {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
          {downloaded ? 'Nedladdad!' : 'Ladda ner'}
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="w-full h-12"
          onClick={handleShare}
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {copied ? 'Länk kopierad!' : 'Dela'}
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default CompanyQRCodeScreen;
