import { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

const UsefulLinks = () => {
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
            <h1 className='text-2xl font-bold'>Links de interés</h1>
          </div>
        </div>
        <p className='mt-2'>
          Interest Link is a platform that allows you to create a link that
          contains all your social media links and share it with your friends.
        </p>
        <p className='mt-2'>
          You can also use it as a signature in your emails or as a link in your
          social media profiles.
        </p>
        <p className='mt-2'>
          To get started, you need to create an account and add your social
          media links.
        </p>
      </main>
    </div>
  );
};

export default UsefulLinks;
