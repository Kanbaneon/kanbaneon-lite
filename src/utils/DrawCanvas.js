import Konva from "konva";
import { kanbanList } from "./Data.mock";
import { initList } from "./DrawList";
import * as uuid from "uuid";

export const __konva = {
  stage: null,
  layer: null,
};

export const __dnd = {
  list: null,
  item: null,
};

export function addMoreList(newList) {
  kanbanList.push({
    id: uuid.v4(),
    name: newList?.name,
    children: [],
  });
  initCanvas();
}

export function initCanvas() {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 115;

  const largestList = kanbanList.length;
  const largestChildren = Math.max(
    ...kanbanList.map((v) => v.children?.length)
  );

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

  initList();
}
