import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CalendarIcon, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import getMaintenanceServices from '@/routes/loaders/getMaintenanceServices';

interface MaintenanceCard {
  IdVehiculo: string;
  IdServicio: string;
  FrecuenciaTipo: 'Tiempo' | 'Kilometraje';
  FrecuenciaKilometraje: number;
  FrecuenciaTiempo: number;
  FrecuenciaTiempoTipo: 'Días' | 'Semanas' | 'Meses' | 'Años';
  FechaUltimoMantenimiento: string;
  KilometrajeUltimoMantenimiento: number;
  Notas: string;
}

interface PreventiveMaintenanceServices {
  Nombre: string;
  Descripcion: string;
  CreadoPorUsuario: boolean;
  IdImagenServicio: string;
  IdServicio: number;
}

export default function PreventiveMaintenanceForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id, maintenanceId } = useParams();
  const navigate = useNavigate();

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<MaintenanceCard>({
      defaultValues: {
        FrecuenciaTipo: 'Tiempo',
        FrecuenciaTiempoTipo: 'Días',
      },
    });

  const frecuenciaTipo = watch('FrecuenciaTipo');

  const [servicioOptions, setServicioOptions] = useState<
    PreventiveMaintenanceServices[]
  >([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getMaintenanceServices();
        setServicioOptions(services);
      } catch (error) {
        console.error('Error al cargar los servicios de mantenimiento:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (frecuenciaTipo === 'Tiempo') {
      setValue('KilometrajeUltimoMantenimiento', 0);
      setValue('FrecuenciaKilometraje', 0);
    } else {
      setValue('FechaUltimoMantenimiento', '');
      setValue('FrecuenciaTiempo', 0);
      setValue('FrecuenciaTiempoTipo', 'Días');
    }
  }, [frecuenciaTipo, setValue]);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      if (maintenanceId) {
        setIsLoading(true);
        try {
          // Aquí deberías hacer una llamada a tu API para obtener los datos del mantenimiento
          // Por ahora, simularemos una llamada a la API con un timeout
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Simula los datos obtenidos de la API
          const data: MaintenanceCard = {
            IdVehiculo: id || '',
            IdServicio: 'Cambio aceite',
            FrecuenciaTipo: 'Tiempo',
            FrecuenciaKilometraje: 0,
            FrecuenciaTiempo: 3,
            FrecuenciaTiempoTipo: 'Meses',
            FechaUltimoMantenimiento: '2023-01-01',
            KilometrajeUltimoMantenimiento: 0,
            Notas: 'Mantenimiento de prueba',
          };

          // Actualiza el formulario con los datos obtenidos
          reset(data);
        } catch (error) {
          console.error('Error al cargar los datos del mantenimiento:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMaintenanceData();
  }, [maintenanceId, id, reset]);

  const onSubmit = async (data: MaintenanceCard) => {
    console.log('data', data);
    if (id) {
      data.IdVehiculo = id;
    } else {
      console.error('El ID del vehículo no está definido');
      return;
    }

    if (data.Notas === '' || !data.Notas) {
      data.Notas = 'Sin notas';
    }

    if (data.FrecuenciaTipo === 'Tiempo') {
      data.KilometrajeUltimoMantenimiento = 0;
      data.FrecuenciaKilometraje = 0;
    } else {
      const currentDate = new Date().toISOString().split('T')[0];
      data.FechaUltimoMantenimiento = currentDate;
      data.FrecuenciaTiempo = 0;
      data.FrecuenciaTiempoTipo = 'Días';
    }

    setIsLoading(true);
    try {
      // Aquí deberías hacer una llamada a tu API para guardar o actualizar los datos
      // Por ahora, simularemos una llamada a la API con un timeout
      const response = await fetch(
        `http://204.48.27.211:5000/api/maintenance/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Error al guardar los datos del mantenimiento');
      }

      console.log(response);
      toast.success('Mantenimiento guardado correctamente');
      navigate(`/dashboard/management/vehicle/${id}/preventive-maintenance`);
    } catch (error) {
      console.error('Error al guardar los datos del mantenimiento:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Cargando...
      </div>
    );
  }

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-100'>
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className='flex-1 p-4 md:p-6 overflow-auto'>
        <div className='flex items-center mb-4'>
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='md:hidden mr-2'
          >
            <Menu className='h-6 w-6' />
          </Button>
          <h1 className='text-2xl font-bold'>
            {maintenanceId ? 'Editar' : 'Crear'} Mantenimiento Preventivo
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalles del Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='IdServicio'>Tipo de servicio</Label>
                  <Controller
                    name='IdServicio'
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <SelectTrigger id='IdServicio'>
                          <SelectValue placeholder='Seleccionar tipo' />
                        </SelectTrigger>
                        <SelectContent>
                          {servicioOptions.map((option) => (
                            <SelectItem
                              key={option.IdServicio}
                              value={option.IdServicio.toString()}
                            >
                              {option.Nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor='FrecuenciaTipo'>Realizado por</Label>
                  <Controller
                    name='FrecuenciaTipo'
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <SelectTrigger id='FrecuenciaTipo'>
                          <SelectValue placeholder='Seleccionar' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Tiempo'>Tiempo</SelectItem>
                          <SelectItem value='Kilometraje'>
                            Kilometraje
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {frecuenciaTipo === 'Tiempo' ? (
                  <>
                    <div className='relative'>
                      <Label htmlFor='FechaUltimoMantenimiento'>
                        Fecha última realización
                      </Label>
                      <Controller
                        name='FechaUltimoMantenimiento'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                          <div className='relative'>
                            <Input
                              type='date'
                              id='FechaUltimoMantenimiento'
                              {...field}
                            />
                            <CalendarIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500' />
                          </div>
                        )}
                      />
                    </div>
                    <div className='flex items-end gap-2'>
                      <div className='flex-1'>
                        <Label htmlFor='FrecuenciaTiempo'>
                          Lapso de tiempo
                        </Label>
                        <Controller
                          name='FrecuenciaTiempo'
                          control={control}
                          rules={{
                            required: 'Este campo es requerido',
                            min: 1,
                          }}
                          render={({ field }) => (
                            <Input
                              type='number'
                              id='FrecuenciaTiempo'
                              placeholder='Lapso de tiempo'
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className='flex-1'>
                        <Controller
                          name='FrecuenciaTiempoTipo'
                          control={control}
                          rules={{ required: 'Este campo es requerido' }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger id='FrecuenciaTiempoTipo'>
                                <SelectValue placeholder='Unidad' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='Días'>Días</SelectItem>
                                <SelectItem value='Semanas'>Semanas</SelectItem>
                                <SelectItem value='Meses'>Meses</SelectItem>
                                <SelectItem value='Años'>Años</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor='KilometrajeUltimoMantenimiento'>
                        Kilometraje última realización
                      </Label>
                      <Controller
                        name='KilometrajeUltimoMantenimiento'
                        control={control}
                        rules={{ required: 'Este campo es requerido', min: 0 }}
                        render={({ field }) => (
                          <Input
                            type='number'
                            id='KilometrajeUltimoMantenimiento'
                            placeholder='Kilometraje última realización'
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor='FrecuenciaKilometraje'>
                        Cada cuántos kilómetros
                      </Label>
                      <Controller
                        name='FrecuenciaKilometraje'
                        control={control}
                        rules={{ required: 'Este campo es requerido', min: 1 }}
                        render={({ field }) => (
                          <Input
                            type='number'
                            id='FrecuenciaKilometraje'
                            placeholder='Cada cuántos kilómetros'
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor='Notas'>Notas</Label>
                <Controller
                  name='Notas'
                  control={control}
                  render={({ field }) => (
                    <textarea
                      id='Notas'
                      className='w-full p-2 border rounded-md'
                      rows={3}
                      placeholder='Notas adicionales...'
                      {...field}
                    />
                  )}
                />
              </div>

              <div className='flex justify-between'>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    navigate(
                      `/dashboard/management/vehicle/${id}/preventive-maintenance`
                    )
                  }
                  disabled={isLoading}
                >
                  Atrás
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </main>
    </div>
  );
}
