import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import { format, isBefore, isTomorrow, isThisWeek, isThisMonth, isToday, compareAsc, compareDesc } from "date-fns";
import { displayAllProjectsNav, displayProjectName, removeProjectNav, displayTodo,  displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton } from "./DOMHandler.js";



(function init (){
    const projectsHandler = handleProjects();
    const defaultProject = projectsHandler.getProject(0);
    const clickHandler = dynamicButtonsEventListeners(projectsHandler);
    const dates = sortDates(projectsHandler);
    sortProjectsButtonsHandler(projectsHandler, clickHandler, dates);
    staticButtonsEventListeners(projectsHandler, clickHandler);
    displayAllProjectsNav(projectsHandler.getAllProjects());
    displayProjectName(defaultProject);
    displayAllTodos(defaultProject);
    clickHandler.expandButtonsListener();
    clickHandler.editTaskEventListener();
    clickHandler.projectsEventListener();
    clickHandler.editProjectEventListener();
    clickHandler.removeProjectEventListener();
    clickHandler.removeTaskEventListener();
    clickHandler.checkboxEventListener()
})();

function staticButtonsEventListeners (projectsHandler, clickHandler) {
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



    const addProject = function (event) {
        event.preventDefault();
        const project = new Project(input.value);
        projectsHandler.addProject(project);
        displayAllProjectsNav(projectsHandler.getAllProjects());
        hideProjectUI(addButton);
        clickHandler.projectsEventListener();
        clickHandler.handleProjectSwitch(project, project.index);
        clickHandler.editProjectEventListener();
        clickHandler.removeProjectEventListener();
        input.value = "";
    }

    const editProject = function (event) {
        event.preventDefault();
        const project = clickHandler.getEditedProject();
        project.editProject(input.value);
        hideProjectUI(addButton);
        displayAllProjectsNav(projectsHandler.getAllProjects());
        clickHandler.projectsEventListener();
        clickHandler.editProjectEventListener();
        clickHandler.removeProjectEventListener();
        if (project === clickHandler.getCurrentProject()) {
            displayProjectName(project);
        }
    }

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
        currentProject.addTodo(todo, clickHandler.getCurrentProjectIndex());
        displayAllTodos(currentProject);
        hideTaskUI(addTaskButton);
        clickHandler.expandButtonsListener(clickHandler.getCurrentProject());
        clickHandler.editTaskEventListener();
        clickHandler.removeTaskEventListener();
        clickHandler.checkboxEventListener()
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
        displayAllTodos(currentProject);
        hideTaskUI(addTaskButton);
        clickHandler.expandButtonsListener(clickHandler.getCurrentProject());
        clickHandler.editTaskEventListener();
        clickHandler.removeTaskEventListener();
        clickHandler.checkboxEventListener()
    }



    const addProjectButtonHandler = (function () {
        addButton.addEventListener("click", () => {
            showProjectUI(addButton);
            input.value = "";
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
            if (!(confirmProject.classList.contains("confirm-edit-project"))){
                if (input.checkValidity()){
                    addProject(event);
                }
            }
            else {
                if (input.checkValidity()) {
                    editProject(event);
                }
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







function dynamicButtonsEventListeners  (projectsHandler) {
    const addTaskButton = document.querySelector(".add-task");
    let currentProjectIndex = 0;
    let currentTodoIndex;
    let editButtonIndex;

    const getCurrentProjectIndex = () => currentProjectIndex;
    const getCurrentProject = () => projectsHandler.getProject(currentProjectIndex);
    const getCurrentTodoIndex = () => currentTodoIndex;
    const getEditedProject = () => projectsHandler.getProject(editButtonIndex);



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
        displayAllTodos(currentProject);
        showAddTaskButton();
        expandButtonsListener();
        editTaskEventListener();
        removeTaskEventListener();
        checkboxEventListener();
        currentProjectIndex = projectIndex;
    }

    const editProjectEventListener = function () {
        const editButtons = document.querySelectorAll(".project-edit-button");
        const addButton = document.querySelector(".add-project");
        editButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                showProjectUI(addButton, true);
                editProject(event.target);
                editButtonIndex = event.target.dataset.index;
            })
        })
    }

    const editProject = function (button) {
        const project = projectsHandler.getProject(button.dataset.index);
        const projectTitle = document.querySelector("#proj-name");
        projectTitle.value = project.name;
    }

    const removeProjectEventListener = function () {
        const deleteButtons = document.querySelectorAll(".project-remove-button");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                removeProject(event.target);
            })
        })
    }

    const removeProject = function (button) {
        removeProjectNav(button.dataset.index);
        projectsHandler.removeFromProjects(button.dataset.index);
        if (projectsHandler.getAllProjects().length === 0) {
            clearTodos();
            setProjectHeaderName("Please Add a New Project!");
            hideAddTaskButton();
        }
        else {
            currentProjectIndex = button.dataset.index - 1;
            handleProjectSwitch();
        }
    }
    
    const handleExpandButton = function (button) {
        let todoIndex = button.dataset.index;
        const currentProject = projectsHandler.getProject(button.dataset.projectIndex);
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

    const removeTaskEventListener = function () {
        const removeButtons = document.querySelectorAll(".task-remove");
        removeButtons.forEach ((button) => {
            button.addEventListener("click", (event) => {
                removeTask(event.target)
            })
        })
    }

    const removeTask = function (button) {
        const todoIndex = button.dataset.index;
        removeTodo(todoIndex);
        const project = projectsHandler.getProject(button.dataset.projectIndex);
        project.removeTodo(todoIndex);
    }

    const checkboxEventListener = function () {
        const checkboxButtons = document.querySelectorAll(`input[type="checkbox"]`);
        checkboxButtons.forEach((checkbox, index) => {
            checkbox.addEventListener("change", (event) => {
                completeSwitch(event.target);
            })
        })
    }

    const completeSwitch = function (checkbox) {
        const project = projectsHandler.getProject(checkbox.dataset.projectIndex);
        const todo = project.getTodo(checkbox.dataset.index);
        const todoDiv = document.querySelector(`.todo[data-project-index="${checkbox.dataset.projectIndex}"][data-index="${checkbox.dataset.index}"]`);
        if (todo.complete) {
            todo.editTodo("complete", false);
            todoDiv.classList.remove("completed-task");
        }
        else {
            todo.editTodo("complete", true);
            todoDiv.classList.add("completed-task");
        }
    }



    return {projectsEventListener, expandButtonsListener, getCurrentProject,  getCurrentProjectIndex, editTaskEventListener, handleProjectSwitch, getCurrentTodoIndex, editProjectEventListener, getEditedProject, removeProjectEventListener, removeTaskEventListener, checkboxEventListener}
    

}



