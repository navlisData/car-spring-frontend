<script lang="ts">
import type { Car } from "../types/Car";
import CarService from "../services/CarService";

import CarCreationDialog from "./CarCrudDialog.vue"
import { defineComponent } from 'vue';
import {CrudOperations, type CrudRequest} from "@/types/CrudOperation";
import type {CarCreationDto} from "@/features/car-management/types/CarCreationDto";
import type ContextMenu from "primevue/contextmenu";

type SizeOption = 'small' | 'large' | undefined ;

interface RowContextMenuEvent {
  originalEvent: MouseEvent;
  data: any;
}

export default defineComponent({
  name: 'CarListView',
  components: {
    CarCreationDialog
  },
  
  data() {
    return {
      crudRequest: null as CrudRequest | null,
      dialogVisibility: false,

      cars: [] as Car[],
      carsLoading: false as boolean,
      
      size: { label: 'Normal', value: 'null' as SizeOption },
      sizeOptions: [
          { label: 'Small', value: 'small' as SizeOption },
          { label: 'Normal', value:  undefined as SizeOption },
          { label: 'Large', value: 'large' as SizeOption }
      ],

      selectedCar: null as Car | null,
      menuModel: [
        { label: 'Create', icon: 'pi pi-fw pi-plus', command: () => this.createCar() },
        { separator: true },
        { label: 'Edit', icon: 'pi pi-fw pi-pen-to-square', command: () => this.editCar(this.selectedCar) },
        { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.deleteCar(this.selectedCar) }
      ]
    };
  },
      
  created() {
    this.fetchCars();
  },

  methods: {
    handleCrudOperations(crudRequest: CrudRequest) {
      switch (crudRequest.operation) {
        case CrudOperations.CREATE.value:
          this.cars.push(crudRequest.payload as Car);
          break;
        case CrudOperations.UPDATE.value:
          const car: Car | undefined = this.cars.find(car => car.id === (crudRequest.payload as Car).id);

          if(car) {
            (car as Car).brand = (crudRequest.payload as Car).brand;
            (car as Car).model = (crudRequest.payload as Car).model;
          }
          break;
        case CrudOperations.DELETE.value:
          this.deleteCar(crudRequest.payload as Car);
          break;
      }
    },

    async fetchCars() {
      this.carsLoading = true;
      try {
        this.cars = await CarService.findAll();
      } catch(err) {
        console.error(err);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed fetching cars', life: 3000 });
      } finally {
        this.carsLoading = false;
      }
    },

    createCar() {
      const crudRequest = {
        operation: CrudOperations.CREATE.value,
        payload: null
      };
      this.openDialog(crudRequest);
    },

    editCar(carToEdit: Car) {
      const crudRequest = {
        operation: CrudOperations.UPDATE.value,
        payload: carToEdit
      };
      this.openDialog(crudRequest);
    },

    async deleteCar(carToRemove: Car) {
      this.cars = this.cars.filter(car => car.id !== carToRemove.id);
    },

    openDialog(crudRequest: CrudRequest) {
      this.crudRequest = crudRequest;
      this.dialogVisibility = true;
    },

    formatIsoString(dateAsString: string) {
      const date = new Date(dateAsString);
      return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    onRowContextMenu(event: RowContextMenuEvent) {
      const contextMenu = this.$refs.cm as InstanceType<typeof ContextMenu>;
      contextMenu.show(event.originalEvent);
    }
  }
});

</script>

<template>
  <Toast />
  <CarCreationDialog v-if="crudRequest"  v-model="dialogVisibility" @crud-action="handleCrudOperations" :request="crudRequest"/>

  <div class="flex flex-col gap-3" >
    <h1 class="text-3xl mb-4">Cardealership - Spring demo</h1>

    <div class="flex gap-2">
      <Button label="Create" icon="pi pi-plus" iconPos="right" @click="createCar" outlined />
      <Button label="Refresh" icon="pi pi-refresh" iconPos="right" @click="fetchCars" severity="secondary" outlined />

      <div class="ml-auto">
        <SelectButton v-model="size" :options="sizeOptions" optionLabel="label" dataKey="label" />
      </div>
    </div>

    <div class="flex justify-center">
      <ProgressSpinner v-if="carsLoading"/>
    </div>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedCar = null" />
    <DataTable :size="size.value" stripedRows :value="cars" v-model:contextMenuSelection="selectedCar" @rowContextmenu="onRowContextMenu"  tableStyle="min-width: 50rem">
      <template class="flex" #empty>No cars found</template>
      <Column field="brand" header="Brand"></Column>
      <Column field="model" header="Model"></Column>
      <Column field="date" header="Created" >
        <template #body="slotProps">
          {{ formatIsoString(slotProps.data.date) + " Uhr" }}
        </template>
      </Column>
    </DataTable>
  </div>

</template>