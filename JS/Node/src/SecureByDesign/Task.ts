import type Description from './Description';
import type Link from './Link';

export default class Task {
  private dueDate?: Date;
  
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
      throw new Error('Due date cannot be in the past');
    }
    
    this.dueDate = dueDate;
    return this;
  }

  getDueDate(): Date | undefined {
    return this.dueDate;
  }

  private checkInvariants(): void {
    if (!this.description && !this.link) {
      throw new Error('Task must have at least a description or a link');
    }
  }
}