import React from 'react';
import type { AppProps } from 'next/app'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:9000/gql',
});

export const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
}
export default App
