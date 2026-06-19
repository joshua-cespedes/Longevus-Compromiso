import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface IUnit{
  id:number
  unitType:string
  isActive:boolean
}

export interface ISupplier {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  photo: string;
  isActive: boolean;
}

export interface IProduct {
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


export interface RawProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  expirationDate: string;  // "yyyy-MM-dd"
  photoURL: string;
  isActive: boolean;
  unit: IUnit;
  supplier: ISupplier;
}

interface ProductListResponse{
    products: RawProduct[];
}

interface IUnitListResponse{
  units: IUnit[];
}

export const getProducts = async (): Promise<IProduct[]> => {
    try {

    const response = await axios.get<ProductListResponse>(`${API_BASE_URL}/products/list`);
    
    const flattened: IProduct[] = response.data.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      expirationDate: p.expirationDate, 
      category: p.category,
      unit: p.unit.unitType,            
      supplier: p.supplier.name,        
      photoURL: p.photoURL,
      isActive: p.isActive,
    }));
    console.log(flattened);

    return flattened;
        
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        throw new Error('No se pudo cargar la lista de productos');
    }
};

export const createProduct = async (data: FormData): Promise<IProduct> => {
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    const response = await axios.post<IProduct>(`${API_BASE_URL}/products/save`, data, config);
    return response.data;
  } catch (error) {
    console.error('Error al agregar un producto:', error);
    throw new Error('No se pudo agregar un producto');
  }
};

export const deleteProduct = async (id:number): Promise<void> => {
    try{
      await axios.delete(`${API_BASE_URL}/products/delete`,{
        params: {id}
      });
    }catch(error){
      console.error('Error del eliminar un producto', error);
      throw new Error('Ocurrio un error al eliminar el producto');
    }


}

export const getUnits = async (): Promise<IUnit[]> =>{
  try{

    const response = await axios.get<IUnitListResponse>(`${API_BASE_URL}/products/units/list`);
    console.log(response.data.units);
    return response.data.units;

  }catch(error){

    console.log('Error al obtener la unidades');
    throw new Error('No se pudo cargar las unidades');
  }

}

export const getProductById = async (id:any): Promise<RawProduct> => {
    try {
        const response = await axios.get<RawProduct>(`${API_BASE_URL}/products/getById?id=${id}`, {
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        throw new Error('No se pudo cargar el proveedor');
    }
};

export const updateProduct = async (data: FormData): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/products/update`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    throw new Error('No se pudo actualizar el proveedor');
  }
};


