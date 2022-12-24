//interface for list of tasks
export interface ITask {
  id: number;
  task: string;
  completed: boolean;
}

//type for EvenTarget sent to app.completeTask
export type ETarget = EventTarget | null;
