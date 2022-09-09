import { Divider, Link, Stack } from "@chakra-ui/react";
import Navlink from "next/link";

export const Header = () => (
  <>
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
  </>
);
