  /* === IndexedDB helper (respaldo silencioso) === */
  const IDB_NAME = 'simon-idb', IDB_STORE = 'save';
  function idbOpen() {
    return new Promise((ok, no) => {
      try {
        const r = indexedDB.open(IDB_NAME, 1);
        r.onupgradeneeded = () => { const db = r.result; if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE); };
        r.onsuccess = () => ok(r.result);
        r.onerror = () => no(r.error);
      } catch (_) { no(_); }
    });
  }
  function idbSet(val) {
    idbOpen().then(db => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(val, CLAVE);
      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    }).catch(() => {});
  }
  function idbGet() {
    return idbOpen().then(db => new Promise((ok, no) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const r = tx.objectStore(IDB_STORE).get(CLAVE);
      r.onsuccess = () => { db.close(); ok(r.result || null); };
      r.onerror = () => { db.close(); no(r.error); };
    })).catch(() => null);
  }
  function idbClear() {
    idbOpen().then(db => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(CLAVE);
      tx.oncomplete = () => db.close();
    }).catch(() => {});
  }

