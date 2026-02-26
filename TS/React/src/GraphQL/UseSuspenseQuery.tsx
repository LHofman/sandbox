import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/client/react';
import { Suspense } from 'react';

interface Task {
  description: string;
}

// Results are automatically cached
const QUERY = gql`
  query GetTaskList($taskListId: String) {
    taskList(taskListId: $taskListId) {
      tasks {
        description
      }
    }
  }
`;

function UseSuspenseQuery() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TaskList taskListId="default" />
    </Suspense>
  )
}

function TaskList({ taskListId }: { taskListId: string }) {
  const { data } = useSuspenseQuery<{ taskList: { tasks: Task[] } }>(QUERY, {
    variables: { taskListId },
  });

  return (
    <>
      {data?.taskList.tasks.map((task: Task, idx: number) => (
        <p key={idx}>{task.description}</p>
      ))}
    </>
  )
}

export default UseSuspenseQuery;