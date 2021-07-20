import { kanbanList } from "./Data.mock";
import { initCanvas, __dnd, __konva } from "./DrawCanvas";

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

export function initListItem(list, x, e) {
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

  const existingCards = [
    ...__konva.stage.find("Rect"),
    ...__konva.stage.find("Text"),
  ].filter(
    (v) =>
      !!v.attrs.id &&
      (v.attrs.id.includes(`LIST-${list?.id}-CARD-`) ||
        v.attrs.id.includes(`LIST-${list?.id}-TEXT-`))
  );

  existingCards.forEach((v) => v.destroy());

  list.children.forEach((card) => {
    const cardRect = standardRect.clone();
    cardRect.id(`LIST-${list?.id}-CARD-${card?.id}`);
    cardRect.y(yCount);

    const titleText = standardText.clone();
    titleText.id(`LIST-${list?.id}-TEXT-${card?.id}`);
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
      const parentItem = kanbanList.find((data) => data?.id === list?.id);

      if (!!dragOverList) {
        const foundItem = kanbanList.find(
          (data) =>
            data?.id.toString() === dragOverList?.attrs?.id.split("LIST-")[1]
        );

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
        }

        if (
          !!foundItem &&
          !foundItem.children.map((v) => v.id).includes(card.id)
        ) {
          foundItem.children.push(card);
          if (foundItem.children.length > 3) {
            initCanvas();
          }
          cardRect.destroy();
          titleText.destroy();
          initListItem(foundItem, dragOverList.x());
        }
      }

      initListItem(parentItem, x);
      __dnd.dragmove = null;
    });

    yCount = yCount + 190;

    __konva.layer.add(cardRect);
    __konva.layer.add(titleText);
  });
}
