import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import {isTomorrow, isThisWeek, isToday, compareAsc, isFuture } from "date-fns";
import { displayAllProjectsNav, displayProjectName, removeProjectNav, displayTodo,  displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton, markImportant, unmarkImportant, createSortButton, clearSortButton, switchSortButton, selectButton, unselectButton, unhighlightAllTasks, highlightTask, highlightProject, unhighlightAllProjects } from "./DOMHandler.js";

(function init (){
    const projectsHandler = handleProjects();

    const testStorage = JSON.parse(localStorage.getItem("Projects"));
    let firstProject;

    if (!testStorage || testStorage.length === 0) {
        firstProject = new Project("EL Wesmo");
        let defaultTodo1 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-11", "Normal");
        let defaultTodo3 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-09", "Low");
        let defaultTodo2 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-08", "High");
    
        firstProject.addTodo(defaultTodo1, 0);
        firstProject.addTodo(defaultTodo2, 0);
        firstProject.addTodo(defaultTodo3, 0);

        projectsHandler.addProject(firstProject);
        updateLocalStorage (projectsHandler);
    }

    else {
        const parsedProjects = JSON.parse(localStorage.getItem("Projects"));
        const projects = parsedProjects.map((project) => {
                const newProject = new Project(project.name);
                projectsHandler.addProject(newProject);
                const todos = project.todos.map((todo) => new Todo(todo.title, todo.description, todo.dueDate, todo.priority, todo.complete, todo.important));
                todos.forEach((todo) => newProject.addTodo(todo, newProject.index));
                return newProject;
        })
    }
    
    const defaultProject = projectsHandler.getFirstProject();
    const dates = sortDates(projectsHandler);
    const clickHandler = dynamicButtonsEventListeners(projectsHandler, dates);
    const projectSection = sortProjectsButtonsHandler(projectsHandler, clickHandler, dates);
    staticButtonsEventListeners(projectsHandler, clickHandler, dates, projectSection);
    displayProjectName(defaultProject);
    displayAllTodos(defaultProject);
    displayAllProjectsNav(projectsHandler.getAllProjects());
    clickHandler.expandButtonsListener();
    clickHandler.editTaskEventListener();
    clickHandler.projectsEventListener();
    clickHandler.editProjectEventListener();
    clickHandler.removeProjectEventListener();
    clickHandler.removeTaskEventListener();
    clickHandler.checkboxEventListener();
    clickHandler.importantTaskEventListener()
    clickHandler.navigationButtonsEventListeners();
    createSortButton();
    clickHandler.sortButtonEventListener(defaultProject.getAllTodos(), dates.sortAscending(defaultProject.getAllTodos()), dates.sortPriority(defaultProject.getAllTodos()), false);
})();

(function themeSwitcher () {
    const root = document.documentElement;

    if (localStorage.getItem("Theme")) {
        root.className = localStorage.getItem("Theme");
    }

    const themeButton = document.querySelector(".switch-theme");

    themeButton.addEventListener("click", () => {
        if (root.className === "light") {
            root.className = "dark";
            localStorage.setItem("Theme", "dark");
        }
        else {
            root.className = "light";
            localStorage.setItem("Theme", "light");
        }
    })

})();

function updateLocalStorage (projectsHandler) {
    localStorage.setItem("Projects", JSON.stringify(projectsHandler.getAllProjects()))
}

