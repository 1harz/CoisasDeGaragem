import { useState, useRef, useEffect } from 'react';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import type { Product, User } from '@/types';

interface QRScannerProps {
  onScanSuccess: (product: Product, seller: User) => void;
}

export function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check for camera permission
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setHasPermission(true);
        // Stop stream immediately after checking
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do navegador.');
          } else if (err.name === 'NotFoundError') {
            setError('Nenhuma câmera encontrada. Por favor, verifique se seu dispositivo possui uma câmera.');
          } else {
            setError(`Erro ao acessar câmera: ${err.message}`);
          }
        } else {
          setError('Erro ao acessar câmera. Por favor, tente novamente.');
        }
        setHasPermission(false);
      }
    };

    checkPermission();
  }, []);

  const handleScan = async (qrCode: string) => {
    setIsScanning(true);
    setError('');
    try {
      // Call API to scan QR code
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qr-codes/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ qrCode }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onScanSuccess(result.data.product, result.data.seller);
      } else {
        setError(result.error?.message || 'QR code inválido ou produto não encontrado');
      }
    } catch (err) {
      setError('Erro ao processar QR code. Por favor, tente novamente.');
    } finally {
      setIsScanning(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {error && (
          <Alert variant="error" dismissible onDismiss={() => setError('')}>
            {error}
          </Alert>
        )}
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276 1.42-1.42 1.42-1.42L13 10l-2.276 4.553-1.42 1.42-1.42L2 12l1.42-1.42 4.553-2.276L9 14l4.553 2.276 1.42 1.42 1.42L13 18l2.276-4.553 1.42-1.42 1.42L15 14z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Permissão de Câmera Necessária
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Para escanear QR codes, precisamos de acesso à câmera do seu dispositivo.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Solicitar Permissão
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <Alert variant="error" dismissible onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      <div className="relative w-full max-w-2xl mx-auto">
        {/* QR Scanner placeholder */}
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-square flex items-center justify-center">
            <div className="text-center text-white p-8">
              <svg
                className="w-24 h-24 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v1m6 11h2m-6 0h-2m4 4v16a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5"
                />
              </svg>
              <p className="text-lg mb-4">
                Posicione o QR code dentro da área de scan
              </p>
              <p className="text-sm text-gray-300 mb-6">
                O QR code será escaneado automaticamente
              </p>
              <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-white/30">
                <div className="w-48 h-48 mx-auto border-2 border-white/40 rounded flex items-center justify-center">
                  <div className="text-white/50 text-sm">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l2 2m-2 2l2 2m-2 2l-2-2m2 2l-2-2m2 2l2 2M3 12l2-2m0 0l2 2m-2 2l2 2m-2 2l-2-2m2 2l2 2"
                      />
                    </svg>
                    <p>Área de Scan</p>
                  </div>
                </div>
              </div>
              {/* Manual QR code input for testing */}
              <div className="mt-6">
                <label htmlFor="manual-qr" className="block text-sm text-gray-300 mb-2">
                  Ou digite o QR code manualmente (para testes):
                </label>
                <input
                  id="manual-qr"
                  type="text"
                  placeholder="Digite o código QR aqui..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        handleScan(target.value.trim());
                        target.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
