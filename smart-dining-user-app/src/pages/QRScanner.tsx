import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, QrCode, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function QRScanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (detectedCodes: any[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;
    
    // The library passes an array of detected barcode objects
    const result = detectedCodes[0].rawValue;
    if (result) {
      setIsScanning(false);
      
      // Parse tableId from the URL (e.g., http://localhost:5173/#/qr-order/table-12345)
      let tableId = result;
      if (result.includes('/qr-order/')) {
        tableId = result.split('/qr-order/')[1].split('?')[0].replace('#', '');
      }

      toast.success('QR Code Scanned Successfully!');
      setTimeout(() => {
        navigate(`/qr-order/${tableId}`);
      }, 800);
    }
  };

  const handleError = (error: unknown) => {
    console.error('QR Scanner Error:', error);
    // Don't toast immediately on load if camera permissions are just pending
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <QrCode className="h-6 w-6 text-orange-500" />
              Scan Table QR
            </h1>
          </div>

          <div className="bg-black rounded-xl overflow-hidden aspect-square flex items-center justify-center relative shadow-inner">
            {isScanning ? (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                formats={['qr_code']}
                components={{
                  finder: true,
                }}
              />
            ) : (
              <div className="text-white text-center p-4 flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-xl font-bold">Scanned!</p>
                <p className="text-gray-400 mt-2">Redirecting to table menu...</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-gray-600 space-y-2">
            <p>Point your camera at the QR code placed on the table.</p>
            <p className="text-sm">This will assign you to the table and open the restaurant's menu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
