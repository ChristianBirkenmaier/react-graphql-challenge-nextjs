import { RepositoryQuery } from "../generated/graphql";

export const saveToLocalStorage = (
  data: NonNullable<RepositoryQuery["repository"]>[]
) => {
  return localStorage.setItem("localRepositories", JSON.stringify(data));
};
export const loadFromLocalStorage = ():
  | NonNullable<RepositoryQuery["repository"]>[] => {
  const stringifiedRepositories = localStorage.getItem("localRepositories");
  return stringifiedRepositories ? JSON.parse(stringifiedRepositories) : [];
};