function staticButtonsEventListeners (projectsHandler, clickHandler, dates, projectSection) {
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


    const createTaskButtonsEventListeners = function () {
        clickHandler.expandButtonsListener();
        clickHandler.editTaskEventListener();
        clickHandler.removeTaskEventListener();
        clickHandler.checkboxEventListener();
        clickHandler.importantTaskEventListener();
    }

    const createProjectButtonsEventListeners = function () {
        clickHandler.projectsEventListener();
        clickHandler.editProjectEventListener();
        clickHandler.removeProjectEventListener();
        clickHandler.navigationButtonsEventListeners();
    }

    const navigationButtonsEventListeners = (function () {
        const buttons = document.querySelectorAll(".dates button");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((unselectedButton) => {
                    unselectButton(unselectedButton);
                })
                selectButton(button);
                const projectdiv = document.querySelector(".projects .selected")
                if (projectdiv) {
                    unselectButton(projectdiv);
                }
            })
        })
    })();


    



    const addProject = function (event) {
        event.preventDefault();
        const project = new Project(input.value);
        projectsHandler.addProject(project);
        updateLocalStorage (projectsHandler);
        displayAllProjectsNav(projectsHandler.getAllProjects());
        hideProjectUI(addButton);
        clickHandler.handleProjectSwitch(project, project.index);
        createProjectButtonsEventListeners();
        input.value = "";
    }

    const editProject = function (event) {
        event.preventDefault();
        const project = clickHandler.getEditedProject();
        project.editProject(input.value);
        updateLocalStorage (projectsHandler);
        hideProjectUI(addButton);
        displayAllProjectsNav(projectsHandler.getAllProjects());
        createProjectButtonsEventListeners();
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
        updateLocalStorage (projectsHandler);
        displayAllTodos(currentProject);
        hideTaskUI();
        createTaskButtonsEventListeners();
        clearSortButton();
        createSortButton();
        clickHandler.sortButtonEventListener(currentProject.getAllTodos(), dates.sortAscending(currentProject.getAllTodos()), dates.sortPriority(currentProject.getAllTodos()), false);
    }

    const editTodo = function (event) {
        let priorityValue;
        radioButtons.forEach((button) => {
            if (button.checked) {
                priorityValue = button.value;
            }
        })
        const currentProject = projectsHandler.getProject(clickHandler.getCurrentProjectIndex());
        const todoIndex = clickHandler.getCurrentTodoIndex();
        const Todo = currentProject.getTodo(todoIndex);
        event.preventDefault();
        Todo.editTodo("title", titleInput.value);
        Todo.editTodo("description", descInput.value);
        Todo.editTodo("dueDate", dateInput.value);
        Todo.editTodo("priority", priorityValue);
        Todo.editTodo("priorityValue", Todo.convertPriorityToInt(priorityValue));
        updateLocalStorage (projectsHandler);
        if (clickHandler.ifInProject()) {
            displayAllTodos(currentProject);
            createTaskButtonsEventListeners();
        }
        else {
            clearTodos();
            const tasks = projectSection.getCurrentSectionTasks();
            clickHandler.displaySortedTasks(tasks, true);
        }
        hideTaskUI();
        clearSortButton();
        createSortButton();
        clickHandler.sortButtonEventListener(currentProject.getAllTodos(), dates.sortAscending(currentProject.getAllTodos()), dates.sortPriority(currentProject.getAllTodos()), false);
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
            showTaskUI();
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
                    unhighlightAllProjects();
                }
            }
        });
        cancelProject.addEventListener("click", () => {
            hideProjectUI(addButton);
            unhighlightAllProjects();
        })
    })()

    const taskFormButtonsHandler = (function () {
        confirmTask.addEventListener("click", (event) => {
            if (!(confirmTask.classList.contains("confirm-edit"))) {
                if (titleInput.checkValidity()){
                    addTask(event);
                    if (clickHandler.ifInProject()) {
                        showAddTaskButton();
                    }
                }
            }
            else {
                if (titleInput.checkValidity()){
                    editTodo(event);
                    if (clickHandler.ifInProject()) {
                        showAddTaskButton();
                    }
                }
            }
        });
        cancelTask.addEventListener("click", (event) => {
            hideTaskUI();
            unhighlightAllTasks()
            if (clickHandler.ifInProject()) {
                showAddTaskButton();
            }
        })
    })()

};







