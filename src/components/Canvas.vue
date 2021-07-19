<template>
  <div id="canban-canvas"></div>
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
</style>
