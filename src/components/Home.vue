<template>
  <div class="container">
    <a-row :gutter="16">
      <a-col :span="6" v-for="board in boards" v-bind:key="board.id">
        <a-card
          class="card"
          :title="board.name"
          @click="handleDirect(board.id)"
        >
          <KanbanImg />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { store } from "../utils/Data.store";
import KanbanImg from "../assets/KanbanImg.vue";
export default {
  data() {
    return { boards: store.kanbanBoards };
  },
  components: {
    KanbanImg,
  },
  methods: {
    handleDirect(id) {
      this.$router.push(`/board/${id}`);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 16px;
  min-height: 90vh;
  background: #42b883;
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
