import { SellerLayout } from '@/components/seller/SellerLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      label: 'Produtos Ativos',
      value: '12',
      icon: '📦',
      color: 'bg-blue-50 text-blue-700',
      trend: '+2 esta semana',
    },
    {
      label: 'Vendas Totais',
      value: '45',
      icon: '💰',
      color: 'bg-green-50 text-green-700',
      trend: '+15% vs mês anterior',
    },
    {
      label: 'Receita Total',
      value: 'R$ 2.450,00',
      icon: '📈',
      color: 'bg-primary text-white',
      trend: '+23% vs mês anterior',
    },
    {
      label: 'QR Codes Gerados',
      value: '12',
      icon: '📱',
      color: 'bg-purple-50 text-purple-700',
      trend: 'Todos ativos',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'sale',
      message: 'Bicicleta infantil vendida por R$ 150,00',
      time: 'Há 2 horas',
      icon: '💰',
    },
    {
      id: '2',
      type: 'product',
      message: 'Novo produto cadastrado: Mesa de escritório',
      time: 'Há 5 horas',
      icon: '📦',
    },
    {
      id: '3',
      type: 'qr',
      message: 'QR Code gerado para: Cadeira de escritório',
      time: 'Há 6 horas',
      icon: '📱',
    },
    {
      id: '4',
      type: 'sale',
      message: 'Mesa de escritório vendida por R$ 350,00',
      time: 'Há 8 horas',
      icon: '💰',
    },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-orange-400 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-white/90">
            Aqui está um resumo da sua loja de garagem
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.color} p-6 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-sm font-medium opacity-90">{stat.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-75">{stat.trend}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="primary" className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l6-6m6 6l6 6M16 4v16m0 0l-6-6m6 6l6 6" />
              </svg>
              Novo Produto
            </Button>
            <Button variant="secondary" className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m4 4v12a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5" />
              </svg>
              Ver Vendas
            </Button>
            <Button variant="tertiary" className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m4 4v12a2 2 0 002 2h6a2 2 0 002-2V6l-3.5-2.5M13 13V6m0 0l-3.5-2.5M13 13l3.5 2.5M13 13v-7.5l-3.5-2.5M13 13l3.5 2.5" />
              </svg>
              Ver Analytics
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Atividade Recente
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </SellerLayout>
  );
}
