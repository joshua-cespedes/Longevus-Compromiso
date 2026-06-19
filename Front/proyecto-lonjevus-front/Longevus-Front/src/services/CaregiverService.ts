import axios from "axios";
import type { EmployeeInitialData } from "../components/EmployeeForm";
import type { EmployeeFormData } from "../components/EmployeeForm";
import type { IShift } from "../components/HourSelector";
const URL_BASE = 'http://localhost:8080/caregiver';

interface BackendSchedulePayload {
    id?: number;
    days: string | null;
    entryTime1: string | null;
    exitTime1: string | null;
    entryTime2: string | null;
    exitTime2: string | null;
}


interface BackendCaregiverPayload {
    id?: number;
    identification: string;
    name: string;
    salary: number;
    email: string;
    password: string;
    shift: string;
    schedule: BackendSchedulePayload; 
    scheduleId?: number; 
}
export interface CaregiverApiResponse {
    id: number; 
    name: string;
    identification: string;
    email: string;
    isActive: boolean; 
    password?: string; 
    photoUrl?: string; 
    salary: number;   
    schedule?: {
        id: number;
        days: string;
        entryTime1?: string | null; 
        exitTime1?: string | null; 
        entryTime2?: string | null; 
        exitTime2?: string | null; 
    };
    shift?: string;
    scheduleId?: number; 
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

export const getAllCaregivers = async () => {
    const response = await axios.get(`${URL_BASE}/listCaregiver`);
    return response.data.data; 
};

export const getCaregiverById = async (id: string): Promise<CaregiverApiResponse> => {
    const response = await axios.get(`${URL_BASE}/getcaregiverById/${id}`);
    return response.data;
};

export const createCaregiver = async (caregiverFormData: EmployeeFormData): Promise<any> => {
    const backendSchedulePayload = mapFrontendScheduleToBackendPayload(
        caregiverFormData.selectedDays,
        caregiverFormData.workSchedule
    );

    
    const caregiverDataForJson: BackendCaregiverPayload = {
        identification: caregiverFormData.identification,
        name: caregiverFormData.name,
        salary: parseFloat(caregiverFormData.salary.toString()) || 0.0,
        email: caregiverFormData.email,
        password: caregiverFormData.password || '',
        shift: caregiverFormData.selectedShifts.join(','),
        schedule: backendSchedulePayload 
    };
    const formData = new FormData();
    if (caregiverFormData.photo instanceof File) {
        formData.append('photo', caregiverFormData.photo);
    }
    formData.append('caregiverData', new Blob([JSON.stringify(caregiverDataForJson)], { type: 'application/json' }));

    if (caregiverFormData.photo) {
        formData.append('photo', caregiverFormData.photo, caregiverFormData.photo.name);
    }

    return axios.post(`${URL_BASE}/addCaregiver`, formData);
};

export const deleteCaregiver  = async (id: string | number) => {
    return axios.delete(`${URL_BASE}/deleteCaregiver/${id}`);
};

export const updateCaregiver = async (id: string, caregiverFormData: EmployeeFormData): Promise<any> => {


    const caregiverDataForJson: BackendCaregiverPayload = {
        id: Number(id),
        identification: caregiverFormData.identification,
        name: caregiverFormData.name,
        salary: parseFloat(caregiverFormData.salary.toString()) || 0.0,
        email: caregiverFormData.email,
        password: caregiverFormData.password || '',
        schedule: {
        id: caregiverFormData.scheduleId || undefined, 
        ...mapFrontendScheduleToBackendPayload(
            caregiverFormData.selectedDays,
            caregiverFormData.workSchedule
        )
    },
        shift:caregiverFormData.selectedShifts.join(',')
    };

    const formData = new FormData();
    formData.append('caregiverData', new Blob([JSON.stringify(caregiverDataForJson)], { type: 'application/json' }));
    

    if (caregiverFormData.photo) {
        formData.append('photo', caregiverFormData.photo, caregiverFormData.photo.name);
    }
    
    return axios.post(`${URL_BASE}/updateCaregiver/${id}`, formData);
};