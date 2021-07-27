<template>
  <a-card class="header">
    <a-col :span="showNewList ? 18 : 22">
      <h2 class="title" @click="handleDirectHome">
        KAN<span class="subtitle">BANEON</span>
      </h2>
    </a-col>
    <a-col :span="2" v-if="showNewList">
      <a-button
        size="large"
        type="primary"
        class="add-new-btn"
        @click="openModal()"
        ><PlusIcon /><span class="add-new-btn-text">NEW LIST</span></a-button
      >
    </a-col>
    <a-col :span="2" v-if="showNewList">
      <a-button
        style="width: 150px"
        size="large"
        type="primary"
        class="add-new-btn"
        @click="openModalSave"
        ><span class="add-new-btn-text">SAVE</span></a-button
      >
    </a-col>
    <a-col :span="1"></a-col>
    <a-col :span="1"
      ><div class="avatar" :size="64"><UserIcon /></div
    ></a-col>
  </a-card>
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
  <a-modal
    title="Save & Exit"
    :visible="visibleSave"
    @ok="handleOk"
    @cancel="handleCancelSave"
  >
    <p>Do you want to save this board and go back to home page?</p>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancelSave"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleSaveData">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import PlusIcon from "../assets/PlusIcon.vue";
import UserIcon from "../assets/UserIcon.vue";
import { store } from "../utils/Data.store";
import { addMoreList } from "../utils/DrawCanvas";

export default {
  data() {
    return {
      showNewList: false,
      visible: false,
      visibleSave: false,
      name: "",
      error: {
        name: "",
      },
    };
  },
  components: {
    PlusIcon,
    UserIcon,
  },
  watch: {
    $route(to, from) {
      this.handleCheckRoute();
    },
  },
  methods: {
    openModalSave() {
      this.visibleSave = true;
    },
    openModal() {
      this.visible = true;
    },
    async handleSaveData() {
      await store.setToDB();
      this.visibleSave = false;
      this.$router.push("/");
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
    handleCancelSave() {
      this.visibleSave = false;
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
      } else {
        this.showNewList = false;
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

.avatar {
  background: #42b883;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
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