function sortProjectsButtonsHandler (projectsHandler, clickHandler, sortDates) {

    const inboxHandler = (function () {
        const inboxButton = document.querySelector(".inbox")
        inboxButton.addEventListener("click", (event) => {
            const tasks = projectsHandler.getAllUncompletedTasks();
            clearTodos();
            tasks.forEach((task) => {
                const project = projectsHandler.getProject(task.projectIndex);
                displayTodo(project, task, task.index);
            })
            clickHandler.expandButtonsListener();
            clickHandler.editTaskEventListener();
            clickHandler.removeTaskEventListener();
            clickHandler.checkboxEventListener();
            if (!(projectsHandler.getAllProjects().length === 0)) {
                showAddTaskButton();
                setProjectHeaderName("Inbox");
            }
        })
    })();

    const TodayHandler = (function () {
        const todayButton = document.querySelector(".today");
        todayButton.addEventListener("click", (event) => {
            const todayTasks = sortDates.getTodayTodos();
            clearTodos();
            todayTasks.forEach((task) => {
                const project = projectsHandler.getProject(task.projectIndex);
                displayTodo(project, task, task.index);
            })
            clickHandler.expandButtonsListener();
            clickHandler.editTaskEventListener();
            clickHandler.removeTaskEventListener();
            clickHandler.checkboxEventListener();
            if (!(projectsHandler.getAllProjects().length === 0)) {
                showAddTaskButton();
                setProjectHeaderName("Today");
            }
        })
    })();
}


function sortDates (projectsHandler) {

    const getTodayTodos = function () {
        const AllTasks = projectsHandler.getAllUncompletedTasks();

        const TodayTasks = AllTasks.filter((task) => {
            return isToday(task.dueDate);
        })

        return TodayTasks;
    }


    return {getTodayTodos}


}






