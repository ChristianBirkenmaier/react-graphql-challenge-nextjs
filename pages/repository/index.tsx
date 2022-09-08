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

const RepositoryPage: NextPage = () => {
  const [amount, setAmount] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const [filterState, setFilterState] = useState("1");

  const router = useRouter();

  const name = router.query.name as string;
  const owner = router.query.owner as string;

  // const [loadIssueData, { data, error, loading }] = useIssuesLazyQuery({
  //   fetchPolicy: "cache-and-network",
  // });

  const {
    data,
    loading,
    error,
    refetch: loadIssueData,
  } = useIssuesQuery({
    variables: {
      last: amount,
      name,
      owner,
      states: mapStateToQuery(filterState),
    },
  });

  console.error({ error });

  // useEffect(() => {
  //   if (data) return;
  //   if (!last || !name || !owner) return;
  //   loadIssueData({
  //     variables: {
  //       last,
  //       name,
  //       owner,
  //       states: mapStateToQuery(filterState),
  //     },
  //   });
  // }, [data, filterState, last, loadIssueData, name, owner]);

  // const memoIssues = useMemo(
  //   () =>
  //     data?.repository?.issues.nodes
  //       ?.filter((issue) => {
  //         if (!issue) return false;
  //         if (!search) return true;
  //         if (issue?.body.includes(search) || issue?.title.includes(search))
  //           return true;
  //         return false;
  //       })
  //       .reverse(),
  //   [data, search]
  // );
  const memoIssues = useMemo(
    () =>
      data?.repository?.issues.edges
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
    [data, search]
  );

  const loadData = () =>
    loadIssueData({
      name,
      last: amount,
      owner,
      states: mapStateToQuery(filterState),
    });

  const fetchBefore = () => {
    loadIssueData({
      name,
      first: undefined,
      last: amount,
      owner,
      states: mapStateToQuery(filterState),
      after: undefined,
      before: data?.repository?.issues.pageInfo.startCursor,
    });
  };
  const fetchAfter = () => {
    loadIssueData({
      name,
      first: amount,
      last: undefined,
      owner,
      states: mapStateToQuery(filterState),
      after: data?.repository?.issues.pageInfo.endCursor,
      before: undefined,
    });
  };

  console.log(data?.repository?.issues.pageInfo);

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
        <Button disabled onClick={loadData}>
          Search
        </Button>
      </FormControl>
      <Divider m="1rem" />
      {loading && <Spinner />}
      {error && <CustomAlert />}
      {data && (
        <Box mx="1rem">
          <Text>#Issues: {data.repository?.issues.totalCount}</Text>
          {memoIssues?.map((edge) => {
            if (!edge?.node) return null;
            return (
              <Box key={edge.node.number} my="2rem">
                <Flex>
                  <Text fontWeight="bold">{edge.node.title}</Text>
                  <Text>{`(${edge.node.comments.totalCount})`}</Text>
                </Flex>
                <Text fontSize="sm">By {edge.node.author?.login}</Text>
                <Divider mb="0.5rem" />
                <Text>
                  {getBody({ text: edge.node.body, maxLength: 200 })}{" "}
                  <Link
                    href={`/issue/${edge.node.number}?name=${name}&owner=${owner}`}
                  >
                    <Button ml="0.5rem" size="xs">
                      Show more
                    </Button>
                  </Link>
                </Text>
              </Box>
            );
          })}
          <Button
            disabled={!data.repository?.issues.pageInfo.hasNextPage}
            onClick={fetchAfter}
          >
            Previous Page
          </Button>
          <Button
            disabled={!data.repository?.issues.pageInfo.hasPreviousPage}
            onClick={fetchBefore}
          >
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
