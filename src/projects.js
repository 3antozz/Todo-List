function handleProjects () {
    let projects = [];
    let defaultProject = new Project("Default");

    const getProjects = () => projects;
    const addProject = function  (project){
        length = projects.push(project);
        project.index = length - 1;
    }
    const removeProject = (index) => projects.splice(index, 1);
    addProject(defaultProject);


    return {getProjects, addProject, removeProject}
}

class Project {


    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    getTodos () { return this.todos;}

    addTodo (todo) { 
        length = this.todos.push(todo);
        todo.index = length-1;
    }

    removeTodo (index) {
        this.todos.splice(index, 1);
    }
}

class Todo {

    constructor (title, description, dueDate, priority, complete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = complete
    }

    getTodo () { return this }

    editTodo (property, value) {
        this[property] = value;
    }
}

export {Project, Todo, handleProjects};