function dynamicButtonsEventListeners  (projectsHandler, dates) {
    let currentProjectIndex = 0;
    let currentTodoIndex;
    let editButtonIndex;
    let isInProject = true;

    const getCurrentProjectIndex = () => currentProjectIndex;
    const getCurrentProject = () => projectsHandler.getProject(currentProjectIndex);
    const getCurrentTodoIndex = () => currentTodoIndex;
    const getEditedProject = () => projectsHandler.getProject(editButtonIndex);
    const ifInProject = () => isInProject;
    const setIfInProject = (boolean) => isInProject = boolean;



    const projectsEventListener = function () {
        const projectHeaders = document.querySelectorAll(".project-nav");
        projectHeaders.forEach((project) => {
            project.addEventListener("click", (event) => {
                currentProjectIndex = event.currentTarget.dataset.index;
                handleProjectSwitch();
            })
        })
    }

    const handleProjectSwitch = function (currentProject = projectsHandler.getProject(currentProjectIndex), projectIndex = currentProjectIndex) {
        clearSortButton();
        createSortButton()
        displayProjectName(currentProject);
        displayAllTodos(currentProject);
        showAddTaskButton();
        expandButtonsListener();
        editTaskEventListener();
        removeTaskEventListener();
        checkboxEventListener();
        importantTaskEventListener();
        hideTaskUI();
        sortButtonEventListener(currentProject.getAllTodos(), dates.sortAscending(currentProject.getAllTodos()), dates.sortPriority(currentProject.getAllTodos()), false);
        isInProject = true;
        currentProjectIndex = projectIndex;
    }

    const navigationButtonsEventListeners = function () {
        if (!(document.querySelector("nav .selected"))) {
            const firstProject = projectsHandler.getFirstProject();
            const firstSelection = document.querySelector(`.project-div[data-index="${firstProject.index}"]`);
            selectButton(firstSelection );
        }
        const buttons = document.querySelectorAll(".project-nav");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((selectedButton) => {
                    unselectButton(selectedButton.parentElement);
                })
                selectButton(button.parentElement);
                const selectedSection = document.querySelector(".dates .selected");
                if (selectedSection) {
                    unselectButton(selectedSection);
                }
            })
        })
    }

    const editProjectEventListener = function () {
        const editButtons = document.querySelectorAll(".project-edit-button");
        const addButton = document.querySelector(".add-project");
        editButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                showProjectUI(addButton, true);
                editProject(event.currentTarget);
                editButtonIndex = event.currentTarget.dataset.index;
            })
        })
    }

    const editProject = function (button) {
        const projectDiv = document.querySelector(`.project-div[data-index="${button.dataset.index}"]`);
        highlightProject(projectDiv);
        const project = projectsHandler.getProject(button.dataset.index);
        const projectTitle = document.querySelector("#proj-name");
        projectTitle.value = project.name;
    }

    const removeProjectEventListener = function () {
        const deleteButtons = document.querySelectorAll(".project-remove-button");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                removeProject(event.currentTarget);
            })
        })
    }

    const removeProject = function (button) {
        removeProjectNav(button.dataset.index);
        projectsHandler.removeFromProjects(button.dataset.index);
        updateLocalStorage (projectsHandler);
        displayAllProjectsNav(projectsHandler.getAllProjects());
        if (projectsHandler.getAllProjects().length === 0) {
            clearTodos();
            setProjectHeaderName("Please Add a New Project!");
            hideAddTaskButton();
        }
        else {
            currentProjectIndex = projectsHandler.getFirstProject().index;
            handleProjectSwitch();
            projectsEventListener();
            editProjectEventListener();
            removeProjectEventListener();
        }
    }
    
    const handleExpandButton = function (button) {
        let todoIndex = button.dataset.index;
        const currentProject = projectsHandler.getProject(button.dataset.projectIndex);
        const todoDiv = document.querySelector(`.todo[data-index="${todoIndex}"][data-project-index="${button.dataset.projectIndex}"]`)
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
            handleExpandButton(event.currentTarget);
        })
    });
    }


    const editTaskEventListener = function () {
        const editButtons = document.querySelectorAll(".edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                showTaskUI(true);
                editTask(event.currentTarget);
            })
        })
    }

    const editTask = function (button) {
        currentTodoIndex = button.dataset.index;
        currentProjectIndex = button.dataset.projectIndex;
        const todoDiv = document.querySelector(`.todo[data-index="${button.dataset.index}"][data-project-index="${button.dataset.projectIndex}"]`);
        highlightTask(todoDiv);
        const todo = projectsHandler.getProject(button.dataset.projectIndex).getTodo(button.dataset.index);
        const priorityValue = todo.priority;
        const radio = document.querySelector(`#${priorityValue}`);
        const titleInput = document.querySelector("#task-name");
        const descInput = document.querySelector("#task-desc");
        const dateInput = document.querySelector("#task-date");
        radio.checked = true;
        titleInput.value = todo.title;
        descInput.value = todo.description;
        dateInput.value = todo.dueDate;
    }

    const removeTaskEventListener = function () {
        const removeButtons = document.querySelectorAll(".task-remove");
        removeButtons.forEach ((button) => {
            button.addEventListener("click", (event) => {
                removeTask(event.currentTarget)
            })
        })
    }

    const removeTask = function (button) {
        const todoIndex = button.dataset.index;
        const projectIndex = button.dataset.projectIndex
        removeTodo(projectIndex, todoIndex);
        const project = projectsHandler.getProject(projectIndex);
        project.removeTodo(todoIndex);
        updateLocalStorage (projectsHandler);
    }

    const importantTaskEventListener = function () {
        const importantButton = document.querySelectorAll(".important-button");
        importantButton.forEach((button) => {
            button.addEventListener("click", (event) => {
                importanceSwitch(event.currentTarget);
            })
        })
    }

    const importanceSwitch = function (button) {
        const todoIndex = button.dataset.index;
        const project = projectsHandler.getProject(button.dataset.projectIndex);
        const todo = project.getTodo(todoIndex);
        if (todo.important) {
            todo.editTodo("important", false);
            unmarkImportant(button);
            updateLocalStorage (projectsHandler);
        }
        else {
            todo.editTodo("important", true);
            markImportant(button);
            updateLocalStorage (projectsHandler);
        }
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
            updateLocalStorage (projectsHandler);
        }
        else {
            todo.editTodo("complete", true);
            todoDiv.classList.add("completed-task");
            updateLocalStorage (projectsHandler);
        }
    }

    const sortButtonEventListener = function (defaultTasks, sortedTasks, priorityTasks, addRightDiv = true) {
        const sortButton = document.querySelector(".sort-button");
        sortButton.addEventListener("click", () => {
            if (sortButton.classList.contains("default")){
                clearTodos();
                displaySortedTasks(sortedTasks, addRightDiv);
                switchSortButton();
            }
            else if (sortButton.classList.contains("ascending")) {
                clearTodos();
                displaySortedTasks(priorityTasks, addRightDiv);
                switchSortButton();
            }
            else if(sortButton.classList.contains("sort-priority")){
                clearTodos();
                displaySortedTasks(defaultTasks, addRightDiv);
                switchSortButton();
            }
        })
    }

    const displaySortedTasks = function (tasks, addRightDiv) {
        tasks.forEach((task) => {
            const project = projectsHandler.getProject(task.projectIndex);
            if (addRightDiv) {
                displayTodo(project, task, task.index);
            }
            else {
                displayTodo(project, task, task.index, false);
            }
        })
        expandButtonsListener();
        editTaskEventListener();
        removeTaskEventListener();
        checkboxEventListener();
        importantTaskEventListener();
        hideTaskUI();
        if (addRightDiv) {
            hideAddTaskButton();
        }
    }



    return {projectsEventListener, expandButtonsListener, getCurrentProject,  getCurrentProjectIndex, editTaskEventListener, handleProjectSwitch, getCurrentTodoIndex, editProjectEventListener, getEditedProject, removeProjectEventListener, removeTaskEventListener, checkboxEventListener, importantTaskEventListener, sortButtonEventListener, ifInProject, setIfInProject, displaySortedTasks, navigationButtonsEventListeners }
    

}



