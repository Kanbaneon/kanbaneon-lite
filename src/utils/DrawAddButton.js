import Konva from "konva";

export default function getAddButton() {
  const buttonGroup = new Konva.Group({ y: 35 });
  const circle = new Konva.Circle({
    radius: 20,
    fill: "#40a9ff",
    shadowOpacity: 0.5,
    shadowOffsetX: 1.5,
    shadowOffsetY: 1.5,
  });

  const xLine = new Konva.Line({
    points: [-10, 0, 10, 0],
    stroke: "white",
    strokeWidth: 4,
    lineCap: "round",
    lineJoin: "round",
  });

  const yLine = xLine.clone();
  yLine.points([0, -10, 0, 10]);

  buttonGroup.add(circle);
  buttonGroup.add(xLine);
  buttonGroup.add(yLine);

  buttonGroup.on("click", (e) => {
    this.visible = true;
    this.addingList = e.currentTarget.attrs.parentList;
  });

  buttonGroup.on("mouseenter", (e) => {
    e.target.getStage().container().style.cursor = "pointer";
  });

  buttonGroup.on("mouseleave", (e) => {
    e.target.getStage().container().style.cursor = "move";
  });

  return buttonGroup;
}
