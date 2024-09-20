<script lang="ts">
import type { Car } from "../types/Car";
import CarService from "../services/CarService";

import CarCreationDialog from "./CarCreationDialog.vue"
import { defineComponent } from 'vue';

type SizeOption = 'small' | 'large' | undefined ;

export default defineComponent({
  name: 'CarListView',
  components: {
    CarCreationDialog
  },
  
  data() {
    return {
      dialogVisibility: false,

      cars: [] as Car[],
      carsLoading: false as boolean,
      
      size: { label: 'Normal', value: 'null' as SizeOption },
      sizeOptions: [
          { label: 'Small', value: 'small' as SizeOption },
          { label: 'Normal', value:  undefined as SizeOption },
          { label: 'Large', value: 'large' as SizeOption }
      ]
    };
  },
      
  created() {
    this.fetchCars();
  },

  methods: {
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

    formatIsoString(dateAsString: string) {
      const date = new Date(dateAsString);
      return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
});

</script>

<template>
  <Toast />
  <CarCreationDialog v-model="dialogVisibility" @newCarCreated="(car) => cars.push(car)" />

  <div class="flex flex-col gap-3" >
    <h1 class="text-3xl mb-4">Cardealership - Spring demo</h1>

    <div class="flex gap-2">
      <Button label="Create" icon="pi pi-plus" iconPos="right" @click="dialogVisibility = true" outlined />
      <Button label="Refresh" icon="pi pi-refresh" iconPos="right" @click="fetchCars" severity="secondary" outlined />

      <div class="ml-auto">
        <SelectButton v-model="size" :options="sizeOptions" optionLabel="label" dataKey="label" />
      </div>
    </div>

    <div class="flex justify-center">
      <ProgressSpinner v-if="carsLoading"/>
    </div>

    <DataTable :size="size.value" stripedRows :value="cars" tableStyle="min-width: 50rem">
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