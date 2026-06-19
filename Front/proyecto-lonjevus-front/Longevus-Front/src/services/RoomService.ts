import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface IRoom {
    id: number;
    statusRoom: string;
    roomType: string;
    bedCount: number;
    isActive: boolean;
    roomNumber: number;
}

type RoomListResponse = {
    rooms: IRoom[];
};

export interface IResident {
    id: number,
    identification: string,
    name: string,
    age: number,
    numberRoom: number,
}


export const getRooms = async (): Promise<IRoom[]> => {
    try {
        const response = await axios.get<RoomListResponse>(
            `${API_BASE_URL}/rooms/list`
        );
        return response.data.rooms;
    } catch (error) {
        console.error('Error al obtener la lista de habitaciones:', error);
        throw new Error('No se pudo cargar la lista de habitaciones');
    }
};


export const deleteRoom = async (id: number): Promise<void> => {
    try {
        await axios.delete(
            `${API_BASE_URL}/rooms/delete`,
            { params: { id } }
        );
        console.log("axios sin problemas")
    } catch (error) {
        console.error('Error al eliminar la habitación:', error);
        throw new Error('Ocurrió un error al eliminar la habitación');
    }
};


export const getRoomById = async (id: number): Promise<IRoom> => {
    try {
        const response = await axios.get<IRoom>(
            `${API_BASE_URL}/rooms/getById`,
            { params: { id } }
        );
        return response.data;
    } catch (error) {
        console.error('Error al obtener la habitación:', error);
        throw new Error('No se pudo cargar la habitación');
    }
};


export const createRoom = async (room: Omit<IRoom, 'id'>): Promise<IRoom> => {
    try {
        const response = await axios.post<IRoom>(
            `${API_BASE_URL}/rooms/save`,room
        );
        return response.data;
    } catch (error) {
        console.error('Error al crear la habitación:', error);
        throw new Error('No se pudo crear la habitación');
    }
};


export const updateRoom = async (room: IRoom): Promise<void> => {
    try {
        await axios.post(
            `${API_BASE_URL}/rooms/update`,
            room
        );
    } catch (error) {
        console.error('Error al actualizar la habitación:', error);
        throw new Error('No se pudo actualizar la habitación');
    }
};

export const getAllResidents = async (): Promise<IResident[]> => {
  const response = await axios.get<IResident[]>(`${API_BASE_URL}/residents`);
  return response.data;
};

export const getResidentsByRoomId = async (roomId: number): Promise<IResident[]> => {
  const response = await axios.get<IResident[]>(`${API_BASE_URL}/residents/getResidentByRoomId`, {
    params: { roomId }
  });
  return response.data;
};

export const checkStatusRoom = async (id: number): Promise<void> => {
  try {
    const response = await axios.post<void>(`${API_BASE_URL}/rooms/checkStatusRoom`,null,
      {
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al chequear y actualizar estado de habitación:", error);
    throw new Error("No se pudo chequear el estado de la habitación");
  }
};
