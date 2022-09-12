import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Divider, Button, Text, Box } from "@chakra-ui/react";
import { IssueState } from "@generated/graphql";
import { getIssueBody } from "@utils";
import Link from "next/link";

export function Issue({
  number,
  title,
  state,
  totalCount,
  authorLogin,
  body,
  owner,
  name,
}: {
  number: number;
  title: string;
  state: IssueState;
  totalCount: number;
  authorLogin?: string;
  body: string;
  owner: string;
  name: string;
}) {
  return (
    <Box my="1rem" borderWidth="1px" borderRadius="5px" p="0.5rem">
      <Flex alignItems="baseline">
        <InfoIcon
          mr="0.5rem"
          color={state === IssueState.Open ? "green" : "rebeccapurple"}
        />
        <Text fontWeight="bold">{title}</Text>
        <Text>{`(${totalCount})`}</Text>
      </Flex>
      <Text my="0.5rem">By {authorLogin}</Text>

      <Divider mb="0.5rem" />
      <Text>
        {getIssueBody({ text: body, maxLength: 200 })}{" "}
        <Link href={`/issue/${number}?name=${name}&owner=${owner}`}>
          <Button ml="0.5rem" size="xs" name="show-more">
            Show more
          </Button>
        </Link>
      </Text>
    </Box>
  );
}
