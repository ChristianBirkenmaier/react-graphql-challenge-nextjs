import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Grid,
  Heading,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useCommentsQuery } from "../../generated/graphql";

const amount = 5;

const IssuePage: NextPage = () => {
  const router = useRouter();
  const name = router.query.name as string;
  const owner = router.query.owner as string;
  const number = Number(router.query.number);
  const { data, error, loading, refetch } = useCommentsQuery({
    variables: { first: amount, name, owner, number },
  });

  const fetchBefore = () => {
    refetch({
      name,
      first: undefined,
      last: amount,
      owner,
      after: undefined,
      before: data?.repository?.issue?.comments.pageInfo.startCursor,
    });
  };
  const fetchAfter = () => {
    refetch({
      name,
      first: amount,
      last: undefined,
      owner,
      after: data?.repository?.issue?.comments.pageInfo.endCursor,
      before: undefined,
    });
  };

  const memoComments = useMemo(
    () =>
      data?.repository?.issue?.comments.nodes?.filter((node) => {
        if (!node) return false;
        return true;
      }),
    [data]
  );

  console.log({ data, error, loading });
  return (
    <>
      <Head>
        <title>{`See all comments from ${name}-${data?.repository?.issue?.title}`}</title>
      </Head>
      <Link href={`/repository?name=${name}&owner=${owner}`}>
        <Button>Go back</Button>
      </Link>
      <Grid>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              An error occured while fetching your data, sorry :(
            </AlertDescription>
          </Alert>
        )}
        {loading && <Spinner />}
        <Box>
          <Heading>{data?.repository?.issue?.title}</Heading>
          <Text fontSize="sm">By {data?.repository?.issue?.author?.login}</Text>
          <Divider mb="0.5rem" />
          <Text>{data?.repository?.issue?.body}</Text>
          <Text>{data?.repository?.issue?.comments.totalCount}</Text>
          <UnorderedList>
            {memoComments?.map((node) => (
              <ListItem key={node?.id}>
                <Text>{node?.body}</Text>
                <Text fontSize="sm">By {node?.author?.login}</Text>
              </ListItem>
            ))}
          </UnorderedList>
          <Button
            disabled={
              !data?.repository?.issue?.comments.pageInfo.hasPreviousPage
            }
            onClick={fetchAfter}
          >
            Previous Page
          </Button>
          <Button
            disabled={!data?.repository?.issue?.comments.pageInfo.hasNextPage}
            onClick={fetchBefore}
          >
            Next Page
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default IssuePage;
