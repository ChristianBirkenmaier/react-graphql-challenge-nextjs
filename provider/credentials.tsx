import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  Grid,
  FormControl,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { GRAPHQL_URI } from "@config/constants";
import { verifyToken } from "@utils";
import { useEffect, useState } from "react";

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
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const { onClose } = useDisclosure();
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) return;
    setIsAuthorized(true);
    setToken(token);
  }, []);

  async function handleTokenSubmit() {
    // return localStorage.setItem("github_token", token);
    const isValid = await verifyToken(token);
    if (isValid) {
      setIsError(false);
      localStorage.setItem("github_token", token);
      setIsAuthorized(true);
    } else {
      setIsError(true);
    }
  }

  function clearCookie() {
    setToken("");
    setIsAuthorized(false);
    localStorage.removeItem("github_token");
  }

  return (
    <Grid>
      <Modal isOpen={!isAuthorized} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Github Access Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="1rem">
              Please enter a valid github access token to proceed to the
              application.
            </Text>
            <FormControl isInvalid={isError}>
              <Input
                type="text"
                name="token-input"
                placeholder="Enter github token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              {!isError ? (
                <FormHelperText>
                  The token needs repository access rights.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Invalid access token.</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              name="token-submit"
              disabled={!token}
              onClick={handleTokenSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isAuthorized && (
        <ApolloProvider client={createClient(token!)}>
          <>{children}</>
        </ApolloProvider>
      )}
      <Button onClick={clearCookie} position="fixed" bottom="10px" left="10px">
        Clear cookie
      </Button>
    </Grid>
  );
}
