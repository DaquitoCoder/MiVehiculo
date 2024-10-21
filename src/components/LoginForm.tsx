import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, Mail } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from './ui/alert';
import { useState } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useAuthContext } from './context/AuthProvider';
import { PRIVATE } from '@/routes/paths';

type LoginFormInputs = {
  username: string;
  password: string;
};

interface ExtendedJwtPayload extends JwtPayload {
  id: number;
  nombre: string;
  documento: string;
  email: string;
  foto_perfil: string;
  tipo_usuario: string;
  role: string | null;
  exp: number;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<LoginFormInputs>();

  const { login } = useAuthContext();

  const navigate = useNavigate();

  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const formBody = Object.entries(data)
      .map(
        ([key, value]) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(value)
      )
      .join('&');

    try {
      const response = await fetch('http://204.48.27.211:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.access_token);
        setApiErrors([]);

        const decodedToken = jwtDecode<ExtendedJwtPayload>(result.access_token);

        login({
          id: decodedToken.id,
          nombre: decodedToken.nombre,
          email: decodedToken.email,
          documento: decodedToken.documento,
          tipo_usuario: decodedToken.tipo_usuario,
          foto_perfil: decodedToken.foto_perfil,
          role: decodedToken.role,
          exp: decodedToken.exp,
        });

        navigate(PRIVATE);
      } else {
        const errorData = await response.json();
        setApiErrors(
          errorData?.detail
            ? [errorData.detail]
            : ['Ocurrió un error desconocido.']
        );
      }
    } catch (error) {
      console.error('Error al hacer la petición:', error);
      setApiErrors(['Error de conexión o servidor.']);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <header className='bg-blue-500 text-white p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <Mail className='mr-2 h-6 w-6' />
          <h1 className='text-xl font-bold'>Mi vehiculo</h1>
        </div>
        <Link to='/sign-up'>
          <Button
            variant='outline'
            className='text-black border-white hover:border-blue-600 hover:bg-blue-600 hover:text-white'
          >
            Registrarse
          </Button>
        </Link>
      </header>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex'>
          <div className='w-1/2 bg-gray-200 hidden md:flex items-center justify-center'>
            <span className='text-gray-500 text-4xl'>Logo</span>
          </div>
          <div className='w-full md:w-1/2 p-8'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
            {apiErrors.length > 0 && (
              <Alert variant='destructive' className='mb-6'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{apiErrors}</AlertDescription>
              </Alert>
            )}
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
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
                  required
                  {...register('username', { required: true })}
                />
              </div>
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
                  placeholder='••••••••'
                  required
                  {...register('password', { required: true })}
                />
              </div>
              <div className='flex items-center'>
                <Checkbox id='remember' />
                <label
                  htmlFor='remember'
                  className='ml-2 text-sm text-gray-600'
                >
                  Recuerdame
                </label>
              </div>
              <Button className='w-full'>Iniciar sesión</Button>
              <div className='text-center'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-blue-600 hover:underline'
                >
                  Recuperar Contraseña
                </Link>
              </div>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-white px-2 text-gray-500'>O</span>
                </div>
              </div>
              <Button variant='outline' className='w-full'>
                <svg
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='google'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 488 512'
                >
                  <path
                    fill='currentColor'
                    d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
                  ></path>
                </svg>
                Sign In with Google
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
