import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';

const countries = [
  { value: 'es', label: 'España', code: '+34' },
  { value: 'mx', label: 'México', code: '+52' },
  { value: 'ar', label: 'Argentina', code: '+54' },
  { value: 'co', label: 'Colombia', code: '+57' },
  { value: 'pe', label: 'Perú', code: '+51' },
  { value: 'cl', label: 'Chile', code: '+56' },
  { value: 'ec', label: 'Ecuador', code: '+593' },
  { value: 've', label: 'Venezuela', code: '+58' },
  { value: 'gt', label: 'Guatemala', code: '+502' },
  { value: 'cu', label: 'Cuba', code: '+53' },
];

type SignUpInputs = {
  Nombre: string;
  NumeroDocumento: string;
  Email: string;
  Contrasena: string;
  Contrasena2: string;
  Telefono: string;
  FotoPerfil: string;
  FotoPerfil2: FileList;
  TipoUsuario: string;
  FechaRegistro: string;
  Activo: boolean;
};

export default function SignUp() {
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<SignUpInputs>();

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        'http://204.48.27.211:5000/api/file/?tipo_entidad=default',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.IdArchivo;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    data.Telefono = `${country}${phone}`;
    data.TipoUsuario = 'Normal';
    data.FechaRegistro = new Date().toISOString();
    data.Activo = true;

    if (data.FotoPerfil2.length > 0) {
      console.log(data.FotoPerfil2);
      const fileId = await uploadFile(data.FotoPerfil2.item(0) as File);

      if (fileId) {
        data.FotoPerfil = fileId.toString();

        if (data.Contrasena !== data.Contrasena2) {
          toast.error('Las contraseñas no coinciden');
          return;
        }

        try {
          const response = await fetch(
            'http://204.48.27.211:5000/api/auth/register',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            const result = await response.json();

            if (result?.detail) {
              toast.success(result.detail);
              reset();
            } else {
              toast.success('Usuario registrado correctamente');
            }
          } else {
            // Si la API responde con un error, procesamos el cuerpo
            const errorData = await response.json();

            if (errorData?.detail) {
              toast.error(errorData.detail);
            } else {
              toast.error('Error al procesar la petición.');
            }
          }
        } catch (error) {
          console.error('Error al hacer la petición:', error);
          toast.error('Error al procesar la petición.');
        }
      }
    } else {
      data.FotoPerfil = '';

      if (data.Contrasena !== data.Contrasena2) {
        toast.error('Las contraseñas no coinciden');
        return;
      }

      try {
        const response = await fetch(
          'http://204.48.27.211:5000/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result?.detail) {
            toast.success(result.detail);
            reset();
          } else {
            toast.success('Usuario registrado correctamente');
          }
        } else {
          // Si la API responde con un error, procesamos el cuerpo
          const errorData = await response.json();

          if (errorData?.detail) {
            toast.error(errorData.detail);
          } else {
            toast.error('Error al procesar la petición.');
          }
        }
      } catch (error) {
        console.error('Error al hacer la petición:', error);
        toast.error('Error al procesar la petición.');
      }
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
        <Link to='/login'>
          <Button
            variant='outline'
            className='text-black border-white hover:border-blue-600 hover:bg-blue-600 hover:text-white'
          >
            Ingresar
          </Button>
        </Link>
      </header>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex'>
          <div className='w-1/2 bg-gray-200 hidden md:flex items-center justify-center'>
            <span className='text-gray-500 text-4xl'>Logo</span>
          </div>
          <div className='w-full md:w-1/2 p-8'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Registrarse</h2>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  * Nombre:
                </label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Nombre completo'
                  required
                  {...register('Nombre', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  * Correo:
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Correo electrónico'
                  required
                  {...register('Email', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor='cc'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Cédula:
                </label>
                <Input
                  id='cc'
                  type='text'
                  placeholder='Número de identificación'
                  {...register('NumeroDocumento', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Celular:
                </label>
                <div className='flex'>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className='w-[110px]'>
                      <SelectValue placeholder='País' />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.code}>
                          {country.code} {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='123 456 789'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='flex-1 ml-2'
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  * Contraseña:
                </label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Contraseña'
                  {...register('Contrasena', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor='password2'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  * Reescriba contraseña:
                </label>
                <Input
                  id='password2'
                  type='password'
                  placeholder='Contraseña'
                  {...register('Contrasena2', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor='picture'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Foto de perfil:
                </label>
                <Input
                  id='picture'
                  type='file'
                  accept='image/*'
                  placeholder='Contraseña'
                  {...register('FotoPerfil2')}
                />
              </div>
              <div className='flex items-center'>
                <Checkbox id='accept' required />
                <label htmlFor='accept' className='ml-2 text-sm text-gray-600'>
                  Yo acepto los <a href='#'>Términos de uso</a> y{' '}
                  <a href='#'>Política de privacidad</a>
                </label>
              </div>
              <Button className='w-full'>Registrarse</Button>
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
                Sign up with Google
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
