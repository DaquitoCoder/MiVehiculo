import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface FormData {
  password: string;
  password2: string;
}

const RecoverPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<FormData>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsLoading(true);

    if (data.password !== data.password2) {
      toast.error('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    const object = {
      new_password: data.password,
      token: token,
    };

    try {
      // Reemplaza esta URL con la de tu API
      const response = await fetch(
        'http://204.48.27.211:5000/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(object),
        }
      );

      if (!response.ok) {
        toast.error(
          'Hubo un error al procesar tu solicitud. Vuelve a pedir el correo de recuperación'
        );
        return;
      }

      toast.success('Se ha enviado un correo para recuperar tu contraseña');
      navigate('/login');
    } catch (e) {
      console.log(e);
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
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Contraseña:
                </label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Contraseña'
                  {...register('password', {
                    required: 'La contraseña es requerida',
                  })}
                />
              </div>
              <div>
                <label
                  htmlFor='password2'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Vuelva a escribir la contraseña:
                </label>
                <Input
                  id='password2'
                  type='password'
                  placeholder='Contraseña'
                  {...register('password2', {
                    required: 'La contraseña es requerida',
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
};

export default RecoverPassword;
