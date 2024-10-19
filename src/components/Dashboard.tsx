import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bell, Menu, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
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
import { toast, Toaster } from 'sonner';

type Vehicle = {
  id: number;
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

export default function Dashboard() {
  const loader = useLoaderData() as { vehicles: Vehicle[] };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>(
    loader.vehicles as Vehicle[]
  );

  const [filter, setFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredVehicles =
    vehicles.length > 0
      ? vehicles.filter(
          (vehicle) =>
            vehicle.Placa.toLowerCase().includes(filter.toLowerCase()) ||
            vehicle.Modelo.toLowerCase().includes(filter.toLowerCase())
        )
      : [];

  const navigate = useNavigate();

  const handleAddVehicle = () => {
    navigate('/dashboard/management/add-vehicle');
  };

  const handleEditVehicle = (id: string) => {
    navigate('/dashboard/management/edit-vehicle/' + id);
  };

  const handleDetailVehicle = (id: string) => {
    navigate('/dashboard/management/vehicle/' + id);
  };

  const openDeleteDialog = (id: string) => {
    setIsDeleteModalOpen(true);
    setCurrentVehicle(id);
  };

  const closeDeleteDialog = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteVehicleCard = async () => {
    setIsDeleteModalOpen(false);

    if (!currentVehicle) return;

    try {
      const response = await fetch(
        `http://204.48.27.211:5000/api/vehicle/${currentVehicle}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
        }
      );

      if (response.ok) {
        setVehicles((prev) =>
          prev.filter((vehicle) => vehicle.Placa !== currentVehicle)
        );
        toast.success('Vehículo eliminado correctamente');
        setCurrentVehicle(null);
        closeDeleteDialog();
      } else {
        toast.error('Hubo un error al eliminar el vehículo');
      }
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al eliminar el vehículo');
      return;
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
        <Toaster position='bottom-right' />
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center'>
            <Button onClick={toggleSidebar} className='md:hidden mr-2'>
              <Menu className='h-6 w-6' />
            </Button>
            <h1 className='text-2xl font-bold'>Mi Garaje</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <Button
              onClick={handleAddVehicle}
              className='bg-blue-500 hover:bg-blue-600 text-white'
            >
              <Plus className='md:mr-2 h-4 w-4' />
              <span className='hidden sm:inline'>Agregar vehículo</span>
            </Button>
            <Bell className='text-gray-500 cursor-pointer' />
          </div>
        </div>

        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Filtro'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='pl-10 pr-4 py-2 w-full'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          <AlertDialog
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente el vehículo con placa <b>{currentVehicle}</b>.
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
          {filteredVehicles.length === 0 ? (
            <p className='text-gray-600 text-center w-full col-span-4'>
              No se encontraron vehículos
            </p>
          ) : (
            filteredVehicles.map((vehicle) => (
              <Card key={vehicle.Placa} className='bg-white shadow-lg'>
                <CardContent className='p-4 md:p-6'>
                  <div className='relative w-full max-w-md aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4'>
                    <img
                      src={vehicle.urlFoto}
                      alt={`Foto de ${vehicle.Placa}`}
                      className='absolute inset-0 w-full h-full object-cover'
                    />
                  </div>
                  <h3 className='font-bold mb-2'>Placa: {vehicle.Placa}</h3>
                  <p className='text-gray-600 mb-1'>Marca: {vehicle.Marca}</p>
                  <p className='text-gray-600 mb-1'>Modelo: {vehicle.Modelo}</p>
                  <p className='text-gray-600 mb-1'>
                    Kilometraje: {vehicle.KilometrajeActual}
                  </p>
                  <p className='text-gray-600'>Color: {vehicle.Color}</p>
                </CardContent>
                <CardFooter className='bg-gray-50 p-4 flex md:flex-col flex-row justify-between  sm:space-y-0 gap-2'>
                  <Button
                    onClick={() => handleDetailVehicle(vehicle.Placa)}
                    variant='outline'
                    className='w-full flex-grow text-blue-500 hover:bg-blue-50'
                  >
                    Detalles
                  </Button>
                  <Button
                    onClick={() => handleEditVehicle(vehicle.Placa)}
                    variant='outline'
                    className='w-full flex-grow text-blue-500 hover:bg-blue-50'
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => openDeleteDialog(vehicle.Placa)}
                    variant='outline'
                    className='w-full flex-grow text-red-500 hover:bg-red-50'
                  >
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
