import api from "@/glb-services/api";
import type { Car } from "../types/Car"

export default class CarService {
  static async findAll(): Promise<Car[]> {
    const response = await api.get<Car[]>('/cars');
    
    return response.data;
  }
  
  static async create(brand: string, model: string): Promise<Car> {
    const response = await api.put<Car>('/car', {
      brand: brand,
      model: model
    });
    
    return response.data;
  }
}