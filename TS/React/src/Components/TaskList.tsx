import { useReducer } from 'react';
import { Task } from './Task'

export const TaskList = () => {
  const [tasks, dispatch] = useReducer(tasksReducer, [
    { id: '1', description: 'Create ToDo List', isCompleted: true },
    { id: '2', description: 'Continue Learning React', isCompleted: false, dueDate: new Date('2026-12-31') }
  ]);
  
  const addTaskHandler = () => {
    const newId = tasks.length > 0 ? (parseInt(tasks[tasks.length - 1].id) + 1).toString() : '1';
    dispatch({
      type: 'ADD_TASK',
      payload: { id: newId, description: `New Task ${newId}` }
    });
  };

  const removeTaskHandler = (taskId: string) => {
    dispatch({
      type: 'REMOVE_TASK',
      payload: taskId
    });
  }

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <Task key={task.id} task={task} onRemove={removeTaskHandler} />
        ))}
      </ul>
      <button onClick={addTaskHandler}>Add Task</button>
    </div>
  );
};

interface AddTaskAction {
  type: 'ADD_TASK';
  payload: Task;
}

interface RemoveTaskAction {
  type: 'REMOVE_TASK';
  payload: string; // taskId
}

type TaskAction = AddTaskAction | RemoveTaskAction;

const tasksReducer = (tasks: Task[], action: TaskAction) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...tasks, action.payload];
    case 'REMOVE_TASK':
      return tasks.filter(task => task.id !== action.payload);
    default:
      return tasks;
  }
}