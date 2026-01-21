import Description from '../../src/SecureByDesign/Description';
import Task from '../../src/SecureByDesign/Task';
import TaskList from '../../src/SecureByDesign/TaskList';

describe('Secure By Design > TaskList', () => {
  it('should not add a duplicate task', () => {
    const taskList = new TaskList();
    const task = new Task(new Description('Make ToDo List'));
    taskList.addTask(task);
    expect(() => taskList.addTask(task)).toThrow('Task with the same description already exists');
  });

  it('should add a task successfully', () => {
    const taskList = new TaskList();
    const task = new Task(new Description('Make ToDo List'));
    taskList.addTask(task);
    expect(taskList.getTasks().length).toBe(1);
    expect(taskList.getTasks()[0]?.description?.text).toBe('Make ToDo List');
  });

  it('should not remove a non-existent task', () => {
    const taskList = new TaskList();
    expect(() => taskList.removeTask(new Description('Non-existent Task'))).toThrow('Task not found');
  });

  it('should remove a task successfully', () => {
    const taskList = new TaskList();
    const task = new Task(new Description('Make ToDo List'));
    taskList.addTask(task);
    taskList.removeTask(new Description('Make ToDo List'));
    expect(taskList.getTasks().length).toBe(0);
  });

  it('should not pass the tasks list mutably', () => {
    const task1 = new Task(new Description('Make ToDo List'));
    const task2 = new Task(new Description('Write Code'));

    const taskList = new TaskList([task1]);
    const tasks = taskList.getTasks();
    tasks[0] = task2; // Attempt to mutate the tasks array

    expect(taskList.getTasks()[0]?.description?.text).toBe('Make ToDo List'); // Original task should remain unchanged
  });
});