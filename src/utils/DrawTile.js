import Konva from "konva";

export default function getTile({ largestChildren, height }) {
  const tile = new Konva.Rect({
    y: 10,
    fill: "#FFFFFF",
    height: largestChildren > 3 ? height + (largestChildren - 3) * 180 : height,
    width: 295,
    cornerRadius: 8,
    shadowBlur: 1,
  });

  return tile;
}
