import { Link, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faBox, faTags, faQrcode, faCog, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/seller/dashboard',
    icon: <FontAwesomeIcon icon={faChartBar} className="w-5 h-5" />,
  },
  {
    label: 'Produtos',
    path: '/seller/products',
    icon: <FontAwesomeIcon icon={faBox} className="w-5 h-5" />,
  },
  {
    label: 'Vendas',
    path: '/seller/sales',
    icon: <FontAwesomeIcon icon={faTags} className="w-5 h-5" />,
  },
  {
    label: 'QR Codes',
    path: '/seller/qr-codes',
    icon: <FontAwesomeIcon icon={faQrcode} className="w-5 h-5" />,
  },
  {
    label: 'Analytics',
    path: '/seller/analytics',
    icon: <FontAwesomeIcon icon={faChartBar} className="w-5 h-5" />,
  },
  {
    label: 'Configurações',
    path: '/seller/settings',
    icon: <FontAwesomeIcon icon={faCog} className="w-5 h-5" />,
  },
];

interface SellerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SellerSidebar({ isOpen, onToggle }: SellerSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Menu do vendedor"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Painel do Vendedor
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Navegação principal">
            <ul className="space-y-2" role="list">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} role="listitem">
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors duration-200
                        ${isActive
                          ? 'bg-primary text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja sair?')) {
                  window.location.href = '/';
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium border border-red-100"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              <span>Sair da Conta</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 text-base font-medium justify-center py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
              <span>Voltar para Home</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
