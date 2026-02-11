import { cacheControlFromInfo } from '@apollo/cache-control-types';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import type { GraphQLResolveInfo } from 'graphql';

const typeDefs = `#graphql
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int #In Seconds
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Task @cacheControl(maxAge: 60, scope: PUBLIC) {
    description: String!
    completed @cacheControl(maxAge: 15, scope: PRIVATE): Boolean
  }

  type Query {
    tasks: [Task]
  }
`;

const tasks = [
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
];

const resolvers = {
  Query: {
    tasks: async (_: any, __: any, ___: any, info: GraphQLResolveInfo) => {
      // Either in types or resolvers, you can set cache hints.
      // If you set it in both places, the resolver will override the type definition.
      const cacheControle = cacheControlFromInfo(info);
      cacheControle.setCacheHint({ maxAge: 30, scope: 'PUBLIC' });

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
