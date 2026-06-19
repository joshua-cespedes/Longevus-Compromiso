import axios from "axios";


export interface Administrator {
  id: number;
  name?: string;
}

export interface Resident {
  id: number;
  name?: string;
  active?: boolean;
}

export interface Billing {
  id?: number;
  consecutive?: string;
  date: string;
  amount: number;
  period: string;
  paymentMethod: string;
  isActive?: boolean;
  administrator: Administrator;
  resident: Resident;
}


const BASE_URL = "http://localhost:8080/api/billing";

export const getAllBillings = async (): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/active`);
  return res.data;
};

export const getBillingById = async (id: number): Promise<Billing> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createBilling = async (billing: Billing): Promise<void> => {
  await axios.post(BASE_URL, billing);
};

export const updateBilling = async (id: number, billing: Billing): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, billing);
};

export const deleteBilling = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getBillingsByDate = async (date: string): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/date/${date}`);
  return res.data;
};

export const getBillingsByPeriod = async (period: string): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/period/${period}`);
  return res.data;
};

// Obtener todos los residentes
export const getAllResidents = async (): Promise<Resident[]> => {
  const res = await axios.get("http://localhost:8080/residents");
  return res.data;
};


// Obtener facturas por residente
export const getBillingsByResident = async (residentId: number): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/resident/${residentId}`);
  return res.data;
};

// Obtener facturas por residente y fecha
export const getBillingsByResidentAndDate = async (
  residentId: number,
  date: string
): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/resident/${residentId}/date/${date}`);
  return res.data;
};

export const getBillingsByInactiveResidents = async (): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/resident/inactive`);
  return res.data;
};

export const getInactiveBillings = async (): Promise<Billing[]> => {
  const res = await axios.get("http://localhost:8080/api/billing/inactive");
  return res.data;
};


