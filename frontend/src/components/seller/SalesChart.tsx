import type { AnalyticsData } from '@/types';

interface SalesChartProps {
  data: AnalyticsData;
  loading?: boolean;
}

export function SalesChart({ data, loading = false }: SalesChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Vendas Totais', value: data.totalSales, icon: '📦' },
    { label: 'Receita Total', value: `R$ ${data.totalRevenue.toFixed(2)}`, icon: '💰' },
    { label: 'Preço Médio', value: `R$ ${data.averagePrice.toFixed(2)}`, icon: '📊' },
    { label: 'Produtos Vendidos', value: data.productsSold, icon: '📈' },
    { label: 'Produtos Listados', value: data.productsListed, icon: '📋' },
    { label: 'Compradores Únicos', value: data.uniqueBuyers, icon: '👥' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gráfico de Vendas
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002-2h2a2 2 0 002-2z"
              />
            </svg>
            <p className="text-gray-600 text-sm">
              Gráfico de vendas por período
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(data.startDate).toLocaleDateString('pt-BR')} -{' '}
              {new Date(data.endDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
