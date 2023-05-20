<template>
  <a-card class="header">
    <a-col
      :md="showNewList ? 14 : 18"
      :xl="showNewList ? 15 : 19"
      :xxl="showNewList ? 17 : 21"
    >
      <h2 class="title" @click="handleDirectHome">
        KAN<span class="subtitle">BANEON</span>
      </h2>
    </a-col>
    <a-col :xl="3" :md="4" :xxl="2" v-if="showNewList && largeScreen"></a-col>
    <a-col :xl="3" :md="4" :xxl="2" v-if="showNewList && largeScreen">
      <a-button
        style="width: 150px"
        size="large"
        type="primary"
        class="add-new-btn"
        @click="openModalSave"
        ><span class="add-new-btn-text">SAVE</span></a-button
      >
    </a-col>
    <a-col :span="1" class="icon-btn-wrapper">
      <div
        class="icon-btn"
        v-if="showNewList"
        shape="round"
        @click="largeScreen ? (visibleEditBoard = true) : (popupMenu = true)"
      >
        <DotsIcon />
      </div>
    </a-col>
    <a-col :span="1" v-if="$store.state.user.isLoggedIn">
      <a-popover :title="$store.state.user.username" trigger="click">
        <template #content>
          <p><a-button block @click="logout">Logout</a-button></p>
        </template>
        <div class="avatar" :size="64"><UserIcon /></div>
      </a-popover>
    </a-col>
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
  <h3>
    <a-breadcrumb>
      <a-breadcrumb-item><a href="/">Home</a></a-breadcrumb-item>
      <a-breadcrumb-item>{{ currentBoard.name }}</a-breadcrumb-item>
    </a-breadcrumb>
  </h3>
</template>

<script>
import PlusIcon from "../assets/PlusIcon.vue";
import DotsIcon from "../assets/DotsIcon.vue";
import UserIcon from "../assets/UserIcon.vue";
import { addMoreList } from "../utils/DrawCanvas";

export default {
  data() {
    return {
      smallScreen: window.matchMedia("(max-width:456px)").matches,
      largeScreen: window.matchMedia("(min-width:456px)").matches,
      showNewList: this.$route.matched?.[0]?.path === "/board/:id",
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
    async $route(to, from) {
      await this.handleCheckRoute();
    },
  },
  mounted() {
    this.handleCheckRoute();
  },
  methods: {
    openModalSave() {
      this.visibleSave = true;
    },
    openModal() {
      this.visible = true;
    },
    async logout() {
      this.$store.commit("setUser", {
        isLoggedIn: false,
        username: "",
        id: undefined,
      });
      this.$router.push("/login");
    },
    async handleSaveData() {
      this.visibleSave = false;
      this.$router.push("/");
    },
    handleDirectHome() {
      this.$router.push("/");
    },
    async handleOkEditBoard() {
      this.currentBoard.name = this.boardDialog.editingBoard.name;
      this.$store.commit("editKanbanBoard", this.boardDialog.editingBoard);
      this.handleCancelEditBoard();
    },
    async handleDeleteBoard() {
      this.$store.commit(
        "deleteKanbanBoard",
        this.$store.getters.currentBoardID
      );
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
    async handleCheckRoute() {
      if (this.$route.matched?.[0]?.path === "/board/:id") {
        this.showNewList = true;
        this.$store.commit("setCurrentBoardID", this.$route?.params?.id);
        this.currentBoard = (this.$store.getters.currentBoards ?? []).find(
          (v) => v.id === this.$store.state.currentBoardID
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
h3 {
  padding-left: 8px;
  margin: 0px;
}
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
