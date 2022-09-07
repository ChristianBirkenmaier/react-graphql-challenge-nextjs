import { RepositoryQuery } from "../generated/graphql";

export const saveToLocalStorage = (data: RepositoryQuery) => {
  if (!data.repository) return;
  const stringifiedRepositories = localStorage.getItem("localRepositories");
  const localRepositories = stringifiedRepositories
    ? JSON.parse(stringifiedRepositories)
    : {};
  localRepositories[data.repository.name] = data.repository;
  localStorage.setItem("localRepositories", JSON.stringify(localRepositories));
};
export const loadFromLocalStorage = () => {
  const stringifiedRepositories = localStorage.getItem("localRepositories");
  if (!stringifiedRepositories) return null;
  return JSON.parse(stringifiedRepositories);
};
