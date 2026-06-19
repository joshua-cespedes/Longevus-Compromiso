import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryFilter from "../../components/CategoryFilter";
import { Link, useNavigate } from 'react-router-dom';
import type { columnDefinition } from "../../components/TableBasic";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import { deleteProduct, getProducts } from "../../services/ProductService";
import { confirmDeleteAlert, succesAlert, errorAlert, confirmDeleteSupplierAlert } from '../../js/alerts';
import { useAuth } from "../../context/AuthContext";
interface IProduct {
  id:number,
  name: string,
  price: number,
  expirationDate: string,
  category: string,
  unit: string,
  supplier: string,
  photoURL: string,
  isActive:boolean
}

const dateES = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const ProductsList=() => {
  const {hasAuthority} = useAuth();
  const [productData,setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = productData.filter(product => {
  const term = searchTerm.toLowerCase();
  return (
    product.name.toLowerCase().includes(term) ||
    product.price.toString().toLowerCase().includes(term) ||
    product.supplier.toLowerCase().includes(term) ||
    product.unit.toLowerCase().includes(term)
  );

});

const productColumns: columnDefinition<IProduct>[]=[

    {header: '#', accessor: 'id', Cell:(_product, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Precio', accessor: 'price',
      Cell: (product) => `₡${product.price}`
    },
    {header: 'Categoria', accessor: 'category'},
    {header: 'Fecha de Vencimiento',accessor: 'expirationDate',
    Cell: (product) => {
      return dateES(product.expirationDate);
    }
    },
    {header: 'Foto', accessor: 'photoURL',Cell: (_item) =>(<img
      src={`http://localhost:8080/${_item.photoURL}`}
      alt="Foto producto"
      style={{ width: 50, height: 50, objectFit: 'cover' }}
      />)
    },
    {header: 'Unidad',accessor:'unit'},
    {header: 'Proveedor', accessor:'supplier'},
      
    {header: 'Acciones', accessor: (product) => product,   
        Cell: (product) =>(
            <>
            {hasAuthority('PERMISSION_PRODUCTOS_UPDATE')&& (
            <Link className="btn btn-warning me-2 btn-sm" to={`/productos/editar/${product.id}`}><i className='bi bi-pencil-square' /></Link>
            )}
            {hasAuthority('PERMISSION_INVENTARIO_VIEW')&& (
            <Link className="btn btn-success me-2 btn-sm" to={`/producto/${product.id}/condiciones`} title="Condiciones Medicas"><i className='bi bi-heart-pulse' /></Link>
            )}
            {hasAuthority('PERMISSION_PRODUCTOS_DELETE')&& (
            <a className='btn btn-danger me-2 btn-sm' onClick={()=>handleDelete(product.id,product.name)}>
                <i className="bi bi-trash"/>
            </a> 
            )} 
            </>
        ) 
    }

];

useEffect(() => {
    loadProducts();
  }, []);

      const loadProducts = async () => {
      try {
        const products = await getProducts();
        
        setProductData(products);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al cargar los productos");
        setLoading(false);
      }
    };


    if (loading) {
    return (
      <>
        {/* <Header /> */}
        <div className="container mt-5">Cargando proveedores…</div>
        {/* <Footer /> */}
      </>
    );
  }

    if (error) {
    return (
      <>
        {/* <Header /> */}
        <div className="container mt-5 text-danger">{error}</div>
        {/* <Footer /> */}
      </>
    );
  }


    const handleDelete = async (id: number,productName:string) => {
    //const confirmDelete = window.confirm("¿Seguro que deseas eliminar este proveedor?");
    const response = await confirmDeleteAlert(productName);

    
    if (response.isConfirmed){
        setLoading(true);
        setError(null);

     try {
        await deleteProduct(id);
        setProductData((prev) => prev.filter((p) => p.id !== id));
        succesAlert("Eliminado","Producto eliminado exitosamente");
      } catch (err) {
        errorAlert("Ocurrio un error al eliminar el producto.");
      }finally{
        setLoading(false);
      }
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
                        <h4 className="m-2">Lista de productos</h4>
                        {hasAuthority('PERMISSION_PRODUCTOS_CREATE')&& (
                          <Link className='btn btn-success' to='/productos/agregar'><i className="bi bi-plus-square"></i> </Link>
                        )}
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar..." id="supplierSearch" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                        
                        <Table<IProduct> data={filteredProducts} columns={productColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    {/* <Footer/> */}
  </>  

  );
};

export default ProductsList;