function sortProjectsButtonsHandler (projectsHandler, clickHandler, sortDates) {

    let currentSection;

    const getCurrentSectionTasks = function () {
        switch (currentSection) {
            case "upcoming":
                return sortDates.getUpcomingTodos();
        
            case "today":
                return sortDates.getTodayTodos();

            case "tomorrow":
                return sortDates.getTomorrowTodos();
        
            case "week":
                return sortDates.getWeekTodos();

            case "important":
                return projectsHandler.getAllImportantTasks();;

            case "complete": 
                return projectsHandler.getAllCompletedTasks();
        }
    }

    const displaySortedTasks = function (tasks) {
        clearTodos();
        tasks.forEach((task) => {
            const project = projectsHandler.getProject(task.projectIndex);
            displayTodo(project, task, task.index);
        })
        clearSortButton();
        createSortButton();
        clickHandler.expandButtonsListener();
        clickHandler.editTaskEventListener();
        clickHandler.removeTaskEventListener();
        clickHandler.checkboxEventListener();
        clickHandler.importantTaskEventListener();
        hideTaskUI();
        hideAddTaskButton();
        clickHandler.setIfInProject(false);
        
        const AscSortedTasks = sortDates.sortAscending(tasks);
        const priorityTasks = sortDates.sortPriority(tasks);
        clickHandler.sortButtonEventListener(tasks, AscSortedTasks, priorityTasks);

    }

    const upcomingHandler = (function () {
        const inboxButton = document.querySelector(".inbox")
        inboxButton.addEventListener("click", (event) => {
            currentSection = "upcoming";
            const tasks = sortDates.getUpcomingTodos();
            displaySortedTasks(tasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-month-outline</title><path d="M7 11H9V13H7V11M21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5M5 7H19V5H5V7M19 19V9H5V19H19M15 13V11H17V13H15M11 13V11H13V13H11M7 15H9V17H7V15M15 17V15H17V17H15M11 17V15H13V17H11Z" /></svg> Upcoming`);
            }
        })
    })();

    const TodayHandler = (function () {
        const todayButton = document.querySelector(".today");
        todayButton.addEventListener("click", (event) => {
            currentSection = "today";
            const todayTasks = sortDates.getTodayTodos();
            displaySortedTasks(todayTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>timer-sand-complete</title><path d="M18 22H6V16L10 12L6 8V2H18V8L14 12L18 16M8 7.5L12 11.5L16 7.5V4H8M12 12.5L8 16.5V20H16V16.5M14 18H10V17.2L12 15.2L14 17.2Z" /></svg> Today`);
            }
        })
    })();

    const TomorrowHandler = (function () {
        const tomorrowButton = document.querySelector(".tomorrow");
        tomorrowButton.addEventListener("click", (event) => {
            currentSection = "tomorrow";
            const tomorrowTasks = sortDates.getTomorrowTodos();
            displaySortedTasks(tomorrowTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-night</title><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg> Tomorrow`);
            }
        })
    })();

    const WeekHandler = (function () {
        const WeekButton = document.querySelector(".this-week");
        WeekButton.addEventListener("click", (event) => {
            currentSection = "week";
            const WeekTasks = sortDates.getWeekTodos();
            displaySortedTasks(WeekTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-week-outline</title><path d="M5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.89 21 5V19C21 20.1 20.11 21 19 21H5C3.9 21 3 20.11 3 19V5C3 3.89 3.9 3 5 3M5 19H19V9H5V19M5 7H19V5H5V7M17 11V13H7V11H17" /></svg> This Week`);
            }
        })
    })();

    const CompleteHandler = (function () {
        const CompleteButton = document.querySelector(".complete");
        CompleteButton.addEventListener("click", (event) => {
            currentSection = "complete";
            const CompleteTasks = projectsHandler.getAllCompletedTasks();
            displaySortedTasks(CompleteTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>clipboard-check-outline</title><path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7.5,13.5L9,12L11,14L15.5,9.5L17,11L11,17L7.5,13.5Z" /></svg> Completed Tasks`);
            }
        })
    })();

    const ImportantHandler = (function () {
        const importantButton = document.querySelector(".important");
        importantButton.addEventListener("click", (event) => {
            currentSection = "important";
            const importantTasks = projectsHandler.getAllImportantTasks();
            displaySortedTasks(importantTasks );
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg> Important Tasks`);
            }
        })
    })();

    return {getCurrentSectionTasks}

}


function sortDates (projectsHandler) {

    const getUpcomingTodos = function () {
        const AllTasks = projectsHandler.getAllUncompletedTasks();

        const upcomingTasks = AllTasks.filter((task) => {
            return isFuture(task.dueDate) || isToday(task.dueDate);
        })

        return upcomingTasks;
    }

    const getTodayTodos = function () {
        const AllTasks = projectsHandler.getAllUncompletedTasks();

        const todayTasks = AllTasks.filter((task) => {
            return isToday(task.dueDate);
        })

        return todayTasks;
    }

    const getTomorrowTodos = function () {
        const AllTasks = projectsHandler.getAllUncompletedTasks();

        const tomorrowTasks = AllTasks.filter((task) => {
            return isTomorrow(task.dueDate);
        })

        return tomorrowTasks;
    }

    const getWeekTodos = function () {
        const AllTasks = projectsHandler.getAllUncompletedTasks();

        const WeekTasks = AllTasks.filter((task) => {
            return isThisWeek(task.dueDate);
        })

        return WeekTasks;
    }

    const sortPriority = function (tasks) {
        const sortedTasks = tasks.toSorted((task1, task2) => {
            if (task2.priorityValue !== task1.priorityValue) {
                return task2.priorityValue - task1.priorityValue;
            }

            return compareAsc(new Date(task1.dueDate), new Date(task2.dueDate));
        })
        return sortedTasks;
    }

    const sortAscending = function (tasks) {
        const sortedTasks = tasks.toSorted((task1, task2) => {
            return compareAsc(new Date(task1.dueDate), new Date(task2.dueDate))
        })
        return sortedTasks;
    }

    return {getUpcomingTodos, getTodayTodos, getTomorrowTodos, getWeekTodos, sortAscending, sortPriority}


}






