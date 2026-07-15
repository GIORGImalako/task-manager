let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dueDateInput = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

const clock = document.getElementById("clock");

function updateClock() {
  const now = new Date();

  clock.textContent = now.toLocaleString();
}

updateClock();
setInterval(updateClock, 1000);

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
  taskCount.textContent = tasks.length;
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;

  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  const task = {
    id: Date.now(),
    title: title,
    description: description,
    dueDate: dueDate,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);

  saveTasks();

  renderTasks();

  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = [...tasks];

  // Search
  const searchValue = searchInput.value.toLowerCase();

  filteredTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchValue),
  );

  if (filterSelect.value === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (filterSelect.value === "pending") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  if (sortSelect.value === "az") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortSelect.value === "newest") {
    filteredTasks.sort((a, b) => b.id - a.id);
  }

  if (sortSelect.value === "oldest") {
    filteredTasks.sort((a, b) => a.id - b.id);
  }

  filteredTasks.forEach((task) => {
    const taskDiv = document.createElement("div");

    taskDiv.classList.add("task");

    if (task.completed) {
      taskDiv.classList.add("completed");
    }

    taskDiv.innerHTML = `
            <h3>${task.title}</h3>

            <p>${task.description || "No description"}</p>

            <p><strong>Due Date:</strong> ${task.dueDate || "Not specified"}</p>

            <p><strong>Status:</strong>
            ${task.completed ? "Completed" : "Pending"}
            </p>

            <div class="task-buttons">

                <button class="complete-btn"
                        onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="delete-btn"
                        onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

    taskList.appendChild(taskDiv);
  });

  updateCounter();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");

  if (!confirmDelete) {
    return;
  }

  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

searchInput.addEventListener("input", function () {
  renderTasks();
});

filterSelect.addEventListener("change", function () {
  renderTasks();
});

sortSelect.addEventListener("change", function () {
  renderTasks();
});

renderTasks();
