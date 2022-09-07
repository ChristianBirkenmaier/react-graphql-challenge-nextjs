import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Grid,
  Heading,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCommentsQuery } from "../../generated/graphql";

const IssuePage: NextPage = () => {
  const router = useRouter();
  const name = router.query.name as string;
  const owner = router.query.owner as string;
  const number = Number(router.query.number);
  const { data, error, loading } = useCommentsQuery({
    variables: { first: 5, name, owner, number },
  });
  console.log({ data, error, loading });
  return (
    <>
      <Head>
        <title>{`See all comments from ${name}`}</title>
      </Head>
      <Grid>
        <Heading>Comment Page</Heading>
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
          <Text>{data?.repository?.issue?.body}</Text>
          <UnorderedList>
            {data?.repository?.issue?.comments.nodes?.map((node) => (
              <ListItem key={node?.id}>{node?.body}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Grid>
    </>
  );
};

export default IssuePage;
