import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.jpg';

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);

  interface FormData {
    email: string;
  }

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsLoading(true);
    try {
      // Reemplaza esta URL con la de tu API
      await fetch('http://204.48.27.211:5000/api/auth/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      toast.success('Se ha enviado un correo para recuperar tu contraseña');
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al procesar tu solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Toaster position='bottom-right' />
      <header className='bg-blue-500 text-white p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <Mail className='mr-2 h-6 w-6' />
          <h1 className='text-xl font-bold'>Vehículo 360</h1>
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
            <img
              src={Logo}
              alt='login'
              className='object-cover w-full h-full'
            />
          </div>
          <div className='flex flex-col justify-center w-full md:w-1/2 p-8'>
            <h2 className='text-2xl font-bold mb-6 text-center'>
              Recuperar contraseña
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
                  {...register('email', {
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo electrónico inválido',
                    },
                  })}
                />
              </div>
              <Button className='w-full' type='submit' disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Recuperar contraseña'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
