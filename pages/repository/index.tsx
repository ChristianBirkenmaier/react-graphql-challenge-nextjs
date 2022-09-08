import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
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
import { useEffect, useMemo, useState } from "react";
import {
  IssueState,
  useIssuesLazyQuery,
  useIssuesQuery,
} from "../../generated/graphql";

type Pagination = {
  after?: String | null;
  before?: String | null;
  first?: Number;
  last?: Number;
};

const RepositoryPage: NextPage = () => {
  const [amount, setAmount] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const [filterState, setFilterState] = useState("1");
  const [pagination, setPagination] = useState<Pagination>({});

  const router = useRouter();

  const name = router.query.name as string;
  const owner = router.query.owner as string;

  const {
    data,
    loading,
    error,
    refetch: loadIssueData,
  } = useIssuesQuery({
    variables: {
      // @ts-ignore
      last: amount,
      name,
      owner,
      states: mapStateToQuery(filterState),
      ...pagination,
    },
  });

  const { totalCount, pageInfo, edges } = data?.repository?.issues || {};

  const memoIssues = useMemo(
    () =>
      edges
        ?.filter((edge) => {
          if (!edge?.node) return false;
          if (!search) return true;
          if (
            edge.node.body.includes(search) ||
            edge.node.title.includes(search)
          )
            return true;
          return false;
        })
        .reverse(),
    [search, edges]
  );

  const fetchBefore = () => {
    setPagination({
      first: undefined,
      last: amount,
      after: undefined,
      before: pageInfo?.startCursor,
    });
    // loadIssueData({
    //   name,
    //   first: undefined,
    //   last: amount,
    //   owner,
    //   states: mapStateToQuery(filterState),
    //   after: undefined,
    //   before: pageInfo?.startCursor,
    // });
  };
  const fetchAfter = () => {
    setPagination({
      first: amount,
      last: undefined,
      after: pageInfo?.endCursor,
      before: undefined,
    });

    // loadIssueData({
    //   name,
    //   first: amount,
    //   last: undefined,
    //   owner,
    //   states: mapStateToQuery(filterState),
    //   after: pageInfo?.endCursor,
    //   before: undefined,
    // });
  };

  return (
    <Grid>
      <Head>
        <title>{`Issues from ${name}`}</title>
      </Head>
      <Heading size="md">{`${name} - ${owner}`}</Heading>
      <Divider my="1rem" />
      <FormControl>
        <Input
          type="number"
          placeholder="First"
          value={amount}
          disabled
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <FormHelperText mb="1rem"># Issues</FormHelperText>

        <RadioGroup onChange={setFilterState} value={filterState}>
          <Stack direction="row">
            <Radio value="1">ALL</Radio>
            <Radio value="2">OPEN</Radio>
            <Radio value="3">CLOSED</Radio>
          </Stack>
        </RadioGroup>
        <FormHelperText mb="1rem">Open / Closed</FormHelperText>
        <Input
          type="text"
          placeholder="Filter search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FormControl>
      <Divider m="1rem" />
      {loading && <Spinner />}
      {error && <CustomAlert />}
      {data && (
        <Box mx="1rem">
          <Text>#Issues: {totalCount}</Text>
          {memoIssues?.map((edge) => {
            if (!edge?.node) return null;
            const { comments, title, number, author, body } = edge.node;
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

function CustomAlert() {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>
        An error occured while fetching your data, sorry :(
      </AlertDescription>
    </Alert>
  );
}

function mapStateToQuery(filterState: string) {
  switch (filterState) {
    case "1":
      return undefined;
    case "2":
      return IssueState.Open;
    case "3":
      return IssueState.Closed;
    default:
      break;
  }
}

function getBody({ text, maxLength }: { text: string; maxLength: number }) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export default RepositoryPage;
