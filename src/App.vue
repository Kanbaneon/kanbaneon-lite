<template>
  <Header />
  <router-view />
</template>

<script>
import { store } from "./utils/Data.store";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    Header: defineAsyncComponent({
      loader: () => import("./components/Header.vue"),
    }),
  },
  async mounted() {
    await store.openDatabase();
    await store.getFromDB();
  },
};
</script>

<style>
.ant-card-body {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-label {
  color: rgb(243, 67, 67);
}
</style>
