import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RepositoryQuery, useRepositoryLazyQuery } from "../generated/graphql";
import { loadFromLocalStorage, saveToLocalStorage } from "@utils";

const Home: NextPage = () => {
  const [name, setName] = useState<string>("react");
  const [owner, setOwner] = useState<string>("facebook");
  const [repositories, setRepositories] = useState<
    NonNullable<RepositoryQuery["repository"]>[] | []
  >([]);

  const [loadRepositories, { data, error, loading }] = useRepositoryLazyQuery();
  const handleLoad = (e: React.MouseEvent) => {
    e.preventDefault();
    loadRepositories({ variables: { name, owner } });
  };

  useEffect(() => {
    if (!data?.repository) return;
    const filteredRepositories = repositories.filter(
      (repo) => repo.name !== data.repository?.name
    );
    const mergedRepositories = [...filteredRepositories, data.repository];
    setRepositories(mergedRepositories);
    saveToLocalStorage(mergedRepositories);
  }, [data]);
  useEffect(() => {
    setRepositories(loadFromLocalStorage());
  }, []);
  return (
    <>
      <Head>
        <title>Repositories</title>
      </Head>
      <Box>
        <FormControl>
          <FormLabel>
            Enter the repository name and owner you want to search for
          </FormLabel>
          <Input
            type="text"
            placeholder="Repository name"
            name="repository-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            name="repository-owner"
            placeholder="Repository owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <Button id="load-repositories" onClick={handleLoad}>
            {loading ? <Spinner /> : "Search"}
          </Button>
        </FormControl>
        {error && <p>Error while fetching ...</p>}
        <Grid templateColumns="repeat(3,1fr)" gap={6}>
          {repositories.map((repository: any) => (
            <Box
              key={repository.name}
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="1rem"
              margin="1rem"
            >
              <Heading size="md">{repository?.name}</Heading>
              <Divider />
              <Text>Owner: {repository?.owner.login}</Text>
              <Text>Issues: {repository?.issues.totalCount}</Text>
              <Link
                href={`/repository?name=${repository?.name}&owner=${repository?.owner.login}`}
              >
                <Button name="show-more">Show more</Button>
              </Link>
            </Box>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Home;
