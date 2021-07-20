<template>
  <div class="canvas-wrapper">
    <div id="canban-canvas"></div>
  </div>
</template>

<script>
import { initCanvas } from "../utils/DrawCanvas";

export default {
  methods: {
    initCanvas,
  },
  mounted() {
    this.initCanvas();
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
.canvas-wrapper {
  width: 100%;
  max-height: 90vh;
  overflow: scroll;
}
</style>

<style>
.konvajs-content {
  background-color: #42b883;
}
</style>
