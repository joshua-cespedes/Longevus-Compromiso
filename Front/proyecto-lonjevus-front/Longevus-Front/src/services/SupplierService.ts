
import axios from 'axios';
import type { IProduct } from './ProductService';

const API_BASE_URL = 'http://localhost:8080';

export interface ISupplier {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    photo: string;
    isActive: boolean;
}

// Respuesta de la API 
interface SupplierListResponse {
    suppliers: ISupplier[];
}


export const getSuppliers = async (): Promise<ISupplier[]> => {
    try {
        const response = await axios.get<SupplierListResponse>(`${API_BASE_URL}/suppliers/list`);
        return response.data.suppliers;
    } catch (error) {
        console.error('Error al obtener la lista de proveedores:', error);
        throw new Error('No se pudo cargar la lista de proveedores');
    }
};


export const deleteSupplier = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/suppliers/delete`, {
            params: { id }
        });
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        throw new Error('Ocurrió un error al eliminar el proveedor');
    }
};

export const deleteProductsBySupplierId = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/products/deleteBySupplier`, {
            params: { id }
        });
    } catch (error) {
        console.error('Error al los productos del proveedor:', error);
        throw new Error('Ocurrió un error al eliminar los productos del proveedor');
    }
};


export const getSupplierById = async (id:any): Promise<ISupplier> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/suppliers/getById?id=${id}`, {
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        throw new Error('No se pudo cargar el proveedor');
    }
};

export const getProductsBySupplierId = async (id:number): Promise<number> =>{
  try{
    const response = await axios.get(`${API_BASE_URL}/suppliers/getQuantityProductsBySupplier?id=${id}`,{});
    return response.data;
  }catch(error){
    console.error('Error al obtener los productos de este proveedor',error);
    throw new Error('No se pudieron cargar los productos de este proveedor');
  }
}



export const createSupplier = async (data: FormData): Promise<ISupplier> => {
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    const response = await axios.post<ISupplier>(`${API_BASE_URL}/suppliers/save`, data, config);
    return response.data;
  } catch (error) {
    console.error('Error al crear el proveedor:', error);
    throw new Error('No se pudo crear el proveedor');
  }
};


export const updateSupplier = async (data: FormData): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/suppliers/update`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    throw new Error('No se pudo actualizar el proveedor');
  }
};