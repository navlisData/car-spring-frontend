<script lang="ts">
import { defineComponent } from 'vue';
import CarService from "../services/CarService";
import type { Car } from '../types/Car';

export default defineComponent({
  name: 'CarCreationDialog',

  props: {
    modelValue: {
      type: Boolean,  
      default: false,
    },
  },
  
  data() {
    return {
      brand: '' as string,
      model: '' as string
    };
  },

  methods: {
    updateDialogState(value: boolean) {
      this.$emit('update:modelValue', value);
    },

    async createInstance() {
      if(this.brand.length > 0 && this.model.length > 0) {
        try {
          const createdCar: Car = await CarService.create(this.brand, this.model);
          this.$emit('newCarCreated', createdCar);
        } catch(err) {
          console.error(err);
        } finally {
          this.updateDialogState(false);
        }
      }
    }
  }
});

</script>

<template>
  <Dialog :visible="modelValue" @update:visible="updateDialogState" modal header="Add new car" :style="{ width: '25rem' }">
    
    <div class="flex gap-3 flex-col">
      <InputGroup>
        <InputGroupAddon>
            <i class="pi pi-car"></i>
        </InputGroupAddon>
        <InputText v-model="brand" placeholder="Brand" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
            <i class="pi pi-tag"></i>
        </InputGroupAddon>
        <InputText v-model="model" placeholder="Model" />
      </InputGroup>
 
      <div class="flex justify-between mt-2">
        <Button type="button" label="Cancel" severity="secondary" @click="updateDialogState(false)"></Button>
        <Button type="button" label="Create" @click="createInstance" ></Button>
      </div>
    </div>
    
  </Dialog>
</template>