import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Resolvers } from './generatedTypes';

const typeDefs = readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf-8' });

const tasks = [
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
];

export interface MyContext {
  token: string | null;
}

const resolvers: Resolvers = {
  Query: {
    tasks: async () => {
      return Promise.resolve(tasks);
    },
  },
};

export async function run(): Promise<void> {
  const server = new ApolloServer<MyContext>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => ({
      token: req.headers.authorization || null,
    }),
  });

  console.log(`🚀  Server ready at: ${url}`);
}
