import {format, isValid} from "date-fns";

const displayNavProject = function (name, index) {
    const projects = document.querySelector(".projects");

    const projectNavDiv = document.createElement("div");
    projectNavDiv.dataset.index = index;
    projectNavDiv.classList.add("project-div");

    const header = document.createElement("button");
    header.classList.add("project-nav")
    header.textContent = name;
    header.dataset.index = index;

    const editProject = document.createElement("button");
    editProject.classList.add("project-edit-button");
    editProject.textContent = "✍";
    editProject.dataset.index = index;

    const removeProject = document.createElement("button");
    removeProject.classList.add("project-remove-button");
    removeProject.textContent = "🗑";
    removeProject.dataset.index = index;

    projectNavDiv.append(header, editProject, removeProject);


    projects.appendChild(projectNavDiv);
}

const displayProjectName = function (project) {
    const projectName = document.querySelector(".project-name")
    projectName.textContent = project.name;
}

const setProjectHeaderName = function (name) {
    const projectName = document.querySelector(".project-name");
    projectName.textContent = name;
}

const clearProjectHeaders = function () {
    const projectsHeaders = document.querySelectorAll(".project-div");
    projectsHeaders.forEach((project) => {
        project.remove();
    })
}

const displayAllProjectsNav = function (projects) {
    clearProjectHeaders();
    projects.forEach((project, index) => {
        displayNavProject(project.name, index);
    })
}

const removeProjectNav = function (index) {
    const projectNavDiv = document.querySelector(`.project-div[data-index="${index}"`);
    projectNavDiv.remove();
}

const displayTodo = function (project, todo, index, addRightDiv = true ) {
    const todosDiv = document.querySelector(".todos");
    const initialDiv = document.createElement("div");
    initialDiv.classList.add("initial");


    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.dataset.index = index;
    todoDiv.dataset.projectIndex = todo.projectIndex;

    const leftDiv = document.createElement("div");
    leftDiv.classList.add("left");

    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("checkbox");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.index = index;
    input.dataset.projectIndex = todo.projectIndex;
    input.id = `todo-${index}`;

    if (todo.complete){
        input.checked = true;
        todoDiv.classList.add("completed-task");
    }

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = todo.title;

    const expandButton = document.createElement("button");
    expandButton.classList.add("expand");
    expandButton.textContent = "▼";
    expandButton.dataset.index = index;
    expandButton.dataset.projectIndex = todo.projectIndex;

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.textContent = "✍";
    editButton.dataset.index = index;
    editButton.dataset.projectIndex = todo.projectIndex;

    const removeButton = document.createElement("button");
    removeButton.classList.add("task-remove");
    removeButton.textContent = "🗑";
    removeButton.dataset.index = index;
    removeButton.dataset.projectIndex = todo.projectIndex;

    const important = document.createElement("button");
    important.classList.add("important-button");
    important.textContent = "☆";
    important.dataset.index = index;
    important.dataset.projectIndex = todo.projectIndex;

    if (todo.important) {
        important.style.backgroundColor = "pink";
    }

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info");

    const datePara = document.createElement("p");
    datePara.classList.add("due-date");
    if (todo.dueDate === "") {
        todo.dueDate = "No Due Date";
    }


    if (isValid(new Date(todo.dueDate))) {
        const formattedDate = format(new Date (todo.dueDate), "dd/MM/yyyy");
        datePara.textContent = formattedDate;
    }

    else {
        datePara.textContent = todo.dueDate;
    }

    const rightDiv = document.createElement("div");
    rightDiv.classList.add("right");

    const priorityPara = document.createElement("p");
    priorityPara.textContent = `#${project.name}`;

    if (!addRightDiv) {
        priorityPara.style.display = "none";
    }

    rightDiv.appendChild(priorityPara);
    infoDiv.append(label, expandButton, editButton, removeButton, important, datePara);

    checkboxDiv.append(input);

    leftDiv.append(checkboxDiv, infoDiv);

    initialDiv.append(leftDiv, rightDiv)

    todoDiv.append(initialDiv);

    todosDiv.append(todoDiv);

}

const clearTodos = function () {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => todo.remove() );
}

const displayAllTodos = function (project){
    clearTodos();
    project.todos.forEach((todo, index) => {
        displayTodo(project, todo, index, false);
    });
}

const expandTodo = function (todoDiv, project, todoIndex, button) {
    const infoDiv = todoDiv.querySelector(".info");
    const detailDiv = document.createElement("div");
    detailDiv.classList.add("detail");

    const priorityPara = document.createElement("p");
    priorityPara.textContent = `Priority: ${project.todos[todoIndex].priority}`;

    const detailPara = document.createElement("p");
    detailPara.textContent = project.todos[todoIndex].description;

    detailDiv.append(priorityPara, detailPara);
    infoDiv.appendChild(detailDiv);

    button.textContent = "▲";

    todoDiv.classList.add("expanded");
}

const retractTodo = function (todoDiv, button) {
    const detail = todoDiv.querySelector(".detail");
    detail.remove();

    button.textContent = "▼";
    todoDiv.classList.remove("expanded");
}

const removeTodo = function (index) {
    const todoDiv = document.querySelector(`.todo[data-index="${index}"`);
    todoDiv.remove();
}

const markImportant = function (starDiv) {
    starDiv.style.backgroundColor = "pink";
}

const unmarkImportant = function (starDiv) {
    starDiv.style.backgroundColor = "rgba(128, 128, 128, 0)";
}

const createSortButton = function () {
    const topDiv = document.querySelector(".top-nav");
    const button = document.createElement("button");
    button.classList.add("sort-button");
    button.textContent = "Sort by Date (Ascending)";

    topDiv.appendChild(button);
}

const clearSortButton = function () {
    const sortButton = document.querySelector(".sort-button");
    sortButton.remove();
}

const showProjectUI = function (addButton, edit = false) {
    if (edit){
        const confirmProject = document.querySelector(".confirm-project");
        confirmProject.classList.add("confirm-edit-project");
    }
    const addUi = document.querySelector(".add-project-ui");
    addButton.style.display = "none";
    addUi.style.display = "flex";
}

const hideProjectUI = function (addButton) {
    const confirmProject = document.querySelector(".confirm-project");
    const addUi = document.querySelector(".add-project-ui");
    addButton.style.display = "block";
    addUi.style.display = "none";
    confirmProject.classList.remove("confirm-edit-project");
}

const showTaskUI = function (edit = false) {
    if (edit) {
        const confirmTask = document.querySelector(".confirm");
        confirmTask.classList.add("confirm-edit");
    }
    const addUi = document.querySelector(".add-task-ui");
    hideAddTaskButton();
    addUi.style.display = "block";
}

const hideTaskUI = function () {
    const confirmTask = document.querySelector(".confirm");
    confirmTask.classList.remove("confirm-edit");
    const addUi = document.querySelector(".add-task-ui");
    showAddTaskButton();
    addUi.style.display = "none";
}

const hideAddTaskButton = function () {
    const button = document.querySelector(".add-task");
    button.style.display = "none";
}

const showAddTaskButton = function () {
    const button = document.querySelector(".add-task");
    button.style.display = "block";
}



export {displayNavProject, displayProjectName, displayAllProjectsNav, removeProjectNav, displayTodo, displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton, markImportant, unmarkImportant, createSortButton, clearSortButton};