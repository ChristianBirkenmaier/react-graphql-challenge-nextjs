import { Heading, Divider, Button, Text, Box } from "@chakra-ui/react";
import Link from "next/link";

export function Repository({
  name,
  ownerLogin,
  totalCount,
}: {
  name: string;
  ownerLogin: string;
  totalCount: number;
}) {
  return (
    <Box
      shadow="md"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      padding="1rem"
      margin="1rem"
      _hover={{
        textDecoration: "none",
        borderColor: "#ddd",
        shadow: "lg",
      }}
    >
      <Heading size="md" p="0.25rem">
        {name}
      </Heading>
      <Divider my="0.5rem" />
      <Text my="0.5rem">Owner: {ownerLogin}</Text>
      <Text my="0.5rem">Issues: {totalCount}</Text>
      <Link href={`/repository?name=${name}&owner=${ownerLogin}`}>
        <Button width="100%" name="show-more">
          Show more
        </Button>
      </Link>
    </Box>
  );
}
