import Description from '../../src/SecureByDesign/Description';
import Link from '../../src/SecureByDesign/Link';
import Task from '../../src/SecureByDesign/Task';
import '../../src/SecureByDesign/FeatureFlags';

let featureFlagShouldAllowAddingSubtasks: boolean = false;

jest.mock('../../src/SecureByDesign/FeatureFlags', () => ({
  get ALLOW_ADDING_SUBTASKS() {
    return featureFlagShouldAllowAddingSubtasks;
  }
}));

describe('Secure By Design > Task', () => {
  it('should create Task when description is valid', () => {
    const task = new Task(new Description('Make ToDo List'));
    expect(task.description?.text).toBe('Make ToDo List');
  });

  it('should create Task when link is valid', () => {
    const task = new Task(undefined, new Link('https://example.com'));
    expect(task.link?.text).toBe('https://example.com');
  });

  it('should throw error when both description and link are missing', () => {
    expect(() => {
      new Task();
    }).toThrow('Task must have at least a description or a link');
  });

  it('should throw error when due date is in the past', () => {
    const task = new Task(new Description('Make ToDo List'));
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago

    expect(() => {
      task.withDueDate(pastDate);
    }).toThrow('Due date cannot be in the past');
  });

  it('should create Task with valid due date', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour in the future
    
    const task = new Task(new Description('Make ToDo List')).withDueDate(futureDate);
    expect(task.getDueDate()).toEqual(futureDate);
  });

  // 8.3.3 Taming the toggles
  it('should not allow adding subtasks when feature flag is disabled', () => {
    featureFlagShouldAllowAddingSubtasks = false;

    const task = new Task(new Description('Make ToDo List'));
    const subTask = new Task(new Description('Subtask 1'));

    expect(() => {
      task.addSubTask(subTask);
    }).toThrow('Adding subtasks is not allowed');
  });

  it('should allow adding subtasks when feature flag is enabled', () => {
    featureFlagShouldAllowAddingSubtasks = true;

    const task = new Task(new Description('Make ToDo List'));
    const subTask = new Task(new Description('Subtask 1'));

    expect(() => {
      task.addSubTask(subTask);
    }).not.toThrow('Adding subtasks is not allowed');
  });
});