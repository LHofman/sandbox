export interface Task {
  id: string;
  description: string;
  isCompleted?: boolean;
  dueDate?: Date;
}

interface TaskProps {
  task: Task;
  onRemove: (taskId: string) => void;
}

export const Task = (props: TaskProps) => {
  const { description, isCompleted = false, dueDate } = props.task;

  return (
    <p>
      {description} - {isCompleted ? "✅" : "☑️"} {dueDate && ` (Due: ${dueDate.toLocaleDateString()})`}
      <button onClick={() => props.onRemove(props.task.id)}>Remove</button>
    </p>
  );
}