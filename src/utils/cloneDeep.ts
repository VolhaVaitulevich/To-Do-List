export function cloneDeep<T>(tasks: T): T {
  if (Array.isArray(tasks)) {
    return tasks.map(cloneDeep) as T;
  }

  if (typeof tasks === 'object' && tasks !== null) {
    const keyValues = Object.entries(tasks);
    return keyValues.reduce((task, [key, value]) => {
      return { ...tasks, [key]: cloneDeep(value) };
    }, {}) as T;
  }
  return tasks;
}
