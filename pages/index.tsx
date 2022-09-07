import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IssueState, useRepositoryLazyQuery } from "../generated/graphql";

type Issue = {
  __typename?: "Issue" | undefined;
  body: string;
  title: string;
  number: number;
} | null;

const Home: NextPage = () => {
  const [name, setName] = useState<string>("react");
  const [owner, setOwner] = useState<string>("facebook");
  const [first, setFirst] = useState<number>(2);
  const [states, setStates] = useState<IssueState>(IssueState.Open);
  const [search, setSearch] = useState<string>();

  const [loadRepositoryData, { data, error, loading }] = useRepositoryLazyQuery(
    {
      variables: { name, owner, first, states },
    }
  );

  const filterFunc = (issue: Issue) => {
    if (!search) return true;
    if (issue?.body.includes(search) || issue?.title.includes(search))
      return true;
    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadRepositoryData({ variables: { name, first, owner, states } });
  };

  const Data = () => {
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error ...</p>;
    if (!data) return null;
    return (
      <>
        <h3>Repository</h3>
        <p>{data.repository?.issues.totalCount}</p>
        {data.repository?.issues.nodes?.filter(filterFunc).map((issue) => {
          if (!issue) return null;
          return (
            <div key={issue.number}>
              <ul>
                <h3>{issue.title}</h3>
                <p>{issue.body}</p>
                <Link
                  href={`/issue/${issue.number}?name=${name}&owner=${owner}`}
                >
                  <button>Show more</button>
                </Link>
              </ul>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <input
          type="number"
          placeholder="First"
          value={first}
          onChange={(e) => setFirst(Number(e.target.value))}
        />
        <select
          name="states"
          id="states"
          value={states}
          onChange={(e) => setStates(e.target.value as IssueState)}
        >
          <option value={IssueState.Open}>OPEN</option>
          <option value={IssueState.Closed}>CLOSED</option>
        </select>
        <input
          type="text"
          name=""
          id=""
          placeholder="Filter search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Fetch</button>
      </form>
      <Data />
    </div>
  );
};

export default Home;
