import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { RepositoryQuery, useRepositoryLazyQuery } from "../generated/graphql";
import { loadFromLocalStorage, saveToLocalStorage } from "@utils";
import { Search2Icon } from "@chakra-ui/icons";
import { Repository } from "@components/repositories";
import { FetchErrorAlert } from "@components/customalert";

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
          <Stack direction={["column", "row"]}>
            <Input
              type="text"
              placeholder="Repository name"
              name="repository-name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />

            <Input
              type="text"
              name="repository-owner"
              placeholder="Repository owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value.trim())}
            />
            <Button id="load-repositories" onClick={handleLoad}>
              {loading ? <Spinner /> : <Search2Icon />}
            </Button>
          </Stack>
        </FormControl>
        {error && <FetchErrorAlert />}
        <SimpleGrid minChildWidth="250px" spacing="40px">
          {repositories.map((repository: any) => (
            <Repository
              key={repository.name}
              name={repository.name}
              ownerLogin={repository.owner.login}
              totalCount={repository.issues.totalCount}
            />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Home;
