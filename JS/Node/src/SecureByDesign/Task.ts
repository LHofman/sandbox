import type Description from './Description';
import InvalidParameterError from './Error/InvalidParameterError';
import InvalidTaskError from './Error/InvalidTaskError';
import UnavailableFeatureError from './Error/UnavailableFeatureError';
import { ALLOW_ADDING_SUBTASKS } from './FeatureFlags';
import type Link from './Link';

export default class Task {
  private dueDate?: Date;
  private subTasks: Task[] = [];
  
  constructor(
    // 4.1 Immutability
    // 5 Domain primitives
    public readonly description?: Description,
    public readonly link?: Link,
  ) {
    this.description = description;
    this.link = link;

    // 6.2.5 Catching advanced constraints in code
    this.checkInvariants();
  }

  // 6.2.4 Construction with a fluent interface
  withDueDate(dueDate: Date): Task {
    if (dueDate < new Date()) {
      throw new InvalidParameterError('Due date cannot be in the past');
    }
    
    this.dueDate = dueDate;
    return this;
  }

  getDueDate(): Date | undefined {
    return this.dueDate;
  }

  addSubTask(subTask: Task): void {
    // 8.3.3 Taming the toggles
    if (!ALLOW_ADDING_SUBTASKS) {
      throw new UnavailableFeatureError('Adding subtasks is not allowed');
    }
    
    this.subTasks.push(subTask);
  }

  private checkInvariants(): void {
    if (!this.description && !this.link) {
      throw new InvalidTaskError('Task must have at least a description or a link');
    }
  }
}