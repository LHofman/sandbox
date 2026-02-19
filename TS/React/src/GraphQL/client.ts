import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      notifyOnNetworkStatusChange: false,
      // nextFetchPolicy: 'cache-first',
      // It will be called after every request or when variables change
      nextFetchPolicy: (currentFetchPolicy, { reason, options, initialFetchPolicy, observable }) => {
        console.log(options, observable);
        
        if (reason === 'variables-changed') {
          return initialFetchPolicy;
        }

        if (
          currentFetchPolicy === "network-only" ||
          currentFetchPolicy === "cache-and-network"
        ) {
          return "cache-first";
        }
        
        return currentFetchPolicy;
      }
    },
  },
});