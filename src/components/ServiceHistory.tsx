import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  PencilIcon,
  TrashIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Menu,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { Link, useLoaderData } from 'react-router-dom';

interface VehicleService {
  PlacaVehiculo: string;
  TipoServicio: string;
  NombreNegocio: string;
  ValorServicio: number;
  Duracion: number;
  FotoServicio: FileList;
  Comentarios: string;
  Kilometraje: number;
  Concepto: string;
  Repuestos: string;
  DescripcionFalla: string;
  Diagnostico: string;
  IdServicioRealizado: number;
  Fecha: string;
}
interface LoaderData {
  services: VehicleService[];
  error: string | null;
}

export default function ServiceHistory() {
  const loader = useLoaderData() as LoaderData;

  const [services, setServices] = useState<VehicleService[]>(loader.services);
  const [filter, setFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredServices = services.filter((service) =>
    Object.values(service).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const openDeleteDialog = (serviceId: number) => {
    setServiceToDelete(serviceId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteDialog = () => {
    setServiceToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const deleteService = () => {
    fetch(
      `http://204.48.27.211:5000/api/services_performed/${serviceToDelete}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token') || '',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error deleting service');
        }
        setServices((prevServices) =>
          prevServices.filter(
            (service) => service.IdServicioRealizado !== serviceToDelete
          )
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    closeDeleteDialog();
  };

  return (
    <div className='flex flex-col h-screen bg-gray-100 md:flex-row'>
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className='flex-1 p-4 md:p-8 overflow-auto'>
        <div className='flex md:justify-center items-center mb-6'>
          <div className='flex items-center'>
            <Button onClick={toggleSidebar} className='md:hidden mr-2'>
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </div>
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <Card>
            <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0'>
              <CardTitle className='text-xl md:text-2xl'>
                HISTORIAL DE SERVICIOS
              </CardTitle>
              <Link to='/dashboard/management/services/add'>
                <Button>Agregar</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className='mb-4'>
                <Input
                  placeholder='Filtro'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className='w-full'
                />
              </div>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[50px]'>Id</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo servicio</TableHead>
                      <TableHead>Negocio</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead className='w-[100px]'>Factura</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className='text-center'>
                          No se encontraron servicios
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredServices.map((service) => (
                      <TableRow key={service.IdServicioRealizado}>
                        <TableCell className='font-medium'>
                          {service.IdServicioRealizado}
                        </TableCell>
                        <TableCell>{service.Fecha.split('T')[0]}</TableCell>
                        <TableCell>{service.TipoServicio}</TableCell>
                        <TableCell>{service.NombreNegocio}</TableCell>
                        <TableCell>{service.ValorServicio}</TableCell>
                        <TableCell>Ver</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end space-x-2'>
                            {/* <Button variant='ghost' size='icon'>
                              <EyeIcon className='h-4 w-4' />
                            </Button> */}
                            <Link
                              to={`/dashboard/management/services/edit/${service.IdServicioRealizado}`}
                            >
                              <Button variant='ghost' size='icon'>
                                <PencilIcon className='h-4 w-4' />
                              </Button>
                            </Link>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() =>
                                openDeleteDialog(service.IdServicioRealizado)
                              }
                            >
                              <TrashIcon className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className='flex items-center justify-end space-x-2 py-4'>
                <Button variant='outline' size='icon'>
                  <ChevronFirstIcon className='h-4 w-4' />
                </Button>
                <Button variant='outline' size='icon'>
                  <ChevronLeftIcon className='h-4 w-4' />
                </Button>
                <Button variant='outline' size='sm'>
                  1
                </Button>
                <Button variant='outline' size='icon'>
                  <ChevronRightIcon className='h-4 w-4' />
                </Button>
                <Button variant='outline' size='icon'>
                  <ChevronLastIcon className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el servicio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteService}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
