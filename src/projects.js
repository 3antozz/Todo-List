function handleProjects () {
    let projects = [];
    let defaultProject = new Project("EL Wesmo");
    let defaultTodo1 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-22", "High");
    let defaultTodo2 = new Todo("Kherya Guettala", "Roh adrebha b kherya mich normal", "2024-10-28", "High");

    defaultProject.addTodo(defaultTodo1);
    defaultProject.addTodo(defaultTodo2);

    const getAllProjects = () => projects;
    const getProject = (index) => projects[index];
    const addProject = function  (project){
        length = projects.push(project);
        project.index = length - 1;
    }
    const removeProject = (index) => projects.splice(index, 1);
    addProject(defaultProject);


    return {getAllProjects, addProject, removeProject, getProject}
}

class Project {


    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    getAllTodos () { return this.todos; }
    getTodo (index) { return this.todos[index]; }

    addTodo (todo) { 
        length = this.todos.push(todo);
        todo.index = length-1;
    }

    removeTodo (index) {
        this.todos.splice(index, 1);
    }
}

class Todo {

    constructor (title, description, dueDate = "No Due Date", priority = "Normal") {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = false;
    }

    getTodo () { return this }

    editTodo (property, value) {
        this[property] = value;
    }
}

export {Project, Todo, handleProjects};