// Your code
import { Application } from './application';
import { MyStorage } from './storage';
import { ITask } from './types';

document.addEventListener('DOMContentLoaded', function () {
  //will be removed
  function addTestTasks(): void {
    if (localStorage.length === 0) {
      for (let i = 1; i < 5; i++) {
        localStorage.setItem(
          'tasks',
          JSON.stringify([...JSON.parse(localStorage.getItem('tasks') ?? '[]'), { id: i, task: `testTask ${i}`, completed: false }])
        );
      }
    }
  }
  addTestTasks();

  const storage = new MyStorage();
  const existingTasks = storage.getTasks();
  const app = new Application(existingTasks);

  document.querySelector('.add-task__button')?.addEventListener('click', function () {
    //call addTask fn - will be added later
  });

  document.querySelector('.tasks')?.addEventListener('click', function (e) {
    const target = e.target as HTMLElement;
    const completedTaskId = target.getAttribute('data_id');
    let tasks: Array<ITask> = [];
    if (completedTaskId !== null) {
      tasks = app.completeTask(Number(completedTaskId));
    }
    storage.setTasks(tasks);
    console.log(location.href);

    //It should somehow refresh the part of page
    /* 
    $('#tasks').load('index.html'); */
  });
});
