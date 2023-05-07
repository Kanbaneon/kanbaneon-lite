import { __konva } from "./DrawCanvas";
import { store } from "../store";

const kanbanList = () =>
  store.getters.currentBoards.find((v) => v.id === store.getters.currentBoardID)
    ?.kanbanList;

export function initList() {
  const height = window.innerHeight;

  const largestChildren =
    !!kanbanList()?.length &&
    Math.max(...kanbanList().map((v) => v.children?.length));
  const standardRect = this.drawFns().getTile({ largestChildren, height });

  const standardTitleRect = new Konva.Rect({
    y: 10,
    fill: "#F0F0F0",
    height: 50,
    width: 295,
    cornerRadius: [8, 8, 0, 0],
  });

  const standardText = this.drawFns().getAddText();
  const standardAddButton = this.drawFns().getAddButton();

  let xCount = 10;

  __konva.layer.destroyChildren();

  if (!kanbanList()) {
    return;
  }

  kanbanList().forEach((list, index) => {
    this.drawFns().initListItem(list, xCount);

    const listRect = standardRect.clone();
    listRect.id(`LIST-${list?.id}`);
    listRect.attrs.listDetails = list;

    const addCardButton = standardAddButton.clone();
    addCardButton.id(`LIST-${list?.id}-ADD-MORE-BTN`);
    addCardButton.attrs.parentList = list;

    const titleRect = standardTitleRect.clone();
    const titleText = standardText.clone();

    titleRect.id(`LIST-${list?.id}-TITLE-RECT`);
    titleText.id(`LIST-${list?.id}`);
    titleText.attrs.listDetails = list;
    titleText.text(list?.name);

    addCardButton.x(xCount + 260);
    listRect.x(xCount);
    titleRect.x(xCount);
    titleText.x(xCount + 16);

    __konva.layer.add(listRect);
    __konva.layer.add(titleRect);
    __konva.layer.add(titleText);
    __konva.layer.add(addCardButton);

    addCardButton.moveToBottom();
    titleText.moveToBottom();
    titleRect.moveToBottom();
    listRect.moveToBottom();

    xCount = xCount + 305;
  });

  const addMoreRect = standardRect.clone();
  addMoreRect.height(240);
  addMoreRect.draggable(false);
  addMoreRect.x(xCount);
  addMoreRect.fill("rgba(255,255,255,0.3)");
  addMoreRect.stroke("white");
  addMoreRect.dash([5, 5]);

  const addMoreText = standardText.clone();
  addMoreText.draggable(false);
  addMoreText.text(`Click here to add more list`);
  addMoreText.x(xCount + 10);
  addMoreText.fontSize(15);
  addMoreText.fill("white");

  __konva.layer.add(addMoreRect);
  __konva.layer.add(addMoreText);

  addMoreText.moveToBottom();
  addMoreRect.moveToBottom();

  __konva.layer.batchDraw();
}
