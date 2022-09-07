// import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { GRAPHQL_URI } from "../config/constants";
import { setContext } from "@apollo/client/link/context";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";

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
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) return;
    setToken(token);
    setSubmitted(true);
  }, []);
  if (!isSubmitted) {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter github token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          disabled={!token}
          onClick={() => {
            localStorage.setItem("github_token", token!);
            setSubmitted(true);
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <ApolloProvider client={createClient(token!)}>
      <ChakraProvider theme={theme}>
        <header>
          <div>
            <Link href="/">Dashboard</Link>
          </div>
        </header>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
