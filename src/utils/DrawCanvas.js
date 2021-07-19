import Konva from "konva";
import { mockData } from "./Data.mock";

const __konva = {
  stage: null,
  layer: null,
};

const __dnd = {
  dragmove: null,
};

export function initCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight - 100;

  const largestChildren = Math.max.apply(
    0,
    mockData.map((v) => v.children?.length)
  );

  __konva.stage = new Konva.Stage({
    container: "canban-canvas",
    width: width - 20,
    height: largestChildren > 4 ? height + (largestChildren - 4) * 180 : height,
    x: 0,
    y: 0,
  });

  __konva.layer = new Konva.Layer();
  __konva.stage.add(__konva.layer);
  __konva.stage.container().style.background = "#42b883";
  __konva.stage.container().style.cursor = "move";

  initList();
}

function searchIntersection(r2) {
  const allRects = __konva.stage
    .find("Rect")
    .filter(
      (rect) =>
        !!rect.attrs.id &&
        rect.attrs.id.includes("LIST-") &&
        !rect.attrs.id.includes("CARD-")
    );

  const collided = allRects.filter((r1) => {
    if (
      r1 !== r2 &&
      !r2.attrs.id.includes(r1.attrs.id) &&
      !(
        r2.position().x > r1.x() + r1.width() - 200 ||
        r2.position().x + r2.width() - 200 < r1.x() ||
        r2.position().y > r1.y() + r1.height() ||
        r2.position().y + r2.height() < r1.y()
      )
    ) {
      return true;
    }
  });
  return collided[0];
}

function initListItem(list, x, e) {
  const standardRect = new Konva.Rect({
    x: x + 10,
    fill: "#35495e",
    height: 180,
    width: 275,
    cornerRadius: 8,
    shadowBlur: 1,
    draggable: true,
  });

  const standardText = new Konva.Text({
    text: "",
    fontSize: 18,
    fill: "white",
    x: x + 20,
  });

  let yCount = 70;

  const existingCards = __konva.stage
    .find("Rect")
    .filter(
      (v) => !!v.attrs.id && v.attrs.id.includes(`LIST-${list?.id}-CARD-`)
    );

  existingCards.forEach((v) => v.destroy());

  list.children.forEach((card) => {
    const cardRect = standardRect.clone();
    cardRect.id(`LIST-${list?.id}-CARD-${card?.id}`);
    cardRect.y(yCount);

    const titleText = standardText.clone();
    titleText.text(card?.text);
    titleText.y(yCount + 10);

    cardRect.on("dragmove", (e) => {
      e.target.moveToTop();
      titleText.moveToTop();

      const { x, y } = e.target.position();
      titleText.x(x + 20);
      titleText.y(y + 10);

      const dragOverList = searchIntersection(e.target);
      __dnd.dragmove = dragOverList;
    });

    cardRect.on("dragend", (e) => {
      const dragOverList = __dnd.dragmove;
      if (!!dragOverList) {
        const foundItem = mockData.find(
          (data) =>
            data?.id.toString() === dragOverList?.attrs?.id.split("LIST-")[1]
        );

        const parentItem = mockData.find((data) => data?.id === list?.id);

        if (
          !!parentItem &&
          parentItem.children.map((v) => v.id).includes(card.id)
        ) {
          parentItem.children = parentItem.children.filter(
            (v) => v.id !== card.id
          );
          if (parentItem.children.length <= 4) {
            initCanvas();
          }
          initListItem(parentItem, x);
        }

        if (
          !!foundItem &&
          !foundItem.children.map((v) => v.id).includes(card.id)
        ) {
          foundItem.children.push(card);
          if (foundItem.children.length > 4) {
            initCanvas();
          }
          cardRect.destroy();
          titleText.destroy();
          initListItem(foundItem, dragOverList.x());
        }
      }
      __dnd.dragmove = null;
    });

    yCount = yCount + 190;

    __konva.layer.add(cardRect);
    __konva.layer.add(titleText);
  });
}

export function initList() {
  const height = window.innerHeight - 100;

  const largestChildren = Math.max.apply(
    0,
    mockData.map((v) => v.children?.length)
  );
  const standardRect = new Konva.Rect({
    y: 10,
    fill: "#FFFFFF",
    height:
      largestChildren > 4
        ? height - 20 + (largestChildren - 4) * 180
        : height - 20,
    width: 295,
    cornerRadius: 8,
    shadowBlur: 1,
  });

  const standardTitleRect = new Konva.Rect({
    y: 10,
    fill: "#F0F0F0",
    height: 50,
    width: 295,
    cornerRadius: [8, 8, 0, 0],
  });

  const standardText = new Konva.Text({
    text: "",
    fontSize: 20,
    y: 24,
  });

  let xCount = 10;
  mockData.forEach((list, index) => {
    initListItem(list, xCount);

    const listRect = standardRect.clone();
    listRect.id(`LIST-${list?.id}`);

    const titleRect = standardTitleRect.clone();
    const titleText = standardText.clone();
    titleText.text(list?.name);

    listRect.x(xCount);
    titleRect.x(xCount);
    titleText.x(xCount + 16);

    __konva.layer.add(listRect);
    __konva.layer.add(titleRect);
    __konva.layer.add(titleText);

    titleText.moveToBottom();
    titleRect.moveToBottom();
    listRect.moveToBottom();

    xCount = xCount + 305;
  });

  const addMoreRect = standardRect.clone();
  addMoreRect.x(xCount);
  addMoreRect.fill("transparent");
  addMoreRect.stroke("white");
  addMoreRect.dash([5, 5]);

  __konva.layer.add(addMoreRect);
  addMoreRect.moveToBottom();
  __konva.layer.batchDraw();
}
