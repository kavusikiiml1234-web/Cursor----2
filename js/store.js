/** 蔵書データの永続化（localStorage） */
const KEY = "mini-library-books";

function loadBooks() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveBooks(books) {
  localStorage.setItem(KEY, JSON.stringify(books));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

window.MiniLibraryStore = { loadBooks, saveBooks, createId };
