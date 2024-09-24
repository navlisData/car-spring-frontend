import type {CarCreationDto} from "@/features/car-management/types/CarCreationDto";


export interface CarMappingRequest {
  idOfOldCar: number;
  creationDto: CarCreationDto;
}