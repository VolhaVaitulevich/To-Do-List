import { ITask } from '../app/types';

export function isEqual(existingTasksList: Array<ITask>, newTasksList: Array<ITask>): boolean {
  console.log(newTasksList);
  if (JSON.stringify(existingTasksList) === JSON.stringify(newTasksList)) {
    return true;
  } else {
    return false;
  }
}
