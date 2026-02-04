import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/use/ws';
import http from 'http';
import { WebSocketServer } from 'ws';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub, withFilter } from 'graphql-subscriptions';

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

  type Subscription {
    taskAdded: Task!
  }
`;

const tasks = [
  { description: 'Create ToDo List', completed: true },
  { description: 'Learn GraphQL Server' },
];

/*
  The PubSub class is not recommended for production environments, because its event-publishing system is in-memory.
  This means that events published by one instance of your GraphQL server are not received by subscriptions that are handled by other instances.
  Instead, you should use a subclass of the PubSubEngine abstract class that you can back with an external datastore such as Redis or Kafka.
  https://www.apollographql.com/docs/apollo-server/data/subscriptions#production-pubsub-libraries
*/
const pubsub = new PubSub();

const resolvers = {
  Query: {
    tasks: () => tasks,
  },
  Mutation: {
    addTask: (
      _: any,
      { taskInput }: { taskInput: { description: string } },
    ) => {
      pubsub.publish('TASK_ADDED', { taskAdded: { description: taskInput.description } });
      return { description: taskInput.description };
    }
  },
  Subscription: {
    taskAdded: {
      // subscribe: () => pubsub.asyncIterableIterator(['TASK_ADDED']),
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator(['TASK_ADDED']),
        (payload, variables) => {
          return (
            payload.taskAdded.description.includes(variables.descriptionFilter || '')
          );
        }
      )
    },
  }
};

export async function run(): Promise<void> {
  const app = express();

  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        return { token: ctx.connectionParams?.authentication };
      },
      onConnect: async (ctx) => {
        console.log('Connected!');
      },
      onDisconnect(ctx, code, reason) {
        console.log('Disconnected!');
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        }
      }
    ],
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
