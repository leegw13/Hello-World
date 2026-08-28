export function createHistory(storageKey) {
  let entries = [];
  try { entries = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { entries = []; }
  return {
    all: () => entries.slice(),
    add(entry) {
      entries = [entry, ...entries.filter(item => item.input !== entry.input || item.direction !== entry.direction)].slice(0, 12);
      try { localStorage.setItem(storageKey, JSON.stringify(entries)); } catch { /* storage is optional */ }
    },
    clear() {
      entries = [];
      try { localStorage.removeItem(storageKey); } catch { /* storage is optional */ }
    }
  };
}
