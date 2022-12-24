// Your code
import { Application } from './application';
import { MyStorage } from './storage';

document.addEventListener('DOMContentLoaded', function () {
  //to add test tasks
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
  const app = new Application(storage);

  document.querySelector('.button__add-task')?.addEventListener('click', function () {
    app.showModal();
  });

  document.querySelector('.tasks')?.addEventListener('click', function (e) {
    app.completeTask(e.target);
  });
});
