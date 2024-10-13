import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import {isTomorrow, isThisWeek, isToday, compareAsc } from "date-fns";
import { displayAllProjectsNav, displayProjectName, removeProjectNav, displayTodo,  displayAllTodos, expandTodo, retractTodo, removeTodo, showProjectUI, hideProjectUI, showTaskUI, hideTaskUI, clearTodos, setProjectHeaderName, hideAddTaskButton, showAddTaskButton, markImportant, unmarkImportant, createSortButton, clearSortButton, switchSortButton, editTask } from "./DOMHandler.js";


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
    clickHandler.sortButtonEventListener(defaultProject.getAllTodos(), dates.sortAscending(defaultProject.getAllTodos()), dates.sortPriority(defaultProject.getAllTodos()), false);



    document.addEventListener("click", () => {
        console.log(projectsHandler.getAllProjects());
    });
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
        if (clickHandler.ifInProject()) {
            displayAllTodos(currentProject);
            createTaskButtonsEventListeners();
        }
        else {
            const todoDiv = document.querySelector(`.todo[data-index="${todoIndex}"][data-project-index="${currentProject.index}"]`);
            if (!(todoDiv.classList.contains("expanded"))){
                const button = document.querySelector(`.expand[data-index="${todoIndex}"][data-project-index="${currentProject.index}"]`);
                expandTodo(todoDiv, currentProject, todoIndex, button)
            }
            editTask(currentProject, Todo);
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
        sortButtonEventListener(currentProject.getAllTodos(), dates.sortAscending(currentProject.getAllTodos()), dates.sortPriority(currentProject.getAllTodos()), false);
        isInProject = true;
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
        currentProjectIndex = button.dataset.projectIndex;
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
                removeTask(event.target)
            })
        })
    }

    const removeTask = function (button) {
        const todoIndex = button.dataset.index;
        const projectIndex = button.dataset.projectIndex
        removeTodo(projectIndex, todoIndex);
        const project = projectsHandler.getProject(projectIndex);
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

    const sortButtonEventListener = function (defaultTasks, sortedTasks, priorityTasks, addRightDiv = true) {
        const sortButton = document.querySelector(".sort-button");
        sortButton.addEventListener("click", () => {
            if (sortButton.classList.contains("default")){
                clearTodos();
                displayAscDateTasks(sortedTasks, addRightDiv);
                switchSortButton();
            }
            else if (sortButton.classList.contains("ascending")) {
                clearTodos();
                displayAscDateTasks(priorityTasks, addRightDiv);
                switchSortButton();
            }
            else if(sortButton.classList.contains("sort-priority")){
                clearTodos();
                displayAscDateTasks(defaultTasks, addRightDiv);
                switchSortButton();
            }
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



    return {projectsEventListener, expandButtonsListener, getCurrentProject,  getCurrentProjectIndex, editTaskEventListener, handleProjectSwitch, getCurrentTodoIndex, editProjectEventListener, getEditedProject, removeProjectEventListener, removeTaskEventListener, checkboxEventListener, importantTaskEventListener, sortButtonEventListener, ifInProject, setIfInProject }
    

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
        clickHandler.setIfInProject(false);
        
        const AscSortedTasks = sortDates.sortAscending(tasks);
        const priorityTasks = sortDates.sortPriority(tasks);
        clickHandler.sortButtonEventListener(tasks, AscSortedTasks, priorityTasks);

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

    return {getTodayTodos, getTomorrowTodos, getWeekTodos, sortAscending, sortPriority}


}






