import axios from 'axios';

const BASE_URL = "http://localhost:8080/api";

export interface Condition {
  id: number;
  name: string;
  description: string;
  severity: string;
  isActive: boolean;
}

export interface ResidentCondition {
  id: number;
  resident: { id: number; name: string };
  condition: { id: number; name: string; severity: string };
  diagnosedDate: string;
  notes: string;
  isActive: boolean;
}

export interface ProductCondition {
  id: number;
  product: { id: number; name: string; category: string };
  condition: { id: number; name: string; severity: string };
  relationshipType: string;
  notes: string;
  isActive: boolean;
}

export const getConditions = async (): Promise<Condition[]> => {
  const res = await axios.get(`${BASE_URL}/conditions/all`);
  return res.data.conditions || [];
};

export const createCondition = async (condition: Partial<Condition>): Promise<void> => {
  await axios.post(`${BASE_URL}/conditions/save`, condition);
};

export const updateCondition = async (condition: Condition): Promise<void> => {
  await axios.put(`${BASE_URL}/conditions/update`, condition);
};

export const deleteCondition = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/conditions/delete?id=${id}`);
};

export const getResidentConditions = async (residentId: number): Promise<ResidentCondition[]> => {
  const res = await axios.get(`${BASE_URL}/resident-conditions/byResident?residentId=${residentId}`);
  return res.data.residentConditions || [];
};

export const getAllResidentConditions = async (): Promise<ResidentCondition[]> => {
  const res = await axios.get(`${BASE_URL}/resident-conditions/all`);
  return res.data.residentConditions || [];
};

export const createResidentCondition = async (rc: Partial<ResidentCondition>): Promise<void> => {
  await axios.post(`${BASE_URL}/resident-conditions/save`, rc);
};

export const deleteResidentCondition = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/resident-conditions/delete?id=${id}`);
};

export const getProductConditions = async (productId: number): Promise<ProductCondition[]> => {
  const res = await axios.get(`${BASE_URL}/product-conditions/byProduct?productId=${productId}`);
  return res.data.productConditions || [];
};

export const getAllProductConditions = async (): Promise<ProductCondition[]> => {
  const res = await axios.get(`${BASE_URL}/product-conditions/all`);
  return res.data.productConditions || [];
};

export const createProductCondition = async (pc: Partial<ProductCondition>): Promise<void> => {
  await axios.post(`${BASE_URL}/product-conditions/save`, pc);
};

export const deleteProductCondition = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/product-conditions/delete?id=${id}`);
};
