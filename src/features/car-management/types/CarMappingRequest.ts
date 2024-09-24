import type {CarCreationDto} from "@/features/car-management/types/CarCreationDto";


export interface CarMappingRequest {
  carToReplaceId: number;
  replacement: CarCreationDto;
}