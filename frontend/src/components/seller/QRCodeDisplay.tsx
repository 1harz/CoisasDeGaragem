import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import type { Product } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faDownload, faQrcode } from '@fortawesome/free-solid-svg-icons';

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
              <div className="w-64 h-64 bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <FontAwesomeIcon icon={faQrcode} className="text-4xl text-gray-300 mb-3" />
                <p className="text-sm text-gray-400 font-medium">QR Code não gerado</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
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
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2 text-blue-700">
                <FontAwesomeIcon icon={faQrcode} className="w-4 h-4" />
                <span className="font-medium text-sm">Código Identificador:</span>
              </div>
              <code className="block bg-white px-3 py-2 rounded border border-blue-100 text-sm font-mono text-blue-900 break-all text-center">
                {product.qrCode}
              </code>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1 px-2">
            <p>• Use este QR Code para marcar seus produtos na garagem</p>
            <p>• Os compradores podem escanear para ver detalhes e comprar</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {onPrint && (
              <Button
                variant="primary"
                onClick={onPrint}
                disabled={!qrCodeUrl || loading}
                className="flex-1"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" />
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
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Baixar
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
