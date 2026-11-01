/**
 * 数据库层 - 基于 IndexedDB 的本地数据存储
 * 支持班级、学生、题库、题目、抽取记录的管理
 */
class Database {
  constructor() {
    this.dbName = 'ClassroomApp';
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        if (!db.objectStoreNames.contains('classes')) {
          db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('students')) {
          const s = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
          s.createIndex('classId', 'classId', { unique: false });
        }
        if (!db.objectStoreNames.contains('questionBanks')) {
          db.createObjectStore('questionBanks', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('questions')) {
          const s = db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
          s.createIndex('bankId', 'bankId', { unique: false });
        }
        if (!db.objectStoreNames.contains('drawRecords')) {
          db.createObjectStore('drawRecords', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  _tx(storeName, mode = 'readonly') {
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  _promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async add(storeName, data) {
    const store = this._tx(storeName, 'readwrite');
    return this._promisifyRequest(store.add(data));
  }

  async getAll(storeName) {
    const store = this._tx(storeName);
    return this._promisifyRequest(store.getAll());
  }

  async get(storeName, id) {
    const store = this._tx(storeName);
    return this._promisifyRequest(store.get(id));
  }

  async put(storeName, data) {
    const store = this._tx(storeName, 'readwrite');
    return this._promisifyRequest(store.put(data));
  }

  async delete(storeName, id) {
    const store = this._tx(storeName, 'readwrite');
    return this._promisifyRequest(store.delete(id));
  }

  async clear(storeName) {
    const store = this._tx(storeName, 'readwrite');
    return this._promisifyRequest(store.clear());
  }

  async getByIndex(storeName, indexName, value) {
    const store = this._tx(storeName);
    const index = store.index(indexName);
    return this._promisifyRequest(index.getAll(value));
  }

  async count(storeName) {
    const store = this._tx(storeName);
    return this._promisifyRequest(store.count());
  }

  async countByIndex(storeName, indexName, value) {
    const store = this._tx(storeName);
    const index = store.index(indexName);
    return this._promisifyRequest(index.count(value));
  }

  // 批量添加
  async bulkAdd(storeName, items) {
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of items) {
      store.add(item);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(items.length);
      tx.onerror = () => reject(tx.error);
    });
  }

  // 按索引删除（如删除某题库下所有题目）
  async deleteByIndex(storeName, indexName, value) {
    const items = await this.getByIndex(storeName, indexName, value);
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of items) {
      store.delete(item.id);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(items.length);
      tx.onerror = () => reject(tx.error);
    });
  }

  // 便捷方法
  async getClasses() {
    return this.getAll('classes');
  }

  async getStudentsByClass(classId) {
    return this.getByIndex('students', 'classId', classId);
  }

  async getQuestionBanks() {
    return this.getAll('questionBanks');
  }

  async getQuestionsByBank(bankId) {
    return this.getByIndex('questions', 'bankId', bankId);
  }

  async countQuestionsByBank(bankId) {
    return this.countByIndex('questions', 'bankId', bankId);
  }
}

const DB = new Database();
