import Description from '../../src/SecureByDesign/Description';
import Task from '../../src/SecureByDesign/Task';
import TaskWithBuilder from '../../src/SecureByDesign/TaskWithBuilder';

describe('Secure By Design > Task', () => {
  it('should create Task with due date using builder', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour in the future
    
    const task = new (TaskWithBuilder.getBuilder())(new Description('Make ToDo List'))
      .withDueDate(futureDate)
      .build();
      
    expect(task.getDueDate()).toEqual(futureDate);
  });
});