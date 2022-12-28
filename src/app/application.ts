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
    const submitBtn = document.querySelector('.button__submit');
    //show modal
    modal?.classList.remove('hidden');
    overlay?.classList.remove('hidden');

    //close modal
    closeModalBtn?.addEventListener('click', () => {
      modal?.classList.add('hidden');
      overlay?.classList.add('hidden');
    });

    submitBtn?.addEventListener('click', () => {
      const inputTask = (<HTMLInputElement>document.getElementById('new_task')).value ?? '';
      if (inputTask.trim() !== '') {
        this.addTask(inputTask);
        modal?.classList.add('hidden');
        overlay?.classList.add('hidden');
      } else {
        const errorMessage = <HTMLElement>document.querySelector('.input__error');
        errorMessage.innerHTML = 'Please enter your task';
        errorMessage.style.display = 'block';
      }
    });
  }

  addTask(inputTask: string): void {
    const newTask: ITask = {
      id: this.existingTasks.length + 1,
      task: inputTask,
      completed: false,
    };
    this.existingTasks.unshift(newTask);
    this.renderTasks(this.existingTasks);
    (<HTMLInputElement>document.getElementById('new_task')).value = '';
  }

  completeTask(eTarget: ETarget): void {
    const target = eTarget as HTMLElement;
    const completedTaskId = Number(target.getAttribute('data_id'));

    //find completed task index to update it
    const completedTaskIndex = this.existingTasks.findIndex((item) => item.id === completedTaskId);
    if (completedTaskIndex !== -1) {
      this.existingTasks[completedTaskIndex].completed = true;
      this.existingTasks.sort((item1, item2) => {
        return item1.completed === item2.completed ? 0 : item1.completed ? 1 : -1;
      });

      //add tasks to local storage
      this.storage.setTasks(this.existingTasks);

      //render tasks on the page
      this.renderTasks(this.existingTasks);
    }
  }
}
