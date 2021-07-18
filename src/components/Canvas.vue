<template>
  <div id="canban-canvas"></div>
</template>

<script>
import { initCanvas, initList } from "../utils/DrawCanvas";

export default {
  methods: {
    initCanvas,
    initList,
  },
  mounted() {
    this.initCanvas();
    this.initList();
  },
};
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}
.subtitle {
  color: #35495e;
}
</style>
