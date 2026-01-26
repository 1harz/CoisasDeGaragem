import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { ProfileForm } from '@/components/buyer/ProfileForm';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (_data: { name?: string; phone?: string; avatarUrl?: string }) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement API call to update user profile
      // For now, just show success message
      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Configurações de Perfil
          </h1>
          <p className="text-gray-600">
            Atualize suas informações de conta
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="error" dismissible onDismiss={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onDismiss={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <ProfileForm
            user={user}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informações da Conta
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tipo de Conta:</span>
              <span className="font-medium text-primary capitalize">{user.role === 'buyer' ? 'Comprador' : 'Vendedor'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Data de Cadastro:</span>
              <span className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {user.isActive ? (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Status da Conta:</span>
                <span className="font-medium text-green-600">Ativa</span>
              </div>
            ) : (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Status da Conta:</span>
                <span className="font-medium text-red-600">Inativa</span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair?')) {
                logout();
                window.location.href = '/';
              }
            }}
            className="w-full mt-6 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </BuyerLayout>
  );
}
