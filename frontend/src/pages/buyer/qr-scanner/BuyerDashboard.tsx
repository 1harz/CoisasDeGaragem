import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { QRScanner } from '@/components/buyer/QRScanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faShoppingBag, faLightbulb } from '@fortawesome/free-solid-svg-icons';

export default function BuyerDashboard() {
  return (
    <BuyerLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Painel do Comprador
          </h1>
          <p className="text-lg text-gray-500">
            Gerencie suas aquisições e explore novas ofertas
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* QR Scanner Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <FontAwesomeIcon icon={faQrcode} className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Escanear QR Code
              </h2>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Encontrou algo interessante? Escaneie o código do produto para ver detalhes e finalizar a compra instantaneamente.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
              <QRScanner onScanSuccess={() => { }} />
            </div>
          </div>

          {/* Recent Purchases Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center text-secondary-600">
                <FontAwesomeIcon icon={faShoppingBag} className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Minhas Compras
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Visualize suas compras recentes e acompanhe o status dos seus pedidos.
            </p>

            <div className="flex-1 flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <FontAwesomeIcon icon={faShoppingBag} className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma compra recente
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-xs px-4">
                Você ainda não realizou nenhuma compra. Que tal começar agora?
              </p>
              <button
                onClick={() => window.location.href = '/buyer/qr-scanner'}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-900/10 hover:shadow-primary-900/20"
              >
                Ir para Scanner QR
              </button>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl overflow-hidden text-white">
          <div className="p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400" />
              Como Começar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-lg border border-blue-500/30">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-blue-100">
                    Escanear QR Code
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Aponte a câmera do celular para o código do produto que você gostou no garage sale.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg border border-purple-500/30">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-purple-100">
                    Ver Minhas Compras
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Acesse seu histórico completo e detalhes de cada item adquirido.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-emerald-100">
                    Configurar Perfil
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Mantenha seus dados atualizados para facilitar o contato com vendedores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
