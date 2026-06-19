import axios from "axios";
import { useState, useEffect } from "react";

const URL_BASE = 'http://localhost:8080/visit';

export interface ApiResident {
    id: number,
    name: string,
    numberRoom: number,
}
export interface VisitPayload {
    id?:number | string;
    name: string;
    visitDate: string;        
    visitHour: string;           
    phoneNumber: string;
    email: string;      
    relationship: string;       
    resident: {               
        id?: number | string,
        name?: string,
        numberRoom?: number | string
    };
}
export const getResidents = async (): Promise<ApiResident[]> => {
    try{
        const response = await axios.get<ApiResident[]>('http://localhost:8080/public-list')      
        return response.data;
        
    }catch(error){
        console.error(`Error al obtener residentes`, error);
        throw error;
    }
}

export const addVisit = async (visitData: VisitPayload): Promise<string> => {
    try {
        const response = await axios.post<string>(`${URL_BASE}/addVisit`, visitData);
        return response.data; 
    } catch (error) {
        console.error(`Error al agendar la visita: `, error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || "Error desconocido del servidor al agendar visita");
        }
        throw new Error("No se pudo conectar con el servidor para agendar la visita.");
    }

}

export const getAllVisits = async()=>{
    const response = await axios.get(`${URL_BASE}/listVisitors`)
     console.log("INFORMACION DE VISITAS ", response.data.data)
    return response.data.data
}

export const deleteVisit = async(id:number | string)=>{
    return axios.delete(`${URL_BASE}/deleteVisit/${id}`)
}

export const getVisitById = async (id: number | string)=>{
        try {
            const response = await axios.get(`${URL_BASE}/getVisitById/${id}`)
            return response.data
        } catch (error) {
            console.log("ERROR AL OBTENER LOS DATOS DE LA VISTA")
            throw error;
        }
}

export const updateVisit = async (visit: VisitPayload)=>{
    try {
        const response = await axios.post(`${URL_BASE}/updateVisit/${visit.id}`, visit);
        return response.data
    } catch (error) {
        console.log("Error al intentar actualizar la visita")
        throw error;
    }
}

