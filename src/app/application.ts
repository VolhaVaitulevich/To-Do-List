import { MyStorage } from './storage';
import { ETarget, ITask } from './types';

export class Application {
  private existingTasks: Array<ITask>;

  constructor(private storage: MyStorage) {
    this.storage = storage;
    this.existingTasks = storage.getTasks();
    this.renderTasks(this.existingTasks);

    this.renderTasks = this.renderTasks.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  renderTasks(tasks: Array<ITask>): void {
    //remove all tasks from the page and from local storage
    this.storage.removeTasks();
    const listOfTasksHTML = document.getElementById('tasks');
    while (listOfTasksHTML?.firstChild) {
      listOfTasksHTML.removeChild(listOfTasksHTML.firstChild);
    }

    //add tasks to the local storage
    this.storage.setTasks(tasks);

    //add taskd to the page
    tasks.forEach((item: ITask): void => {
      const listOfTasks = document.querySelector('.tasks');
      const label = document.createElement('label');
      label.className = 'check';
      label.setAttribute('task_id', String(item.id));

      const inputCheckbox = document.createElement('input');
      inputCheckbox.className = 'check__input';
      inputCheckbox.type = 'checkbox';

      const spanCheckbox = document.createElement('span');
      spanCheckbox.className = 'check__box';
      spanCheckbox.setAttribute('data_id', String(item.id));
      label.innerHTML = item.task;
      if (item.completed === true) {
        inputCheckbox.setAttribute('disabled', '');
        label.className = 'check check_done';
      }

      label.appendChild(inputCheckbox);
      label.appendChild(spanCheckbox);
      listOfTasks?.appendChild(label);
    });
  }

  showModal(): void {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const closeModalBtn = document.querySelector('.button__close');
    const submitBtn = document.querySelector('button__submit');
    const inputTask = (<HTMLInputElement>document.querySelector('new_task')).value;
    //show modal
    modal?.classList.remove('hidden');
    overlay?.classList.remove('hidden');

    //close modal
    closeModalBtn?.addEventListener('click', function () {
      modal?.classList.add('hidden');
      overlay?.classList.add('hidden');
    });
  }

  completeTask(eTarget: ETarget): void {
    const target = eTarget as HTMLElement;
    const completedTaskId = Number(target.getAttribute('data_id'));

    //Create arrays to distinguish and sort completed and uncompleted tasks
    const completedTaskIndex = this.existingTasks.findIndex((item) => item.id === completedTaskId);
    this.existingTasks[completedTaskIndex].completed = true;
    this.existingTasks.sort(function (item1, item2) {
      return item1.completed === item2.completed ? 0 : item1.completed ? 1 : -1;
    });
    console.log(this.existingTasks);

    //add tasks to local storage
    this.storage.setTasks(this.existingTasks);

    //render tasks on the page
    this.renderTasks(this.existingTasks);
  }
}
