import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onGenerateQR?: (product: Product) => void;
  showActions?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onGenerateQR,
  showActions = true,
}: ProductCardProps) {
  const getConditionBadge = (condition?: string) => {
    const conditionMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' }> = {
      'NEW': { label: 'Novo', variant: 'success' },
      'LIKE_NEW': { label: 'Como Novo', variant: 'success' },
      'GOOD': { label: 'Bom', variant: 'success' },
      'FAIR': { label: 'Razoável', variant: 'warning' },
      'POOR': { label: 'Ruim', variant: 'error' },
    };

    return conditionMap[condition || 'GOOD'] || { label: 'Bom', variant: 'success' };
  };

  const conditionBadge = getConditionBadge(product.condition);

  return (
    <Card hoverable className="overflow-hidden h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 8m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M16 16l4-2m2 2l-1.586 1.586a2 2 0 01-2.828 0L4 14m2 2l-1.586 1.586a2 2 0 01-2.828 0L16 8m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M16 16l4-2m2 2l-1.586 1.586a2 2 0 01-2.828 0L4 14m2 2l-1.586 1.586a2 2 0 01-2.828 0L16 8m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          {product.isSold ? (
            <Badge variant="error">Vendido</Badge>
          ) : !product.isAvailable ? (
            <Badge variant="warning">Indisponível</Badge>
          ) : (
            <Badge variant="success">Disponível</Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>
            {product.category && (
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: product.currency,
              }).format(product.price)}
            </p>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="mb-4">
          <Badge variant={conditionBadge.variant}>{conditionBadge.label}</Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {product.description}
        </p>

        {/* QR Code Info */}
        {product.qrCodeUrl && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m4 4v12a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5" />
            </svg>
            <span>QR Code gerado</span>
          </div>
        )}

        {/* Date */}
        <div className="text-xs text-gray-500 mt-auto">
          Criado em{' '}
          {new Date(product.createdAt).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(product)}
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L15 7m0 0l5-5m-5 5l5 5M15 7l5 5" />
                </svg>
                Editar
              </Button>
            )}
            {onGenerateQR && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onGenerateQR(product)}
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m4 4v12a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5" />
                </svg>
                QR Code
              </Button>
            )}
            {onDelete && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onDelete(product.id)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 17m7 5V7m0 0a2 2 0 012-2m0 0a2 2 0 012 2m0 0v2m0 0a2 2 0 012 2m0 0v2m0 0a2 2 0 012 2m0 0v2m0 0a2 2 0 012 2m0 0v2m0 0a2 2 0 012 2m0 0v2m0 0a2 2 0 012 2m0 0v2" />
                </svg>
                Excluir
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
