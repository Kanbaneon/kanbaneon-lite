import { v4 } from "uuid";
import { browserDB, INDEXED_DB } from "./helpers/IndexedDbHelper";
import { createStore } from "vuex";

const initialState = {
  kanbanBoards: {},
  currentBoardID: "",
  user: {
    isLoggedIn: false,
    username: "",
  },
};

export async function getExistingUser(username) {
  const users =
    (await browserDB.get(INDEXED_DB.objectStores.KANBANEON, "users")) || {};

  const existingUser = users[username];
  return existingUser;
}

// Create a new store instance.
export const store = createStore({
  state() {
    return initialState;
  },
  getters: {
    async kanbanBoards(state) {
      return JSON.parse(JSON.stringify(state.kanbanBoards));
    },
    currentBoardID(state) {
      return JSON.parse(JSON.stringify(state.currentBoardID));
    },
    user(state) {
      return JSON.parse(JSON.stringify(state.user));
    },
    getCurrentBoards: (state) => async () => {
      const userId = await getExistingUser(state.user.username);
      return JSON.parse(JSON.stringify(state.kanbanBoards?.[userId] ?? []));
    },
  },
  mutations: {
    async addKanbanBoard(state, board) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const existingUser = await getExistingUser(state.user.username);
      const currentBoards = allBoards[existingUser] ?? [];
      currentBoards.push(board);
      this.commit("setKanbanBoards", {
        ...allBoards,
        [existingUser]: currentBoards,
      });
    },
    async setKanbanBoards(state, boards) {
      state.kanbanBoards = boards;
      await browserDB.put(
        INDEXED_DB.objectStores.KANBANEON,
        "kanbanBoards",
        boards
      );
    },
    async setCurrentBoardID(state, currentBoardID) {
      state.currentBoardID = currentBoardID;
      await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "currentBoardID", {
        value: currentBoardID,
      });
    },
    async setUser(state, user) {
      state.user = user;
      const existingUser = await getExistingUser(user.username);
      if (!existingUser && user.username) {
        await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "users", {
          [user.username]: v4(),
        });
      }

      await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "user", user);
    },
  },
});

export async function setUpDB() {
  await browserDB.openDatabase();

  const currentBoardID = await browserDB.get(
    INDEXED_DB.objectStores.KANBANEON,
    "currentBoardID",
    initialState.currentBoardID
  );
  if (currentBoardID?.value) {
    store.commit("setCurrentBoardID", currentBoardID.value);
  } else {
    store.commit("setCurrentBoardID", initialState.currentBoardID);
  }

  const user = await browserDB.get(
    INDEXED_DB.objectStores.KANBANEON,
    "user",
    initialState.user
  );
  if (user) {
    store.commit("setUser", user);
  } else {
    store.commit("setUser", initialState.user);
  }

  if (user?.isLoggedIn && user?.username) {
    const kanbanBoards = await browserDB.get(
      INDEXED_DB.objectStores.KANBANEON,
      "kanbanBoards"
    );
    store.commit("setKanbanBoards", kanbanBoards);
  }
}
