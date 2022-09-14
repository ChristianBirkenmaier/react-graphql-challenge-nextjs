import { Divider, Link, Stack } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

import Navlink from "next/link";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <>
      <Stack direction={"row"} spacing={4} justifyContent="space-between">
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
        {!session ? (
          <Navlink href="#">
            <Link
              p={2}
              fontSize="lg"
              fontWeight={500}
              color="gray.600"
              _hover={{
                textDecoration: "none",
                color: "gray.800",
              }}
              onClick={() => signIn()}
            >
              Login
            </Link>
          </Navlink>
        ) : (
          <Navlink href="#">
            <Link
              p={2}
              fontSize="lg"
              fontWeight={500}
              color="gray.600"
              _hover={{
                textDecoration: "none",
                color: "gray.800",
              }}
              onClick={() => signOut()}
            >
              Logout
            </Link>
          </Navlink>
        )}
      </Stack>
      <Divider mb="1rem" />
    </>
  );
};
