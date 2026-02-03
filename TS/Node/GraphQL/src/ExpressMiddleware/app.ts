import cors from 'cors';
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

const typeDefs = `#graphql
  type Task {
    description: String!
    completed: Boolean
  }

  input TaskInput {
    description: String!
  }

  type Query {
    tasks: [Task]
  }

  type Mutation {
    addTask(taskInput: TaskInput!): Task!
  }
`;

const tasks = [
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
];

const resolvers = {
  Query: {
    tasks: () => tasks,
  },
  Mutation: {
    addTask: (
      _: any,
      { taskInput }: { taskInput: { description: string } },
    ) => {
      return { description: taskInput.description };
    }
  },
};

export async function run(): Promise<void> {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
