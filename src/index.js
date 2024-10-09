import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import { format, isBefore, isTomorrow, isThisWeek, isThisMonth, isToday, compareAsc, compareDesc } from "date-fns";
import { displayAllProjectsNav, displayProjectName, displayTodos, expandTodo, retractTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI } from "./DOMHandler.js";



(function init (){
    const projectsHandler = handleProjects();
    const defaultProject = projectsHandler.getProject(0);
    const clickHandler = dynamicEventsListener(projectsHandler);
    staticEventListeners(projectsHandler, clickHandler);
    displayAllProjectsNav(projectsHandler.getAllProjects());
    displayProjectName(defaultProject);
    displayTodos(defaultProject);
    clickHandler.expandButtonsListener();
    clickHandler.projectsEventListener();
    clickHandler.editTaskEventListener();
})();

function staticEventListeners (projectsHandler, clickHandler) {
    const confirmProject = document.querySelector(".form-buttons button:first-child");
    const cancelProject = document.querySelector(".form-buttons :not(button:first-child)");
    const addButton = document.querySelector(".add-project");
    const input = document.querySelector("#proj-name");
    const confirmTask = document.querySelector(".confirm");
    const cancelTask = document.querySelector(".add-task-ui button:not(:first-of-type)");
    const titleInput = document.querySelector("#task-name");
    const descInput = document.querySelector("#task-desc");
    const dateInput = document.querySelector("#task-date");
    const radioButtons = document.querySelectorAll(`input[type="radio"]`);
    const addTaskButton = document.querySelector(".add-task");

    const addTask = function (event) {
        let priorityValue;
        radioButtons.forEach((button) => {
            if (button.checked) {
                priorityValue = button.value;
            }
        })
        const currentProject = clickHandler.getCurrentProject();
        event.preventDefault();
        const todo = new Todo(titleInput.value, descInput.value, dateInput.value, priorityValue);
        currentProject.addTodo(todo);
        displayTodos(currentProject);
        hideTaskUI(addTaskButton);
        clickHandler.expandButtonsListener(clickHandler.getCurrentProject());
        clickHandler.editTaskEventListener();
    }

    const editTodo = function (event) {
        let priorityValue;
        radioButtons.forEach((button) => {
            if (button.checked) {
                priorityValue = button.value;
            }
        })
        const currentProject = clickHandler.getCurrentProject();
        const todoIndex = clickHandler.getCurrentTodoIndex();
        const Todo = currentProject.getTodo(todoIndex);
        event.preventDefault();
        Todo.editTodo("title", titleInput.value);
        Todo.editTodo("description", descInput.value);
        Todo.editTodo("dueDate", dateInput.value);
        Todo.editTodo("priority", priorityValue);
        displayTodos(currentProject);
        hideTaskUI(addTaskButton);
        clickHandler.expandButtonsListener(clickHandler.getCurrentProject());
        clickHandler.editTaskEventListener();
    }


    const addProjectButtonHandler = (function () {
        addButton.addEventListener("click", () => {
            showProjectUI(addButton);
        })
    })();

    const addTaskButtonHandler = (function () {
        addTaskButton.addEventListener("click", () => {
            titleInput.value = "";
            descInput.value = "";
            dateInput.value = "";
            radioButtons[1].checked = true;
            showTaskUI(addTaskButton);
        })
    })();

    const projectFormButtonsHandler = (function () {
        confirmProject.addEventListener("click", (event) => {
            if (input.checkValidity()){
                event.preventDefault();
                const project = new Project(input.value);
                projectsHandler.addProject(project);
                displayAllProjectsNav(projectsHandler.getAllProjects());
                hideProjectUI(addButton);
                clickHandler.projectsEventListener();
                clickHandler.handleProjectSwitch(project, project.index);
                input.value = "";
            }
        });
        cancelProject.addEventListener("click", () => {
            hideProjectUI(addButton);
        })
    })()

    const taskFormButtonsHandler = (function () {
        confirmTask.addEventListener("click", (event) => {
            if (!(confirmTask.classList.contains("confirm-edit"))) {
                if (titleInput.checkValidity()){
                    addTask(event);
                }
            }
            else {
                if (titleInput.checkValidity()){
                    editTodo(event);
                }
            }
        });
        cancelTask.addEventListener("click", (event) => {
            hideTaskUI(addTaskButton);
        })
    })()

};

function dynamicEventsListener  (projectsHandler) {
    const addTaskButton = document.querySelector(".add-task");
    let currentProjectIndex = 0;
    let currentTodoIndex;

    const getCurrentProject = () => projectsHandler.getProject(currentProjectIndex);
    const getCurrentTodoIndex = () => currentTodoIndex;
    
    const handleExpandButton = function (button) {
        let todoIndex = button.dataset.index;
        const currentProject = projectsHandler.getProject(currentProjectIndex);
        const todoDiv = document.querySelector(`.todo[data-index="${button.dataset.index}"]`)
        if (todoDiv.classList.contains("expanded")){
            retractTodo(todoDiv, button);
        }
        else {
            expandTodo(todoDiv, currentProject, todoIndex, button);
        }
    }
    
    const expandButtonsListener = function () {
        const todoButtons = document.querySelectorAll(".expand");
        todoButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            handleExpandButton(event.target);
        })
    });
    }

    const projectsEventListener = function () {
        const projectHeaders = document.querySelectorAll(".project-nav");
        projectHeaders.forEach((project) => {
            project.addEventListener("click", (event) => {
                currentProjectIndex = event.target.dataset.index;
                handleProjectSwitch();
            })
        })
    }
    
    const handleProjectSwitch = function (currentProject = projectsHandler.getProject(currentProjectIndex), projectIndex = currentProjectIndex) {
        displayProjectName(currentProject);
        displayTodos(currentProject);
        expandButtonsListener();
        editTaskEventListener();
        currentProjectIndex = projectIndex;
    }

    const editTaskEventListener = function () {
        const editButtons = document.querySelectorAll(".edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                showTaskUI(addTaskButton, true);
                editTask(event.target);
            })
        })
    }

    const editTask = function (button) {
        currentTodoIndex = button.dataset.index;
        const todo = getCurrentProject().getTodo(button.dataset.index);
        const titleInput = document.querySelector("#task-name");
        const descInput = document.querySelector("#task-desc");
        const dateInput = document.querySelector("#task-date");
        titleInput.value = todo.title;
        descInput.value = todo.description;
        dateInput.value = todo.dueDate;
    }



    return {projectsEventListener, expandButtonsListener, getCurrentProject, editTaskEventListener, handleProjectSwitch, getCurrentTodoIndex}
    

}
