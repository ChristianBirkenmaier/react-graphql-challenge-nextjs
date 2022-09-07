import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  useRepositoryCommentsLazyQuery,
  useRepositoryCommentsQuery,
} from "../../generated/graphql";

const IssuePage: NextPage = () => {
  const router = useRouter();
  //   const { name, owner, number } = router.query;
  const name = router.query.name as string;
  const owner = router.query.owner as string;
  const number = Number(router.query.number);
  //   return <p>No data found</p>;
  const { data, error, loading } = useRepositoryCommentsQuery({
    variables: { first: 5, name, owner, number },
  });
  console.log({ data, error, loading });
  return (
    <div>
      <h3>Comment Page</h3>
      {error && <p>Error ...</p>}
      {loading && <p>Loading ...</p>}
      <div>{data?.repository?.issue?.body}</div>
      <ul>
        {data?.repository?.issue?.comments.nodes?.map((node) => (
          <li key={node?.id}>{node?.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default IssuePage;
