const { loadBooks } = window.MiniLibraryStore;

const STATUS_LABEL = {
  unread: "未読",
  reading: "読書中",
  done: "読了",
};

const tableBodyEl = document.getElementById("table-body");
const emptyEl = document.getElementById("empty");
const searchEl = document.getElementById("search");
const statsEl = document.getElementById("stats");

let books = loadBooks();
let filter = "";

function formatDateIso(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ja-JP", { hour12: false });
}

function render() {
  const q = filter.trim().toLowerCase();

  const filtered = books.filter((book) => {
    if (!q) return true;
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    return title.includes(q) || author.includes(q);
  });

  statsEl.textContent = q
    ? `全${books.length}件中 ${filtered.length}件を表示`
    : `全${books.length}件`;

  tableBodyEl.innerHTML = "";

  if (books.length === 0) {
    emptyEl.classList.remove("hidden");
    return;
  }

  if (filtered.length === 0) {
    emptyEl.textContent = "検索に一致する本がありません。";
    emptyEl.classList.remove("hidden");
    return;
  }

  emptyEl.classList.add("hidden");
  const frag = document.createDocumentFragment();

  const byCreatedAtAsc = [...filtered].sort((a, b) => {
    const at = new Date(a.createdAt || 0).getTime();
    const bt = new Date(b.createdAt || 0).getTime();
    return at - bt;
  });

  for (const book of byCreatedAtAsc) {
    frag.appendChild(row(book));
  }

  tableBodyEl.appendChild(frag);
}

function row(book) {
  const tr = document.createElement("tr");

  const titleTd = document.createElement("td");
  titleTd.textContent = book.title || "—";

  const authorTd = document.createElement("td");
  authorTd.textContent = book.author || "—";

  const statusTd = document.createElement("td");
  statusTd.textContent = STATUS_LABEL[book.status] || (book.status || "—");

  const createdAtTd = document.createElement("td");
  createdAtTd.textContent = formatDateIso(book.createdAt);

  tr.append(titleTd, authorTd, statusTd, createdAtTd);
  return tr;
}

searchEl.addEventListener("input", () => {
  filter = searchEl.value;
  render();
});

render();
