import { kanbanList } from "./Data.mock";
import { __konva } from "./DrawCanvas";

export function initList() {
  const height = window.innerHeight;

  const largestChildren = Math.max(
    ...kanbanList.map((v) => v.children?.length)
  );
  const standardRect = this.drawFns().getTile({ largestChildren, height });

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

  const standardAddButton = this.drawFns().getAddButton();

  let xCount = 10;
  kanbanList.forEach((list, index) => {
    this.drawFns().initListItem(list, xCount);

    const listRect = standardRect.clone();
    listRect.id(`LIST-${list?.id}`);

    const addCardButton = standardAddButton.clone();
    const titleRect = standardTitleRect.clone();
    const titleText = standardText.clone();
    titleText.text(list?.name);
    addCardButton.attrs.parentList = list;

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
  addMoreRect.x(xCount);
  addMoreRect.fill("rgba(255,255,255,0.3)");
  addMoreRect.stroke("white");
  addMoreRect.dash([5, 5]);

  const addMoreText = standardText.clone();
  addMoreText.text(`Click "NEW LIST" Button to add more list`);
  addMoreText.x(xCount + 10);
  addMoreText.fontSize(15);
  addMoreText.fill("white");

  __konva.layer.add(addMoreRect);
  __konva.layer.add(addMoreText);

  addMoreText.moveToBottom();
  addMoreRect.moveToBottom();

  __konva.layer.batchDraw();
}
