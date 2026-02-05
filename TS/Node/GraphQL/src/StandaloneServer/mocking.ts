import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema/makeExecutableSchema';
import { addMocksToSchema } from '@graphql-tools/mock';

const typeDefs = `#graphql
  type Task {
    description: String!
    completed: Boolean
  }

  type Query {
    tasks: [Task]
  }
`;

const resolvers = {};

// Optional: Custom mocks
const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Hello',
};

export async function run(): Promise<void> {
  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      mocks,
      // Needed to ensure that existing resolvers (if any) are preserved
      preserveResolvers: true,
    }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}
