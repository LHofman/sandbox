import { gql, NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

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

function UseQuery() {
  // https://www.apollographql.com/docs/react/data/queries#usequery-api
  const { loading, error, data, refetch, networkStatus } =
    useQuery<{ taskList: { tasks: Task[] } }>(QUERY, {
      variables: { taskListId: 'default' },
      pollInterval: 5000, // Poll every 5 seconds
      errorPolicy: 'all', // ignore, all, and none
      // cache-first, cache-only, no-cache, network-only, cache-and-network, and standby
      // https://www.apollographql.com/docs/react/data/queries#supported-fetch-policies
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    });

    // Conditionally skip the query if id is not provided
    // useQuery<{ taskList: { tasks: Task[] } }>(QUERY, id ? { variables: { taskListId: id } } : skipToken);

  if (networkStatus === NetworkStatus.refetch) return <p>Refetching...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      {data?.taskList.tasks.map((task: Task, idx: number) => (
        <p key={idx}>{task.description}</p>
      ))}
      <button onClick={() => refetch({ taskListId: 'another' })}>Refetch Task List!</button>
    </div>
  );
}

export default UseQuery;