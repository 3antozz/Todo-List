function handleProjects () {
    let projects = [];
    let i = 0

    const getFirstProject = () => projects[0];
    const getAllProjects = () => projects;
    const getProject = (projectIndex) =>  { return projects.find((project) => project.index == projectIndex);}
    const addProject = function  (project){
        projects.push(project);
        project.index = i++;
    }
    const removeFromProjects = (projectIndex) => {
        const confirmation = confirm("Do you want to remove this project?")
        if(!confirmation) {
            return false;
        }
        const removedProjectIndex = projects.findIndex((project) => project.index == projectIndex) 
        projects.splice(removedProjectIndex, 1);
        return true;
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
    getUncompleteTodos () {
        return this.todos.filter((todo) => (!todo.complete));
    }

    addTodo (todo, index) { 
        todo.index = Project.i++;
        todo.projectIndex = index;
        this.todos.push(todo);
    }

    removeTodo (index) {
        const confirmation = confirm("Do you want to delete this task?");
        if(!confirmation) {
            return false;
        }
        const removedTodoIndex = this.todos.findIndex((todo) => todo.index == index) 
        this.todos.splice(removedTodoIndex, 1);
        return true;
    }

    editProject (title) {
        this.name = title;
    }
}

class Todo {

    constructor (title, description, dueDate = "No Due Date", priority = "Normal", complete = false, important = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = complete;
        this.important = important;
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



