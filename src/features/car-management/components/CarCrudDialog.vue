<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import CarService from "../services/CarService";
import type { Car } from '../types/Car';
import {CrudOperations, type CrudRequest} from "@/types/CrudOperation";
import type {CarCreationDto} from "@/features/car-management/types/CarCreationDto";

export default defineComponent({
  name: 'CarCreationDialog',

  props: {
    request: {
      type: Object as PropType<CrudRequest>,
      required: true
    },

    modelValue: {
      type: Boolean,  
      default: false,
    },
  },
  
  data() {
    return {
      brand: '' as string,
      brandError: false as boolean,

      model: '' as string,
      modelError: false as boolean,
    };
  },

  watch: {
    request(value) {
      if(value.payload !== null) {
        this.brand = (value.payload as Car).brand;
        this.model = (value.payload as Car).model;
      } else {
        this.brand = '';
        this.model = '';
      }
    }
  },

  computed: {
    getHeaderText(): string {
      return CrudOperations[this.request.operation].dialogHeader;
    },

    getConfirmButtonLabel(): string {
      return CrudOperations[this.request.operation].label;
    },

    setTextFieldReadonly(): boolean {
      return this.request.operation === CrudOperations.READ.value;
    }
  },

  methods: {
    setDialogVisible(value: boolean) {
      this.$emit('update:modelValue', value);
    },

    async confirmAction() {
      if(this.request.operation === CrudOperations.CREATE.value || this.request.operation === CrudOperations.UPDATE.value) {
        this.brandError = this.brand.length <= 0;
        this.modelError = this.model.length <= 0;
      }

      if(!(this.brandError || this.modelError)) {
        try {
          switch (this.request.operation) {
            case CrudOperations.CREATE.value:
              const createdCar: Car = await CarService.create(this.brand, this.model);
              this.request.payload = createdCar;
              this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully created car', life: 3000 });
              break;
            case CrudOperations.UPDATE.value:
              const replacement: CarCreationDto = { brand: this.brand, model: this.model };
              const newInstance = await CarService.replaceCar(this.request.payload as Car, replacement);

              if(newInstance) {
                this.request.payload = newInstance;
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated car', life: 3000 });
              } else {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Operation failed', life: 3000 });
              }
              break;
            case CrudOperations.DELETE.value:
              await this.deleteCar(this.request.payload as Car);
              this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully deleted car', life: 3000 });
              break;
          }
          this.$emit('crud-action', this.request);
        } catch (err) {
          // TODO:
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Operation failed', life: 3000 });
          console.error(err);
        } finally {
          this.setDialogVisible(false);
        }
      }
    },

    async deleteCar(car: Car) {
      try {
        const crudRequest: CrudRequest = {
          operation: CrudOperations.DELETE.value,
          payload: car
        };

        this.request.payload = await CarService.deleteCar(car);
        this.$emit('crud-action', crudRequest);
        this.setDialogVisible(false);
      } catch (err) {
        console.error(err);
      }
    }
  }
});

</script>

<template>
  <Toast />
  <Dialog :visible="modelValue" @update:visible="setDialogVisible" modal :header="getHeaderText" :style="{ width: '25rem' }">
    
    <div class="flex gap-3 flex-col">
      <InputGroup>
        <InputGroupAddon>
            <i class="pi pi-car"></i>
        </InputGroupAddon>
        <InputText v-model="brand" placeholder="Brand" :invalid="brandError" :disabled="setTextFieldReadonly" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
            <i class="pi pi-tag"></i>
        </InputGroupAddon>
        <InputText v-model="model" placeholder="Model" :invalid="modelError" :disabled="setTextFieldReadonly"/>
      </InputGroup>

      <div class="flex justify-between mt-2">
        <div class="flex gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="setDialogVisible(false)"></Button>
          <Button type="button" label="Delete" severity="danger" @click="deleteCar(request.payload as Car)" v-if="request.payload instanceof Car"></Button>
        </div>

        <Button type="button" @click="confirmAction" >{{getConfirmButtonLabel}}</Button>
      </div>
    </div>
    
  </Dialog>
</template>