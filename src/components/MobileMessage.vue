<template>
  <div class="container">
    <MobileAlert />
    <h1>Kanbaneon cannot be used on Mobile Devices.</h1>
    <h5>Please open it on PC browser.</h5>
  </div>
</template>

<script>
import MobileAlert from "../assets/MobileAlert.vue";
export default {
  components: {
    MobileAlert,
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  background: #42b883;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
h1 {
  color: white;
  font-size: 46px;
}
h5 {
  color: white;
  font-size: 16px;
}
a {
  text-decoration: underline;
  color: #35495e;
  font-weight: bold;
}
</style>
