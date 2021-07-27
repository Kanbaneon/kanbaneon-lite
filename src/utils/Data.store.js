import { browserDB } from "../helpers/IndexedDbHelper";

browserDB.openDatabase();
export const store = {
  kanbanBoards: [],
  currentBoardID: "",
};
