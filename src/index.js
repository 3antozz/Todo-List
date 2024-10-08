import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import { format, isBefore, isTomorrow, isThisWeek, isThisMonth, isToday, compareAsc, compareDesc } from "date-fns";
import { displayAllProjectsNav, displayProjectName, displayTodos, expandTodo, retractTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI } from "./DOMHandler.js";


(function init (){
    const projectsHandler = handleProjects();
    const defaultProject = projectsHandler.getProject(0);
    const clickHandler = mouseClicksHandler(projectsHandler);
    staticEventListeners(projectsHandler, clickHandler);
    displayAllProjectsNav(projectsHandler.getAllProjects());
    displayProjectName(defaultProject);
    displayTodos(defaultProject);
    clickHandler.expandButtonsListener();
    clickHandler.projectsEventListener();
})();

function staticEventListeners (projectsHandler, clickHandler) {
    const confirmProject = document.querySelector(".form-buttons button:first-child");
    const cancelProject = document.querySelector(".form-buttons :not(button:first-child)");
    const addButton = document.querySelector(".add-project");
    const input = document.querySelector("#proj-name");
    const confirmTask = document.querySelector(".add-task-ui button:first-of-type")
    const cancelTask = document.querySelector(".add-task-ui button:not(:first-of-type)");
    const titleInput = document.querySelector("#task-name");
    const descInput = document.querySelector("#task-desc");
    const dateInput = document.querySelector("#task-date");
    const radioButtons = document.querySelectorAll(`input[type="radio"]`)
    const addTaskButton = document.querySelector(".add-task");


    const addProjectButtonHandler = (function () {
        addButton.addEventListener("click", () => {
            showProjectUI(addButton);
        })
    })();

    const addTaskButtonHandler = (function () {
        addTaskButton.addEventListener("click", () => {
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
                input.value = "";
            }
        });
        cancelProject.addEventListener("click", () => {
            hideProjectUI(addButton);
        })
    })()

    const taskFormButtonsHandler = (function () {
        confirmTask.addEventListener("click", (event) => {
            if (titleInput.checkValidity()){
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
            }
        });
        cancelTask.addEventListener("click", (event) => {
            hideTaskUI(addTaskButton);
        })
    })()

};

function mouseClicksHandler  (projectsHandler) {
    let currentProjectIndex = 0;

    const getCurrentProject = () => projectsHandler.getProject(currentProjectIndex);
    
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
                handleProjectSwitch(event.target.dataset.index);
            })
        })
    }
    
    const handleProjectSwitch = function () {
        const currentProject = projectsHandler.getProject(currentProjectIndex);
        displayProjectName(currentProject);
        displayTodos(currentProject);
        expandButtonsListener();
    }

    return {projectsEventListener, expandButtonsListener, getCurrentProject}
    

}
