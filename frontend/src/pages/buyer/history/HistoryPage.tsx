import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { usePurchases } from '@/hooks/usePurchases';
import { Spinner } from '@/components/common/Spinner';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Pagination } from '@/components/common/Pagination';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { exportPurchasesToCSV } from '@/utils/export';
import { useState, useEffect } from 'react';

export default function HistoryPage() {
  const { purchases, fetchPurchases } = usePurchases();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const pageSize = 9;

  // Filter purchases
  const filteredPurchases = purchases.filter(purchase =>
    purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date') {
      comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Paginate sorted purchases
  const totalPages = Math.ceil(sortedPurchases.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPurchases = sortedPurchases.slice(startIndex, startIndex + pageSize);

  // Reset to page 1 when search term or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  // Load purchases on mount
  useState(() => {
    const loadPurchases = async () => {
      setIsLoading(true);
      setError('');
      try {
        await fetchPurchases();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      } finally {
        setIsLoading(false);
      }
    };
    loadPurchases();
  });

  const statusConfig = {
    pending: { label: 'Pendente', variant: 'warning' as const },
    completed: { label: 'Concluído', variant: 'success' as const },
    cancelled: { label: 'Cancelado', variant: 'error' as const },
    refunded: { label: 'Reembolsado', variant: 'error' as const },
  };

  if (isLoading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Carregando histórico...</p>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  if (error) {
    return (
      <BuyerLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Erro ao carregar histórico</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Histórico de Transações
            </h1>
            <p className="text-gray-600">
              Histórico completo de todas as suas interações
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="search"
              placeholder="Buscar histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[200px]"
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'price')}
              className="min-w-[150px]"
              options={[
                { value: 'date', label: 'Data' },
                { value: 'status', label: 'Status' },
                { value: 'price', label: 'Preço' },
              ]}
            />
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="min-w-[120px]"
              options={[
                { value: 'asc', label: 'Antigo' },
                { value: 'desc', label: 'Recente' },
              ]}
            />
            <Button variant="secondary" onClick={() => exportPurchasesToCSV(sortedPurchases, 'historico-transacoes.csv')} disabled={sortedPurchases.length === 0}>
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* History List */}
        {sortedPurchases.length === 0 && purchases.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum registro encontrado com os filtros atuais.</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum histórico disponível.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Product ID: {purchase.productId.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusConfig[purchase.status]?.variant || 'warning'}>
                        {statusConfig[purchase.status]?.label || purchase.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              totalItems={filteredPurchases.length}
            />
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
