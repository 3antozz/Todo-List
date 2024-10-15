import {format, isValid} from "date-fns";

const displayNavProject = function (project) {
    const colors = ["red", "blue", "green", "rgb(18, 160, 146)", "blueviolet", "maroon", "indigo" ];
    const colorIndex = Math.floor(Math.random() * 8);
    const projects = document.querySelector(".projects");

    const projectNavDiv = document.createElement("div");
    projectNavDiv.dataset.index = project.index;
    projectNavDiv.classList.add("project-div");

    const header = document.createElement("button");
    header.classList.add("project-nav")
    header.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pound</title><path d="M5.41,21L6.12,17H2.12L2.47,15H6.47L7.53,9H3.53L3.88,7H7.88L8.59,3H10.59L9.88,7H15.88L16.59,3H18.59L17.88,7H21.88L21.53,9H17.53L16.47,15H20.47L20.12,17H16.12L15.41,21H13.41L14.12,17H8.12L7.41,21H5.41M9.53,9L8.47,15H14.47L15.53,9H9.53Z" /></svg>${project.name}`;
    header.style.fill = colors[colorIndex];
    header.dataset.index = project.index;

    const editProject = document.createElement("button");
    editProject.classList.add("project-edit-button");
    editProject.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>`;
    editProject.dataset.index = project.index;

    const removeProject = document.createElement("button");
    removeProject.classList.add("project-remove-button");
    removeProject.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;
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
    projectName.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pound</title><path d="M5.41,21L6.12,17H2.12L2.47,15H6.47L7.53,9H3.53L3.88,7H7.88L8.59,3H10.59L9.88,7H15.88L16.59,3H18.59L17.88,7H21.88L21.53,9H17.53L16.47,15H20.47L20.12,17H16.12L15.41,21H13.41L14.12,17H8.12L7.41,21H5.41M9.53,9L8.47,15H14.47L15.53,9H9.53Z" /></svg> ${project.name}`;
}

const setProjectHeaderName = function (name) {
    const projectName = document.querySelector(".project-name");
    projectName.innerHTML = name;
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
    expandButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>triangle-down</title><path d="M1 3H23L12 22" /></svg>`;
    expandButton.dataset.index = index;
    expandButton.dataset.projectIndex = todo.projectIndex;

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>`;
    editButton.dataset.index = index;
    editButton.dataset.projectIndex = todo.projectIndex;

    const removeButton = document.createElement("button");
    removeButton.classList.add("task-remove");
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;
    removeButton.dataset.index = index;
    removeButton.dataset.projectIndex = todo.projectIndex;

    const important = document.createElement("button");
    important.classList.add("important-button");
    important.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg>`;
    important.dataset.index = index;
    important.dataset.projectIndex = todo.projectIndex;

    if (todo.important) {
        markImportant(important);
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
        datePara.textContent = `Due: ${formattedDate}`;
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
    infoDiv.append(label, expandButton, important, editButton, removeButton, datePara);

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
    project.getUncompleteTodos().forEach((todo) => {
        displayTodo(project, todo, todo.index, false);
    });
}

const selectButton = (button) => button.classList.add("selected");

const unselectButton = (button) => button.classList.remove("selected");


const expandTodo = function (todoDiv, project, todoIndex, button) {
    const detailDiv = document.createElement("div");
    detailDiv.classList.add("detail");

    const priorityPara = document.createElement("p");
    priorityPara.classList.add("task-priority");
    priorityPara.textContent = `Priority: ${project.getTodo(todoIndex).priority}`;

    const detailPara = document.createElement("p");
    detailPara.classList.add("task-description");
    if (project.getTodo(todoIndex).description != "") {
        detailPara.innerHTML = `<strong>Description:</strong> ${project.getTodo(todoIndex).description}`;
    }
    else {
        detailPara.textContent = project.getTodo(todoIndex).description;
    }


    detailDiv.append(priorityPara, detailPara);
    todoDiv.appendChild(detailDiv);

    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>triangle</title><path d="M1,21H23L12,2" /></svg>`;
    button.classList.add("important-task");

    todoDiv.classList.add("expanded");
}

const retractTodo = function (todoDiv, button) {
    const detail = todoDiv.querySelector(".detail");
    detail.remove();

    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>triangle-down</title><path d="M1 3H23L12 22" /></svg>`;
    button.classList.remove("important-task");
    todoDiv.classList.remove("expanded");
}

const removeTodo = function (projectIndex, todoIndex) {
    const todoDiv = document.querySelector(`.todo[data-index="${todoIndex}"][data-project-index="${projectIndex}"]`);
    todoDiv.remove();
}

const markImportant = function (starDiv) {
    starDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star</title><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`
    starDiv.classList.add("important-task");
}

const unmarkImportant = function (starDiv) {
    starDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg>`;
    starDiv.classList.remove("important-task");
}

const highlightTask = function (todoDiv) {
    todoDiv.classList.add("edited");
}

const unhighlightAllTasks = function () {
    const divs = document.querySelectorAll(".todo");
    divs.forEach((div) => div.classList.remove("edited"));
}

const highlightProject = function (projectDiv) {
    projectDiv.classList.add("edited");
}

const unhighlightAllProjects = function () {
    const divs = document.querySelectorAll(".project-div");
    divs.forEach((div) => div.classList.remove("edited"));
}

const createSortButton = function () {
    const topDiv = document.querySelector(".top-nav");
    const button = document.createElement("button");
    button.classList.add("sort-button", "default");
    button.textContent = "Sorted by Default";

    topDiv.appendChild(button);
}

const switchSortButton = function () {
    const button = document.querySelector(".sort-button");

    if (button.classList.contains("ascending")) {
        button.textContent = "Sorted by Priority";
        button.classList.add("sort-priority");
        button.classList.remove("ascending");
    }

    else if (button.classList.contains("sort-priority")) {
        button.textContent = "Sorted by Default";
        button.classList.remove("sort-priority");
        button.classList.add("default");

    }

    else if (button.classList.contains("default")) {

        button.textContent = "Sorted by Date (Ascending)";
        button.classList.add("ascending");
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



export {displayProjectName, displayAllProjectsNav, removeProjectNav, displayTodo, displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton, markImportant, unmarkImportant, createSortButton, clearSortButton, switchSortButton, selectButton, unselectButton, unhighlightAllTasks, highlightTask, highlightProject, unhighlightAllProjects};