import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Menu, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
// import { AuthContext } from './context/AuthProvider';
import Sidebar from './Sidebar';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from './context/AuthProvider';

type Vehicle = {
  Placa: string;
  Marca: string;
  Modelo: string;
  KilometrajeActual: number;
  NumeroChasis: string;
  NumeroMotor: string;
  Tipo: string;
  TipoCombustible: string;
  Color: string;
  IdFoto: number;
  IdUsuario: number;
  ArchivoFoto: FileList;
  urlFoto: string;
};

export default function VehicleForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  console.log(uploadError);
  // const authContext = useContext(AuthContext);

  const { id } = useParams();
  const loader = useLoaderData();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm<Vehicle>();

  useEffect(() => {
    if (id) {
      setVehicle(loader as Vehicle);
      const fields: (keyof Vehicle)[] = [
        'Placa',
        'Tipo',
        'Marca',
        'Color',
        'Modelo',
        'TipoCombustible',
        'NumeroMotor',
        'NumeroChasis',
        'KilometrajeActual',
      ];

      fields.forEach((field) => {
        setValue(
          field,
          vehicle?.[field] || (field === 'KilometrajeActual' ? 0 : '')
        );
      });
    }
  }, [id, loader, setValue, vehicle]);

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
          // Remove the Content-Type header, let the browser set it automatically with the boundary
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

  const buildVehicleData = (data: Vehicle, idFoto: number) => {
    const formDataObject = {
      Placa: data.Placa,
      Tipo: data.Tipo,
      Marca: data.Marca,
      Modelo: data.Modelo,
      Color: data.Color,
      TipoCombustible: data.TipoCombustible,
      NumeroMotor: data.NumeroMotor,
      NumeroChasis: data.NumeroChasis,
      KilometrajeActual: data.KilometrajeActual,
      IdFoto: idFoto,
      IdUsuario: user?.id,
    };

    return formDataObject;
  };

  const onSubmit = (data: Vehicle) => {
    return id ? handleEditVehicle(data) : handleAddVehicle(data);
  };

  const handleAddVehicle = async (data: Vehicle) => {
    if (data.ArchivoFoto) {
      const fileId = await uploadFile(data.ArchivoFoto.item(0) as File);
      if (fileId) {
        // Proceed with form submission, including the fileId
        console.log('File uploaded successfully, ID:', fileId);
        const vehicleData = buildVehicleData(data, fileId);

        const response = await fetch(`http://204.48.27.211:5000/api/vehicle`, {
          method: 'POST',
          body: JSON.stringify(vehicleData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
        });

        if (!response.ok) {
          console.error('Error creating vehicle:', response.statusText);
        } else {
          const vehicle = await response.json();
          navigate('/dashboard/management/vehicle/' + vehicle.Placa);
        }
      }
    } else {
      console.log('No file selected');
      // Handle case where no file is selected
    }
  };

  const handleEditVehicle = async (data: Vehicle) => {
    if (data.ArchivoFoto) {
      const fileId = await uploadFile(data.ArchivoFoto.item(0) as File);
      if (fileId) {
        // Proceed with form submission, including the fileId
        console.log('File uploaded successfully, ID:', fileId);
        const vehicleData = buildVehicleData(data, fileId);

        const response = await fetch(
          `http://204.48.27.211:5000/api/vehicle/${id}`,
          {
            method: 'PUT',
            body: JSON.stringify(vehicleData),
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token') || '',
            },
          }
        );

        if (!response.ok) {
          console.error('Error updating vehicle:', response.statusText);
        } else {
          const vehicle = await response.json();
          navigate('/dashboard/management/vehicle/' + vehicle.Placa);
        }
      }
    } else {
      console.log('No file selected');
      // Handle case where no file is selected
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='flex flex-col h-screen bg-gray-100 md:flex-row'>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />
      {/* Main content */}
      <main className='flex-1 p-4 md:p-8 overflow-auto'>
        <div className='flex md:justify-center items-center mb-6'>
          <div className='flex items-center'>
            <Button onClick={toggleSidebar} className='md:hidden mr-2'>
              <Menu className='h-6 w-6' />
            </Button>

            <h1 className='text-2xl font-bold'>
              {id ? 'Editar vehículo' : 'Crear vehiculo'}
            </h1>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent>
                <div className='space-y-4 my-4'>
                  <div>
                    <label
                      htmlFor='placa'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Placa:
                    </label>
                    <Input
                      id='placa'
                      type='text'
                      placeholder='Placa del vehículo'
                      required
                      {...register('Placa', { required: true, disabled: !!id })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='claseVehiculo'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Clase de vehículo:
                    </label>
                    <Input
                      id='claseVehiculo'
                      type='text'
                      placeholder='Clase de vehículo'
                      required
                      {...register('Tipo', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='marca'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Marca:
                    </label>
                    <Input
                      id='marca'
                      type='text'
                      placeholder='Marca'
                      required
                      {...register('Marca', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='modelo'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Modelo:
                    </label>
                    <Input
                      id='modelo'
                      type='text'
                      placeholder='Modelo'
                      required
                      {...register('Modelo', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='color'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Color:
                    </label>
                    <Input
                      id='color'
                      type='color'
                      required
                      {...register('Color', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='combustible'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Combustible:
                    </label>
                    <Input
                      id='combustible'
                      type='text'
                      placeholder='Combustible'
                      required
                      {...register('TipoCombustible', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='motor'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Número de motor:
                    </label>
                    <Input
                      id='motor'
                      type='text'
                      placeholder='Número de motor'
                      required
                      {...register('NumeroMotor', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='chasis'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Número de chasis:
                    </label>
                    <Input
                      id='chasis'
                      type='text'
                      placeholder='Número de chasis'
                      required
                      {...register('NumeroChasis', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='kilometraje'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Kilometraje:
                    </label>
                    <Input
                      id='kilometraje'
                      type='number'
                      placeholder='Kilometraje'
                      required
                      {...register('KilometrajeActual', { required: true })}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='nombre'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Foto del vehículo:
                    </label>
                    <Input
                      id='nombre'
                      type='file'
                      accept='image/*'
                      required
                      {...register('ArchivoFoto', { required: true })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className='gap-2'>
                <Button type='submit' className='w-full' disabled={isUploading}>
                  {isUploading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Plus className='mr-2' />
                      {id ? 'Editar' : 'Crear'} vehículo
                    </>
                  )}
                </Button>
                <Button onClick={() => navigate(`/dashboard`)}>Atrás</Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
