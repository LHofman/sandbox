import type { Task } from './Task';
import { TaskList } from './TaskList'
import { TasksProvider } from './TasksContext';

const tasks: Task[] = [
  { id: '1', description: 'Create ToDo List', isCompleted: true },
  {
    id: '2',
    description: 'Continue Learning React',
    isCompleted: false,
    dueDate: new Date('2026-12-31'),
    category: 'React',
    subTasks: [
      { id: '2.1', description: 'Context', isCompleted: true, subTasks: [
        { id: '2.1.1', description: 'Another subtask' }
      ] },
    ],
  }
];

function TaskApp() {
  return (
    <>
      <TasksProvider tasks={tasks}>
        <TaskList />
      </TasksProvider>
    </>
  )
}

export default TaskApp;
