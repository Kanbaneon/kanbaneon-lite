import Konva from "konva";

export default function getText({ x }) {
  const text = new Konva.Text({
    text: "",
    fontSize: 18,
    fill: "white",
    x: x + 20,
    width: 265,
    height: 175,
    draggable: true,
  });

  text.on("click", (e) => {
    this.cardDialog = {
      visible: true,
      title: "Edit Card",
      editingCard: {
        ...e?.currentTarget?.attrs?.cardDetails,
        parentList: e?.currentTarget?.attrs?.parentList,
      },
    };
  });

  return text;
}
