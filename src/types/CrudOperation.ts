import type {Car} from "@/features/car-management/types/Car";

export const CrudOperations = {
  CREATE: { value: "CREATE", label: "Create" },
  READ: { value: "READ", label: "Done" },
  UPDATE: { value: "UPDATE", label: "Save" },
  DELETE: { value: "DELETE", label: "Delete" }
} as const;

export type CrudOperation = keyof typeof CrudOperations;

export interface CrudRequest {
  operation: CrudOperation;
  payload: Car | number | null;
}