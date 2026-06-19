import axios from 'axios';
import type { EmployeeFormData } from '../components/EmployeeForm';
import type { IShift } from '../components/HourSelector';


const URL_BASE = 'http://localhost:8080/admin';


interface BackendSchedulePayload {
    id?: number;
    days: string | null;
    entryTime1: string | null;
    exitTime1: string | null;
    entryTime2: string | null;
    exitTime2: string | null;
}

interface BackendAdminPayload { 
    id?: number;
    identification: string;
    name: string;
    salary: number;
    email: string;
    password: string; 
    schedule: BackendSchedulePayload; 
    officeContact?: string; 
}
function mapFrontendScheduleToBackendPayload(
    selectedDays: string[],
    workSchedule: IShift[] 
): BackendSchedulePayload {
    const backendSchedule: BackendSchedulePayload = {
        days: selectedDays.length > 0 ? selectedDays.join(',') : null, 
        entryTime1: null,
        exitTime1: null,
        entryTime2: null,
        exitTime2: null,
    };
        if (workSchedule.length > 0 && workSchedule[0]) {
        backendSchedule.entryTime1 = workSchedule[0].entryTime || null;
        backendSchedule.exitTime1 = workSchedule[0].exitTime || null;
    }
    if (workSchedule.length > 1 && workSchedule[1]) {
        backendSchedule.entryTime2 = workSchedule[1].entryTime || null;
        backendSchedule.exitTime2 = workSchedule[1].exitTime || null;
    }
    return backendSchedule;
}

export const createAdmin = async (adminFormData: EmployeeFormData): Promise<any> => {

    const backendSchedulePayload = mapFrontendScheduleToBackendPayload(
        adminFormData.selectedDays,
        adminFormData.workSchedule
    );
    const adminDataForJson: BackendAdminPayload = {
        identification: adminFormData.identification,
        name: adminFormData.name,
        salary: parseFloat(adminFormData.salary) || 0.0, 
        email: adminFormData.email,
        password: adminFormData.password, 
        schedule: backendSchedulePayload,
        officeContact: adminFormData.officeContact, 
    };
    const formData = new FormData();
    formData.append('adminData', new Blob([JSON.stringify(adminDataForJson)], { type: 'application/json' }));

    if (adminFormData.photo) {
        formData.append('photo', adminFormData.photo, adminFormData.photo.name);
    }
     return axios.post(`${URL_BASE}/addAdmin`, formData);
};

export const getAdminById = async (id: string): Promise<any> => {
    try {
        const response = await axios.get(`${URL_BASE}/getAdmin/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener administrador:", error);
        throw error;
    }
};
export const updateAdmin = async (id: string, adminFormData: EmployeeFormData): Promise<any> => {


    const adminDataForJson: BackendAdminPayload = {
        id: Number(id),
        identification: adminFormData.identification,
        name: adminFormData.name,
        salary: parseFloat(adminFormData.salary.toString()) || 0.0,
        email: adminFormData.email,
        password: adminFormData.password || '',
        schedule: {
        id: adminFormData.scheduleId || undefined,
        ...mapFrontendScheduleToBackendPayload(
            adminFormData.selectedDays,
            adminFormData.workSchedule
        )
    },
        officeContact: adminFormData.officeContact,
    };

    const formData = new FormData();
    formData.append('adminData', new Blob([JSON.stringify(adminDataForJson)], { type: 'application/json' }));
    

    if (adminFormData.photo) {
        formData.append('photo', adminFormData.photo, adminFormData.photo.name);
    }
    
    return axios.post(`${URL_BASE}/updateAdmin/${id}`, formData);
};

export const deleteAdmin = async (id: string | number) => {
    return axios.delete(`${URL_BASE}/deleteAdmin/${id}`);
};