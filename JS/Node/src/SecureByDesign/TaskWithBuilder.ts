import type Description from './Description';
import type Link from './Link';

// 6.2.6 The builder pattern for upholding advanced constraints
export default class TaskWithBuilder {
  private dueDate?: Date;
  
  private constructor(
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

  setDueDate(dueDate: Date): void {
    if (dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
    
    this.dueDate = dueDate;
  }

  getDueDate(): Date | undefined {
    return this.dueDate;
  }

  private checkInvariants(): void {
    if (!this.description && !this.link) {
      throw new Error('Task must have at least a description or a link');
    }
  }

  static getBuilder() {
    let task: TaskWithBuilder;

    return class Builder {
      constructor(description?: Description, link?: Link) {
        task = new TaskWithBuilder(description, link);
      }

      withDueDate(dueDate: Date): this {
        task.setDueDate(dueDate);
        return this;
      }

      build(): TaskWithBuilder {
        return task;
      }
    }
  }
}