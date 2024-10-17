import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthContextProvider from './components/context/AuthProvider';
import { LOGIN, LOGOUT, PRIVATE } from './routes/paths';
import PrivateRoute from './routes/PrivateRoute';
import LoginForm from './components/LoginForm';
import PublicRoute from './routes/PublicRoute';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import getVehicles from './routes/loaders/getVehicles';
import VehicleForm from './components/VehicleForm';
import VehicleDetail from './components/Vehicle';
import getVehicleById from './routes/loaders/getVehicleById';
import PreventiveMaintenance from './components/PreventiveMaintenance';
import getMaintenanceById from './routes/loaders/getMaintenanceById';
import PreventiveMaintenanceForm from './components/PreventiveMaintenanceForm';
import ServiceHistory from './components/ServiceHistory';
import VehicleServiceForm from './components/VehicleServiceForm';
import FuelHistory from './components/FuelHistory';
import getFuelHistory from './routes/loaders/getFuelHistory';
import getServiceLoader from './routes/loaders/getServiceLoader';
import getServices from './routes/loaders/getServices';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import { Suspense } from 'react';
import RecoverPassword from './components/RecoverPassword';

const router = createBrowserRouter([
  {
    path: PRIVATE,
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        loader: getVehicles,
        element: <Dashboard />,
      },
      {
        path: '/dashboard/management/add-vehicle',
        element: <VehicleForm />,
      },
      {
        path: '/dashboard/management/edit-vehicle/:id',
        loader: ({ params }) => {
          if (!params.id) {
            throw new Error('Vehicle ID is required');
          }
          return getVehicleById(params.id);
        },
        element: <VehicleForm />,
      },
      {
        path: '/dashboard/management/vehicle/:id',
        loader: ({ params }) => {
          if (!params.id) {
            throw new Error('Vehicle ID is required');
          }
          return getVehicleById(params.id);
        },
        element: <VehicleDetail />,
      },
      {
        path: '/dashboard/management/vehicle/:id/preventive-maintenance',
        loader: ({ params }) => {
          if (!params.id) {
            throw new Error('Vehicle ID is required');
          }
          return getMaintenanceById(params.id);
        },
        element: <PreventiveMaintenance />,
      },
      {
        path: '/dashboard/management/vehicle/:id/preventive-maintenance/edit/:maintenanceId',
        loader: ({ params }) => {
          if (!params.id || !params.maintenanceId) {
            throw new Error('Vehicle ID and Maintenance ID are required');
          }
          return getMaintenanceById(params.id);
        },
        element: <PreventiveMaintenanceForm />,
      },
      {
        path: '/dashboard/management/vehicle/:id/preventive-maintenance/add',
        element: <PreventiveMaintenanceForm />,
      },
      {
        path: '/dashboard/management/services',
        loader: getServices,
        element: <ServiceHistory />,
      },
      {
        path: '/dashboard/management/services/add',
        loader: getServiceLoader,
        element: <VehicleServiceForm />,
      },
      {
        path: '/dashboard/management/services/edit/:idService',
        loader: getServiceLoader,
        element: <VehicleServiceForm />,
      },
      {
        path: '/dashboard/management/fuel',
        loader: getFuelHistory,
        element: <FuelHistory />,
      },
      {
        path: '/dashboard/management/services/edit/:id',
        loader: ({ params }) => {
          if (!params.id) {
            throw new Error('Service ID is required');
          }
          return getMaintenanceById(params.id);
        },
        element: <VehicleServiceForm />,
      },
      {
        path: LOGOUT,
        element: <Logout />,
      },
    ],
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginForm />,
      },
      {
        path: LOGIN,
        element: <LoginForm />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/recover-password',
        element: <RecoverPassword />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthContextProvider>
  );
};

export default App;
