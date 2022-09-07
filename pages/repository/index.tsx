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
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IssueState, useIssuesLazyQuery } from "../../generated/graphql";

type Issue = {
  __typename?: "Issue" | undefined;
  body: string;
  title: string;
  number: number;
} | null;

const RepositoryPage: NextPage = () => {
  const [first, setFirst] = useState<number>(2);
  const [states, setStates] = useState<IssueState>(IssueState.Open);
  const [search, setSearch] = useState<string>();

  const router = useRouter();
  console.log({ router });

  const name = router.query.name as string;
  const owner = router.query.owner as string;

  const [loadIssueData, { data, error, loading }] = useIssuesLazyQuery();

  useEffect(() => {
    if (data) return;
    if (!first || !states || !name || !owner) return;
    loadIssueData({ variables: { first, name, owner, states } });
  }, [loadIssueData, first, name, owner, states, data]);

  const filterFunc = (issue: Issue) => {
    if (!search) return true;
    if (issue?.body.includes(search) || issue?.title.includes(search))
      return true;
    return false;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    loadIssueData({ variables: { name, first, owner, states } });
  };

  const Data = () => {
    if (loading) return <Spinner />;
    if (error)
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            An error occured while fetching your data, sorry :(
          </AlertDescription>
        </Alert>
      );
    if (!data)
      return <Text>Sadly, there seems to be no data available :(</Text>;
    return (
      <>
        <Text>#Issues: {data.repository?.issues.totalCount}</Text>
        <Box mx="1rem">
          {data.repository?.issues.nodes?.filter(filterFunc).map((issue) => {
            if (!issue) return null;
            return (
              <Box key={issue.number} my="2rem">
                <ul>
                  <Heading size="sm">{issue.title}</Heading>
                  <Text>{issue.body}</Text>
                  <Link
                    href={`/issue/${issue.number}?name=${name}&owner=${owner}`}
                  >
                    <Button>Show more</Button>
                  </Link>
                </ul>
              </Box>
            );
          })}
        </Box>
      </>
    );
  };

  return (
    <Grid>
      <Head>
        <title>{`Issues from ${name}`}</title>
      </Head>
      <Heading>Repository</Heading>
      <Heading size="sm">Name: {name}</Heading>
      <Heading size="sm">Owner: {owner}</Heading>
      <FormControl>
        <Text>Search for issues ...</Text>
        <Input
          type="number"
          placeholder="First"
          value={first}
          onChange={(e) => setFirst(Number(e.target.value))}
        />
        <FormHelperText mb="1rem"># Issues</FormHelperText>
        <Select
          name="states"
          id="states"
          value={states}
          onChange={(e) => setStates(e.target.value as IssueState)}
        >
          <option value={IssueState.Open}>OPEN</option>
          <option value={IssueState.Closed}>CLOSED</option>
        </Select>
        <FormHelperText mb="1rem">Open / Closed</FormHelperText>
        <Input
          type="text"
          placeholder="Filter search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSubmit}>Search</Button>
      </FormControl>
      <Divider m="1rem" />
      <Data />
    </Grid>
  );
};

export default RepositoryPage;
