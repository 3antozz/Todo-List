import {Project, Todo, handleProjects} from "./projects.js";

const displayNavProject = function (name, index) {
    const projects = document.querySelector(".projects");
    const header = document.createElement("button");
    header.classList.add("project-nav")
    header.textContent = name;
    header.dataset.index = index;
    projects.appendChild(header);
}

const displayProjectName = function (project) {
    const projectName = document.querySelector(".project-name")
    projectName.textContent = project.name;
}

const displayAllProjectsNav = function (projects) {
    const projectsHeaders = document.querySelectorAll(".project-nav");
    projectsHeaders.forEach((project) => {
        project.remove();
    })
    projects.forEach((project, index) => {
        displayNavProject(project.name, index);
    })
}

const displayTodos = function (project){
    const todosDiv = document.querySelector(".todos");
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => todo.remove() );
    project.todos.forEach((todo, index) => {
        const initialDiv = document.createElement("div");
        initialDiv.classList.add("initial");


        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.dataset.index = index;

        const leftDiv = document.createElement("div");
        leftDiv.classList.add("left");

        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("checkbox");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = `todo-${index}`;
        if (todo.complete) {
            input.checked = true;
        }

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = todo.title;

        const expandButton = document.createElement("button");
        expandButton.classList.add("expand");
        expandButton.textContent = "▼";
        expandButton.dataset.index = index;

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");

        const datePara = document.createElement("p");
        datePara.classList.add("due-date");
        if (todo.dueDate === "") {
            todo.dueDate = "No Due Date";
        }
        datePara.textContent = todo.dueDate;

        const rightDiv = document.createElement("div");
        rightDiv.classList.add("right");

        const priorityPara = document.createElement("p");
        priorityPara.textContent = `#${project.name}`;

        rightDiv.appendChild(priorityPara);
        infoDiv.append(label, expandButton, datePara);

        checkboxDiv.append(input);

        leftDiv.append(checkboxDiv, infoDiv);

        initialDiv.append(leftDiv, rightDiv)

        todoDiv.append(initialDiv);

        todosDiv.append(todoDiv);





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

const showProjectUI = function (addButton) {
    const addUi = document.querySelector(".add-project-ui");
    addButton.style.display = "none";
    addUi.style.display = "block";
}

const hideProjectUI = function (addButton) {
    const addUi = document.querySelector(".add-project-ui");
    addButton.style.display = "block";
    addUi.style.display = "none";
}

const showTaskUI = function (addButton) {
    const addUi = document.querySelector(".add-task-ui");
    addButton.style.display = "none";
    addUi.style.display = "block";
}

const hideTaskUI = function (addButton) {
    const addUi = document.querySelector(".add-task-ui");
    addButton.style.display = "block";
    addUi.style.display = "none";
}



export {displayNavProject, displayProjectName, displayAllProjectsNav, displayTodos, expandTodo, retractTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI};