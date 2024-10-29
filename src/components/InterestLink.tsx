import { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Eye, Menu } from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardTitle } from './ui/card';

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
              <>
                <Card
                  key={link.IdEnlace}
                  className='flex flex-col justify-between h-full'
                >
                  <div>
                    <CardTitle className='px-6 py-2'>{link.Nombre}</CardTitle>
                    <CardContent>
                      <p className='text-gray-500'>{link.Descripcion}</p>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <Link to={link.URL} target='_blank' rel='noreferrer'>
                      <Button className='mt-4' variant='outline'>
                        <Eye className='h-4 w-4 me-2' />
                        Ver más
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </>
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
