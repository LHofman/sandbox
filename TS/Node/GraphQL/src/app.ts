import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  "Description of an example type"
  type Example {
    """
    Multi-line description of a field
    """
    number: Int @deprecated(reason: "Use requiredNumber.")
    requiredNumber: Int!
    array: [String]
    arrayWithoutNullableItems: [String!]
    arrayNotNullable: [String]!
    arrayNotNullableWithoutNullableItems: [String!]!
    decimal: Float
    text: String
    id: ID
    object: Task
    option: ExampleEnum
    color: ExampleEnumWithInternalValues
  }

  enum ExampleEnum {
    OPTION_A
    OPTION_B
  }

  enum ExampleEnumWithInternalValues {
    RED
    GREEN
    BLUE
  }

  union ExampleUnion = Example | Task

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

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type AddTaskMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    task: Task
  }

  type Query {
    tasks: [Task]
    taskList: TaskList
    example: ExampleUnion
  }

  type Mutation {
    addTask(taskInput: TaskInput!): AddTaskMutationResponse!
  }
`;

const tasks = [
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
];

const exampleData = {
  number: 42,
  requiredNumber: 7,
  array: ['one', 'two', 'three'],
  arrayWithoutNullableItems: ['a', 'b', 'c'],
  arrayNotNullable: ['x', 'y', 'z'],
  arrayNotNullableWithoutNullableItems: ['alpha', 'beta', 'gamma'],
  decimal: 3.14,
  text: 'Hello, GraphQL!',
  id: 'example-id',
  object: { description: 'Sample Task', completed: false },
  option: 'OPTION_A',
  color: '#F00'
};

interface MyContext {
  token: string | null; 
}

const resolvers = {
  Query: {
    tasks: async () => Promise.resolve(tasks),
    taskList: () => ({ tasks: tasks }),
    example: () => exampleData,
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
  ExampleUnion: {
    __resolveType(obj: any) {
      if (obj.number) return 'Example';
      if (obj.description) return 'Task';
      return null;
    },
  },
  ExampleEnumWithInternalValues: {
    RED: '#F00',
    GREEN: '#0F0',
    BLUE: '#00F'
  }
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
