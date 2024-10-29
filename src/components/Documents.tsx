'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, EyeIcon, Menu, Plus, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { toast, Toaster } from 'sonner';
import { Link, useLoaderData } from 'react-router-dom';

interface Document {
  IdVehiculo: string;
  TipoDocumento: string;
  NombreDocumento: string;
  FechaEmision: string;
  FechaVencimiento: string | null;
  TieneFechaVencimiento: boolean;
  CostoDocumento: number;
  IdArchivo: number;
  IdDocumento: number;
  EstaVencido: boolean;
  DiasParaVencer: number;
  Archivo: FileList;
  urlFoto: string;
}

export default function Documents() {
  const loader = useLoaderData() as {
    documents: Document[];
    vehicles: { Placa: string }[];
    error: string | null;
  };
  const [documents, setDocuments] = useState<Document[]>(
    loader.documents as Document[]
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredDocuments =
    documents.length > 0
      ? documents.filter((document) =>
          document.NombreDocumento.toLowerCase().includes(filter.toLowerCase())
        )
      : [];

  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, control, watch, setValue } =
    useForm<Document>({
      defaultValues: {
        FechaEmision: new Date().toISOString().split('T')[0],
        FechaVencimiento: null,
        TieneFechaVencimiento: false,
      },
    });
  const hasExpiration = watch('TieneFechaVencimiento');

  useEffect(() => {
    setValue('IdVehiculo', loader.vehicles[0].Placa);
  }, [loader.vehicles, setValue]);

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

  const onSubmit = async (data: Document) => {
    const object = {
      ...data,
    };

    const fileId = await uploadFile(data.Archivo.item(0) as File);
    if (fileId) {
      object.IdArchivo = fileId.toString();

      try {
        const response = await fetch(
          `http://204.48.27.211:5000/api/documents/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token') || '',
            },
            body: JSON.stringify(object),
          }
        );

        if (response.ok) {
          setDocuments((prev) => [...prev, object]);
          toast.success('Documento agregado correctamente');
          closeCreateDialog();
        } else {
          console.error('Error creating document:', response);
        }
      } catch (error) {
        console.error('Error creating document:', error);
      }
    }
  };

  const deleteDocumentCard = async (id: number) => {
    try {
      const response = await fetch(
        `http://204.48.27.211:5000/api/documents/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') || '',
          },
        }
      );

      if (response.ok) {
        setDocuments((prev) =>
          prev.filter((documents) => documents.IdDocumento !== currentDocument)
        );
        toast.success('Vehículo eliminado correctamente');
        setCurrentDocument(null);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDeleteDocument = (id: number) => {
    setIsDeleteModalOpen(true);
    setCurrentDocument(id);
  };

  const closeDeleteDialog = () => {
    setIsDeleteModalOpen(false);
  };

  const closeCreateDialog = () => {
    setIsOpen(false);
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
            <h1 className='text-2xl font-bold'>Mis Documentos</h1>
          </div>

          <div className='flex items-center space-x-4'>
            <Button
              onClick={() => setIsOpen(true)}
              className='bg-blue-500 hover:bg-blue-600 text-white'
            >
              <Plus className='md:mr-2 h-4 w-4' />
              <span className='hidden sm:inline'>Agregar documentos</span>
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          <AlertDialog
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente el documento <b>{currentDocument}</b>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={closeDeleteDialog}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteDocumentCard(currentDocument!)}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='sm:max-w-[425px]'>
              <AlertDialogHeader>
                <AlertDialogTitle>Agregar documentos</AlertDialogTitle>
              </AlertDialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='grid gap-4 py-4'
              >
                <div className='grid gap-2'>
                  <Label htmlFor='type'>Tipo de documento</Label>
                  <Controller
                    name='TipoDocumento'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        required
                      >
                        <SelectTrigger id='type'>
                          <SelectValue placeholder='Selecciona el tipo de documento' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='tarjeta_propiedad'>
                            Tarjeta propiedad
                          </SelectItem>
                          <SelectItem value='licencia_conducir'>
                            Licencia de conducir
                          </SelectItem>
                          <SelectItem value='cedula'>Cédula</SelectItem>
                          <SelectItem value='soat'>SOAT</SelectItem>
                          <SelectItem value='tecnomecanica'>
                            Tecnomecánica
                          </SelectItem>
                          <SelectItem value='seguro'>Seguro</SelectItem>
                          <SelectItem value='otro'>Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Nombre del documento</Label>
                  <Input id='name' required {...register('NombreDocumento')} />
                </div>
                <div>
                  <Label htmlFor='PlacaVehiculo'>Placa</Label>
                  <Controller
                    name='IdVehiculo'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={
                          field.value ||
                          (loader.vehicles.length > 0
                            ? loader.vehicles[0].Placa
                            : '')
                        }
                      >
                        <SelectTrigger id='PlacaVehiculo'>
                          <SelectValue placeholder='TUS PLACAS' />
                        </SelectTrigger>
                        <SelectContent>
                          {loader.vehicles.map((vehicle) => (
                            <SelectItem
                              key={vehicle.Placa}
                              value={vehicle.Placa}
                            >
                              {vehicle.Placa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='emissionDate'>Fecha de emisión</Label>
                  <Input
                    type='date'
                    id='emissionDate'
                    required
                    {...register('FechaEmision')}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Controller
                    name='TieneFechaVencimiento'
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='hasExpiration'
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setValue(
                            'FechaVencimiento',
                            checked
                              ? new Date().toISOString().split('T')[0]
                              : null
                          );
                        }}
                      />
                    )}
                  />
                  <Label htmlFor='hasExpiration'>
                    Tiene fecha de vencimiento
                  </Label>
                </div>

                {hasExpiration && (
                  <div className='grid gap-2'>
                    <Label htmlFor='expirationDate'>Fecha de vencimiento</Label>
                    <Input
                      type='date'
                      id='expirationDate'
                      {...register('FechaVencimiento')}
                    />
                  </div>
                )}
                <div className='grid gap-2'>
                  <Label htmlFor='cost'>Costo</Label>
                  <Input
                    id='cost'
                    type='number'
                    {...register('CostoDocumento', { valueAsNumber: true })}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='file'>Selecciona imagen a subir</Label>
                  <Input
                    id='file'
                    type='file'
                    required
                    {...register('Archivo')}
                  />
                </div>
                <Button type='submit'>Agregar</Button>
              </form>
            </AlertDialogContent>
          </AlertDialog>
          {loader.documents.length === 0 ? (
            <div className='text-center text-gray-500 col-span-6'>
              No hay documentos
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <Card
                key={doc.IdArchivo}
                className='flex flex-col justify-between h-full'
              >
                <div>
                  <CardHeader>
                    <CardTitle>{doc.NombreDocumento}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tipo: {doc.TipoDocumento}</p>
                    <p>Emisión: {formatDate(doc.FechaEmision)}</p>
                    {doc.TieneFechaVencimiento && (
                      <>
                        <p>Vence: {formatDate(doc.FechaVencimiento)}</p>
                        <p
                          className={
                            doc.EstaVencido ? 'text-red-600' : 'text-black'
                          }
                        >
                          {doc.EstaVencido
                            ? 'Vencido'
                            : `Vence en ${doc.DiasParaVencer} días`}
                        </p>
                      </>
                    )}
                    <p>Placa: {doc.IdVehiculo}</p>
                    <p>Costo: ${doc.CostoDocumento.toLocaleString('es-CO')}</p>
                  </CardContent>
                </div>
                <CardFooter className='gap-2'>
                  <Button
                    variant='destructive'
                    onClick={() => handleDeleteDocument(doc.IdDocumento)}
                  >
                    Eliminar
                  </Button>
                  <Link to={doc.urlFoto} target='_blank'>
                    <Button variant='outline'>
                      <EyeIcon className='h-5 w-5 mr-2' />
                      Ver
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
