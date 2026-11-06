/* ==========================================
   English Master 9 - Storage Module (IndexedDB & LocalStorage)
   ================================---------- */

class StorageManager {
    constructor() {
        this.dbName = "EnglishMaster9DB";
        this.dbVersion = 1;
        this.db = null;
        this.initIndexedDB();
    }

    // Initialize IndexedDB
    initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // User Progress Store
                if (!db.objectStoreNames.contains("progress")) {
                    db.createObjectStore("progress", { keyPath: "id" });
                }
                // Vocabulary Store
                if (!db.objectStoreNames.contains("vocabulary")) {
                    db.createObjectStore("vocabulary", { keyPath: "wordId" });
                }
                // Exam Results Store
                if (!db.objectStoreNames.contains("examResults")) {
                    db.createObjectStore("examResults", { keyPath: "id", autoIncrement: true });
                }
            };
        });
    }

    // Save general settings in localStorage
    setSetting(key, value) {
        localStorage.setItem(`em9_${key}`, JSON.stringify(value));
    }

    // Get general settings from localStorage
    getSetting(key, defaultValue = null) {
        const item = localStorage.getItem(`em9_${key}`);
        return item ? JSON.parse(item) : defaultValue;
    }

    // Save exam result to IndexedDB
    async saveExamResult(resultData) {
        if (!this.db) await this.initIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["examResults"], "readwrite");
            const store = transaction.objectStore("examResults");
            const request = store.add({ ...resultData, date: new Date().toISOString() });

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    // Export all local data as JSON (Backup feature)
    async exportData() {
        const settings = {
            theme: this.getSetting("theme", "light"),
            streak: this.getSetting("streak", 5)
        };
        return JSON.stringify(settings, null, 2);
    }
}

// Global storage instance
const dbStorage = new StorageManager();
