import type {Car} from "@/features/car-management/types/Car";

export const CrudOperations = {
  CREATE: { value: "CREATE", label: "Create", dialogHeader: "Create car" },
  READ: { value: "READ", label: "Done", dialogHeader: "View car information" },
  UPDATE: { value: "UPDATE", label: "Save", dialogHeader: "Update car" },
  DELETE: { value: "DELETE", label: "Delete", dialogHeader: "Delete car" }
} as const;

export type CrudOperation = keyof typeof CrudOperations;

export interface CrudRequest {
  operation: CrudOperation;
  payload: Car | number | null;
}