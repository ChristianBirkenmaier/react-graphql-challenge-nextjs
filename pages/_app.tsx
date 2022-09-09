// import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { GRAPHQL_URI } from "@config/constants";
import { setContext } from "@apollo/client/link/context";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@styles/theme";
import { CredentialsProvider } from "@provider/credentials";
import { Header } from "@components/header";

const createClient = (token: string) => {
  const httpLink = createHttpLink({
    uri: GRAPHQL_URI,
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN;

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <ChakraProvider theme={theme}>
      <CredentialsProvider setToken={setToken} token={token}>
        <ApolloProvider client={createClient(token!)}>
          <Header />
          <Component {...pageProps} />
        </ApolloProvider>
      </CredentialsProvider>
    </ChakraProvider>
  );
}

export default MyApp;
