import axios from 'axios';


export type InventoryItem = {
  id: number;
  quantity: number;
  category: string;
  photoURL: string;
  product: {
    id: number;
    name: string;
    category: string;
    supplier: {
      name: string;
    };
  };
  purchase: {
    id: string;
  };
  expirationDate: string | null;
};

const BASE_URL = "http://localhost:8080/api/inventory";

export const getAllInventory = async (): Promise<InventoryItem[]> => {
  try{
    const res = await axios.get(`${BASE_URL}/all`);
    return res.data.inventory || [];
  }catch(error){
    console.error("Error al obtener inventario:", error);
    throw new Error("Error al obtener inventario");
  }

};

export const deleteInventory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/delete?id=${id}`)
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
     throw new Error("Error al eliminar inventario");
  }

  
};
