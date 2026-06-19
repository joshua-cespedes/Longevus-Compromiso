import axios from "axios";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface PurchaseItem {
  idProduct: number;
  name : string;
  quantity: number;
  expirationDate: string;
  productName?: string;
  price?: number;
}

export interface Admin {
  id: number;
  name: string;
}

export interface Purchase {
  id: string;
  date: string;
  amount: number;
  admin: {
    id: number;
    name: string;
  };
  items: PurchaseItem[];
}

export interface PurchasePayload {
  date: string;
  amount: number;
  admin: Admin;
  items: PurchaseItem[];
}


export const getAllPurchases = async (): Promise<Purchase[]> => {
  const response = await axios.get("http://localhost:8080/api/purchases/all");
  return response.data;
};

export const getPurchaseById = async (id: string): Promise<Purchase> => {
  const response = await axios.get(`http://localhost:8080/api/purchases/${id}`);
  return response.data;
};

export const createPurchase = async (purchase: Purchase): Promise<void> => {
  await axios.post("http://localhost:8080/api/purchases/add", purchase);
};

export const updatePurchase = async (id: string, purchase: Purchase, ): Promise<void> => {
  await axios.put(`http://localhost:8080/api/purchases/update/${id}`, purchase);
};

// Eliminar una compra (lógico)
export const deletePurchase = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/purchases/delete/${id}`);
};

// Obtener compras inactivas
export const getInactivePurchases = async (): Promise<Purchase[]> => {
  const response = await axios.get("http://localhost:8080/api/purchases/inactive");
  return response.data;
};
