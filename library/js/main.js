const { loadBooks, saveBooks, createId } = window.MiniLibraryStore;

const STATUS_LABEL = {
  unread: "未読",
  reading: "読書中",
  done: "読了",
};

const form = document.getElementById("book-form");
const listEl = document.getElementById("book-list");
const emptyEl = document.getElementById("empty");
const searchEl = document.getElementById("search");

let books = loadBooks();
let filter = "";

function render() {
  const q = filter.trim().toLowerCase();
  const filtered = books.filter((b) => {
    if (!q) return true;
    const t = (b.title || "").toLowerCase();
    const a = (b.author || "").toLowerCase();
    return t.includes(q) || a.includes(q);
  });

  listEl.innerHTML = "";
  if (filtered.length === 0) {
    emptyEl.classList.toggle("hidden", books.length > 0);
    if (books.length > 0) {
      emptyEl.textContent = "検索に一致する本がありません。";
      emptyEl.classList.remove("hidden");
    } else {
      emptyEl.textContent = "まだ本がありません。上のフォームから追加してください。";
    }
    return;
  }

  emptyEl.classList.add("hidden");
  const frag = document.createDocumentFragment();
  for (const book of [...filtered].reverse()) {
    frag.appendChild(bookCard(book));
  }
  listEl.appendChild(frag);
}

function bookCard(book) {
  const li = document.createElement("li");
  li.className = "book-card";
  li.dataset.id = book.id;

  const info = document.createElement("div");
  const title = document.createElement("p");
  title.className = "book-card__title";
  title.textContent = book.title;
  const author = document.createElement("p");
  author.className = "book-card__author";
  author.textContent = book.author ? `著: ${book.author}` : "著者未入力";
  const badge = document.createElement("span");
  badge.className = `badge badge--${book.status}`;
  badge.textContent = STATUS_LABEL[book.status] || book.status;

  info.append(title, author, badge);

  const actions = document.createElement("div");
  const del = document.createElement("button");
  del.type = "button";
  del.className = "btn btn--ghost";
  del.textContent = "削除";
  del.addEventListener("click", () => {
    books = books.filter((b) => b.id !== book.id);
    saveBooks(books);
    render();
  });
  actions.appendChild(del);

  li.append(info, actions);
  return li;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const title = String(fd.get("title") || "").trim();
  if (!title) return;

  const book = {
    id: createId(),
    title,
    author: String(fd.get("author") || "").trim(),
    status: String(fd.get("status") || "unread"),
    createdAt: new Date().toISOString(),
  };
  books.push(book);
  saveBooks(books);
  form.reset();
  render();
});

searchEl.addEventListener("input", () => {
  filter = searchEl.value;
  render();
});

render();
