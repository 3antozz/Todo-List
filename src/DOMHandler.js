import {format, isValid} from "date-fns";

const displayNavProject = function (project) {
    const projects = document.querySelector(".projects");

    const projectNavDiv = document.createElement("div");
    projectNavDiv.dataset.index = project.index;
    projectNavDiv.classList.add("project-div");

    const header = document.createElement("button");
    header.classList.add("project-nav")
    header.textContent = project.name;
    header.dataset.index = project.index;

    const editProject = document.createElement("button");
    editProject.classList.add("project-edit-button");
    editProject.textContent = "✍";
    editProject.dataset.index = project.index;

    const removeProject = document.createElement("button");
    removeProject.classList.add("project-remove-button");
    removeProject.textContent = "🗑";
    removeProject.dataset.index = project.index;

    projectNavDiv.append(header, editProject, removeProject);


    projects.appendChild(projectNavDiv);
}

const displayAllProjectsNav = function (projects) {
    clearProjectHeaders();
    projects.forEach((project) => {
        displayNavProject(project);
    })
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

    switch (todo.priority) {
        case "Low":
            todoDiv.classList.add("low")
            break;
    
        case "Normal":
            todoDiv.classList.add("normal")
            break;
        case "High":
            todoDiv.classList.add("high");
            break;
    }

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

const editTask = function (project, task) {
    const taskDiv = document.querySelector(`.todo[data-index="${task.index}"][data-project-index="${project.index}"]`);
    const label = taskDiv.querySelector("label");
    label.textContent = task.title;

    const description = taskDiv.querySelector(".task-description");
    description.textContent = task.description;

    const date = taskDiv.querySelector(".due-date");
    date.textContent = task.dueDate;

    const priority = taskDiv.querySelector(".task-priority");
    priority.textContent = `Priority: ${task.priority}`;
}

const clearTodos = function () {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => todo.remove() );
}

const displayAllTodos = function (project){
    clearTodos();
    project.todos.forEach((todo) => {
        displayTodo(project, todo, todo.index, false);
    });
}

const expandTodo = function (todoDiv, project, todoIndex, button) {
    const infoDiv = todoDiv.querySelector(".info");
    const detailDiv = document.createElement("div");
    detailDiv.classList.add("detail");

    const priorityPara = document.createElement("p");
    priorityPara.classList.add("task-priority");
    priorityPara.textContent = `Priority: ${project.getTodo(todoIndex).priority}`;

    const detailPara = document.createElement("p");
    detailPara.classList.add("task-description");
    detailPara.textContent = project.getTodo(todoIndex).description;

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

const removeTodo = function (projectIndex, todoIndex) {
    const todoDiv = document.querySelector(`.todo[data-index="${todoIndex}"][data-project-index="${projectIndex}"]`);
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
    button.classList.add("sort-button", "default");
    button.textContent = "Sort by Date (Ascending)";

    topDiv.appendChild(button);
}

const switchSortButton = function () {
    const button = document.querySelector(".sort-button");
    console.log("called!");

    if (button.classList.contains("ascending")) {
        button.textContent = "Sort by Date (Ascending)";
        button.classList.remove("ascending");
        button.classList.add("default");
    }

    else if (button.classList.contains("sort-priority")) {
        button.textContent = "Sort by Default";
        button.classList.remove("sort-priority");
        button.classList.add("ascending");

    }

    else if (button.classList.contains("default")) {
        button.textContent = "Sort by Priority";
        button.classList.add("sort-priority");
        button.classList.remove("default");
    }
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



export {displayNavProject, displayProjectName, displayAllProjectsNav, removeProjectNav, displayTodo, displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton, markImportant, unmarkImportant, createSortButton, clearSortButton, switchSortButton, editTask};