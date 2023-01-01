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

  renderTask(item: ITask): void {
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
  }

  renderTasks(tasks: Array<ITask>): void {
    this.existingTasks = JSON.parse(JSON.stringify(tasks));
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
      this.renderTask(item);
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
      if (inputTask.trim() === '') {
        errorMessage.innerHTML = 'Please enter your task';
        errorMessage.style.display = 'block';
      } else if (inputTask.trim().length > 20) {
        errorMessage.innerHTML = 'Maximum length is 20 characters';
        errorMessage.style.display = 'block';
      } else {
        this.addTask(inputTask);
        modal?.classList.add('hidden');
        overlay?.classList.add('hidden');
      }
    });
  }

  addTask(inputTask: string): void {
    const newTask: ITask = {
      id: this.existingTasks.length + 1,
      task: inputTask,
      completed: false,
    };
    const newTasksList: Array<ITask> = JSON.parse(JSON.stringify(this.existingTasks));
    newTasksList.unshift(newTask);
    this.renderTasks(newTasksList);
    (<HTMLInputElement>document.getElementById('new_task')).value = '';
  }

  completeTask(task: ITask): void {
    //find completed task index to update it
    const completedTaskIndex = this.existingTasks.findIndex((item) => item.id === task.id);
    if (completedTaskIndex !== -1) {
      const newTasksList: Array<ITask> = JSON.parse(JSON.stringify(this.existingTasks));
      newTasksList[completedTaskIndex].completed = true;
      newTasksList.sort((item1, item2) => {
        return item1.completed === item2.completed ? 0 : item1.completed ? 1 : -1;
      });

      //add tasks to local storage
      this.storage.setTasks(newTasksList);

      //render tasks on the page
      this.renderTasks(newTasksList);
    }
  }

  deleteTask(task: ITask): void {
    const deletedTaskIndex = this.existingTasks.findIndex((item) => item.id === task.id);
    if (deletedTaskIndex !== -1) {
      const newTasksList: Array<ITask> = JSON.parse(JSON.stringify(this.existingTasks));
      newTasksList.splice(deletedTaskIndex, 1);

      this.storage.setTasks(newTasksList);
      this.renderTasks(newTasksList);
    }
  }
}
