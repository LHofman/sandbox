import { useContext } from 'react';
import { Task } from './Task'
import { TasksContext, TasksDispatchContext } from './TasksContext';

export const TaskList = () => {
  const tasks = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  
  const addTaskHandler = () => {
    const newId = tasks.length > 0 ? (parseInt(tasks[tasks.length - 1].id) + 1).toString() : '1';
    dispatch!({
      type: 'ADD_TASK',
      payload: { id: newId, description: `New Task ${newId}` }
    });
  };

  const removeTaskHandler = (taskId: string) => {
    dispatch!({
      type: 'REMOVE_TASK',
      payload: taskId
    });
  }

  return (
    <div>
      <ul style={{ textAlign: 'left' }}>
        {tasks.map((task) => (
          <li key={task.id}><Task task={task} onRemove={removeTaskHandler} /></li>
        ))}
      </ul>
      <button onClick={addTaskHandler}>Add Task</button>
    </div>
  );
};