import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { useState } from "react";

const NotFound = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <h1 className='text-2xl font-bold'>Página no encontrada!</h1>
          </div>
        </div>
        <p className='mt-2'>
          La página que estás buscando no existe. Por favor, verifica la URL e
          intenta nuevamente.
        </p>
      </main>
    </div>
  );
};

export default NotFound;
