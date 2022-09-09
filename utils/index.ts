import { IssueState, RepositoryQuery } from "../generated/graphql";

export const saveToLocalStorage = (
  data: NonNullable<RepositoryQuery["repository"]>[]
) => {
  if (!localStorage) return;
  return localStorage.setItem("localRepositories", JSON.stringify(data));
};
export const loadFromLocalStorage = ():
  | NonNullable<RepositoryQuery["repository"]>[] => {
  if (!localStorage) return [];
  const stringifiedRepositories = localStorage.getItem("localRepositories");
  return stringifiedRepositories ? JSON.parse(stringifiedRepositories) : [];
};

export function mapStateToQuery(filterState: string) {
  switch (filterState) {
    case "1":
      return undefined;
    case "2":
      return IssueState.Open;
    case "3":
      return IssueState.Closed;
    default:
      break;
  }
}
