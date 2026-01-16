import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import type { Product } from '@/types';

interface QRCodeDisplayProps {
  product: Product;
  qrCodeUrl?: string;
  onPrint?: () => void;
  onDownload?: () => void;
  loading?: boolean;
}

export function QRCodeDisplay({ product, qrCodeUrl, onPrint, onDownload, loading = false }: QRCodeDisplayProps) {
  return (
    <>
      <div className="hidden print:flex flex-col items-center justify-center p-8 border-4 border-black m-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">{product.name}</h1>
        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" className="w-[400px] h-[400px] mb-4" />
        )}
        <p className="text-5xl font-bold text-black mb-2">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: product.currency,
          }).format(product.price)}
        </p>
        <p className="text-xl text-black">{product.category}</p>
        <p className="text-sm mt-8 text-gray-500">coisasdegaragem.com</p>
      </div>

      <Card className="p-6 print:hidden">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              QR Code do Produto
            </h3>
            <p className="text-gray-600">{product.name}</p>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center mb-6">
            {loading ? (
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : qrCodeUrl ? (
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code para ${product.name}`}
                  className="w-64 h-64"
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2m4 4v12a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5"
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2">QR Code não gerado</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Preço:</span>
              <span className="text-xl font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: product.currency,
                }).format(product.price)}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Categoria:</span>
              <span className="font-medium text-gray-900">
                {product.category || 'Não definida'}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Condição:</span>
              <Badge variant="success">{product.condition || 'Bom'}</Badge>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Status:</span>
              {product.isSold ? (
                <Badge variant="error">Vendido</Badge>
              ) : !product.isAvailable ? (
                <Badge variant="warning">Indisponível</Badge>
              ) : (
                <Badge variant="success">Disponível</Badge>
              )}
            </div>
          </div>

          {/* QR Code Info */}
          {product.qrCode && qrCodeUrl && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m4 4v12a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5" />
                </svg>
                <span className="font-medium text-blue-900">Código QR:</span>
              </div>
              <code className="block bg-white px-3 py-2 rounded text-sm font-mono text-blue-900 break-all">
                {product.qrCode}
              </code>
            </div>
          )}
          <div className="text-xs text-gray-600 mt-2">
            <p>• Use este QR Code para marcar seus produtos na garagem</p>
            <p>• Os compradores podem escanear para ver detalhes</p>
            <p>• Cada produto tem um QR Code único</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {onPrint && (
              <Button
                variant="primary"
                onClick={onPrint}
                disabled={!qrCodeUrl || loading}
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4m2 2h10a2 2 0 002 2v4m-2 2h10a2 2 0 00-2 2v4m-2 2h10a2 2 0 00-2 2v4" />
                </svg>
                Imprimir
              </Button>
            )}
            {onDownload && (
              <Button
                variant="secondary"
                onClick={onDownload}
                disabled={!qrCodeUrl || loading}
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a1 1 0 011-1h2a1 1 0 011 1v3.586a1 1 0 01.707.293 1.414L18 14l-6-6m6 6l6 6M16 16l4-2m2 2l-1.586 1.586a1 1 0 01-2.828 0L4 14m2 2l-1.586 1.586a1 1 0 01-2.828 0L16 8m-2-2l-1.586 1.586a1 1 0 01-2.828 0L16 8" />
                </svg>
                Baixar PNG
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
