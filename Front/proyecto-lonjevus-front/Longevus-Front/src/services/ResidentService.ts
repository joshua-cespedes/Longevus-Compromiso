import axios from "axios";
import type { IRoom } from "./RoomService";

const API_BASE_URL = 'http://localhost:8080'

export interface Resident {
  id: number,
  identification?: string,
  name?: string,
  age?: number,
  numberRoom?: number | string
}

export interface ResidentData {
  id: number;
  identification: string;
  name: string;
  birthdate: string,
  age: number;
  healthStatus: string;
  numberRoom: number;
  photo: File | null;
}


export const getResidents = async (): Promise<Resident[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/residents`);
    return response.data;
  } catch (error) {
    console.log('No se pudo obtener la lista de residentes', error)
    throw (error)
  }
}

export const deleteResident = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/deleteResident?id=${id}`);
  } catch (error) {
    console.error('Error al eliminar el residente', error);
    throw error;
  }
};

export const createResident = async (data: ResidentData): Promise<void> => {
  const formData = new FormData();
  formData.append("identification", data.identification);
  formData.append("name", data.name);
  formData.append("birthdate", data.birthdate);
  formData.append("healthStatus", data.healthStatus);
  formData.append("numberRoom", data.numberRoom.toString());

  if (data.photo && data.photo instanceof File) {
    formData.append("photo", data.photo);
  }

  try {
    await axios.post(`${API_BASE_URL}/addResident`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error al crear el residente", error);
    throw error;
  }
};


export const getResidentById = async (id: number): Promise<ResidentData> => {
  try {
    const response = await axios.get<ResidentData>(`${API_BASE_URL}/findResident?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el residente", error);
    throw error;
  }
};


export const updateResident = async (data: ResidentData): Promise<ResidentData> => {
  const formData = new FormData();
  formData.append("id", data.id.toString());
  formData.append("identification", data.identification);
  formData.append("name", data.name);
  formData.append("birthdate", data.birthdate);
  formData.append("healthStatus", data.healthStatus);
  formData.append("numberRoom", data.numberRoom.toString());

  if (data.photo && data.photo instanceof File) {
    formData.append("photo", data.photo);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/updateResident`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el residente", error);
    throw error;
  }
};

export const filterResidents = (residents: Resident[], nameFilter?: string, identificationFilter?: string): Resident[] => {
  return residents.filter((resident) => {
    const matchesName = nameFilter
      ? resident.name?.toLowerCase().includes(nameFilter.toLowerCase())
      : true;

    const matchesIdentification = identificationFilter
      ? resident.identification?.toLowerCase().includes(identificationFilter.toLowerCase())
      : true;

    return matchesName || matchesIdentification;
  });
};


