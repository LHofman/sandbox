import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Task {
    description: String!
    completed: Boolean
  }

  type Query {
    tasks(): [Task]
  }
`;

const tasks = [
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
];

const resolvers = {
  Query: {
    tasks: async () => {
      return Promise.resolve(tasks);
    },
  },
};

export async function run(): Promise<void> {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}
