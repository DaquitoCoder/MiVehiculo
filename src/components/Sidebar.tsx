import {
  Car,
  ChevronDown,
  ChevronRight,
  FileText,
  Fuel,
  HelpCircle,
  Home,
  LogOut,
  User,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from './context/AuthProvider';
import { LOGOUT, PRIVATE } from '@/routes/paths';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: <Home className='mx-2 w-5 h-5' />,
    href: PRIVATE,
  },
  {
    id: 'garaje',
    label: 'Garaje',
    icon: <Car className='mx-2 w-5 h-5' />,
    href: PRIVATE,
  },
  {
    id: 'servicios',
    label: 'Servicios',
    icon: <Wrench className='mx-2 w-5 h-5' />,
    children: [
      {
        id: 'registrar',
        label: 'Registrar servicio',
        icon: null,
        href: '/dashboard/management/services/add',
      },
      {
        id: 'historial',
        label: 'Ver historial',
        icon: null,
        href: '/dashboard/management/services',
      },
    ],
  },
  {
    id: 'combustible',
    label: 'Combustible',
    icon: <Fuel className='mx-2 w-5 h-5' />,
    href: '/dashboard/management/fuel',
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: <FileText className='mx-2 w-5 h-5' />,
    href: '/dashboard/management/documents',
  },
  {
    id: 'enlaces',
    label: 'Enlaces de interés',
    icon: <HelpCircle className='mx-2 w-5 h-5' />,
    href: '/dashboard/management/useful-links',
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: <User className='mx-2 w-5 h-5' />,
    href: '/dashboard/management/profile',
  },
  {
    id: 'ayuda',
    label: 'Ayuda',
    icon: <HelpCircle className='mx-2 w-5 h-5' />,
    href: '#',
  },
  {
    id: 'logout',
    label: 'Cerrar sesión',
    icon: <LogOut className='mx-2 w-5 h-5' />,
    href: LOGOUT,
  },
];

function NavItemComponent({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center justify-between w-full text-left hover:text-gray-200'
        >
          <span className='flex items-center'>
            {item.icon}
            <span className='m-2'>{item.label}</span>
          </span>
          {isOpen ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </button>
        {isOpen && (
          <ul className='ml-6 mt-2 space-y-1'>
            {item.children.map((child) => (
              <li key={child.id}>
                <Link to={child.href!} className='text-sm hover:underline'>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.href!}
        className='flex items-center space-x-2 py-2 hover:bg-blue-600 rounded'
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

type SidebarProps = {
  sidebarOpen: boolean;
};

const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  const { user } = useAuthContext();

  return (
    <aside
      className={`${
        sidebarOpen ? 'block' : 'hidden'
      } md:block w-full md:w-64 bg-blue-500 text-white p-6 overflow-y-auto`}
    >
      <div className='mb-8 text-center flex flex-col items-center'>
        <div className='w-24 h-24 bg-white rounded-full mb-4'>
          <img
            src={
              user?.foto_perfil ??
              'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
            }
            alt='Foto de perfil'
            className='w-full h-full object-cover rounded-full'
          />
        </div>
        <h2 className='text-xl font-bold'>{user?.nombre}</h2>
      </div>
      <nav>
        <ul className='space-y-4'>
          {navItems.map((item) => (
            <NavItemComponent key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
