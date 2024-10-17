import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Cross,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Sidebar from './Sidebar';
import { Link, useLoaderData } from 'react-router-dom';

type Service = {
  id: number;
  date: string;
  type: string;
  business: string;
  cost: number;
};

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

type VehicleDetailLoaderData = {
  vehicle: Vehicle;
  services: Service[];
  fuelHistory: FuelRefill[];
  error: string | null;
};

const expensesData = [
  { name: 'Ene', gastos: 4000 },
  { name: 'Feb', gastos: 3000 },
  { name: 'Mar', gastos: 2000 },
  { name: 'Abr', gastos: 2780 },
  { name: 'May', gastos: 1890 },
  { name: 'Jun', gastos: 2390 },
  { name: 'Jul', gastos: 3490 },
];

export default function VehicleDetail() {
  const loader = useLoaderData() as VehicleDetailLoaderData;

  const [vehicle, setVehicle] = useState<Vehicle>(loader.vehicle);
  const [fuelHistory, setFuelHistory] = useState<FuelRefill[]>(
    loader.fuelHistory
  );

  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [currentFuelPage, setCurrentFuelPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 5;
  const totalServicePages = Math.ceil(loader.services.length / itemsPerPage);
  const totalFuelPages = Math.ceil(fuelHistory.length / itemsPerPage);

  const paginatedServices = loader.services.slice(
    (currentServicePage - 1) * itemsPerPage,
    currentServicePage * itemsPerPage
  );

  const paginatedFuelHistory = fuelHistory.slice(
    (currentFuelPage - 1) * itemsPerPage,
    currentFuelPage * itemsPerPage
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-100'>
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className='flex-1 p-4 md:p-8 overflow-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center'>
            <Button onClick={toggleSidebar} className='md:hidden mr-2'>
              <Menu className='h-6 w-6' />
            </Button>
          </div>
          <Bell className='text-gray-500 cursor-pointer' />
        </div>
        <div className='header'>
          <h1 className='text-4xl mb-4 text-white font-bold text-center bg-blue-500 rounded-md'>
            {vehicle.Placa}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <Card>
            <CardContent className='p-4 md:p-6'>
              <div className='flex justify-center mb-4'>
                <div className='relative w-full max-w-md aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden'>
                  <img
                    src={vehicle.urlFoto}
                    alt={`Foto de ${vehicle.Placa}`}
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='font-semibold'>Marca:</p>
                  <p>{vehicle.Marca}</p>
                </div>
                <div>
                  <p className='font-semibold'>Modelo:</p>
                  <p>{vehicle.Modelo}</p>
                </div>
                <div>
                  <p className='font-semibold'>Color:</p>
                  <p>{vehicle.Color}</p>
                </div>
                <div>
                  <p className='font-semibold'>Número de chasis:</p>
                  <p>{vehicle.NumeroChasis}</p>
                </div>
                <div>
                  <p className='font-semibold'>Número de motor:</p>
                  <p>{vehicle.NumeroMotor}</p>
                </div>
                <div>
                  <p className='font-semibold'>Tipo de combustible:</p>
                  <p>{vehicle.TipoCombustible}</p>
                </div>
                <div>
                  <p className='font-semibold'>Kilometraje actual:</p>
                  <p>{vehicle.KilometrajeActual} km</p>
                </div>
                <div></div>
                <div>
                  <Link
                    to={`/dashboard/management/vehicle/${vehicle.Placa}/preventive-maintenance`}
                    replace
                  >
                    <Button>
                      <Cross className='h-4 w-4 mr-4' />
                      <span className='sm:inline'>
                        Mantenimiento preventivo
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 md:p-6'>
              <Tabs defaultValue='servicios'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='servicios'>Servicios</TabsTrigger>
                  <TabsTrigger value='combustible'>Combustible</TabsTrigger>
                  <TabsTrigger value='documentos'>Documentos</TabsTrigger>
                </TabsList>
                <TabsContent value='servicios'>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b'>
                          <th className='text-left py-2'>Fecha</th>
                          <th className='text-left py-2'>Tipo servicio</th>
                          <th className='text-left py-2'>Negocio</th>
                          <th className='text-left py-2'>Costo</th>
                          <th className='text-left py-2'>Factura</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loader.services.length === 0 && (
                          <tr>
                            <td colSpan={5} className='text-center py-2'>
                              No hay servicios registrados
                            </td>
                          </tr>
                        )}
                        {paginatedServices.map((service) => (
                          <tr key={service.id} className='border-b'>
                            <td className='py-2'>{service.date}</td>
                            <td className='py-2'>{service.type}</td>
                            <td className='py-2'>{service.business}</td>
                            <td className='py-2'>${service.cost}</td>
                            <td className='py-2'>
                              <Button variant='link' className='p-0'>
                                Ver
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-between items-center mt-4'>
                    <div className='flex space-x-2 mb-2 sm:mb-0'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setCurrentServicePage(1)}
                        disabled={currentServicePage === 1}
                      >
                        <ChevronsLeft className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          setCurrentServicePage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentServicePage === 1}
                      >
                        <ChevronLeft className='h-4 w-4' />
                      </Button>
                    </div>
                    <span className='mb-2 sm:mb-0'>
                      Página {currentServicePage} de {totalServicePages}
                    </span>
                    <div className='flex space-x-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          setCurrentServicePage((prev) =>
                            Math.min(prev + 1, totalServicePages)
                          )
                        }
                        disabled={currentServicePage === totalServicePages}
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setCurrentServicePage(totalServicePages)}
                        disabled={currentServicePage === totalServicePages}
                      >
                        <ChevronsRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <Link to={'/dashboard/management/services/add'}>
                    <Button className='mt-4 w-full sm:w-auto'>Agregar</Button>
                  </Link>
                </TabsContent>
                <TabsContent value='combustible'>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b'>
                          <th className='text-left py-2'>Fecha</th>
                          <th className='text-left py-2'>Kilometraje</th>
                          <th className='text-left py-2'>Galones</th>
                          <th className='text-left py-2'>Precio/Galón</th>
                          <th className='text-left py-2'>Costo Total</th>
                          <th className='text-left py-2'>Estación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fuelHistory.length === 0 && (
                          <tr>
                            <td colSpan={6} className='text-center py-2'>
                              No hay recargas de combustible registradas
                            </td>
                          </tr>
                        )}
                        {paginatedFuelHistory.map((refill) => (
                          <tr
                            key={refill.IdRecargaCombustible}
                            className='border-b'
                          >
                            <td className='py-2'>
                              {new Date(refill.Fecha).toLocaleDateString()}
                            </td>
                            <td className='py-2'>{refill.Kilometraje}</td>
                            <td className='py-2'>{refill.GalonesTanqueados}</td>
                            <td className='py-2'>${refill.PrecioGalon}</td>
                            <td className='py-2'>${refill.CostoTotal}</td>
                            <td className='py-2'>{refill.EstacionServicio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-between items-center mt-4'>
                    <div className='flex space-x-2 mb-2 sm:mb-0'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setCurrentFuelPage(1)}
                        disabled={currentFuelPage === 1}
                      >
                        <ChevronsLeft className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          setCurrentFuelPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentFuelPage === 1}
                      >
                        <ChevronLeft className='h-4 w-4' />
                      </Button>
                    </div>
                    <span className='mb-2 sm:mb-0'>
                      Página {currentFuelPage} de {totalFuelPages}
                    </span>
                    <div className='flex space-x-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          setCurrentFuelPage((prev) =>
                            Math.min(prev + 1, totalFuelPages)
                          )
                        }
                        disabled={currentFuelPage === totalFuelPages}
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setCurrentFuelPage(totalFuelPages)}
                        disabled={currentFuelPage === totalFuelPages}
                      >
                        <ChevronsRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <Link to={`/dashboard/management/fuel`}>
                    <Button className='mt-4 w-full sm:w-auto'>Agregar</Button>
                  </Link>
                </TabsContent>
                <TabsContent value='documentos'>
                  <p>Contenido de documentos aquí</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className='p-4 md:p-6'>
            <h2 className='text-xl font-bold mb-4'>Gastos del vehículo</h2>
            <div className='h-[300px] md:h-[400px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={expensesData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Line type='monotone' dataKey='gastos' stroke='#8884d8' />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
