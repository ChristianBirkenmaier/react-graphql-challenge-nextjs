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
import { useCommentsQuery } from "../../generated/graphql";

const IssuePage: NextPage = () => {
  const router = useRouter();
  const name = router.query.name as string;
  const owner = router.query.owner as string;
  const number = Number(router.query.number);
  const { data, error, loading } = useCommentsQuery({
    variables: { first: 20, name, owner, number },
  });
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
          <UnorderedList>
            {data?.repository?.issue?.comments.nodes?.map((node) => (
              <ListItem key={node?.id}>
                <Text>{node?.body}</Text>
                <Text fontSize="sm">By {node?.author?.login}</Text>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Grid>
    </>
  );
};

export default IssuePage;
