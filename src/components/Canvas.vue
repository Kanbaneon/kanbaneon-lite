<template>
  <div class="canvas-wrapper">
    <div id="canban-canvas"></div>
  </div>
  <a-modal
    title="Enter the message of new item"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <textarea class="ant-input" placeholder="Type here..." v-model="message" />
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal
    :title="cardDialog.title"
    :visible="cardDialog.visible"
    @ok="handleOkCardDialog"
    @cancel="handleCancelCardDialog"
  >
    <textarea
      class="ant-input edit-card-textarea"
      placeholder="Type here..."
      v-model="cardDialog.editingCard.text"
    />
    <template v-slot:footer>
      <a-button class="btn-danger" type="danger" @click="handleDeleteCard"
        >Delete</a-button
      >
      <a-button key="back" @click="handleCancelCardDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkCardDialog">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  initCanvas,
  addMoreCard,
  addMoreList,
  editCard,
  deleteCard,
} from "../utils/DrawCanvas";
import { initList } from "../utils/DrawList";
import { initListItem } from "../utils/DrawListItem";
import getAddButton from "../utils/DrawAddButton";
import getCard from "../utils/DrawCard";
import getTile from "../utils/DrawTile";

export default {
  data() {
    return {
      visible: false,
      message: "",
      addingList: null,
      cardDialog: {
        editingCard: {
          text: "",
        },
      },
    };
  },
  methods: {
    drawFns() {
      return {
        initCanvas: initCanvas.bind(this),
        initList: initList.bind(this),
        initListItem: initListItem.bind(this),
        getAddButton: getAddButton.bind(this),
        getCard: getCard.bind(this),
        getTile: getTile.bind(this),
      };
    },
    addMoreCard,
    addMoreList,
    editCard,
    deleteCard,
    handleCancel() {
      this.visible = false;
      this.message = "";
    },
    handleCancelCardDialog() {
      this.cardDialog = {
        editingCard: {
          text: "",
        },
      };
    },
    handleOk() {
      const newCard = { listId: this.addingList?.id, text: this.message };
      this.addMoreCard(newCard);
      this.handleCancel();
    },
    handleOkCardDialog() {
      const editingCard = {
        id: this.cardDialog.editingCard.id,
        listId: this.cardDialog.editingCard.parentList.id,
        text: this.cardDialog.editingCard.text,
      };
      this.editCard(editingCard);
      this.handleCancelCardDialog();
    },
    handleDeleteCard() {
      const deletingCard = {
        id: this.cardDialog.editingCard.id,
        listId: this.cardDialog.editingCard.parentList.id,
      };
      this.deleteCard(deletingCard);
      this.handleCancelCardDialog();
    },
  },
  mounted() {
    this.drawFns().initCanvas();
  },
};
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}
.subtitle {
  color: #35495e;
}
.canvas-wrapper {
  width: 100%;
  max-height: 90vh;
  overflow: scroll;
}
.edit-card-textarea {
  margin-bottom: 10px;
}
.btn-danger {
  background: #ef180c;
  color: white;
}
</style>

<style>
.konvajs-content {
  background-color: #42b883;
}
</style>
