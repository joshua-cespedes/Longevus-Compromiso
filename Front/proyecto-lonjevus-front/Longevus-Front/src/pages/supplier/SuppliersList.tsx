
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type {columnDefinition} from '../../components/TableBasic';
import { Link } from 'react-router-dom';
import Table from '../../components/TableBasic';
import { useState, useEffect } from "react";
import { deleteProductsBySupplierId, deleteSupplier, getProductsBySupplierId, getSuppliers } from "../../services/SupplierService";
import { confirmDeleteAlert, succesAlert, errorAlert, confirmDeleteSupplierAlert } from '../../js/alerts';
import { useAuth } from "../../context/AuthContext";
interface ISupplier{
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
    photo: string,
    isActive: boolean
}

const SuppliersList = () =>{
  const {hasAuthority} = useAuth();
  const [supplierData, setSupplierData] = useState<ISupplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSuppliers = supplierData.filter(supplier => {
  const term = searchTerm.toLowerCase();
  return (
    supplier.name.toLowerCase().includes(term) ||
    supplier.phoneNumber.toLowerCase().includes(term) ||
    supplier.email.toLowerCase().includes(term) ||
    supplier.address.toLowerCase().includes(term)
  );
});

   const supplierColumns: columnDefinition<ISupplier>[] =[
    {header: '#', accessor: 'id', Cell:(_supplier, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Teléfono', accessor: 'phoneNumber'},
    {header: 'Correo', accessor: 'email'},
    {header: 'Dirección', accessor: 'address'},
    {header: 'Foto', accessor: 'photo',
      Cell: (_item) =>(<img
      src={`http://localhost:8080/${_item.photo}`}
      alt="Foto proveedor"
      style={{ width: 50, height: 50, objectFit: 'cover' }}
      />)
    },
    {header: 'Acciones', accessor: (supplier) => supplier,   
        Cell: (supplier) =>(
            <>
            {hasAuthority('PERMISSION_PROVEEDORES_UPDATE')&& (
            <Link className="btn btn-warning me-2" to={`/proveedores/editar/${supplier.id}`}><i className='bi bi-pencil-square' /></Link>
            )}
            {hasAuthority('PERMISSION_PROVEEDORES_DELETE')&& (
            <a className='btn btn-danger me-2' onClick={()=>handleDelete(supplier.id,supplier.name)}>
                <i className="bi bi-trash"/>
            </a>  
            )}
            </>
        ) 
    }
   ];

   useEffect(() => {
    loadSuppliers();
  }, []);

    const loadSuppliers = async () => {
    try {
      const suppliers = await getSuppliers();
      setSupplierData(suppliers);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar proveedores");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">Cargando proveedores…</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-danger">{error}</div>
        <Footer />
      </>
    );
  }




  const handleDelete = async (id: number,supplierName:string) => {
    
  const quantityOfProducts = await getProductsBySupplierId(id);

  const response = await confirmDeleteSupplierAlert(quantityOfProducts,supplierName);
  if(response.isConfirmed){
            setLoading(true);
            setError(null);
   try {
      await deleteSupplier(id);
      await deleteProductsBySupplierId(id);
            succesAlert("Eliminado",`Proveedor ${supplierName} eliminado exitosamente`);
      setSupplierData((prev) => prev.filter((p) => p.id !== id));

    } catch (err) {
      errorAlert("Hubo un error al eliminar el proveedor");
    } finally{
      setLoading(false);
    };
      
  }else{
    return;
  }
}
return (

    
  <>  
    {/* <Header/> */}
      <div className="container ">
        <div className='row'>
            <div className='card mt-5 mb-5'>
                <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4 className="m-2">Lista de proveedores</h4>
                        {hasAuthority('PERMISSION_PROVEEDORES_CREATE')&& (
                        <Link className='btn btn-success' to='/proveedores/agregar'><i className="bi bi-plus-square"></i> </Link>
                        )}
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar..." id="supplierSearch" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                        
                        <Table<ISupplier> data={filteredSuppliers} columns={supplierColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    {/* <Footer/> */}
  </>  
  
    )
  }

  export default SuppliersList;
  
