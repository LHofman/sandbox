import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

export const typeDefs = `#graphql
  type Task {
    description: String!
    completed: Boolean
  }

  type TaskList {
    tasks: [Task!]!
  }

  input TaskInput {
    description: String!
  }

  type AddTaskMutationResponse {
    task: Task
  }

  type Query {
    taskList(taskListId: String): TaskList
  }

  type Mutation {
    addTask(taskInput: TaskInput!): AddTaskMutationResponse!
  }
`;

interface Task {
  description: string;
  completed?: boolean;
}

interface TaskList {
  tasks: Task[];
}

const taskLists: Record<string, TaskList> = {
  default: {
    tasks: [
      { description: 'Create ToDo List', completed: true },
      { description: 'Learn GraphQL Server' },
    ],
  },
  another: {
    tasks: [
      { description: 'Task from another list', completed: false },
    ],
  },
};

interface MyContext {
  token: string | null; 
}

export const resolvers = {
  Query: {
    taskList: (_: any, { taskListId }: { taskListId: string }) => {
      console.log('hi', taskListId);
      return taskLists[taskListId ?? 'default'] || null;
    }
  },
  Mutation: {
    addTask: (
      _: any,
      { taskInput }: { taskInput: { description: string } },
      context: MyContext
    ) => {
      console.log(context.token);

      return {
        code: '200',
        success: true,
        message: 'Task added',
        task: { description: taskInput.description },
      };
    }
  },
};

export async function run(): Promise<void> {
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => ({
      token: req.headers.authorization || null,
    }),
  });

  console.log(`🚀  Server ready at: ${url}`);
}
