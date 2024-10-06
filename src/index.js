import "./styles.css";
import * as Projects from "./projects";

const projects = Projects.projects();

const project1 = new Projects.Project("bruv");
projects.pushProject(project1);
const todo1 = new Projects.Todo("nigger", "description", "duedate", "high");
const todo2 = new Projects.Todo("nigger", "description", "duedate", "high");
const todo3 = new Projects.Todo("nigger", "description", "duedate", "high");
project1.addTodo(todo1);
project1.addTodo(todo2);
project1.addTodo(todo3);



const project2 = new Projects.Project("bruv");
projects.pushProject(project2);
// projects.deleteProject(0);
console.log(projects.getProjects());