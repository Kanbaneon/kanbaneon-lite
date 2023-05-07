<template>
  <div class="wrapper">
    <form @submit.prevent="login">
      <a-card class="card">
        <h2 class="title">
          KAN<span class="subtitle">BANEON</span>
          <span class="version"> Lite</span>
        </h2>
        <div class="input-wrapper">
          <a-input v-model:value="username" placeholder="Enter your username" />
          <label class="error-label">{{ error.username }}&nbsp;</label>
          <a-input
            v-if="!isLite"
            v-model:value="password"
            placeholder="Enter your password"
            type="password"
          />
          <label v-if="!isLite" class="error-label"
            >{{ error.password }}&nbsp;</label
          >
        </div>
        <a-button type="primary" size="large" block @click="login($event)"
          >Login</a-button
        >
      </a-card>
    </form>
  </div>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { INDEXED_DB, browserDB } from "../helpers/IndexedDbHelper";
import { getExistingUser } from "../store";

export default {
  data: () => {
    return {
      // @ts-ignore
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      username: "",
      password: "",
      error: { username: "", password: "" },
    };
  },
  methods: {
    async login(e) {
      e.preventDefault();
      let userId = await getExistingUser(this.username);
      if (!userId) {
        userId = v4();
        await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "users", {
          [this.username]: userId,
        });
      }

      this.$store.commit("setUser", {
        username: this.username,
        isLoggedIn: true,
        id: userId,
      });
      this.$router.push("/");
    },
  },
};
</script>

<style lang="css" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.title {
  display: inline;
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
  cursor: pointer;
}

.subtitle {
  color: #35495e;
}

.version {
  font-size: 14px;
}

.card {
  width: 25vw;
}

.input-wrapper {
  margin: 16px 0px;
  width: 100%;
}

.ant-input {
  padding: 8px 8px;
}
</style>

<style>
.card .ant-card-body {
  flex-direction: column;
}
</style>
