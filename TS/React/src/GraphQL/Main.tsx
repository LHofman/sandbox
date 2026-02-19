import { ApolloProvider } from '@apollo/client/react';
import client from './client';
import UseQuery from './UseQuery';
import UseLazyQuery from './UseLazyQuery';

function Main() {
  return (
    <ApolloProvider client={client}>
      <h1>GraphQL Example</h1>
      <UseQuery />
      <UseLazyQuery />
    </ApolloProvider>
  )
}

export default Main;