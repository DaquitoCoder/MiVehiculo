import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';

type ServiceType = 'Taller' | 'Parqueadero' | 'Lavadero';

interface VehicleService {
  PlacaVehiculo: string;
  TipoServicio: ServiceType;
  NombreNegocio: string;
  ValorServicio: number;
  Duracion: number;
  FotoServicio: FileList | number;
  Comentarios: string;
  Kilometraje: number;
  Concepto: string;
  Repuestos: string;
  DescripcionFalla: string;
  Diagnostico: string;
  IdServicioRealizado?: number;
}

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
  urlFoto: string;
};

interface VehicleServiceLoader {
  vehicles: Vehicle[];
  error: string | null;
}

export default function VehicleServiceForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialData, setInitialData] = useState<VehicleService | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loader = useLoaderData() as VehicleServiceLoader;

  const { idService } = useParams();

  const navigate = useNavigate();

  const { control, handleSubmit, watch, reset } = useForm<VehicleService>({
    defaultValues: {
      TipoServicio: 'Taller',
      PlacaVehiculo: '',
      NombreNegocio: '',
      ValorServicio: 0,
      Duracion: 0,
      Comentarios: '',
      Kilometraje: 0,
      Concepto: '',
      Repuestos: '',
      DescripcionFalla: '',
      Diagnostico: '',
    },
  });

  useEffect(() => {
    if (idService) {
      const fetchService = async () => {
        try {
          const response = await fetch(
            `http://204.48.27.211:5000/api/services_performed/${idService}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
          }

          const result = await response.json();
          setInitialData(result);
          reset(result);
        } catch (error) {
          console.error('Error fetching service:', error);
          toast('Error al cargar los datos del servicio');
        }
      };

      fetchService();
    }
  }, [idService, reset]);

  const serviceType = watch('TipoServicio');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  const onSubmit = async (data: VehicleService) => {
    try {
      let fileId = data.FotoServicio;
      if (
        data.FotoServicio instanceof FileList &&
        data.FotoServicio.length > 0
      ) {
        fileId = await uploadFile(data.FotoServicio[0]);
        if (!fileId) {
          toast('Error al subir la imagen');
          return;
        }
      }

      const dataToSend = {
        ...data,
        FotoServicio: fileId,
      };

      const url = initialData
        ? `http://204.48.27.211:5000/api/services_performed/${initialData.IdServicioRealizado}`
        : 'http://204.48.27.211:5000/api/services_performed/';

      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result = await response.json();
      console.log('Result:', result);

      toast(initialData ? 'Servicio actualizado' : 'Servicio creado');
      navigate('/dashboard/management/services');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast(
        'Hubo un problema al guardar el servicio. Por favor, intenta de nuevo.'
      );
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gray-100 md:flex-row'>
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className='flex-1 p-4 md:p-8 overflow-auto'>
        <div className='flex md:justify-center items-center mb-6'>
          <div className='flex items-center'>
            <Button onClick={toggleSidebar} className='md:hidden mr-2'>
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </div>
        <Card className='w-full max-w-2xl mx-auto'>
          <CardHeader>
            <CardTitle>
              {initialData ? 'Editar Servicio' : 'Agregar Servicio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label htmlFor='TipoServicio'>Tipo de servicio</Label>
                <Controller
                  name='TipoServicio'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id='TipoServicio'>
                        <SelectValue placeholder='Seleccionar tipo de servicio' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Taller'>Taller</SelectItem>
                        <SelectItem value='Parqueadero'>Parqueadero</SelectItem>
                        <SelectItem value='Lavadero'>Lavadero</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor='PlacaVehiculo'>Placa</Label>
                <Controller
                  name='PlacaVehiculo'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id='PlacaVehiculo'>
                        <SelectValue placeholder='TUS PLACAS' />
                      </SelectTrigger>
                      <SelectContent>
                        {loader.vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.Placa} value={vehicle.Placa}>
                            {vehicle.Placa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor='NombreNegocio'>Nombre Negocio</Label>
                <Controller
                  name='NombreNegocio'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='NombreNegocio'
                      placeholder='Nombre del negocio'
                      {...field}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor='Duracion'>Duración (en minutos)</Label>
                <Controller
                  name='Duracion'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='Duracion'
                      placeholder='Duración'
                      type='number'
                      {...field}
                    />
                  )}
                />
              </div>

              {serviceType === 'Taller' && (
                <>
                  <div>
                    <Label htmlFor='Kilometraje'>Kilometraje</Label>
                    <Controller
                      name='Kilometraje'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='Kilometraje'
                          placeholder='Kilometraje actual'
                          type='number'
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor='Concepto'>Concepto</Label>
                    <Controller
                      name='Concepto'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='Concepto'
                          placeholder='Concepto'
                          {...field}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor='Repuestos'>Repuestos</Label>
                    <Controller
                      name='Repuestos'
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id='Repuestos'>
                            <SelectValue placeholder='VARIOS' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='repuesto1'>
                              Repuesto 1
                            </SelectItem>
                            <SelectItem value='repuesto2'>
                              Repuesto 2
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor='DescripcionFalla'>Falla</Label>
                    <Controller
                      name='DescripcionFalla'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='DescripcionFalla'
                          placeholder='Descripción de la falla'
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor='Diagnostico'>Diagnóstico</Label>
                    <Controller
                      name='Diagnostico'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='Diagnostico'
                          placeholder='Diagnóstico del problema'
                          {...field}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor='ValorServicio'>Valor Servicio</Label>
                <Controller
                  name='ValorServicio'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='ValorServicio'
                      placeholder='$'
                      type='number'
                      {...field}
                    />
                  )}
                />
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox id='favorite' />
                <Label htmlFor='favorite'>Marcar Negocio como favorito</Label>
              </div>

              <div>
                <Label>FOTO</Label>
                <Controller
                  name='FotoServicio'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='Foto'
                      type='file'
                      accept='image/*'
                      onChange={(e) => field.onChange(e.target.files)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor='Comentarios'>Comentarios</Label>
                <Controller
                  name='Comentarios'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id='Comentarios'
                      placeholder='Escribe tus comentarios aquí'
                      {...field}
                    />
                  )}
                />
              </div>

              <Button type='submit' className='w-full'>
                {initialData ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  );
}
