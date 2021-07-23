import Konva from "konva";

export default function getCard({ x }) {
  const card = new Konva.Rect({
    x: x + 10,
    fill: "#35495e",
    height: 180,
    width: 275,
    cornerRadius: 8,
    shadowBlur: 1,
    draggable: true,
  });

  card.on("click", (e) => {
    this.cardDialog = {
      visible: true,
      title: "Edit Card",
      editingCard: {
        ...e?.currentTarget?.attrs?.cardDetails,
        parentList: e?.currentTarget?.attrs?.parentList,
      },
    };
  });

  return card;
}
