import axios from "axios";
import type { Resident } from "./ResidentService";

const API_BASE_URL = 'http://localhost:8080'

export interface Contact {
    id: number;
    resident: Resident;
    name: string;
    phoneNumber: string;
    relationShip: string;
}

export const getContactsByResidentId = async (id: number): Promise<Contact[]> => {
  try {
    const response = await axios.get<Contact[]>(`${API_BASE_URL}/getContacts?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener contactos", error);
    throw error;
  }
};

export const addContact = async (contact: Contact): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/addContact`, contact);
  } catch (error) {
    console.error("Error al guardar el contacto", error);
    throw error;
  }
};

export const updateContact = async (contact: Contact): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/updateContact`, contact);
  } catch (error) {
    console.error("Error al actualizar contacto", error);
    throw error;
  }
};


export const deleteContact = async (contactId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/deleteContact?id=${contactId}`);
  } catch (error) {
    console.error("Error al eliminar contacto", error);
    throw error;
  }
};
