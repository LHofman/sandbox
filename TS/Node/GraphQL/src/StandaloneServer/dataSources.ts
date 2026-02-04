import { RESTDataSource, type AugmentedRequest } from '@apollo/datasource-rest';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import DataLoader from 'dataloader';

const typeDefs = `#graphql
  type Task {
    description: String!
    completed: Boolean
  }

  type Query {
    tasks: [Task]
  }
`;

interface MyContext {
  dataSources: {
    tasksDataSource: TasksDataSource;
    taskAPI: TaskAPI;
  };
}

const resolvers = {
  Query: {
    tasks: async (_: any, __: any, context: MyContext) => {
      return context.dataSources.tasksDataSource.getTasks('default');
      // return context.dataSources.taskAPI.getTasks('default');
    },
  },
};

export async function run(): Promise<void> {
  const server = new ApolloServer<MyContext>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const { cache } = server;
      return {
        dataSources: {
          tasksDataSource: new TasksDataSource(),
          taskAPI: new TaskAPI({ token: 'my-token', cache }),
        }
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

interface Task {
  description: string;
  completed?: boolean;
}

/*
  If you want to add batching, deduplication, or caching to your data source class, we recommend using the DataLoader package.
  Using a package like DataLoader is particularly helpful for solving the infamous N+1 query problem.

  DataLoader provides a memoization cache, which avoids loading the same object multiple times during a single GraphQL request (much like one of RESTDataSource's caching layers).
  It also combines loads during a single event loop tick into a batched request that fetches multiple objects at once.

  DataLoader instances are per-request, so if you use a DataLoader in your data source, ensure you create a new instance of that class with every request
*/
class TasksDataSource {
  // Data Loader always requires key(s) and returns an array of values with the exact same length as the keys array
  private tasksFromList = new DataLoader(async (keys) => {
    return [getTasksFromData()];
  });

  async getTasks(taskListId: string): Promise<Task[]> {
    return this.tasksFromList.load(taskListId);
  }
}

const getTasksFromData = async () => Promise.resolve([
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
]);

class TaskAPI extends RESTDataSource {
  override baseURL = 'https://example.com/api/';
  private token: string;

  constructor(options: { token: string, cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  async getTasks(taskListId: string) {
    // return this.get<Task[]>(`/tasks/${encodeURIComponent(taskListId)}`, requestOptions);
    return getTasksFromData();
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers['Authorization'] = this.token;
    request.params.set('api_key', 'my-api-key');
  }
}