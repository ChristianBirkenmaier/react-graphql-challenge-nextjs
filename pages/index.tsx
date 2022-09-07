import {
  Box,
  Button,
  Divider,
  Flex,
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
import { useRepositoryLazyQuery } from "../generated/graphql";
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
      <Head>
        <title>{`Issues from ${name}`}</title>
      </Head>
      <Grid>
        <FormControl>
          <FormLabel>
            Enter the repository name and owner you want to search for
          </FormLabel>
          <Input
            type="text"
            placeholder="Repository name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            placeholder="Repository owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <Button onClick={handleLoad}>
            {loading ? <Spinner /> : "Search"}
          </Button>
        </FormControl>
        {error && <p>Error while fetching ...</p>}
        <Flex>
          {repositories &&
            Object.values(repositories).map((repository: any) => (
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
                  href={`/repositories?name=${repository?.name}&owner=${repository?.owner.login}`}
                >
                  <Button>Show more</Button>
                </Link>
              </Box>
            ))}
        </Flex>
      </Grid>
    </>
  );
};

export default Home;
