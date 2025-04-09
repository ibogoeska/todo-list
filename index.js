// ---------- ASSIGNING HTML ELEMENTS ----------
const todoInput = document.querySelector("#todoInput");
const addTodoBtn = document.querySelector("#addTodo");
const doneRadioBtn = document.querySelector("#done");
const notDoneRadioBtn = document.querySelector("#notDone");
const importantBtn = document.querySelector("#important");
const resetBtn = document.querySelector("#resetFilters");
const form = document.querySelector(".form");
const todoList = document.querySelector("#todoList");

// ----------- Global variables ------------
let todos = [];

// ----------- MANIPULATING WITH TODOS ----------
class ToDo {
  constructor(title) {
    this.title = title;
    this.status = false;
    this.id = crypto.randomUUID();
    this.isInEditMode = false;
    this.important = false;
  }
}

if (localStorage.getItem("todos")) {
  todos = JSON.parse(localStorage.getItem("todos"));
}
renderList(todos, todoList);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoInputValue = todoInput.value;

  if (todoInputValue.trim() !== "") {
    const newTodo = new ToDo(todoInput.value);
    todos.push(newTodo);

    form.reset();

    renderList(todos, todoList);

    saveTodoToLocaleStorage(todos);
  }
});

function renderTodo(todo) {
  const listItem = document.createElement("li");

  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("hidden", true);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("id", todo.id);
  checkbox.setAttribute("hidden", true);

  // ------------ Event listener on the checkbox ----------
  checkbox.addEventListener("click", () => {
    labelItem.classList.toggle("done");

    todo.status = !todo.status;

    saveTodoToLocaleStorage(todos);
  });
  // ------------ End of Event listener on the checkbox ----------

  const labelItem = document.createElement("label");
  labelItem.setAttribute("for", todo.id);
  labelItem.innerText = todo.title;
  if (todo.status) {
    labelItem.classList.add("done");
  }

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const importantStar = document.createElement("a");
  importantStar.innerHTML = `<i class="fa-regular fa-star"></i>`;
  importantStar.classList.add("important-btn");
  const icon = importantStar.querySelector("i");

  if (todo.important) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    icon.style.fontWeight = "bold";
  }

  // ------------ Event listener on the IMPORTANT Btn & FontAwesome star ----------
  importantStar.addEventListener("click", () => {
    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");

    if (icon.classList.contains("fa-solid")) {
      icon.style.fontWeight = "bold";
      todo.important = true;
    } else {
      icon.style.fontWeight = "normal";
      todo.important = false;
    }

    saveTodoToLocaleStorage(todos);
  });

  importantBtn.addEventListener("click", () => {
    importantTodos = todos.filter((t) => t.important === true);

    renderList(importantTodos, todoList);
  });

  resetBtn.addEventListener("click", () => {
    doneRadioBtn.checked = false;
    notDoneRadioBtn.checked = false;
    importantBtn.checked = false;

    //sakam i posle reset important star da ostani markirana na todos shto se important

    renderList(todos, todoList);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("button", "delete-button");
  deleteBtn.innerText = "Delete";

  // ------------ Event listener on the DELETE Btn ----------
  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete this todo?");
    if (confirmDelete) {
      const filteredTodos = todos.filter((t) => t.id !== todo.id);
      todos = filteredTodos;
      console.log("filtered todos", todos);

      listItem.remove();

      saveTodoToLocaleStorage(todos);
    }
  });

  // ------------ End of Event listener on the DELETE Btn ----------

  const editBtn = document.createElement("button");
  editBtn.classList.add("button", "edit-button");
  editBtn.innerText = "Edit";

  // ------------ Event listener on the EDIT Btn ----------

  editBtn.addEventListener("click", () => {
    if (!todo.isInEditMode) {
      editBtn.innerText = "Save";
      input.removeAttribute("hidden");
      input.value = todo.title;
      listItem.prepend(input);
      labelItem.setAttribute("hidden", true);
      todo.isInEditMode = true;
    } else {
      input.setAttribute("hidden", true);
      input.remove();
      editBtn.innerText = "Edit";
      labelItem.removeAttribute("hidden");
      labelItem.innerText = input.value;
      todo.title = input.value;
      todo.isInEditMode = false;

      saveTodoToLocaleStorage(todos);
    }
  });

  buttons.append(importantStar, editBtn, deleteBtn);
  listItem.append(input, checkbox, labelItem, buttons);
  todoList.appendChild(listItem);

  return listItem;
}

// Filter the todos which are done and show on the UI
doneRadioBtn.addEventListener("click", (e) => {
  console.log(e);
  doneTodos = todos.filter((t) => t.status === true);

  renderList(doneTodos, todoList);
});

notDoneRadioBtn.addEventListener("click", () => {
  awaitingTodos = todos.filter((t) => t.status === false);
  renderList(awaitingTodos, todoList);
});

function renderList(todos, todoList) {
  todoList.innerHTML = "";
  console.log("todos", todos);
  todos.forEach((todo) => {
    const listItem = renderTodo(todo);
    todoList.appendChild(listItem);
  });
}

const todosFromStorage = localStorage.getItem("todos");

function saveTodoToLocaleStorage(data) {
  localStorage.setItem("todos", JSON.stringify(data));
}
