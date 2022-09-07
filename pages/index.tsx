import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRepositoryLazyQuery } from "../generated/graphql";

const Home: NextPage = () => {
  const [name, setName] = useState<string>("react");
  const [owner, setOwner] = useState<string>("facebook");

  const [loadRepositories, { data, error, loading }] = useRepositoryLazyQuery({
    variables: { name, owner },
  });
  const handleLoad = (e: React.MouseEvent) => {
    e.preventDefault();
    loadRepositories({ variables: { name, owner } });
  };
  console.log({ data, error, loading });
  return (
    <>
      <h3>Dashboard</h3>
      <form action="">
        <input
          type="text"
          placeholder="Repository name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Repository owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <button onClick={handleLoad}>Search</button>
      </form>
      {data && (
        <div>
          <p>Name: {data.repository?.name}</p>
          <p>Owner: {data.repository?.owner.login}</p>
          <p>Issues: {data.repository?.issues.totalCount}</p>
          <Link
            href={`/repositories?name=${data.repository?.name}&owner=${data.repository?.owner.login}`}
          >
            <button>Show more</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
