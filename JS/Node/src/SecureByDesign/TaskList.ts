import type Description from './Description';
import type Task from './Task';

export default class TaskList {
  constructor(
    // 4.1 Immutability
    private readonly tasks: Task[] = [],
  ) {}

  getTasks(): Task[] {
    // 6.3.3 Securing the integrity of collections
    return [...this.tasks];
  }

  addTask(task: Task) {
    // 4.2.1 Checking preconditions for method arguments
    if (task.description && this.tasks.find(t => t.description?.equals(task.description!))) {
      throw new Error('Task with the same description already exists');
    }

    if (task.link && this.tasks.find(t => t.link?.equals(task.link!))) {
      throw new Error('Task with the same link already exists');
    }

    this.tasks.push(task);
  }

  removeTask(description: Description) {
    // 4.2.3 Failing for bad state
    const index = this.tasks.findIndex(t => t.description?.equals(description));
    if (index === -1) {
      throw new Error('Task not found');
    }

    this.tasks.splice(index, 1);
  }
}