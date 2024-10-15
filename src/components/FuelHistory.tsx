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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
import { useLoaderData } from 'react-router-dom';

interface FuelRefill {
  CostoTotal: string;
  EstacionServicio: string;
  Fecha: string;
  GalonesTanqueados: string;
  IdRecargaCombustible?: number;
  IdUbicacion?: number;
  IdVehiculo: string;
  Kilometraje: number;
  PrecioGalon: string;
  TipoCombustible: string;
}

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

interface FuelHistoryLoaderData {
  fuels: FuelRefill[];
  vehicles: Vehicle[];
}

export default function FuelHistory() {
  const loader = useLoaderData() as FuelHistoryLoaderData;

  const [fuelRefills, setFuelRefills] = useState<FuelRefill[]>(loader.fuels);
  const [filter, setFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [editingRefill, setEditingRefill] = useState<FuelRefill | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openDeleteDialog = (cardId: number) => {
    setCardToDelete(cardId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteDialog = () => {
    setCardToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const deleteMaintenanceCard = async () => {
    if (cardToDelete === null) return;

    try {
      const response = await fetch(
        `http://204.48.27.211:5000/api/fuel_refills/${cardToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
        }
      );

      if (response.ok) {
        setFuelRefills(
          fuelRefills.filter(
            (refill) => refill.IdRecargaCombustible !== cardToDelete
          )
        );
        closeDeleteDialog();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFuelRefills = fuelRefills.filter((refill) =>
    Object.values(refill).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const handleAddFuelRefill = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRefill: FuelRefill = {
      IdVehiculo: formData.get('placa') as string,
      Kilometraje: Number(formData.get('kilometraje')),
      GalonesTanqueados: formData.get('galones') as string,
      TipoCombustible: 'gasolina',
      PrecioGalon: formData.get('valorGalon') as string,
      CostoTotal: (
        Number(formData.get('valorGalon')) * Number(formData.get('galones'))
      ).toString(),
      EstacionServicio: formData.get('estacion') as string,
      Fecha: new Date().toISOString(),
      IdUbicacion: 1, // This could be dynamic if needed
    };

    try {
      const response = await fetch(
        `http://204.48.27.211:5000/api/fuel_refills/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
          body: JSON.stringify(newRefill),
        }
      );

      if (response.ok) {
        const json = await response.json();

        newRefill.IdRecargaCombustible = json.IdRecargaCombustible;

        setFuelRefills([...fuelRefills, newRefill]);
      }
    } catch (error) {
      console.error(error);
    }

    setIsAddModalOpen(false);
  };

  const openEditModal = (refill: FuelRefill) => {
    setEditingRefill(refill);
    setIsEditModalOpen(true);
  };

  const handleEditFuelRefill = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!editingRefill) return;

    const formData = new FormData(event.currentTarget);
    const updatedRefill: FuelRefill = {
      ...editingRefill,
      IdVehiculo: formData.get('placa') as string,
      Kilometraje: Number(formData.get('kilometraje')),
      GalonesTanqueados: formData.get('galones') as string,
      PrecioGalon: formData.get('valorGalon') as string,
      CostoTotal: (
        Number(formData.get('valorGalon')) * Number(formData.get('galones'))
      ).toString(),
      EstacionServicio: formData.get('estacion') as string,
    };

    try {
      const response = await fetch(
        `http://204.48.27.211:5000/api/fuel_refills/${editingRefill.IdRecargaCombustible}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
          body: JSON.stringify(updatedRefill),
        }
      );

      if (response.ok) {
        setFuelRefills(
          fuelRefills.map((refill) =>
            refill.IdRecargaCombustible === editingRefill.IdRecargaCombustible
              ? updatedRefill
              : refill
          )
        );
        setIsEditModalOpen(false);
        setEditingRefill(null);
      }
    } catch (error) {
      console.error(error);
    }
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
                HISTORIAL DE COMBUSTIBLE
              </CardTitle>
              <AlertDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará
                      permanentemente el servicio de mantenimiento.
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
              <AlertDialog
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button>Agregar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      AGREGAR RECARGA COMBUSTIBLE
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <form onSubmit={handleAddFuelRefill} className='space-y-4'>
                    <div>
                      <Label htmlFor='placa'>PLACA</Label>
                      <Select name='placa'>
                        <SelectTrigger id='placa'>
                          <SelectValue placeholder='PLACA' />
                        </SelectTrigger>
                        <SelectContent>
                          {loader.vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.Placa}>
                              {vehicle.Placa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='valorGalon'>Valor del galón</Label>
                        <Input
                          id='valorGalon'
                          name='valorGalon'
                          type='number'
                          placeholder='$'
                        />
                      </div>
                      <div>
                        <Label htmlFor='kilometraje'>Kilometraje</Label>
                        <Input
                          id='kilometraje'
                          name='kilometraje'
                          type='number'
                          placeholder='Número de kilómetros'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='galones'>Galones tanqueados</Label>
                        <Input
                          id='galones'
                          name='galones'
                          type='number'
                          placeholder='Galones tanqueados'
                        />
                      </div>
                      <div>
                        <Label htmlFor='estacion'>Estación</Label>
                        <Input
                          id='estacion'
                          name='estacion'
                          type='text'
                          placeholder='Nombre de la estación'
                        />
                      </div>
                    </div>
                    <Button type='submit'>Agregar</Button>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      EDITAR RECARGA COMBUSTIBLE
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <form onSubmit={handleEditFuelRefill} className='space-y-4'>
                    <div>
                      <Label htmlFor='placa'>PLACA</Label>
                      <Select
                        name='placa'
                        defaultValue={editingRefill?.IdVehiculo}
                      >
                        <SelectTrigger id='placa'>
                          <SelectValue placeholder='PLACA' />
                        </SelectTrigger>
                        <SelectContent>
                          {loader.vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.Placa}>
                              {vehicle.Placa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='valorGalon'>Valor del galón</Label>
                        <Input
                          id='valorGalon'
                          name='valorGalon'
                          type='number'
                          placeholder='$'
                          defaultValue={editingRefill?.PrecioGalon}
                        />
                      </div>
                      <div>
                        <Label htmlFor='kilometraje'>Kilometraje</Label>
                        <Input
                          id='kilometraje'
                          name='kilometraje'
                          type='number'
                          placeholder='Número de kilómetros'
                          defaultValue={editingRefill?.Kilometraje}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='galones'>Galones tanqueados</Label>
                        <Input
                          id='galones'
                          name='galones'
                          type='number'
                          placeholder='Galones tanqueados'
                          defaultValue={editingRefill?.GalonesTanqueados}
                        />
                      </div>
                      <div>
                        <Label htmlFor='estacion'>Estación</Label>
                        <Input
                          id='estacion'
                          name='estacion'
                          type='text'
                          placeholder='Nombre de la estación'
                          defaultValue={editingRefill?.EstacionServicio}
                        />
                      </div>
                    </div>
                    <Button type='submit'>Guardar cambios</Button>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
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
                      <TableHead>Placa</TableHead>
                      <TableHead>Kilometraje</TableHead>
                      <TableHead>Cantidad (gal)</TableHead>
                      <TableHead>Combustible</TableHead>
                      <TableHead>Precio gal</TableHead>
                      <TableHead>Costo total</TableHead>
                      <TableHead>Estación</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFuelRefills.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className='text-center'>
                          No hay registros
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredFuelRefills.map((refill) => (
                      <TableRow key={refill.IdRecargaCombustible}>
                        <TableCell className='font-medium'>
                          {refill.IdRecargaCombustible}
                        </TableCell>
                        <TableCell>{refill.IdVehiculo}</TableCell>
                        <TableCell>{refill.Kilometraje}</TableCell>
                        <TableCell>{refill.GalonesTanqueados}</TableCell>
                        <TableCell>{refill.TipoCombustible}</TableCell>
                        <TableCell>
                          {Number(refill.CostoTotal) /
                            Number(refill.GalonesTanqueados)}
                        </TableCell>
                        <TableCell>{refill.CostoTotal}</TableCell>
                        <TableCell>{refill.EstacionServicio}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end space-x-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openEditModal(refill)}
                            >
                              <PencilIcon className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => {
                                openDeleteDialog(refill.IdRecargaCombustible!);
                              }}
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
    </div>
  );
}
