import Konva from "konva";
import * as uuid from "uuid";

const __vue = {
  instance: null,
};

export const __konva = {
  stage: null,
  layer: null,
};

export const __dnd = {
  list: null,
  item: null,
};

export function addMoreCard({ listId, text }) {
  const newCard = {
    id: uuid.v4(),
    text: text,
  };
  this.$store.commit("addKanbanCard", { listId, newCard });
  this.drawFns().initCanvas();
}

export function addMoreList(newList) {
  const addingList = {
    id: uuid.v4(),
    name: newList?.name,
    children: [],
  };
  this.$store.commit("addKanbanList", addingList);
  __vue.instance.drawFns().initCanvas();
}

export function deleteList(deletingList) {
  this.$store.commit("deleteKanbanList", deletingList);
  this.drawFns().initList();
}

export function editList(editingList) {
  this.$store.commit("editKanbanList", editingList);
  this.drawFns().initList();
}

export function deleteCard(deletingCard) {
  this.$store.commit("deleteKanbanCard", deletingCard);
  this.drawFns().initList();
}

export function editCard(editingCard) {
  this.$store.commit("editKanbanCard", editingCard);
  this.drawFns().initList();
}

export function initCanvas() {
  __vue.instance = this;

  const width =
    (window.matchMedia("(min-width:1440px)").matches
      ? window.innerWidth
      : 1600) + 20;
  const height = window.innerHeight + 20;

  const largestList = this.$store.getters.kanbanList?.length;
  const largestChildren =
    !!largestList &&
    Math.max(...this.$store.getters.kanbanList.map((v) => v.children?.length));

  __konva.stage = new Konva.Stage({
    container: "kanbaneon-canvas",
    width: largestList > 4 ? width + (largestList - 4) * 295 : width,
    height: largestChildren > 3 ? height + (largestChildren - 3) * 180 : height,
    x: 0,
    y: 0,
  });

  __konva.layer = new Konva.Layer();
  __konva.stage.add(__konva.layer);
  __konva.stage.container().style.cursor = "move";

  this.drawFns().initList();
}
