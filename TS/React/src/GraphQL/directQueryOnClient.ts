import { gql } from '@apollo/client';
import client from './client';

export default () => {
  client.query({
    query: gql`
      query GetTaskList {
        taskList {
          tasks {
            description
          }
        }
      }
    `,
  }).then(result => console.log(result));
}