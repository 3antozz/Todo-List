function handleProjects () {
    let projects = [];
    let i = 0
    let defaultProject = new Project("EL Wesmo");
    let defaultTodo1 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-11", "Normal");
    let defaultTodo3 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-09", "Low");
    let defaultTodo2 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-08", "High");

    defaultProject.addTodo(defaultTodo1, 0);
    defaultProject.addTodo(defaultTodo2, 0);
    defaultProject.addTodo(defaultTodo3, 0);

    const getFirstProject = () => projects[0];
    const getAllProjects = () => projects;
    const getProject = (projectIndex) =>  { return projects.find((project) => project.index == projectIndex);}
    const addProject = function  (project){
        length = projects.push(project);
        project.index = i++;
    }
    const removeFromProjects = (projectIndex) => {
        const removedProjectIndex = projects.findIndex((project) => project.index == projectIndex) 
        projects.splice(removedProjectIndex, 1); 
    }
    const getAllUncompletedTasks = () => {
        const tasks = [];
        projects.forEach((project) => {
            project.todos.forEach((todo) => {
                if (!(todo.complete)){
                    tasks.push(todo);
                }
            })
        })
        return tasks;
    }

    const getAllImportantTasks = () => {
        const uncompletedTasks = getAllUncompletedTasks();
        const tasks = [];
        uncompletedTasks.forEach((task) => {
            if(task.important) {
                tasks.push(task);
            }
        })
        return tasks;
    }

    const getAllCompletedTasks = () => {
        const tasks = [];
        projects.forEach((project) => {
            project.todos.forEach((todo) => {
                if (todo.complete){
                    tasks.push(todo);
                }
            })
        })
        return tasks;
    }


    addProject(defaultProject);

    return {getAllProjects, addProject, removeFromProjects, getProject, getAllUncompletedTasks, getAllCompletedTasks, getAllImportantTasks, getFirstProject}
}

class Project {


    constructor(name) {
        this.name = name;
        this.todos = [];
    }
    static i = 0;

    getAllTodos () { return this.todos; }
    getTodo (taskIndex) { return this.todos.find((todo) => todo.index == taskIndex ); }

    addTodo (todo, index) { 
        todo.index = Project.i++;
        todo.projectIndex = index;
        this.todos.push(todo);
    }

    removeTodo (index) {
        this.todos.splice(index, 1);
    }

    editProject (title) {
        this.name = title;
    }
}

class Todo {

    constructor (title, description, dueDate = "No Due Date", priority = "Normal") {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = false;
        this.important = false;
        switch (priority) {
            case "Low":
                this.priorityValue = 0;
                break;
            case "Normal":
                this.priorityValue = 1;
                break;
            case "High":
                this.priorityValue = 2;
                break;
        }
    }

    getTodo () { return this }

    editTodo (property, value) {
        this[property] = value;
    }

    convertPriorityToInt(priority) {
        switch (priority) {
            case "Low":
                return 0;
            case "Normal":
                return 1;
            case "High":
                return 2;
        }
    }
}

export {Project, Todo, handleProjects};



