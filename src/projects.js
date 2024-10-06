function projects () {
    let projects = [];
    let defaultProject = new Project("Default");

    const getProjects = () => projects;
    const pushProject = function  (project){
        length = projects.push(project);
        project.index = length - 1;
    }
    const deleteProject = (index) => projects.splice(index, 1);
    pushProject(defaultProject);


    return {getProjects, pushProject, deleteProject}
}

class Project {


    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo (todo) { 
        length = this.todos.push(todo);
        todo.index = length-1;
    }


}

class Todo {

    constructor (title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

export {Project, Todo, projects};