import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import { isBefore, isTomorrow, isThisWeek, isToday, compareAsc, compareDesc } from "date-fns";
import { displayAllProjectsNav, displayProjectName, removeProjectNav, displayTodo,  displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton, markImportant, unmarkImportant, createSortButton, clearSortButton } from "./DOMHandler.js";



(function init (){
    const projectsHandler = handleProjects();
    const defaultProject = projectsHandler.getProject(0);
    const dates = sortDates(projectsHandler);
    const clickHandler = dynamicButtonsEventListeners(projectsHandler, dates);
    sortProjectsButtonsHandler(projectsHandler, clickHandler, dates);
    staticButtonsEventListeners(projectsHandler, clickHandler, dates);
    displayAllProjectsNav(projectsHandler.getAllProjects());
    displayProjectName(defaultProject);
    displayAllTodos(defaultProject);
    clickHandler.expandButtonsListener();
    clickHandler.editTaskEventListener();
    clickHandler.projectsEventListener();
    clickHandler.editProjectEventListener();
    clickHandler.removeProjectEventListener();
    clickHandler.removeTaskEventListener();
    clickHandler.checkboxEventListener();
    clickHandler.importantTaskEventListener()
    createSortButton();
    clickHandler.sortButtonEventListener(dates.sortAscending(defaultProject.getAllTodos()), false);
})();

function staticButtonsEventListeners (projectsHandler, clickHandler, dates) {
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
        clickHandler.expandButtonsListener(clickHandler.getCurrentProject());
        clickHandler.editTaskEventListener();
        clickHandler.removeTaskEventListener();
        clickHandler.checkboxEventListener();
        clickHandler.importantTaskEventListener();
    }

    const createProjectButtonsEventListeners = function () {
        clickHandler.projectsEventListener();
        clickHandler.editProjectEventListener();
        clickHandler.removeProjectEventListener();
    }


    



    const addProject = function (event) {
        event.preventDefault();
        const project = new Project(input.value);
        projectsHandler.addProject(project);
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
        displayAllTodos(currentProject);
        hideTaskUI();
        createTaskButtonsEventListeners();
        clearSortButton();
        createSortButton();
        clickHandler.sortButtonEventListener(dates.sortAscending(currentProject.getAllTodos()), false);
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
        hideTaskUI();
        createTaskButtonsEventListeners();
        clearSortButton();
        createSortButton();
        clickHandler.sortButtonEventListener(dates.sortAscending(currentProject.getAllTodos()), false);
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
            hideTaskUI();
        })
    })()

};







function dynamicButtonsEventListeners  (projectsHandler, dates) {
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
        sortButtonEventListener(dates.sortAscending(currentProject.getAllTodos()), false);
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
                showTaskUI(true);
                editTask(event.target);
            })
        })
    }

    const editTask = function (button) {
        currentTodoIndex = button.dataset.index;
        const todo = projectsHandler.getProject(button.dataset.projectIndex).getTodo(button.dataset.index);
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

    const importantTaskEventListener = function () {
        const importantButton = document.querySelectorAll(".important-button");
        importantButton.forEach((button) => {
            button.addEventListener("click", (event) => {
                importanceSwitch(event.target);
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
        }
        else {
            todo.editTodo("important", true);
            markImportant(button);
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
        }
        else {
            todo.editTodo("complete", true);
            todoDiv.classList.add("completed-task");
        }
    }

    const sortButtonEventListener = function (tasks, addRightDiv = true) {
        const sortButton = document.querySelector(".sort-button");
        sortButton.addEventListener("click", () => {
            clearTodos();
            displayAscDateTasks(tasks, addRightDiv);
        })
    }

    const displayAscDateTasks = function (tasks, addRightDiv) {
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



    return {projectsEventListener, expandButtonsListener, getCurrentProject,  getCurrentProjectIndex, editTaskEventListener, handleProjectSwitch, getCurrentTodoIndex, editProjectEventListener, getEditedProject, removeProjectEventListener, removeTaskEventListener, checkboxEventListener, importantTaskEventListener, sortButtonEventListener }
    

}



function sortProjectsButtonsHandler (projectsHandler, clickHandler, sortDates) {

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
        
        const AscSortedTasks = sortDates.sortAscending(tasks);
        clickHandler.sortButtonEventListener(AscSortedTasks);

    }

    const upcomingHandler = (function () {
        const inboxButton = document.querySelector(".inbox")
        inboxButton.addEventListener("click", (event) => {
            const tasks = projectsHandler.getAllUncompletedTasks();
            displaySortedTasks(tasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName("Upcoming");
            }
        })
    })();

    const TodayHandler = (function () {
        const todayButton = document.querySelector(".today");
        todayButton.addEventListener("click", (event) => {
            const todayTasks = sortDates.getTodayTodos();
            displaySortedTasks(todayTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName("Today");
            }
        })
    })();

    const TomorrowHandler = (function () {
        const tomorrowButton = document.querySelector(".tomorrow");
        tomorrowButton.addEventListener("click", (event) => {
            const tomorrowTasks = sortDates.getTomorrowTodos();
            displaySortedTasks(tomorrowTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName("Tomorrow");
            }
        })
    })();

    const WeekHandler = (function () {
        const WeekButton = document.querySelector(".this-week");
        WeekButton.addEventListener("click", (event) => {
            const WeekTasks = sortDates.getWeekTodos();
            displaySortedTasks(WeekTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName("This Week");
            }
        })
    })();

    const CompleteHandler = (function () {
        const CompleteButton = document.querySelector(".complete");
        CompleteButton.addEventListener("click", (event) => {
            const CompleteTasks = projectsHandler.getAllCompletedTasks();
            displaySortedTasks(CompleteTasks);
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName("Completed Tasks");
            }
        })
    })();

    const ImportantHandler = (function () {
        const importantButton = document.querySelector(".important");
        importantButton.addEventListener("click", (event) => {
            const importantTasks = projectsHandler.getAllImportantTasks();
            displaySortedTasks(importantTasks );
            if (!(projectsHandler.getAllProjects().length === 0)) {
                setProjectHeaderName("Important Tasks");
            }
        })
    })();

}


function sortDates (projectsHandler) {

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

    const sortAscending = function (tasks) {
        const sortedTasks = tasks.toSorted((task1, task2) => {
            return compareAsc(new Date(task1.dueDate), new Date(task2.dueDate))
        })
        return sortedTasks;
    }

    return {getTodayTodos, getTomorrowTodos, getWeekTodos, sortAscending}


}






