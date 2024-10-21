import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Menu } from 'lucide-react';
import { useAuthContext } from './context/AuthProvider';
import { useLoaderData } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

type User = {
  Nombre: string;
  NumeroDocumento: string;
  Email: string;
  Contrasena: string;
  confirmPassword: string;
  Telefono: string;
  FotoPerfil: string;
  FileFoto: FileList;
  TipoUsuario: string;
  FechaRegistro: string;
  Activo: boolean;
  IdRol: number;
};

export default function EditProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { user, logout } = useAuthContext();

  const loader = useLoaderData() as User;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<User>();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fields: (keyof User)[] = [
      'Nombre',
      'NumeroDocumento',
      'Email',
      'Telefono',
      'FotoPerfil',
      'TipoUsuario',
      'FechaRegistro',
      'Activo',
      'IdRol',
    ];

    fields.forEach((field) => {
      setValue(field, loader[field]);
    });
  }, [loader, setValue]);

  const uploadFile = async (file: File) => {
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
      return null;
    }
  };

  const onSubmit = async (data: User) => {
    const object = {
      Nombre: data.Nombre ? data.Nombre : loader.Nombre,
      NumeroDocumento: data.NumeroDocumento
        ? data.NumeroDocumento
        : loader.NumeroDocumento,
      Email: data.Email ? data.Email : loader.Email,
      Contrasena: data.Contrasena ? data.Contrasena : loader.Contrasena,
      Telefono: data.Telefono ? data.Telefono : loader.Telefono,
      FotoPerfil: data.FotoPerfil ? data.FotoPerfil : '',
    };

    if (data.FileFoto.length > 0) {
      const fileId = await uploadFile(data.FileFoto.item(0) as File);
      if (fileId) {
        object.FotoPerfil = fileId.toString();

        try {
          const response = await fetch(
            `http://204.48.27.211:5000/api/user/update/`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token') || '',
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            alert(
              'Usuario actualizado correctamente. Se te redirigirá al login'
            );
            logout();
          } else {
            console.error('Error updating user:', response);
          }
        } catch (error) {
          console.error('Error updating user:', error);
        }
      }
    } else {
      try {
        const response = await fetch(
          `http://204.48.27.211:5000/api/user/update/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token') || '',
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          alert('Usuario actualizado correctamente. Se te redirigirá al login');
          logout();
        } else {
          console.error('Error updating user:', response);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const deleteVehicleCard = async () => {
    const response = await fetch(`http://204.48.27.211:5000/api/user/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    });

    if (response.ok) {
      alert('Usuario eliminado correctamente. Se te redirigirá al login');
      logout();
    } else {
      console.error('Error deleting user:', response);
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteModalOpen(false);
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
            <h1 className='text-2xl font-bold'>Perfil</h1>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden'>
              <img
                src={user?.foto_perfil}
                alt='Foto de perfil'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
          <AlertDialog
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente este perfil.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={closeDeleteDialog}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={deleteVehicleCard}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='text-center'>
              <p>
                Usuario activo desde:{' '}
                {new Date(loader.FechaRegistro).toLocaleDateString()}
              </p>
            </div>

            <div>
              <Label htmlFor='file'>Actualizar imagen de perfil</Label>
              <Input
                id='file'
                type='file'
                accept='image/*'
                {...register('FileFoto')}
              />
            </div>

            <div>
              <Label htmlFor='nombre'>Nombre</Label>
              <Input
                id='nombre'
                type='text'
                {...register('Nombre', {
                  required: 'Este campo es requerido',
                })}
              />
              {errors.Email && (
                <p className='text-red-500 text-sm'>{errors.Email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor='numDoc'>Número de Documento</Label>
              <Input
                id='numDoc'
                {...register('NumeroDocumento', {
                  required: 'Este campo es requerido',
                })}
              />
              {errors.NumeroDocumento && (
                <p className='text-red-500 text-sm'>
                  {errors.NumeroDocumento.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                {...register('Email', {
                  required: 'Este campo es requerido',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
                })}
              />
              {errors.Email && (
                <p className='text-red-500 text-sm'>{errors.Email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor='telefono'>Teléfono</Label>
              <Input
                id='telefono'
                {...register('Telefono', {
                  pattern: {
                    value: /^[0-9+]+$/,
                    message: 'Ingrese solo números',
                  },
                })}
              />
              {errors.Telefono && (
                <p className='text-red-500 text-sm'>
                  {errors.Telefono.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='password'>Contraseña</Label>
              <Input
                id='password'
                type='password'
                {...register('Contrasena', {
                  minLength: {
                    value: 4,
                    message: 'La contraseña debe tener al menos 4 caracteres',
                  },
                })}
              />
              {errors.Contrasena && (
                <p className='text-red-500 text-sm'>
                  {errors.Contrasena.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='confirmPassword'>Confirme su contraseña</Label>
              <Input
                id='confirmPassword'
                type='password'
                {...register('confirmPassword', {
                  validate: (value, formValues) =>
                    value === formValues.Contrasena ||
                    'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && (
                <p className='text-red-500 text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type='submit' className='w-full'>
              Actualizar información
            </Button>
          </form>

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => openDeleteDialog()}
            >
              Eliminar cuenta
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
