import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Grid } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCommentsQuery, useIssueQuery } from "@generated/graphql";
import { NUMBER_OF_ITEMS_TO_FETCH } from "@config/constants";
import { Pagination } from "@types";
import { PaginationFooter } from "@components/pagination";
import { FetchErrorAlert } from "@components/customalert";
import { CustomSkeletonText, IssueBody, IssueHeader } from "@components/utils";
import { CommentsList } from "@components/comments";

const IssuePage: NextPage = () => {
  const router = useRouter();
  const name = router.query.name as string;
  const owner = router.query.owner as string;
  const number = parseInt(router.query.number as unknown as string);
  const [pagination, setPagination] = useState<Pagination>({});

  const {
    data: issueData,
    error: issueError,
    loading: issueLoading,
  } = useIssueQuery({ variables: { name, owner, number } });

  const { data, error, loading } = useCommentsQuery({
    variables: {
      // @ts-ignore
      last: NUMBER_OF_ITEMS_TO_FETCH,
      name,
      owner,
      number,
      ...pagination,
    },
  });

  const { body, id, state, title, author } = issueData?.repository?.issue || {};

  const { pageInfo, totalCount, nodes } =
    data?.repository?.issue?.comments || {};

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
        {(error || issueError) && <FetchErrorAlert />}
        <Box>
          <IssueHeader
            authorLogin={author?.login}
            loading={loading}
            state={state}
            title={title}
            totalCount={totalCount}
          />
          <Divider mb="0.5rem" />
          <IssueBody body={body} issueLoading={issueLoading} />
          {loading ? (
            <CustomSkeletonText number={5} />
          ) : (
            <CommentsList nodes={nodes} />
          )}
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
