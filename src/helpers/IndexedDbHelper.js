const INDEXED_DB = Object.freeze({
  name: "canban",
  version: 1,
  objectStores: {
    KanbanList: "KanbanList",
  },
});

/**
 * @class A helper class for storing and fetching data to IndexedDB
 */
class IndexedDbHelper {
  isSupported = false; //indicator if indexedDB is supported.
  isOpened = false;
  db = null;
  dbRequest = null;
  indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  constructor() {
    if (!this.indexedDB) {
      return;
    }
    this.isSupported = true;
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      if (this.isOpened) {
        return resolve();
      }
      const { name, version } = INDEXED_DB;
      this.dbRequest = this.indexedDB.open(name, version);
      this.dbRequest.onupgradeneeded = (e) => {
        this.db = e.target.result;
        this.isOpened = true;
        this.createStore();
      };

      this.dbRequest.onsuccess = (e) => {
        this.db = e.target.result;
        this.db.onclose = this.onCloseListener.bind(this);

        if (this.isOpened) {
          return resolve(this.db);
        }
        this.isOpened = true;
        return resolve(this.db);
      };

      this.dbRequest.onerror = (e) => {
        return reject(e.target.error);
      };
    });
  }

  closeDatabase() {
    if (!!this.db) {
      this.isOpened = false;
      this.db.close();
    }
  }

  onCloseListener() {
    this.isOpened = false;
  }

  /**
   * @description createObjectStores when version upgrade
   */
  createStore() {
    this.db.createObjectStore(INDEXED_DB.objectStores.KanbanList, {
      autoIncrement: true,
    });
  }

  /**
   * @func putItem
   * @params storeName, key, value
   * @description Update if exists , Insert if not exists
   * @return Promise
   */
  async put(storeName, key, value) {
    try {
      if (!this.isOpened) {
        await this.openDatabase();
      }
      const existingData = await this.get(storeName, key);
      const newData = { ...existingData, ...value };
      return await this.#putRequest(storeName, key, newData);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * @func getItem
   * @params storeName, key
   * @description Fetch an item in objectStore
   * @return Promise
   */
  async get(storeName, key) {
    try {
      if (!this.isOpened) {
        await this.openDatabase();
      }
      return await this.#getRequest(storeName, key);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * @func getItem
   * @params storeName, key
   * @description Fetch an item in objectStore
   * @return Promise
   */
  async delete(storeName, key) {
    try {
      if (!this.isOpened) {
        await this.openDatabase();
      }
      return await this.#deleteRequest(storeName, key);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * @private
   */
  #putRequest = (storeName, key, value) =>
    new Promise((resolve, reject) => {
      let tx = this.db.transaction([storeName], "readwrite");
      let store = tx.objectStore(storeName);
      let req = store.put(value, key);

      req.onsuccess = (e) => {
        resolve(e.target.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });

  /**
   * @private
   */
  #getRequest = (storeName, key) =>
    new Promise((resolve, reject) => {
      let tx = this.db.transaction([storeName], "readonly");
      let store = tx.objectStore(storeName);
      let req = store.get(key);

      req.onsuccess = (e) => {
        resolve(e.target.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });

  /**
   * @private
   */
  #deleteRequest = (storeName, key) =>
    new Promise((resolve, reject) => {
      let tx = this.db.transaction([storeName], "readwrite");
      let store = tx.objectStore(storeName);
      let req = store.delete(key);

      req.onsuccess = (e) => {
        resolve(e.target.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
}

export const browserDB = new IndexedDbHelper();
