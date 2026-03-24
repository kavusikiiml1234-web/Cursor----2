const STORAGE_KEY = "simple-task-list-v1";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const template = document.getElementById("task-item-template");

let tasks = loadTasks();

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  saveTasks();
  render();
  form.reset();
  input.focus();
});

function render() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const toggle = item.querySelector(".task-toggle");
    const text = item.querySelector(".task-text");
    const deleteBtn = item.querySelector(".delete-btn");

    text.textContent = task.text;
    toggle.checked = task.done;
    item.classList.toggle("completed", task.done);

    toggle.addEventListener("change", () => {
      task.done = toggle.checked;
      saveTasks();
      item.classList.toggle("completed", task.done);
    });

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      render();
    });

    list.appendChild(item);
  });
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
