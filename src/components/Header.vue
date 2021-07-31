<template>
  <a-card class="header">
    <a-col :span="showNewList ? [17] : [21]">
      <h2 class="title" @click="handleDirectHome">
        KAN<span class="subtitle">BANEON</span>
      </h2>
    </a-col>
    <a-col :span="2" v-if="showNewList && largeScreen">
      <a-button
        size="large"
        type="primary"
        class="add-new-btn"
        @click="openModal()"
        ><PlusIcon /><span class="add-new-btn-text">NEW LIST</span></a-button
      >
    </a-col>
    <a-col :span="2" v-if="showNewList && largeScreen">
      <a-button
        style="width: 150px"
        size="large"
        type="primary"
        class="add-new-btn"
        @click="openModalSave"
        ><span class="add-new-btn-text">SAVE</span></a-button
      >
    </a-col>
    <a-col :span="[21, 1]" class="icon-btn-wrapper">
      <div
        class="icon-btn"
        v-if="showNewList"
        shape="round"
        @click="largeScreen ? (visibleEditBoard = true) : (popupMenu = true)"
      >
        <DotsIcon />
      </div>
    </a-col>
    <a-col :span="[24, 1]"
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
    title="Edit board"
    :visible="visibleEditBoard"
    @ok="handleOkEditBoard"
    @cancel="handleCancelEditBoard"
  >
    <input
      class="ant-input"
      placeholder="Name"
      v-model="boardDialog.editingBoard.name"
      @change="handleBoardNameChange"
    />
    <label class="error-label">{{ boardDialog.error.name }}</label>
    <template v-slot:footer>
      <a-button class="btn-danger" type="danger" @click="handleDeleteBoard"
        >Delete</a-button
      >
      <a-button key="back" @click="handleCancelEditBoard"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkEditBoard">
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
import DotsIcon from "../assets/DotsIcon.vue";
import UserIcon from "../assets/UserIcon.vue";
import { store } from "../utils/Data.store";
import { addMoreList } from "../utils/DrawCanvas";

export default {
  data() {
    return {
      smallScreen: window.matchMedia("(max-width:456px)").matches,
      largeScreen: window.matchMedia("(min-width:456px)").matches,
      showNewList: false,
      visible: false,
      visibleSave: false,
      visibleEditBoard: false,
      name: "",
      error: {
        name: "",
      },
      currentBoard: {},
      boardDialog: {
        editingBoard: {
          name: "",
        },
        error: {
          name: "",
        },
      },
    };
  },
  components: {
    PlusIcon,
    UserIcon,
    DotsIcon,
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
    async handleOkEditBoard() {
      const currentBoardIndex = store.kanbanBoards.findIndex(
        (v) => v.id === store.currentBoardID
      );
      store.kanbanBoards[currentBoardIndex].name =
        this.boardDialog.editingBoard.name;

      this.currentBoard = store.kanbanBoards[currentBoardIndex];
      this.handleCancelEditBoard();
    },
    async handleDeleteBoard() {
      store.kanbanBoards = store.kanbanBoards.filter(
        (v) => v.id !== this.currentBoard.id
      );
      await store.setToDB();
      this.$router.push("/");
      this.handleCancelEditBoard();
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
    handleBoardNameChange(e) {
      this.boardDialog.editingBoard.name = e.target.value;
      this.boardDialog.error.name = !this.boardDialog.editingBoard.name
        ? "*required"
        : "";
    },
    handleCancelSave() {
      this.visibleSave = false;
    },
    handleCancelEditBoard() {
      this.visibleEditBoard = false;
      this.boardDialog = {
        editingBoard: {
          name: this.currentBoard.name,
        },
        error: {
          name: "",
        },
      };
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
        this.currentBoard = store.kanbanBoards.find(
          (v) => v.id === store.currentBoardID
        );
        this.boardDialog.editingBoard = {
          name: this.currentBoard?.name,
        };
      } else {
        this.showNewList = false;
      }
    },
  },
};
</script>

<style scoped>
.icon-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-btn {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.icon-btn:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

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
  height: 60px;
  width: 60px;
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

.btn-danger {
  background: #ef180c;
  color: white;
}
</style>

<style>
.header .ant-card-body {
  width: 100%;
  display: flex;
}
</style>
