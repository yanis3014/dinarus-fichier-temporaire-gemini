'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layouts/PageHeader';

export default function ScannerPage() {
  const [hasCamera, setHasCamera] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanType, setScanType] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Vérifie si l'appareil a accès à la caméra
    async function checkCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
        if (hasVideoInput && scanning) {
          startCamera();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la caméra:', error);
        setHasCamera(false);
      }
    }

    checkCamera();

    return () => {
      stopScanning();
    };
  }, [scanning]);

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Commence le scan une fois que la vidéo est chargée
        videoRef.current.onloadedmetadata = () => {
          startScanning();
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      setHasCamera(false);
    }
  };

  const startScanning = () => {
    if (!canvasRef.current || !videoRef.current || scanIntervalRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Ajuste la taille du canvas à celle de la vidéo
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    scanIntervalRef.current = setInterval(() => {
      // Dessine la frame actuelle de la vidéo sur le canvas
      context.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);
      
      // Ici vous intégreriez une bibliothèque de scan QR code comme jsQR
      // Pour cet exemple, nous simulerons une détection
      if (Math.random() < 0.001) { // Pour simuler un scan occasionnel
        const typeOptions = ['payment', 'contact', 'store', 'sendmoney'];
        const randomType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
        const mockData = {          payment: 'dinary://payment/storeid=123&amount=500',
          contact: 'dinary://contact/userid=456&name=AhmedStore',
          store: 'dinary://store/id=789&name=CafeAmigo',
          sendmoney: 'dinary://sendmoney/amount=200&to=userid123'
        };
        
        setScannedData(mockData[randomType as keyof typeof mockData]);
        setScanType(randomType);
        stopScanning();
      }
    }, 100); // Scan toutes les 100ms
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Arrête la caméra
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleStartScan = () => {
    setScannedData(null);
    setScanType(null);
    setScanning(true);
  };

  const handleProcessScan = () => {
    // Dans une application réelle, cette fonction traiterait le QR code en fonction de son type
    // Pour l'instant, nous simulons juste une redirection
    
    if (scanType === 'payment') {
      alert('Redirection vers la page de paiement');
      // window.location.href = '/encaisser?data=' + encodeURIComponent(scannedData || '');
    } else if (scanType === 'contact') {
      alert('Contact ajouté à vos contacts');
      // window.location.href = '/contacts?action=add&data=' + encodeURIComponent(scannedData || '');
    } else if (scanType === 'store') {
      alert('Affichage du profil du magasin');
      // window.location.href = '/boutique?id=' + storeId;
    } else if (scanType === 'sendmoney') {
      alert('Redirection vers la page d\'envoi d\'argent');
      // window.location.href = '/envoyer?data=' + encodeURIComponent(scannedData || '');
    }
    
    // Réinitialise pour un nouveau scan
    setScannedData(null);
    setScanType(null);
  };

  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader 
        title="Scanner" 
        emoji="📷" 
        showBackButton 
      />

      <div className="px-5">
        {/* Zone de scan - Style du dashboard */}
        <div className="my-4">
          {!hasCamera ? (
            <div className="bg-gray-100 p-4 rounded-xl mb-4">
              <h3 className="font-semibold flex items-center mb-2">
                <span className="mr-2">⚠️</span> Accès à la caméra nécessaire
              </h3>
              <p className="text-sm text-gray-700">
                Nous n'avons pas pu accéder à votre caméra. Veuillez vérifier vos autorisations.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Réessayer
              </button>
            </div>
          ) : scannedData ? (
            <div className="space-y-4">
              <div className="bg-black text-white p-5 rounded-xl">
                <h3 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">✓</span> QR Code détecté!
                </h3>
                <p className="text-sm text-gray-300 break-all">{scannedData}</p>
                
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-300">Type:</span>
                  <p className="font-medium">
                    {scanType === 'payment' ? 'Paiement' : 
                    scanType === 'contact' ? 'Ajout de contact' :
                    scanType === 'store' ? 'Profil de magasin' :
                    scanType === 'sendmoney' ? 'Demande d\'argent' : 'Inconnu'}
                  </p>
                </div>
                
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={handleStartScan}
                    className="flex-1 mr-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-sm">Rescanner</span>
                  </button>
                  <button 
                    onClick={handleProcessScan}
                    className="flex-1 ml-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-sm">Continuer</span>
                  </button>
                </div>
              </div>
            </div>
          ) : scanning ? (
            <div className="bg-black text-white p-5 rounded-xl mb-4">
              <div className="relative w-full aspect-square bg-gray-900 mb-4 overflow-hidden rounded-lg">
                {/* Indicateur de scan */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white animate-scanline z-10"></div>
                
                {/* Cadre de scan */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 aspect-square border-2 border-white/50 rounded-lg flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
                  </div>
                </div>
                
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <p className="text-sm text-center text-gray-400 mb-3">
                Placez le QR code dans le cadre
              </p>
              
              <button 
                onClick={() => setScanning(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg flex items-center justify-center"
              >
                <span className="text-sm">Annuler</span>
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 p-5 rounded-xl">
              <div className="flex flex-col items-center my-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <rect width="14" height="14" x="5" y="5" rx="1" />
                    <path d="M7.5 7.5h3v3h-3z" />
                    <path d="M13.5 7.5h3v3h-3z" />
                    <path d="M7.5 13.5h3v3h-3z" />
                  </svg>
                </div>
                <button 
                  onClick={handleStartScan}
                  className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium"
                >
                  Commencer à scanner
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Types de QR codes - Style du dashboard */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Ce scanner peut lire:</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-lg">💳</span>
                </div>
                <span className="font-medium">Codes de paiement</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-lg">👥</span>
                </div>
                <span className="font-medium">Contacts</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-lg">🏪</span>
                </div>
                <span className="font-medium">Profils de magasins</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-lg">💸</span>
                </div>
                <span className="font-medium">Demandes d'argent</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Récents scans - Style similaire à l'activité récente du dashboard */}
        <div className="my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Scans récents</h2>
            <Link href="/historique" className="text-sm text-gray-500">Tout voir</Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3">
                  <span>🏪</span>
                </div>
                <div>
                  <p className="font-medium">Bio&Co</p>
                  <p className="text-xs text-gray-500">Aujourd'hui, 14:30</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Magasin</p>
                <p className="text-xs text-gray-500">Profil</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
                  <span>💸</span>
                </div>
                <div>
                  <p className="font-medium">Demande d'argent</p>
                  <p className="text-xs text-gray-500">Hier, 16:15</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">200 DA</p>
                <p className="text-xs text-gray-500">Envoi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles spécifiques à la page */}
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { transform: translateY(100%); opacity: 0.8; }
        }
        
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
      `}</style>
    </div>
  );
}