import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Grid, Heading } from "@chakra-ui/react";
import { GRAPHQL_URI } from "@config/constants";
import { useSession } from "next-auth/react";

const createClient = (token: string) => {
  const httpLink = createHttpLink({
    uri: GRAPHQL_URI,
  });
  const authLink = setContext((_, { headers }) => {
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

export function CredentialsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <Grid>
      {session?.accessToken ? (
        <ApolloProvider client={createClient(session.accessToken)}>
          <>{children}</>
        </ApolloProvider>
      ) : (
        <Heading size="lg">
          You need to be logged in to use this application.
        </Heading>
      )}
    </Grid>
  );
}
