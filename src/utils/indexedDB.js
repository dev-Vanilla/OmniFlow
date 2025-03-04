// indexedDB.js
const DB_NAME = 'conversationDB';
const STORENAME = 'conversationIndex';

// 深拷贝函数
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export const openIndexedDB = () =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORENAME)) {
                db.createObjectStore(STORENAME);
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });

export const saveToIndexedDB = async (key, value) => {
    const db = await openIndexedDB();
    const transaction = db.transaction(STORENAME, 'readwrite');
    const store = transaction.objectStore(STORENAME);

    // 在 put 之前深拷贝对象
    const clonedValue = deepClone(value);

    store.put(clonedValue, key);
    return transaction.complete;
};

export const getFromIndexedDB = async (key) => {
    const db = await openIndexedDB();
    const transaction = db.transaction(STORENAME, 'readonly');
    const store = transaction.objectStore(STORENAME);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deleteFromIndexedDB = async (key) => {
    const db = await openIndexedDB();
    const transaction = db.transaction(STORENAME, 'readwrite');
    const store = transaction.objectStore(STORENAME);

    // 删除指定键的记录
    store.delete(key);
    return transaction.complete;
};
