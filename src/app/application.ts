import { ITask } from './types';

export class Application {
  private existingTasks: Array<ITask>;

  constructor(existingTasks: Array<ITask>) {
    this.existingTasks = existingTasks;
    this.existingTasks.forEach((item: ITask): void => {
      const listOfTasks = document.querySelector('.tasks');
      const input = document.createElement('label');
      input.className = 'check';
      input.setAttribute('task_id', String(item.id));
      if (item.completed === true) {
        input.innerHTML = `<input class="check__input" type="checkbox" data_id = ${item.id} disabled>
        <span class="check__box"></span>${item.task}`;
        input.className = 'check check_done';
      } else {
        input.innerHTML = `<input class="check__input" type="checkbox" data_id = ${item.id}> <span class="check__box"></span>${item.task}`;
      }
      listOfTasks?.appendChild(input);
    });
    this.addTask = this.addTask.bind(this);
  }

  addTask(): Array<ITask> {
    console.log('Add task');
    //show modal window with input field (will be triggered by Enter)
    return this.existingTasks;
  }

  completeTask(completedTaskId: number): Array<ITask> {
    const completedTask = document.querySelector(`[data_id="${completedTaskId}"]`);
    completedTask?.setAttribute('disabled', '');
    const taskToCompleteText = document.querySelector(`[task_id="${completedTaskId}"]`) as HTMLElement;
    if (taskToCompleteText !== null) {
      taskToCompleteText.style.textDecoration = 'line-through';
    }
    const uncompletedTasks: Array<ITask> = this.existingTasks.filter((item) => item.id !== completedTaskId);
    const completedTasks: Array<ITask> = this.existingTasks.filter((item) => item.id === completedTaskId);
    completedTasks.forEach((item) => (item.completed = true));
    this.existingTasks = uncompletedTasks.concat(completedTasks);
    return this.existingTasks;
  }
}
