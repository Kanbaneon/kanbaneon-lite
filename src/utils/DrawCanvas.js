import Konva from "konva";
import * as uuid from "uuid";
import { store } from "./Data.store";

const kanbanList = () =>
  store.kanbanBoards.find((v) => v.id === store.currentBoardID)?.kanbanList;

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

export function addMoreCard(newCard) {
  const foundList = kanbanList().find((v) => v.id === newCard.listId);
  if (!Array.isArray(foundList?.children)) {
    return;
  }

  foundList.children.push({
    id: uuid.v4(),
    text: newCard?.text,
  });
  this.drawFns().initCanvas();
}

export function addMoreList(newList) {
  kanbanList().push({
    id: uuid.v4(),
    name: newList?.name,
    children: [],
  });

  __vue.instance.drawFns().initCanvas();
}

export function deleteList(deletingList) {
  const foundListIndex = kanbanList().findIndex(
    (v) => v.id === deletingList.listId
  );
  if (foundListIndex <= -1) {
    return;
  }

  kanbanList().splice(foundListIndex, 1);
  this.drawFns().initList();
}

export function editList(editingList) {
  const foundList = kanbanList().find((v) => v.id === editingList.listId);
  if (!foundList?.id) {
    return;
  }

  foundList.name = editingList.name;
  this.drawFns().initList();
}

export function deleteCard(deletingCard) {
  const foundList = kanbanList().find((v) => v.id === deletingCard.listId);
  if (!Array.isArray(foundList?.children)) {
    return;
  }

  foundList.children = foundList.children.filter(
    (v) => v.id !== deletingCard.id
  );
  this.drawFns().initList();
}

export function editCard(editingCard) {
  const foundList = kanbanList().find((v) => v.id === editingCard.listId);
  if (!Array.isArray(foundList?.children)) {
    return;
  }

  const foundItem = foundList.children.find((v) => v.id === editingCard.id);
  if (!foundItem?.id) {
    return;
  }

  foundItem.text = editingCard.text;
  this.drawFns().initList();
}

export function initCanvas() {
  __vue.instance = this;

  const width =
    (window.matchMedia("(min-width:1440px)").matches
      ? window.innerWidth
      : 1600) + 20;
  const height = window.innerHeight + 20;

  const largestList = kanbanList()?.length;
  const largestChildren =
    !!largestList && Math.max(...kanbanList().map((v) => v.children?.length));

  __konva.stage = new Konva.Stage({
    container: "canban-canvas",
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
