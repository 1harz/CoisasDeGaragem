import { SellerLayout } from '@/components/seller/SellerLayout';
import { SalesChart } from '@/components/seller/SalesChart';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import type { AnalyticsData } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      setAnalyticsData({
        id: 'analytics-1',
        sellerId: user?.id || '',
        period: 'monthly',
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
        totalSales: 45,
        totalRevenue: 2450,
        averagePrice: 54.44,
        productsSold: 45,
        productsListed: 12,
        uniqueBuyers: 28,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-8 bg-gray-200 rounded w-64" />
          </div>
        </div>
      </SellerLayout>
    );
  }

  if (!analyticsData) {
    return (
      <SellerLayout>
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faChartBar} className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando dados de analytics...
          </h3>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Analytics
          </h1>
          <p className="text-gray-600">
            Visualize o desempenho da sua loja de garagem
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-orange-600 transition-colors">
              Diário
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
              Semanal
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
              Mensal
            </button>
          </div>
        </div>

        {/* Analytics Chart */}
        <SalesChart data={analyticsData} loading={loading} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Vendas Totais</h3>
            <p className="text-3xl font-bold text-green-900">
              {analyticsData.totalSales}
            </p>
            <p className="text-sm text-green-700 mt-1">+15% vs mês anterior</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Receita Total</h3>
            <p className="text-3xl font-bold text-blue-900">
              R$ {analyticsData.totalRevenue.toFixed(2)}
            </p>
            <p className="text-sm text-blue-700 mt-1">+23% vs mês anterior</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Produtos Vendidos</h3>
            <p className="text-3xl font-bold text-purple-900">
              {analyticsData.productsSold}
            </p>
            <p className="text-sm text-purple-700 mt-1">de {analyticsData.productsListed} listados</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Compradores Únicos</h3>
            <p className="text-3xl font-bold text-orange-900">
              {analyticsData.uniqueBuyers}
            </p>
            <p className="text-sm text-orange-700 mt-1">Compradores diferentes</p>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Insights de Vendas
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">📈</div>
              <div>
                <p className="font-medium text-gray-900">Tendência de vendas</p>
                <p className="text-sm text-gray-600">Vendas aumentando 15% este mês</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">🏆</div>
              <div>
                <p className="font-medium text-gray-900">Produto mais vendido</p>
                <p className="text-sm text-gray-600">Mesa de escritório com 8 vendas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">📅</div>
              <div>
                <p className="font-medium text-gray-900">Melhor dia de vendas</p>
                <p className="text-sm text-gray-600">Sábado com média de 6 vendas/dia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
