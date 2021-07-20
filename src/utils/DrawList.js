import { kanbanList } from "./Data.mock";
import { __konva } from "./DrawCanvas";
import { initListItem } from "./DrawListItem";

export function initList() {
  const height = window.innerHeight;

  const largestChildren = Math.max.apply(
    0,
    kanbanList.map((v) => v.children?.length)
  );
  const standardRect = new Konva.Rect({
    y: 10,
    fill: "#FFFFFF",
    height: largestChildren > 3 ? height + (largestChildren - 3) * 180 : height,
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
  kanbanList.forEach((list, index) => {
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
