import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <header className='bg-blue-500 text-white p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <Mail className='mr-2 h-6 w-6' />
          <h1 className='text-xl font-bold'>Mi vehiculo</h1>
        </div>
        <div className='flex items-start gap-2'>
          <Link to='/sign-up'>
            <Button
              variant='outline'
              className='text-black border-white hover:border-blue-600 hover:bg-blue-600 hover:text-white'
            >
              Registrarse
            </Button>
          </Link>
          <Link to='/login'>
            <Button
              variant='outline'
              className='text-black border-white hover:border-blue-600 hover:bg-blue-600 hover:text-white'
            >
              Ingresar
            </Button>
          </Link>
        </div>
      </header>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex'>
          <div className='w-1/2 bg-gray-200 hidden md:flex items-center justify-center'>
            <span className='text-gray-500 text-4xl'>Logo</span>
          </div>
          <div className='w-full md:w-1/2 p-8'>
            <h2 className='text-2xl font-bold mb-6 text-center'>
              Recuperar contraseña
            </h2>
            <form className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Correo:
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Correo electrónico'
                />
              </div>
              <Button className='w-full'>Recuperar contraseña</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
