const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

const validateInput = () => inputElement.value.trim().length > 0;

const handleAddTask = () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = inputElement.value;

  taskContent.addEventListener("click", () => handleClick(taskContent));

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("fa-regular");
  deleteItem.classList.add("fa-trash-can");

  deleteItem.addEventListener("click", () =>
    handleDeletClick(taskItemContainer, taskContent)
  );

  // Criando a checkbox com a label "completo"
  const checkboxLabel = document.createElement("label"); 
  checkboxLabel.innerText = "Completo";
  checkboxLabel.classList.add("checkbox-label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("complete-checkbox");

  checkbox.addEventListener("change", () => handleCheckboxChange(taskContent, checkbox));

  checkboxLabel.prepend(checkbox);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action-container");
  actionContainer.appendChild(checkboxLabel);
  actionContainer.appendChild(deleteItem);

  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(actionContainer);

  tasksContainer.appendChild(taskItemContainer);

  inputElement.value = "";

  updateLocalStorage();
};

const handleClick = (taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed");
    }
  }

  updateLocalStorage();
};

const handleDeletClick = (taskItemContainer, taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);
    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }

  updateLocalStorage();
};

const handleCheckboxChange = (taskContent, checkbox) => {
  if (checkbox.checked) {
    taskContent.classList.add("completed");
  } else {
    taskContent.classList.remove("completed");
  }
  updateLocalStorage();
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

const updateLocalStorage = () => {
  const tasks = tasksContainer.childNodes;

  const LocalStorageTasks = [...tasks].map((task) => {
    const content = task.querySelector('p');
    const checkbox = task.querySelector('.complete-checkbox');
    const isCompleted = checkbox.checked;

    return { description: content.innerText, isCompleted };
  });
  localStorage.setItem("tasks", JSON.stringify(LocalStorageTasks));
};

const resfreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    if (task.isCompleted) {
      taskContent.classList.add("completed");
    }

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fa-regular");
    deleteItem.classList.add("fa-trash-can");

    deleteItem.addEventListener("click", () =>
      handleDeletClick(taskItemContainer, taskContent)
    );

    const checkboxLabel = document.createElement("label");
    checkboxLabel.innerText = "Completo";
    checkboxLabel.classList.add("checkbox-label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete-checkbox");

    if (task.isCompleted) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => handleCheckboxChange(taskContent, checkbox));

    checkboxLabel.prepend(checkbox);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");
    actionContainer.appendChild(checkboxLabel);
    actionContainer.appendChild(deleteItem);

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(actionContainer);

    tasksContainer.appendChild(taskItemContainer);
  }
};

resfreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());

inputElement.addEventListener("change", () => handleInputChange());
