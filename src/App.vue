<script lang="ts">
  import CarListView from "@/features/car-management/components/CarListView.vue";
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'App',
    components: {
      CarListView
    }
});
</script>

<template>
  <main>
    <CarListView/>
  </main>
</template>
