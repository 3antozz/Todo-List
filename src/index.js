import "./styles.css";
import {Project, Todo, handleProjects} from "./projects.js";
import { format, isBefore, isTomorrow, isThisWeek, isThisMonth, isToday, compareAsc, compareDesc } from "date-fns";
import { displayNavProject, displayProjectName, displayTodos } from "./DOMHandler.js";



const allProjects = handleProjects();

const project1 = new Project("Get Money");
allProjects.addProject(project1);
const todo1 = new Todo("This is an example", "description", "07/10/2024", "high");
const todo2 = new Todo("nigger", "description", "duedate", "high");
const todo3 = new Todo("nigger", "description", "duedate", "high");
project1.addTodo(todo1);
project1.addTodo(todo2);
project1.addTodo(todo3);



const project2 = new Project("Get Laid");
allProjects.addProject(project2);
console.log(allProjects.getProjects());
todo2.editTodo("title", "EDITED");
todo2.editTodo("description", "RAK FAHEM");


const projectsArray = allProjects.getProjects();
projectsArray.forEach((project) => {
    displayNavProject(project.name);
})

displayProjectName(project1);
displayTodos(project1);

