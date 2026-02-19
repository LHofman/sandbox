import { CombinedGraphQLErrors } from '@apollo/client';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';

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

function UseLazyQuery() {
  const [getTaskList, { loading, error, called, variables }] =
    useLazyQuery<{ taskList: { tasks: Task[] } }>(QUERY);

  const handleClickErrorPolicyNoneDefault = async () => {
    try {
      const { data } = await getTaskList({ variables: { taskListId: 'default' } });
      console.log(data);
    } catch (error) {
      if (CombinedGraphQLErrors.is(error)) {
        console.error('GraphQL Errors:', error.message);
      }
    }
  };

  /*const handleClickErrorPolicyAll = async () => {
    const { data, error } = await getTaskList({ variables: { taskListId: 'default' } });
    
    if (CombinedGraphQLErrors.is(error)) {
      console.error('GraphQL Errors:', error.message);
      return;
    }
    
    console.log(data);
  };

  const handleClickDontAbortOnError = async () => {
    const promise = getTaskList({ variables: { taskListId: 'default' } });

    // Retain the query even if component unmounts or if the query is refetched before the previous one completes
    promise.retain();

    const { data } = await promise;

    console.log(data);
  };*/

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <button onClick={handleClickErrorPolicyNoneDefault}>
        Refetch Task List!
      </button>

      { called && <span>Last fetched: { variables.taskListId }</span>}
    </div>
  );
}

export default UseLazyQuery;