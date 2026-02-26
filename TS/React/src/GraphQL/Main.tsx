import { ApolloProvider } from '@apollo/client/react';
import client from './client';
import UseQuery from './UseQuery';
import UseLazyQuery from './UseLazyQuery';
import UseSuspenseQuery from './UseSuspenseQuery';

function Main() {
  return (
    <ApolloProvider client={client}>
      <h1>GraphQL Example</h1>
      <UseQuery />
      <UseLazyQuery />
      <UseSuspenseQuery />
    </ApolloProvider>
  )
}

export default Main;