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

      const inputCheckbox = document.createElement('input');
      inputCheckbox.className = 'check__input';
      inputCheckbox.type = 'checkbox';

      const spanCheckbox = document.createElement('span');
      spanCheckbox.className = 'check__box';
      label.innerHTML = item.task;

      const deleteButton = document.createElement('button');
      deleteButton.className = 'button__delete';

      deleteButton.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete this task? \n${item.task}`)) {
          this.deleteTask(item);
        }
      });

      if (item.completed === true) {
        inputCheckbox.setAttribute('disabled', '');
        label.className = 'check check_done';
      } else {
        inputCheckbox.addEventListener('click', () => this.completeTask(item));
      }

      label.appendChild(inputCheckbox);
      label.appendChild(spanCheckbox);
      label.appendChild(deleteButton);
      listOfTasks?.appendChild(label);
    });
  }

  showModal(): void {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const closeModalBtn = document.querySelector('.button__close');
    const submitBtn = document.querySelector('.button__submit');
    const errorMessage = <HTMLElement>document.querySelector('.input__error');

    //show modal
    errorMessage.style.display = 'none';
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

  completeTask(task: ITask): void {
    //find completed task index to update it
    const completedTaskIndex = this.existingTasks.findIndex((item) => item.id === task.id);
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

  deleteTask(task: ITask): void {
    const deletedTaskIndex = this.existingTasks.findIndex((item) => item.id === task.id);
    if (deletedTaskIndex !== -1) {
      this.existingTasks.splice(deletedTaskIndex, 1);
    }

    this.storage.setTasks(this.existingTasks);
    this.renderTasks(this.existingTasks);
  }
}
