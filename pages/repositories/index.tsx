import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  IssueState,
  useRepositoryLazyQuery,
  useRepository_IssuesLazyQuery,
} from "../../generated/graphql";

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

  const [loadRepositoryData, { data, error, loading }] =
    useRepository_IssuesLazyQuery({
      variables: { name, owner, first, states },
    });

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
        <p>#Issues: {data.repository?.issues.totalCount}</p>
        {data.repository?.issues.nodes?.filter(filterFunc).map((issue) => {
          if (!issue) return null;
          return (
            <div key={issue.number}>
              <ul>
                <h3>{issue.title}</h3>
                <p>{issue.body}</p>
                <Link
                  href={`/issues/${issue.number}?name=${name}&owner=${owner}`}
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
      <h3>Repository</h3>
      <h5>Name: {name}</h5>
      <h5>Owner: {owner}</h5>
      <form onSubmit={handleSubmit}>
        <p>Search for issues ...</p>
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

export default RepositoryPage;
