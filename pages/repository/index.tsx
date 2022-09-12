import {
  Box,
  Divider,
  FormControl,
  Grid,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { FetchErrorAlert } from "@components/customalert";
import { useIssuesQuery } from "@generated/graphql";
import { Pagination } from "@types";
import { PaginationFooter } from "@components/pagination";
import { mapStateToQuery } from "@utils";
import { NUMBER_OF_ITEMS_TO_FETCH } from "@config/constants";
import { CustomSkeletonText } from "@components/utils";
import { Issue } from "@components/issues";

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
      {error && <FetchErrorAlert />}
      <Box mx="1rem">
        {loading ? (
          <CustomSkeletonText number={5} />
        ) : (
          <>
            <Text id="issue-count">#Issues: {totalCount}</Text>
            <Box id="issue-list">
              {nodes?.map((node) => {
                if (!node) return null;
                const { comments, title, number, author, body, state } = node;
                return (
                  <Issue
                    key={number}
                    authorLogin={author?.login}
                    title={title}
                    body={body}
                    name={name}
                    number={number}
                    owner={owner}
                    state={state}
                    totalCount={comments.totalCount}
                  />
                );
              })}
            </Box>
          </>
        )}
        <PaginationFooter
          pageInfo={pageInfo}
          setPagination={setPagination}
          totalCount={totalCount}
          loading={loading}
        />
      </Box>
    </Grid>
  );
};

export default RepositoryPage;
