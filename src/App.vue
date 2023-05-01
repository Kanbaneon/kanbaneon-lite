<template>
  <Header v-if="$store.state.user.isLoggedIn && largeScreen" />
  <router-view v-if="largeScreen" />
  <MobileMessage v-if="!largeScreen" />
</template>

<script>
import Header from "./components/Header.vue";
import MobileMessage from "./components/MobileMessage.vue";

export default {
  data() {
    return {
      largeScreen: window.matchMedia("(min-width:1024px)").matches,
      resizeListener: null,
    };
  },
  components: {
    Header,
    MobileMessage,
  },
  methods: {
    handleListenScreen() {
      this.resizeListener = window.addEventListener("resize", () => {
        this.largeScreen = window.matchMedia("(min-width:1024px)").matches;
      });
    },
    handleUnlistenScreen() {
      window.removeEventListener(this.resizeListener);
      this.resizeListener = null;
    },
  },
  watch: {
    "$store.state.user"() {
      return this.$store.state.user;
    },
  },
  async mounted() {
    this.handleListenScreen();
  },
  beforeUnmount() {
    this.handleUnlistenScreen();
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
