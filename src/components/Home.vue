<template>
  <div class="container">
    <a-row v-if="boards?.length" :gutter="16">
      <a-col
        class="col"
        :span="6"
        v-for="board in boards"
        v-bind:key="board.id"
      >
        <a-card
          class="card"
          :title="board.name"
          @click="handleDirect(board.id)"
        >
          <KanbanImg />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="add-new-btn-card" @click="visible = true">
          <a-button
            @click="visible = true"
            class="add-new-btn"
            type="primary"
            size="large"
            ><PlusIcon />New Board</a-button
          >
        </a-card>
      </a-col>
    </a-row>
    <div v-if="!boards?.length" class="wrapper">
      <GetStartedImg />
      <a-button
        @click="visible = true"
        class="add-new-btn"
        type="primary"
        size="large"
        >Get Started</a-button
      >
    </div>
  </div>
  <a-modal
    title="Enter the name of new board"
    :visible="visible"
    @ok="handleAddNewBoard"
    @cancel="handleCancelDialog"
  >
    <input
      class="ant-input"
      placeholder="Name"
      v-model="name"
      @change="handleNameChange"
    />
    <label class="error-label">{{ error.name }}</label>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancelDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleAddNewBoard">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { store } from "../utils/Data.store";
import PlusIcon from "../assets/PlusIcon.vue";
import KanbanImg from "../assets/KanbanImg.vue";
import GetStartedImg from "../assets/GetStartedImg.vue";
import * as uuid from "uuid";

export default {
  data() {
    return {
      boards: store.kanbanBoards,
      visible: false,
      name: "",
      error: {
        name: "",
      },
    };
  },
  components: {
    KanbanImg,
    GetStartedImg,
    PlusIcon,
  },
  mounted() {
    this.handleDataSync();
  },
  methods: {
    async handleDataSync() {
      await store.getFromDB();
      this.boards = store.kanbanBoards;
    },
    handleDirect(id) {
      this.$router.push(`/board/${id}`);
    },
    handleNameChange(e) {
      this.name = e.target.value;
      this.error.name = !this.name ? "*required" : "";
    },
    handleCancelDialog() {
      this.name = "";
      this.visible = false;
      this.error.name = "";
    },
    handleAddNewBoard() {
      const newBoard = {
        id: uuid.v4(),
        name: this.name,
        kanbanList: [],
      };
      this.boards.push(newBoard);
      this.handleCancelDialog();

      store.kanbanBoards = JSON.parse(JSON.stringify(this.boards));
      store.setToDB();
    },
  },
};
</script>

<style scoped>
.col {
  padding-bottom: 16px;
}

.add-new-btn-card {
  height: 307px;
  border: 2px dashed rgb(219, 219, 219);
  background: rgba(73, 73, 73, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
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

.container {
  padding: 16px;
  min-height: 90vh;
  background: #42b883;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 80vh;
}

.card {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
