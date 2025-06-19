import axios from "axios";
import type { PricesResponse, Stats } from "./types";

const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

const api = {
  async getPrices(
    period?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PricesResponse> {
    const params: Record<string, string> = {};

    if (period) params.period = period;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get("/bitcoin/prices", { params });
    return response.data;
  },

  async getLatestPrice() {
    const response = await apiClient.get("/bitcoin/latest");
    return response.data;
  },

  async getStats(period?: string): Promise<Stats> {
    const params: Record<string, string> = {};
    if (period) params.period = period;

    const response = await apiClient.get("/bitcoin/stats", { params });
    return response.data;
  },
};

export default api;
