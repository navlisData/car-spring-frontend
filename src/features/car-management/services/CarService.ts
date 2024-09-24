import api from "@/glb-services/api";
import type { Car } from "../types/Car"
import type {CarCreationDto} from "@/features/car-management/types/CarCreationDto";
import type {CarMappingRequest} from "@/features/car-management/types/CarMappingRequest";

export default class CarService {

  static async findAll(): Promise<Car[]> {
    const response = await api.get<Car[]>('/cars');
    return response.data;
  }

  static async deleteCar(car: Car): Promise<number> {
    const response = await api.delete<number>(`/cars/${car.id}`);
    return response.data;
  }

  static async replaceCar(toReplace: Car, replacement: CarCreationDto): Promise<Car | null> {
    const mappingRequest: CarMappingRequest = {
      idOfOldCar: toReplace.id,
      creationDto: replacement
    };

    const response = await api.post<Car | null>('/cars', {
      carCheckMappingRequest: mappingRequest,
    });

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