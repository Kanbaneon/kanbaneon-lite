<template>
  <Header />
  <router-view />
</template>

<script>
import Header from "./components/Header.vue";
import Canvas from "./components/Canvas.vue";

export default {
  components: {
    Header,
    Canvas,
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
