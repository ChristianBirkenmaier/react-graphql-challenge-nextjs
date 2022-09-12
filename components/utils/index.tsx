import { InfoIcon } from "@chakra-ui/icons";
import {
  Heading,
  Skeleton,
  SkeletonText,
  Spinner,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { IssueState } from "@generated/graphql";

export function TotalCountTag({
  totalCount,
  loading,
}: {
  totalCount: number | undefined;
  loading: boolean;
}) {
  return (
    <Tag size="sm" variant="solid" colorScheme="teal" mx="0.5rem">
      {totalCount ? (
        totalCount
      ) : loading ? (
        <Spinner mx="0.25rem" size="xs" />
      ) : (
        0
      )}{" "}
      items
    </Tag>
  );
}

export function CustomSkeletonText({ number }: { number: number }) {
  return (
    <Stack>
      <SkeletonText mt={number} noOfLines={number} spacing={number} />
      <SkeletonText mt={number} noOfLines={number} spacing={number} />
      <SkeletonText mt={number} noOfLines={number} spacing={number} />
      <SkeletonText mt={number} noOfLines={number} spacing={number} />
      <SkeletonText mt={number} noOfLines={number} spacing={number} />
    </Stack>
  );
}

export function IssueBody({
  issueLoading,
  body,
}: {
  issueLoading: boolean;
  body?: string;
}) {
  return (
    <Skeleton isLoaded={!issueLoading}>
      <Text borderWidth="1px" borderRadius="5px" p="0.5rem" id="comment-body">
        {body}
      </Text>
    </Skeleton>
  );
}

export function IssueHeader({
  title,
  state,
  authorLogin,
  loading,
  totalCount,
}: {
  title?: string;
  state?: IssueState;
  authorLogin?: string;
  loading: boolean;
  totalCount?: number;
}) {
  return (
    <>
      <Heading my="0.5rem" id="comment-title">
        {title}
      </Heading>
      <Stack direction="row" mb="0.5rem">
        <InfoIcon
          alignSelf="center"
          mr="0.5rem"
          color={state === IssueState.Open ? "green" : "rebeccapurple"}
        />
        <Text my="0.5rem">By {authorLogin} </Text>
        <TotalCountTag loading={loading} totalCount={totalCount} />
      </Stack>
    </>
  );
}
