// Your code
import { ITask } from "./types";


document.addEventListener("DOMContentLoaded", function () {
    const newTask = {
       task:Date(),
       completed: false,
   };

   localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") ?? "[]"), 
   { task: newTask.task, completed: false }]));

   const existingTasks: Array<ITask> = Array.from(JSON.parse(localStorage.getItem("tasks") ?? ''));
   existingTasks.forEach((item) => {

    const listOfTasks = document.querySelector(".tasks");
    const input = document.createElement("label");
    input.className = "check";
    input.innerHTML  = `<input class="check__input" type="checkbox"> <span class="check__box"></span>${item.task}`;
    listOfTasks?.appendChild(input);
   })
});
