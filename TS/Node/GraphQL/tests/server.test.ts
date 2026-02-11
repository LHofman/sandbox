import { ApolloServer } from '@apollo/server';
import { resolvers, typeDefs } from '../src/StandaloneServer/basics';
import assert from 'node:assert';

it('returns hi', async () => {
  const testServer = new ApolloServer({ typeDefs, resolvers });

  const response = await testServer.executeOperation({
    query: `query {
      example {
        ...on Example {
          number
        }
      }
    }`
  });

  assert(response.body.kind === 'single');
  const body = response.body.singleResult;
  expect(body.errors).toBeUndefined();
  expect(body.data?.example.number).toBe(42);
});