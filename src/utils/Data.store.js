import { browserDB, INDEXED_DB } from "../helpers/IndexedDbHelper";

export const store = {
  kanbanBoards: [],
  currentBoardID: "",
  async getFromDB() {
    const boards = await browserDB.get(
      INDEXED_DB.objectStores.KANBAN_BOARDS,
      "boards"
    );
    if (!!boards?.value) {
      this.kanbanBoards = JSON.parse(JSON.stringify(boards.value));
    } else {
      await this.setToDB();
    }
  },
  async setToDB() {
    await browserDB.put(INDEXED_DB.objectStores.KANBAN_BOARDS, "boards", {
      value: this.kanbanBoards,
    });
  },
  async openDatabase() {
    await browserDB.openDatabase();
  },
};
