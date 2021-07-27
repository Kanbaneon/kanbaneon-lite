<template>
  <a-card class="header">
    <a-col :span="showNewList ? 20 : 24">
      <h2 class="title" @click="handleDirectHome">
        KAN<span class="subtitle">BANEON</span>
      </h2>
    </a-col>
    <a-col :span="4" v-if="showNewList">
      <a-button
        size="large"
        type="primary"
        class="add-new-btn"
        @click="openModal()"
        ><PlusIcon /><span class="add-new-btn-text">NEW LIST</span></a-button
      >
    </a-col></a-card
  >
  <a-modal
    title="Enter the name of new list"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <input
      class="ant-input"
      placeholder="Name"
      v-model="name"
      @change="handleNameChange"
    />
    <label class="error-label">{{ error.name }}</label>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import PlusIcon from "../assets/PlusIcon.vue";
import { store } from "../utils/Data.store";
import { addMoreList } from "../utils/DrawCanvas";

export default {
  data() {
    return {
      showNewList: false,
      visible: false,
      name: "",
      error: {
        name: "",
      },
    };
  },
  components: {
    PlusIcon,
  },
  watch: {
    $route(to, from) {
      this.handleCheckRoute();
    },
  },
  methods: {
    openModal() {
      this.visible = true;
    },
    handleDirectHome() {
      this.$router.push("/");
    },
    handleOk() {
      if (!this.name) {
        return (this.error.name = !this.name ? "*required" : "");
      }

      const addingList = { name: this.name };
      addMoreList(addingList);
      this.handleCancel();
    },
    handleNameChange(e) {
      this.name = e.target.value;
      this.error.name = !this.name ? "*required" : "";
    },
    handleCancel() {
      this.name = "";
      this.error.name = "";
      this.visible = false;
    },
    handleCheckRoute() {
      if (this.$route.matched?.[0]?.path === "/board/:id") {
        this.showNewList = true;
        store.currentBoardID = this.$route?.params?.id;
      }
    },
  },
};
</script>

<style scoped>
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

.add-new-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 500;
  height: 46px;
  padding: 20px;
}
</style>

<style>
.header .ant-card-body {
  width: 100%;
  display: flex;
}
</style>
