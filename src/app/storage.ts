import { ITask } from './types';

export class MyStorage {
  constructor() {
    //add tasks to localStorage
  }

  getTasks(): Array<ITask> {
    //get tasks from localStorage
    const existingTasks: Array<ITask> = Array.from(JSON.parse(localStorage.getItem('tasks') ?? '[]'));
    return existingTasks;
  }

  setTasks(tasks: Array<ITask>): void {
    //add tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  removeTasks(): void {
    localStorage.removeItem('tasks');
  }
}
