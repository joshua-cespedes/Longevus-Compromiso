import axios from "axios";

const URL_BASE = 'http://localhost:8080/task';

export interface Task {
  id?: number;
  caregiver?: { id: number };
  description: string;
}

export const getCaregiverTask = async (caregiverId: string | number) => {
  try {
    const response = await axios.get(`${URL_BASE}/listTaskByCaregiver/${caregiverId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener tareas del cuidador ${caregiverId}:`, error);
    throw error;
  }
};

export const saveTask = async (task: Task) => {
  try {
    const response = await axios.post(`${URL_BASE}/saveTask`, task);
    return response.data;
  } catch (error) {
    console.error('Error al guardar tarea:', error);
    throw error;
  }
};
// Actualizar una tarea existente
export const updateTask = async (task: Task) => {
  try {
    const response = await axios.post(`${URL_BASE}/updateTask/${task.id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tarea ${task.id}:`, error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId: number) => {
  try {
    const response = await axios.delete(`${URL_BASE}/deleteTask/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar tarea ${taskId}:`, error);
    throw error;
  }
};

// Obtener una tarea por su ID
export const getTaskById = async (taskId: number) => {
  try {
    const response = await axios.get(`${URL_BASE}/getById/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tarea ${taskId}:`, error);
    throw error;
  }
};