import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/inventory";

export interface PrioritizedProduct {
  productId: number;
  productName: string;
  category: string;
  stockActual: number;
  consumosUltimos30d: number;
  demandaProyectada30d: number;
  diasParaVencimiento: number | null;
  fechaVencimiento: string | null;
  factorVencimiento: number;
  factorCategoria: number;
  factorRotacion: number;
  factorStockBajo: number;
  factorDemandaMedica: number;
  priorityScore: number;
  level: string;
}

export interface PredictionResult {
  productId: number;
  productName: string;
  category: string;
  stockActual: number;
  movingAverage: number;
  exponentialSmoothing: number;
  trend: number;
  projectedDaily: number;
  projectedTotal: number;
  horizonDays: number;
  riskOfStockout: boolean;
  daysUntilStockout: number;
}

export interface Alert {
  type: string;
  productId: number;
  productName: string;
  category: string;
  stockActual: number;
  severity: string;
  message: string;
  expirationDate?: string;
  daysUntilExpiration?: number;
  demandaProyectada30d?: number;
}

export const getPrioritizedProducts = async (): Promise<PrioritizedProduct[]> => {
  const res = await axios.get(`${BASE_URL}/prioritized`);
  return res.data.products || [];
};

export const getPrediction = async (productId: number, futureDays: number = 30): Promise<PredictionResult> => {
  const res = await axios.get(`${BASE_URL}/prediction/${productId}?futureDays=${futureDays}`);
  return res.data;
};

export const getAlerts = async (): Promise<Alert[]> => {
  const res = await axios.get(`${BASE_URL}/alerts`);
  return res.data.alerts || [];
};

export const recordExit = async (inventoryId: number, reason: string, performedBy: number = 0): Promise<void> => {
  await axios.post(`${BASE_URL}/exit`, { inventoryId, reason, performedBy });
};

export const recordBulkExit = async (inventoryIds: number[], reason: string, performedBy: number = 0): Promise<void> => {
  await axios.post(`${BASE_URL}/bulk-exit`, { inventoryIds, reason, performedBy });
};

export const getMovements = async (productId?: number): Promise<any[]> => {
  const params = productId ? `?productId=${productId}` : '';
  const res = await axios.get(`${BASE_URL}/movements${params}`);
  return res.data.movements || [];
};
