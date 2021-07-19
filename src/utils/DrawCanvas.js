import Konva from "konva";
const mockData = [
  {
    id: 1,
    name: "To-Do",
    children: [
      { id: 1, text: `Buy lunch` },
      { id: 2, text: `Buy dinner` },
    ],
  },
  {
    id: 2,
    name: "Doing",
    children: [],
  },
  {
    id: 3,
    name: "Done",
    children: [],
  },
  {
    id: 4,
    name: "Blockers",
    children: [],
  },
];

export function initCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight - 100;

  this.stage = new Konva.Stage({
    container: "canban-canvas",
    width: width,
    height: height,
    x: 0,
    y: 0,
  });

  this.layer = new Konva.Layer();
  this.stage.add(this.layer);
  this.stage.container().style.background = "#42b883";
  this.stage.container().style.cursor = "move";
}

function initListItem(list, x) {
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
  list.children.forEach((card) => {
    const cardRect = standardRect.clone();
    cardRect.y(yCount);

    const titleText = standardText.clone();
    titleText.text(card?.text);
    titleText.y(yCount + 10);

    cardRect.on("dragmove", (e) => {
      const { x, y } = e.target.position();
      titleText.x(x + 20);
      titleText.y(y + 10);
    });

    yCount = yCount + 190;

    this.layer.add(cardRect);
    this.layer.add(titleText);
  });
}

export function initList() {
  const standardRect = new Konva.Rect({
    y: 10,
    fill: "#FFFFFF",
    height: 620,
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
    const initListCard = initListItem.bind(this);
    initListCard(list, xCount);

    const listRect = standardRect.clone();
    const titleRect = standardTitleRect.clone();
    const titleText = standardText.clone();
    titleText.text(list?.name);

    listRect.x(xCount);
    titleRect.x(xCount);
    titleText.x(xCount + 16);

    this.layer.add(listRect);
    this.layer.add(titleRect);
    this.layer.add(titleText);

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

  this.layer.add(addMoreRect);
  this.layer.batchDraw();
}
