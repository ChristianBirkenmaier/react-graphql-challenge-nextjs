import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RepositoryQuery, useRepositoryLazyQuery } from "../generated/graphql";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils";

const Home: NextPage = () => {
  const [name, setName] = useState<string>("react");
  const [owner, setOwner] = useState<string>("facebook");
  const [repositories, setRepositories] = useState<object>();

  const [loadRepositories, { data, error, loading }] = useRepositoryLazyQuery({
    variables: { name, owner },
  });
  const handleLoad = (e: React.MouseEvent) => {
    e.preventDefault();
    loadRepositories({ variables: { name, owner } });
  };

  useEffect(() => {
    if (!data?.repository?.name) return;
    const name = data.repository.name;
    setRepositories((prevRepos) => ({ ...prevRepos, [name]: data.repository }));
    saveToLocalStorage(data);
  }, [data]);
  useEffect(() => {
    const localRepositories = loadFromLocalStorage();
    setRepositories(localRepositories);
  }, []);
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
      {error && <p>Error while fetching ...</p>}
      {loading && <p>Loading ...</p>}
      {repositories &&
        Object.values(repositories).map((repository: any) => (
          <div key={repository.name}>
            <p>Name: {repository?.name}</p>
            <p>Owner: {repository?.owner.login}</p>
            <p>Issues: {repository?.issues.totalCount}</p>
            <Link
              href={`/repositories?name=${repository?.name}&owner=${repository?.owner.login}`}
            >
              <button>Show more</button>
            </Link>
          </div>
        ))}
    </>
  );
};

export default Home;
