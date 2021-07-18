<template>
  <Header />
  <Canvas />
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
}
</style>
