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
import Navlink from "next/link";
import { useEffect, useState } from "react";
import {
  Button,
  ChakraProvider,
  Flex,
  Link,
  FormControl,
  Grid,
  Input,
  Stack,
  Divider,
} from "@chakra-ui/react";
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
  const [hasLookedForItem, setHasLookedForItem] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    setHasLookedForItem(true);
    if (!token) return;
    setToken(token);
    setSubmitted(true);
  }, []);
  if (!hasLookedForItem) return null;

  return (
    <ChakraProvider theme={theme}>
      {!token || (token && !isSubmitted) ? (
        <GetCredentials
          setSubmitted={setSubmitted}
          setToken={setToken}
          token={token}
        />
      ) : (
        <ApolloProvider client={createClient(token!)}>
          <Stack direction={"row"} spacing={4}>
            <Navlink href="/">
              <Link
                p={2}
                fontSize="lg"
                fontWeight={500}
                color="gray.600"
                _hover={{
                  textDecoration: "none",
                  color: "gray.800",
                }}
              >
                Repositories
              </Link>
            </Navlink>
          </Stack>
          <Divider mb="1rem" />
          <Component {...pageProps} />
        </ApolloProvider>
      )}
    </ChakraProvider>
  );
}

function GetCredentials({
  setToken,
  setSubmitted,
  token,
}: {
  setToken: any;
  setSubmitted: any;
  token: string | undefined;
}) {
  return (
    <Grid>
      <FormControl>
        <Input
          type="text"
          placeholder="Enter github token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button
          disabled={!token}
          onClick={() => {
            localStorage.setItem("github_token", token!);
            setSubmitted(true);
          }}
        >
          Submit
        </Button>
      </FormControl>
    </Grid>
  );
}

export default MyApp;
