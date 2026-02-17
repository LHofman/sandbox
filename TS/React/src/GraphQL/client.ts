import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache(),
});