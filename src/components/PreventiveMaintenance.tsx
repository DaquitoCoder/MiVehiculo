import { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CalendarIcon, Menu, PlusCircleIcon, Trash2Icon } from 'lucide-react';
import Sidebar from './Sidebar';

import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';

interface MaintenanceCard {
  IdMantenimientoPreventivo: number;
  IdVehiculo: string;
  IdServicio: string;
  FrecuenciaTipo: 'Tiempo' | 'Kilometraje';
  FrecuenciaKilometraje: number;
  FrecuenciaTiempo: number;
  FrecuenciaTiempoTipo: 'Días' | 'Semanas' | 'Meses';
  FechaUltimoMantenimiento: string;
  KilometrajeUltimoMantenimiento: number;
  Notas: string;
}

const servicioOptions = [
  { value: '1', label: 'Cambio aceite' },
  { value: '2', label: 'Revisión frenos' },
  { value: '3', label: 'Revisión y reemplazo de filtros' },
  { value: '4', label: 'Revisión y cambio de bujías' },
  { value: '5', label: 'Inspección y cambio de la batería' },
  { value: '6', label: 'Revisión y alineación de neumáticos' },
  { value: '7', label: 'Revisión del sistema de enfriamiento' },
  { value: '8', label: 'Revisión del sistema de escape' },
  { value: '9', label: 'Verificación de las luces y limpiaparabrisas' },
  { value: '10', label: 'Inspección de la transmisión' },
  { value: '11', label: 'Mantenimiento del aire acondicionado' },
  { value: '12', label: 'Revisión de la suspensión' },
  { value: '13', label: 'Revisión del sistema eléctrico' },
];

export default function PreventiveMaintenance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loader = useLoaderData() as MaintenanceCard[];
  const [maintenanceCards, setMaintenanceCards] =
    useState<MaintenanceCard[]>(loader);
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);

  const addMaintenanceCard = () => {
    navigate(`/dashboard/management/vehicle/${id}/preventive-maintenance/add`);
  };

  const openDeleteDialog = (cardId: number) => {
    setCardToDelete(cardId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setCardToDelete(null);
    setDeleteDialogOpen(false);
  };

  const deleteMaintenanceCard = async () => {
    if (cardToDelete === null) return;

    try {
      const response = await fetch(
        `http://204.48.27.211:5000/api/maintenance/${cardToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.detail);
        return;
      }

      setMaintenanceCards(
        maintenanceCards.filter(
          (card) => card.IdMantenimientoPreventivo !== cardToDelete
        )
      );
      toast.success('Servicio eliminado correctamente');
    } catch (error) {
      console.error('Error deleting maintenance card:', error);
      toast.error('Error al eliminar el servicio');
    } finally {
      closeDeleteDialog();
    }
  };

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
          <h1 className='text-2xl font-bold'>Mantenimiento preventivo</h1>
        </div>

        <Card className='w-full mb-4'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle>Servicios de mantenimiento</CardTitle>
              <Button
                onClick={addMaintenanceCard}
                className='mt-4 w-full md:w-auto'
              >
                <PlusCircleIcon className='mr-2 h-4 w-4' />
                Agregar mantenimiento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {maintenanceCards.length === 0 ? (
              <p className='text-center text-gray-500'>
                No se han agregado servicios de mantenimiento preventivo
              </p>
            ) : (
              maintenanceCards.map((card) => (
                <div
                  key={card.IdMantenimientoPreventivo}
                  className='mb-8 relative'
                >
                  <Card className='relative'>
                    <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
                      <div>
                        <Label
                          htmlFor={`tipoServicio-${card.IdMantenimientoPreventivo}`}
                        >
                          Tipo de servicio:
                        </Label>
                        <Select disabled value={card.IdServicio.toString()}>
                          <SelectTrigger
                            id={`tipoServicio-${card.IdMantenimientoPreventivo}`}
                          >
                            <SelectValue placeholder='Seleccionar tipo' />
                          </SelectTrigger>
                          <SelectContent>
                            {servicioOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor={`realizadoPor-${card.IdMantenimientoPreventivo}`}
                        >
                          Realizado por:
                        </Label>
                        <Select disabled value={card.FrecuenciaTipo}>
                          <SelectTrigger
                            id={`realizadoPor-${card.IdMantenimientoPreventivo}`}
                          >
                            <SelectValue placeholder='Seleccionar' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Tiempo'>Tiempo</SelectItem>
                            <SelectItem value='Kilometraje'>
                              Kilometraje
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {card.FrecuenciaTipo === 'Tiempo' ? (
                        <>
                          <div className='relative'>
                            <Label
                              htmlFor={`fechaUltimaRealizacion-${card.IdMantenimientoPreventivo}`}
                            >
                              Fecha última realización
                            </Label>
                            <Input
                              id={`fechaUltimaRealizacion-${card.IdMantenimientoPreventivo}`}
                              type='date'
                              disabled
                              value={card.FechaUltimoMantenimiento}
                            />
                            <CalendarIcon className='absolute right-3 top-9 h-4 w-4 text-gray-500' />
                          </div>
                          <div className='flex items-end gap-2'>
                            <div className='flex-1'>
                              <Label
                                htmlFor={`lapsoTiempo-${card.IdMantenimientoPreventivo}`}
                              >
                                Lapso de tiempo
                              </Label>
                              <Input
                                id={`lapsoTiempo-${card.IdMantenimientoPreventivo}`}
                                type='number'
                                disabled
                                value={card.FrecuenciaTiempo}
                              />
                            </div>
                            <div className='flex-1'>
                              <Select
                                disabled
                                value={card.FrecuenciaTiempoTipo}
                              >
                                <SelectTrigger
                                  id={`unidadTiempo-${card.IdMantenimientoPreventivo}`}
                                >
                                  <SelectValue placeholder='Unidad' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='Días'>Días</SelectItem>
                                  <SelectItem value='Semanas'>
                                    Semanas
                                  </SelectItem>
                                  <SelectItem value='Meses'>Meses</SelectItem>
                                  <SelectItem value='Años'>Años</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label
                              htmlFor={`kilometrajeUltimaRealizacion-${card.IdMantenimientoPreventivo}`}
                            >
                              Kilometraje última realización:
                            </Label>
                            <Input
                              id={`kilometrajeUltimaRealizacion-${card.IdMantenimientoPreventivo}`}
                              type='number'
                              disabled
                              value={card.KilometrajeUltimoMantenimiento}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`cadaCuantoKm-${card.IdMantenimientoPreventivo}`}
                            >
                              Cada cuánto kilómetros:
                            </Label>
                            <Input
                              id={`cadaCuantoKm-${card.IdMantenimientoPreventivo}`}
                              type='number'
                              disabled
                              value={card.FrecuenciaKilometraje}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Button
                    variant='destructive'
                    size='icon'
                    className='absolute -top-3 -right-3 rounded-full w-8 h-8 shadow-md hover:shadow-lg transition-shadow duration-200'
                    onClick={() =>
                      openDeleteDialog(card.IdMantenimientoPreventivo)
                    }
                  >
                    <Trash2Icon className='h-4 w-4' />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Button
          onClick={() => navigate(`/dashboard/management/vehicle/${id}`)}
          className='mt-4 float-right'
        >
          Atrás
        </Button>
        <Toaster />
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el servicio de mantenimiento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteMaintenanceCard}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
