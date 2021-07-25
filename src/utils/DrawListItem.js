import { __dnd, __konva } from "./DrawCanvas";
import { store } from "./Data.store";

const { kanbanList } = store;

export function searchIntersection(r2) {
  const allRects = __konva.stage.find("Rect");

  const listRects = allRects.filter(
    (rect) =>
      !!rect.attrs.id &&
      rect.attrs.id.includes("LIST-") &&
      !rect.attrs.id.includes("CARD-") &&
      !rect.attrs.id.includes("TITLE-RECT")
  );

  const cardRects = allRects.filter(
    (rect) =>
      !!rect.attrs.id &&
      rect.attrs.id.includes("LIST-") &&
      rect.attrs.id.includes("CARD-")
  );

  const collidedLists = listRects.filter((r1) => {
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

  const collidedItems = cardRects.filter((r1) => {
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

  return { list: collidedLists[0], item: collidedItems[0] };
}

export function initListItem(list, x, e) {
  const standardRect = this.drawFns().getCard({ x });
  const standardText = this.drawFns().getText({ x });

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
    cardRect.attrs.cardDetails = card;
    cardRect.attrs.parentList = list;
    cardRect.y(yCount);

    const titleText = standardText.clone();
    titleText.id(`LIST-${list?.id}-TEXT-${card?.id}`);
    titleText.text(card?.text);

    titleText.attrs.cardDetails = card;
    titleText.attrs.parentList = list;
    titleText.y(yCount + 10);

    titleText.on("dragmove", (e) => {
      cardRect.moveToTop();
      e.target.moveToTop();

      const { x, y } = e.target.position();
      cardRect.x(x - 20);
      cardRect.y(y - 10);

      const { list, item } = searchIntersection(e.target);
      __dnd.list = list;
      __dnd.item = item;
    });

    titleText.on("dragend", (e) => {
      const dragOverList = __dnd.list;
      const dragOverItem = __dnd.item;
      const parentList = kanbanList.find((data) => data?.id === list?.id);

      if (!dragOverList) {
        const parentItemIndex = parentList.children.findIndex(
          (item) =>
            item?.id.toString() === dragOverItem?.attrs?.id.split("CARD-")[1]
        );
        if (parentItemIndex > -1) {
          parentList.children = parentList.children.filter(
            (v) => v.id !== card.id
          );
          parentList.children.splice(parentItemIndex, 0, card);
        }
      }

      if (!!dragOverList) {
        const foundList = kanbanList.find(
          (data) =>
            data?.id.toString() === dragOverList?.attrs?.id.split("LIST-")[1]
        );
        const foundItemIndex =
          !!foundList?.children &&
          foundList.children.findIndex(
            (item) =>
              item?.id.toString() === dragOverItem?.attrs?.id.split("CARD-")[1]
          );

        if (
          !!parentList &&
          parentList.children.map((v) => v.id).includes(card.id)
        ) {
          parentList.children = parentList.children.filter(
            (v) => v.id !== card.id
          );
          if (parentList.children.length <= 4) {
            this.drawFns().initCanvas();
          }
        }

        if (
          !!foundList &&
          !foundList.children.map((v) => v.id).includes(card.id)
        ) {
          if (foundItemIndex > -1) {
            foundList.children.splice(foundItemIndex, 0, card);
          } else {
            foundList.children.push(card);
          }
          if (foundList.children.length > 3) {
            this.drawFns().initCanvas();
          }
          cardRect.destroy();
          titleText.destroy();
          this.drawFns().initListItem(foundList, dragOverList.x());
        }
      }

      this.drawFns().initListItem(parentList, x);
      __dnd.list = null;
      __dnd.item = null;
    });

    yCount = yCount + 190;

    __konva.layer.add(cardRect);
    __konva.layer.add(titleText);
  });
}
