import Konva from "konva";
import { kanbanList } from "./Data.mock";
import { initList } from "./DrawList";

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
    id: `L${kanbanList?.length + 5}`,
    name: newList?.name,
    children: [],
  });
  initCanvas();
}

export function initCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const largestList = kanbanList.length;

  const largestChildren = Math.max.apply(
    0,
    kanbanList.map((v) => v.children?.length)
  );

  __konva.stage = new Konva.Stage({
    container: "canban-canvas",
    width: largestList > 5 ? width - 20 + (largestList - 5) * 295 : width - 20,
    height: largestChildren > 3 ? height + (largestChildren - 3) * 180 : height,
    x: 0,
    y: 0,
  });

  __konva.layer = new Konva.Layer();
  __konva.stage.add(__konva.layer);
  __konva.stage.container().style.cursor = "move";

  initList();
}
