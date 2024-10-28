import { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { useLoaderData } from 'react-router-dom';

type InterestLink = {
  Nombre: string;
  Descripcion: string;
  URL: string;
  IdEnlace: number;
};

const InterestLinks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loader = useLoaderData() as {
    links: InterestLink[];
    error: string | null;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='flex flex-col h-screen bg-gray-100 md:flex-row'>
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className='flex-1 p-4 md:p-8 overflow-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center'>
            <Button onClick={toggleSidebar} className='md:hidden mr-2'>
              <Menu className='h-6 w-6' />
            </Button>
            <h1 className='text-2xl font-bold'>Links de interés</h1>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {loader.links.length > 0 ? (
            loader.links.map((link) => (
              <div
                key={link.IdEnlace}
                className='bg-white p-4 rounded-lg shadow-md'
              >
                <h2 className='text-lg font-bold'>{link.Nombre}</h2>
                <p className='text-gray-500'>{link.Descripcion}</p>
                <a
                  href={link.URL}
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {link.URL}
                </a>
              </div>
            ))
          ) : (
            <div className='text-center text-gray-500 col-span-6'>
              No hay enlaces de interés
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterestLinks;
