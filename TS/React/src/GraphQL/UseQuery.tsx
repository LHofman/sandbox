import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

interface Task {
  description: string;
}

const QUERY = gql`
  query GetTaskList {
    taskList {
      tasks {
        description
      }
    }
  }
`;

function UseQuery() {
  const { loading, error, data } = useQuery<{ taskList: { tasks: Task[] } }>(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      {data?.taskList.tasks.map((task: Task, idx: number) => (
        <p key={idx}>{task.description}</p>
      ))}
    </div>
  );
}

export default UseQuery;