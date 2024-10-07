import {Project, Todo, handleProjects} from "./projects.js";

const projects = document.querySelector(".projects");
const todosDiv = document.querySelector(".todos");
const projectName = document.querySelector(".project-name")

const displayNavProject = function (name) {
    const header = document.createElement("h3");
    header.textContent = name;
    projects.appendChild(header);
}

const displayProjectName = function (project) {
    projectName.textContent = project.name;


}

const displayTodos = function (project){
    project.todos.forEach((todo, index) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.dataset.index = index;

        const leftDiv = document.createElement("div");
        leftDiv.classList.add("left");

        const topDiv = document.createElement("div");
        topDiv.classList.add("top");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = `todo-${index}`;

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = todo.title;

        const expandButton = document.createElement("button");
        expandButton.textContent = "▼";

        const bottomDiv = document.createElement("div");
        bottomDiv.classList.add("bottom");

        const datePara = document.createElement("p");
        datePara.textContent = todo.dueDate;

        const rightDiv = document.createElement("div");
        rightDiv.classList.add("right");

        const priorityPara = document.createElement("p");
        priorityPara.textContent = `Priority: ${todo.priority}`;

        rightDiv.appendChild(priorityPara);
        bottomDiv.appendChild(datePara);

        topDiv.append(input, label, expandButton);

        leftDiv.append(topDiv, bottomDiv);

        todoDiv.append(leftDiv, rightDiv);

        todosDiv.append(todoDiv);



    });
}



export {displayNavProject, displayProjectName, displayTodos};