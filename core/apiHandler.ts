// core/api/apiHandler.ts
import axios from "axios";

export class ApiHandler {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || "";
  }

  async get<T>(endpoint: string, params?: object): Promise<T> {
    const response = await axios.get(`${this.baseUrl}${endpoint}`, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: object): Promise<T> {
    const response = await axios.post(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: object): Promise<T> {
    const response = await axios.put(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await axios.delete(`${this.baseUrl}${endpoint}`);
    return response.data;
  }
}

// Export a default instance with the API URL
export const api = new ApiHandler();
