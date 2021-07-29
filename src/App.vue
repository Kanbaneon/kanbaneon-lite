<template>
  <Header />
  <router-view />
</template>

<script>
import { store } from "./utils/Data.store";
import Header from "./components/Header.vue";

export default {
  components: {
    Header,
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
