import { ApolloProvider } from '@apollo/client/react';
import client from './client';
import UseQuery from './useQuery';

function Main() {
  return (
    <ApolloProvider client={client}>
      <h1>GraphQL Example</h1>
      <UseQuery />
    </ApolloProvider>
  )
}

export default Main;