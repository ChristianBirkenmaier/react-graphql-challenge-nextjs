import { GITHUB_VALIDATION_URL } from "@config/constants";
import { IssueState, RepositoryQuery } from "../generated/graphql";

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

export async function verifyToken(token: string) {
  // @ts-ignore
  if (window.Cypress) return true;
  try {
    const response = await fetch(GITHUB_VALIDATION_URL, {
      headers: { Authorization: `token ${token}` },
    });
    return !!response.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}
