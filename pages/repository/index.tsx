import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FetchErrorAlert } from "@components/ui/CustomAlert";
import { useIssuesQuery } from "@generated/graphql";
import { Pagination } from "@types";
import { mapStateToQuery } from "@utils";
import { NUMBER_OF_ITEMS_TO_FETCH } from "@config/constants";

const RepositoryPage: NextPage = () => {
  const [search, setSearch] = useState<string>("");
  const [filterState, setFilterState] = useState("1");
  const [pagination, setPagination] = useState<Pagination>({});

  const router = useRouter();

  const name = router.query.name as string;
  const owner = router.query.owner as string;

  const { data, loading, error } = useIssuesQuery({
    variables: {
      // @ts-ignore
      last: NUMBER_OF_ITEMS_TO_FETCH,
      name,
      owner,
      states: mapStateToQuery(filterState),
      ...pagination,
    },
  });

  const { totalCount, pageInfo, nodes } = data?.repository?.issues || {};

  const memoIssues = useMemo(
    () =>
      nodes
        ?.filter((node) => {
          if (!node) return false;
          if (!search) return true;
          if (
            node.body.toLowerCase().includes(search.toLowerCase()) ||
            node.title.toLowerCase().includes(search.toLowerCase())
          )
            return true;
        })
        .reverse(),
    [search, nodes]
  );

  const fetchBefore = () => {
    setPagination({
      first: undefined,
      last: NUMBER_OF_ITEMS_TO_FETCH,
      after: undefined,
      before: pageInfo?.startCursor,
    });
  };
  const fetchAfter = () => {
    setPagination({
      first: NUMBER_OF_ITEMS_TO_FETCH,
      last: undefined,
      after: pageInfo?.endCursor,
      before: undefined,
    });
  };

  return (
    <Grid>
      <Head>
        <title>{`Issues from ${name}`}</title>
      </Head>
      <Heading size="md">{`${name} - ${owner}`}</Heading>
      <Divider my="1rem" />
      <FormControl display="flex" flexDirection={["column", "row"]}>
        <Input
          type="text"
          placeholder="Filter search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mr={[null, "1rem"]}
        />
        <RadioGroup
          onChange={setFilterState}
          value={filterState}
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          my={["1rem", "inherit"]}
        >
          <Stack direction="row">
            <Radio value="1">ALL</Radio>
            <Radio value="2">OPEN</Radio>
            <Radio value="3">CLOSED</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Divider m="1rem" />
      {loading && <Spinner />}
      {error && <FetchErrorAlert />}
      {data && (
        <Box mx="1rem">
          <Text id="issue-count">#Issues: {totalCount}</Text>
          <Box id="issue-list">
            {memoIssues?.map((node) => {
              if (!node) return null;
              const { comments, title, number, author, body } = node;
              return (
                <Box key={number} my="2rem">
                  <Flex>
                    <Text fontWeight="bold">{title}</Text>
                    <Text>{`(${comments.totalCount})`}</Text>
                  </Flex>
                  <Text fontSize="sm">By {author?.login}</Text>
                  <Divider mb="0.5rem" />
                  <Text>
                    {getBody({ text: body, maxLength: 200 })}{" "}
                    <Link href={`/issue/${number}?name=${name}&owner=${owner}`}>
                      <Button ml="0.5rem" size="xs">
                        Show more
                      </Button>
                    </Link>
                  </Text>
                </Box>
              );
            })}
          </Box>
          <Button disabled={!pageInfo?.hasNextPage} onClick={fetchAfter}>
            Previous Page
          </Button>
          <Button disabled={!pageInfo?.hasPreviousPage} onClick={fetchBefore}>
            Next Page
          </Button>
        </Box>
      )}
    </Grid>
  );
};

function getBody({ text, maxLength }: { text: string; maxLength: number }) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export default RepositoryPage;
