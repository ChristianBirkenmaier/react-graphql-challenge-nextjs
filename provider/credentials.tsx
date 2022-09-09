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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function CredentialsProvider({
  setToken,
  token,
  children,
}: {
  setToken: any;
  token: string | undefined;
  children: React.ReactNode;
}) {
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const { onClose } = useDisclosure();

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) return;
    setSubmitted(true);
    setToken(token);
  }, []);

  return (
    <Grid>
      <Modal isOpen={!token || (!!token && !isSubmitted)} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Github Access Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="1rem">
              Please enter a valid github access token to proceed to the
              application.
            </Text>
            <FormControl>
              <Input
                type="text"
                name="token-input"
                placeholder="Enter github token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <FormHelperText>
                The token needs repository access rights.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              name="token-submit"
              disabled={!token}
              onClick={() => {
                localStorage.setItem("github_token", token!);
                setSubmitted(true);
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <>{children}</>
    </Grid>
  );
}
