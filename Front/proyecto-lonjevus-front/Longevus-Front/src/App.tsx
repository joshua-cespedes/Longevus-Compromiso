import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowEmployee from './pages/Employee/ShowEmployees';
import EditEmployee from './pages/Employee/EditEmployee';
import ViewEmployee from './pages/Employee/VIewEmployee';
import ShowResidents from './pages/Residents/ShowResidents';
import AddResident from './pages/Residents/AddResident';
import EditResident from './pages/Residents/EditResident';
import ViewResident from './pages/Residents/ViewResident';
import PurchasePage from './pages/purchase/PurchasePage';
import EditPurchase from './pages/purchase/EditPurchase';
import AddPurchase from './pages/purchase/AddPurchase';
import ProductsList from './pages/product/ProductList';
import BillingPage from './pages/billing/BillingPage';
import EditBilling from './pages/billing/EditBilling';
import AddBilling from './pages/billing/AddBilling';
import InactiveBillingsPage from "./pages/billing/InactiveBillingsPage";
import InactivePurchasesPage from './pages/purchase/InactivePurchasesPage';
import SuppliersList from './pages/supplier/SuppliersList';
import SuppliersAdd from './pages/supplier/SuppliersAdd';
import SuppliersEdit from './pages/supplier/SuppliertsUpdate';
import ShowVisits from './pages/visits/ShowVisits';
import EditVisit from './pages/visits/EditVisit';
import UserProfile from './pages/Employee/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedPage from './components/ProtectedPages';
import ProtectedRoute from './components/ProtectedRoute';
import RoomList from './pages/Room/ListRooms';
import AddRoom from './pages/Room/AddRoom';
import EditRoom from './pages/Room/EditRoom';
import EditProduct from './pages/product/EditProduct';
import AddProduct from './pages/product/AddProduct';
import ShowActivities from './pages/Activity/ShowActivities';
import AddActivity from './pages/Activity/AddActivity';
import EditActivity from './pages/Activity/EditActivity';
import ViewActivity from './pages/Activity/ViewActivity';
import ShowResidentsFromActivity from './pages/Activity/ShowResidentsFromActivity';
import AddResidentsToActivity from './pages/Activity/AddResidentToActivity';
import AddAdmin from './pages/Employee/AddAdmin';
import EditAdmin from './pages/Employee/EditAdmin';
import RolesList from './pages/role_permissions/Role_permission';
import UpdatePassword from './pages/Employee/UpdatePassword';
import PriorityDashboard from './pages/inventory/PriorityDashboard';
import ConditionsPage from './pages/conditions/ConditionsPage';
import ResidentConditionsPage from './pages/conditions/ResidentConditionsPage';
import ProductConditionsPage from './pages/conditions/ProductConditionsPage';

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visita" element={<VisitSchedule />} />
          <Route path='/login' element={<Index />} />
          <Route path='/password' element={<UpdatePassword/>}/>
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedPage />}>
              <Route path="/inventario" element={<InventoryPage />} />
              <Route path="/inventario/prioridades" element={<PriorityDashboard />} />
              <Route path="/condiciones" element={<ConditionsPage />} />
              <Route path="/residente/:residentId/condiciones" element={<ResidentConditionsPage />} />
              <Route path="/producto/:productId/condiciones" element={<ProductConditionsPage />} />
              <Route path='/empleado/agregar' element={< AddEmployee />} />
              <Route path='/empleado/mostrar' element={<ShowEmployee />} />
              <Route path='/empleado/editar/:id' element={<EditEmployee />} />
              <Route path='/empleado/perfil/:id' element={< ViewEmployee />} />
              <Route path='/residente/mostrar' element={<ShowResidents />} />
              <Route path='/residente/agregar' element={<AddResident />} />
              <Route path="/compras" element={<PurchasePage />} />
              <Route path="/compras/editar/:id" element={<EditPurchase />} />
              <Route path="/compras/agregar" element={<AddPurchase />} />
              <Route path="/productos" element={<ProductsList />} />
              <Route path="/productos/editar/:id" element={<EditProduct />} />
              <Route path="/productos/agregar" element={<AddProduct />} />
              <Route path="/proveedores" element={<SuppliersList />} />
              <Route path="/proveedores/agregar" element={<SuppliersAdd />} />
              <Route path='/proveedores/editar/:id' element={<SuppliersEdit />} />
              <Route path='/admin/agregar' element={<AddAdmin />} />
              <Route path='/admin/editar/:id' element={<EditAdmin />} />
              <Route path='/residente/editar/:id' element={<EditResident />} />
              <Route path='/residente/perfil/:id' element={<ViewResident />} />
              <Route path='/residente/visitas' element={<ShowVisits />} />
              <Route path='/residente/visitas/editar/:id' element={<EditVisit />} />
              <Route path='/perfil' element={<UserProfile />} />
              <Route path='/habitaciones' element={<RoomList />} />
              <Route path='/habitaciones/agregar' element={<AddRoom />} />
              <Route path='/habitaciones/editar/:id' element={<EditRoom />} />
              <Route path="/actividades/mostrar" element={<ShowActivities />} />
              <Route path="/actividad/agregar" element={<AddActivity />} />
              <Route path="/actividad/editar/:id" element={<EditActivity />} />
              <Route path="/actividad/info/:id" element={<ViewActivity />} />
              <Route path="/actividad/info/residentes/:id" element={<ShowResidentsFromActivity />} />
              <Route path="/actividad/info/residentes/agregar/:id" element={<AddResidentsToActivity />} />
              <Route path="/facturas" element={<BillingPage />} />
              <Route path="/facturas/editar/:id" element={<EditBilling />} />
              <Route path="/facturas/nueva" element={<AddBilling />} />
              <Route path="/facturas/inactivas" element={<InactiveBillingsPage />} />
              <Route path="/compras/inactivas" element={<InactivePurchasesPage />} />
              <Route path="/proveedores" element={<SuppliersList />} />
              <Route path="/proveedores/agregar" element={<SuppliersAdd />} />
              <Route path='/proveedores/editar/:id' element={<SuppliersEdit />} />
              <Route path="/roles_permisos" element={<RolesList/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App;