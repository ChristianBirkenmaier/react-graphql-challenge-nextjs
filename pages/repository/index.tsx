import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
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
import { IssueState, useIssuesLazyQuery } from "../../generated/graphql";

const RepositoryPage: NextPage = () => {
  const [last, setLast] = useState<number>(2);
  const [search, setSearch] = useState<string>("");
  const [filterState, setFilterState] = useState("1");

  const router = useRouter();

  const name = router.query.name as string;
  const owner = router.query.owner as string;

  const [loadIssueData, { data, error, loading }] = useIssuesLazyQuery();

  useEffect(() => {
    if (data) return;
    if (!last || !name || !owner) return;
    loadIssueData({
      variables: {
        last,
        name,
        owner,
        states: mapStateToQuery(filterState),
      },
    });
  }, [data, filterState, last, loadIssueData, name, owner]);

  const memoIssues = useMemo(
    () =>
      data?.repository?.issues.nodes
        ?.filter((issue) => {
          if (!issue) return false;
          if (!search) return true;
          if (issue?.body.includes(search) || issue?.title.includes(search))
            return true;
          return false;
        })
        .reverse(),
    [data, search]
  );

  const loadData = () =>
    loadIssueData({
      variables: {
        name,
        last,
        owner,
        states: mapStateToQuery(filterState),
      },
    });

  const fetchMore = () =>
    loadIssueData({
      variables: {
        name,
        last,
        owner,
        before: data?.repository?.issues.pageInfo.endCursor,
      },
    });

  console.log({ data });
  console.log(
    data?.repository?.issues.pageInfo.endCursor,
    data?.repository?.issues.pageInfo.startCursor,
    data?.repository?.issues.pageInfo.hasNextPage,
    data?.repository?.issues.pageInfo.hasPreviousPage
  );

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
          value={last}
          onChange={(e) => setLast(Number(e.target.value))}
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
        <Button onClick={loadData}>Search</Button>
      </FormControl>
      <Divider m="1rem" />
      {loading && <Spinner />}
      {error && <CustomAlert />}
      {data && (
        <Box mx="1rem">
          <Text>#Issues: {data.repository?.issues.totalCount}</Text>
          {memoIssues?.map((issue) => {
            if (!issue) return null;
            return (
              <Box key={issue.number} my="2rem">
                <Heading size="sm">{issue.title}</Heading>
                <Text fontSize="sm">By {issue.author?.login}</Text>
                <Divider mb="0.5rem" />
                <Text>
                  {getBody({ text: issue.body, maxLength: 200 })}{" "}
                  <Link
                    href={`/issue/${issue.number}?name=${name}&owner=${owner}`}
                  >
                    <Button ml="0.5rem" size="xs">
                      Show more
                    </Button>
                  </Link>
                </Text>
              </Box>
            );
          })}
          <Button onClick={fetchMore}>Fetch more</Button>
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
