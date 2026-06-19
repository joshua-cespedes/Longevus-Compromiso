import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowEmployee from './pages/Employee/ShowEmployee';
import EditInventoryPage from './pages/inventory/EditInventoryPage';
import PurchasePage from './pages/purchase/PurchasePage';
import EditPurchase from './pages/purchase/EditPurchase';
import AddPurchase from './pages/purchase/AddPurchase';
import ProductPage from './pages/product/ProductPage';
import EditProduct from './pages/product/EditProduct';
import AddProduct from './pages/product/AddProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/inventario" element={<InventoryPage />} />
      <Route path="/inventario/editar/:id" element={<EditInventoryPage />} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path='/login' element={<Index/>} />
        <Route path='/agregarEmpleado' element={< AddEmployee/>}/>
        <Route path='/agregar' element={< AddEmployee/>}/>
        <Route path='/mostrar' element={<ShowEmployee/>}/>
        <Route path="/compras" element={<PurchasePage />} />
        <Route path="/compras/editar/:id" element={<EditPurchase />} />    
        <Route path="/compras/agregar" element={<AddPurchase/>} /> 
        <Route path="/productos" element={<ProductPage/>} />
         <Route path="/productos/editar/:id" element={<EditProduct />} />
         <Route path="/productos/agregar" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
