import { ArrowBackIcon } from "@chakra-ui/icons";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Heading,
  ListItem,
  OrderedList,
  Skeleton,
  Spinner,
  Tag,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useCommentsQuery, useIssueQuery } from "@generated/graphql";
import { NUMBER_OF_ITEMS_TO_FETCH } from "@config/constants";
import { Pagination } from "@types";
import { PaginationFooter } from "@components/pagination";

const IssuePage: NextPage = () => {
  const router = useRouter();
  const name = router.query.name as string;
  const owner = router.query.owner as string;
  const number = Number(router.query.number);
  const [pagination, setPagination] = useState<Pagination>({});

  const {
    data: issueData,
    error: issueError,
    loading: issueLoading,
  } = useIssueQuery({ variables: { name, owner, number } });

  const { data, error, loading, refetch } = useCommentsQuery({
    variables: {
      last: NUMBER_OF_ITEMS_TO_FETCH,
      name,
      owner,
      number,
      ...pagination,
    },
  });

  const memoComments = useMemo(
    () =>
      data?.repository?.issue?.comments.nodes?.filter((node) => {
        if (!node) return false;
        return true;
      }),
    [data]
  );

  const { body, id, state, title, author } = issueData?.repository?.issue || {};

  const { pageInfo, totalCount } = data?.repository?.issue?.comments || {};

  return (
    <>
      <Head>
        <title>{`See all comments from ${name}-${title}`}</title>
      </Head>
      <Link href={`/repository?name=${name}&owner=${owner}`}>
        <Button width="100px">
          <ArrowBackIcon />
          Go back
        </Button>
      </Link>
      <Grid>
        {(error || issueError) && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              An error occured while fetching your data, sorry :(
            </AlertDescription>
          </Alert>
        )}
        <Box>
          <Heading my="0.5rem" id="comment-title">
            {title}{" "}
          </Heading>
          <Text fontSize="sm" my="0.5rem">
            By {author?.login}{" "}
            <Tag size="sm" variant="solid" colorScheme="teal" mx="0.5rem">
              {totalCount ? totalCount : "..."} items
            </Tag>
          </Text>
          <Divider mb="0.5rem" />
          <Skeleton isLoaded={!issueLoading}>
            <Text
              borderWidth="1px"
              borderRadius="5px"
              p="0.5rem"
              bg="#eee"
              id="comment-body"
            >
              {body}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <OrderedList id="comment-list" overflow="auto">
              {memoComments?.map((node) => (
                <ListItem
                  key={node?.id}
                  my="1rem"
                  borderWidth="1px"
                  borderRadius="5px"
                  p="0.5rem"
                  bg="#eee"
                >
                  <Text>{node?.body}</Text>
                  <Text fontSize="sm">By {node?.author?.login}</Text>
                </ListItem>
              ))}
            </OrderedList>
          </Skeleton>
          <PaginationFooter
            pageInfo={pageInfo}
            setPagination={setPagination}
            totalCount={totalCount}
            loading={loading}
          />
        </Box>
      </Grid>
    </>
  );
};

export default IssuePage;
