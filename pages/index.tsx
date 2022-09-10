import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RepositoryQuery, useRepositoryLazyQuery } from "../generated/graphql";
import { loadFromLocalStorage, saveToLocalStorage } from "@utils";
import { Search2Icon } from "@chakra-ui/icons";

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
        {error && <p>Error while fetching ...</p>}
        <SimpleGrid minChildWidth="250px" spacing="40px">
          {repositories.map((repository: any) => (
            <Box
              key={repository.name}
              shadow="md"
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="1rem"
              margin="1rem"
              _hover={{
                textDecoration: "none",
                borderColor: "#ddd",
                shadow: "lg",
              }}
            >
              <Heading size="md" p="0.25rem">
                {repository?.name}
              </Heading>
              <Divider my="0.5rem" />
              <Text my="0.5rem">Owner: {repository?.owner.login}</Text>
              <Text my="0.5rem">Issues: {repository?.issues.totalCount}</Text>
              <Link
                href={`/repository?name=${repository?.name}&owner=${repository?.owner.login}`}
              >
                <Button width="100%" name="show-more">
                  Show more
                </Button>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Home;
