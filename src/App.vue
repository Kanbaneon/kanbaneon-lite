<template>
  <Header v-if="largeScreen" />
  <router-view v-if="largeScreen" />
  <MobileMessage v-if="smallScreen" />
</template>

<script>
import { store } from "./utils/Data.store";
import Header from "./components/Header.vue";
import MobileMessage from "./components/MobileMessage.vue";

export default {
  data() {
    return {
      smallScreen: window.matchMedia("(max-width:1024px)").matches,
      largeScreen: window.matchMedia("(min-width:1024px)").matches,
    };
  },
  components: {
    Header,
    MobileMessage,
  },
  async mounted() {
    await store.openDatabase();
    await store.getFromDB();
  },
};
</script>

<style>
body {
  background-color: #42b883 !important;
}

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
