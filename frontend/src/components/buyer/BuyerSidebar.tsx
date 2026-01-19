import { Link, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faShoppingBag, faUser, faHistory, faHome } from '@fortawesome/free-solid-svg-icons';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Scanner QR',
    path: '/buyer/qr-scanner',
    icon: <FontAwesomeIcon icon={faQrcode} className="w-5 h-5" />,
  },
  {
    label: 'Minhas Compras',
    path: '/buyer/purchases',
    icon: <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />,
  },
  {
    label: 'Perfil',
    path: '/buyer/profile',
    icon: <FontAwesomeIcon icon={faUser} className="w-5 h-5" />,
  },
  {
    label: 'Histórico',
    path: '/buyer/history',
    icon: <FontAwesomeIcon icon={faHistory} className="w-5 h-5" />,
  },
];

interface BuyerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BuyerSidebar({ isOpen, onToggle }: BuyerSidebarProps) {
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
        aria-label="Menu do comprador"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Painel do Comprador
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
          <div className="p-4 border-t border-gray-200">
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
