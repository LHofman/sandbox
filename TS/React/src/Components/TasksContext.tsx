import { createContext, useReducer, type ReactNode } from "react";
import type { Task } from "./Task";

export const TasksContext = createContext<Task[]>([]);
export const TasksDispatchContext = createContext<React.Dispatch<TaskAction>|undefined>(undefined);

export const TasksProvider = (props: { tasks: Task[], children: ReactNode}) => {
  const [tasks, dispatch] = useReducer(tasksReducer, props.tasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {props.children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

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
      return removeTask(tasks, action.payload);
    default:
      return tasks;
  }
};

const removeTask = (tasks: Task[], idToRemove: string): Task[] =>
  tasks
    .filter(task => task.id !== idToRemove)
    .map((task) => {
      if (!task.subTasks) return task;

      const filteredSubTasks = removeTask(task.subTasks, idToRemove);
      return {
        ...task,
        subTasks: filteredSubTasks.length ? filteredSubTasks : undefined,
      };
    });