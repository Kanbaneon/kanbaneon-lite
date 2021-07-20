export const kanbanList = [
  {
    id: "L1",
    name: "To-Do",
    children: [
      { id: "L1C1", text: `Wash lunch dish` },
      { id: "L1C2", text: `Wash dinner dish` },
    ],
  },
  {
    id: 2,
    name: "Doing",
    children: [
      { id: "L2C1", text: `Eat lunch` },
      { id: "L2C2", text: `Eat dinner` },
    ],
  },
  {
    id: 3,
    name: "Done",
    children: [
      { id: "L3C1", text: `Buy lunch` },
      { id: "L3C2", text: `Buy dinner` },
    ],
  },
  {
    id: 4,
    name: "Blockers",
    children: [
      { id: "L4C1", text: `Drink lunch beverage` },
      { id: "L4C2", text: `Drink dinner beverage` },
      { id: "L4C3", text: `Drink lunch beverage` },
    ],
  },
];
