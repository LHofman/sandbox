import React from "react";
import icons from "./icons";

export interface Task {
  id: string;
  description: string;
  isCompleted?: boolean;
  dueDate?: Date;
  subTasks?: Task[];
  category?: keyof typeof icons;
}

interface TaskProps {
  task: Task;
  onRemove: (taskId: string) => void;
}

export const Task = (props: TaskProps) => {
  const { description, isCompleted = false, dueDate, subTasks } = props.task;

  let iconElement = null;
  if (props.task.category) {
    iconElement = React.createElement(icons[props.task.category]);
  }

  return (
    <span>
      {iconElement} {description} - {isCompleted ? "✅" : "☑️"} {dueDate && ` (Due: ${dueDate.toLocaleDateString()})`}
      { !!subTasks
        ? (
          <ul>
            { subTasks.map((subTask) => (
              <li key={subTask.id}><Task task={subTask} onRemove={props.onRemove} /></li>
            )) }
          </ul>
        ) : <button onClick={() => props.onRemove(props.task.id)}>Remove</button>
      }
    </span>
  );
}