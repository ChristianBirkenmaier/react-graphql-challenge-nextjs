import { gql } from "@apollo/client";

export const QUERY_REPOSITORY = gql`
  query Repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      name
      owner {
        login
      }
      issues {
        totalCount
      }
    }
  }
`;
export const QUERY_REPOSITORY_ISSUES = gql`
  query Repository_Issues(
    $name: String!
    $owner: String!
    $first: Int!
    $states: [IssueState!]
  ) {
    repository(name: $name, owner: $owner) {
      issues(first: $first, states: $states) {
        totalCount
        nodes {
          body
          title
          number
        }
      }
    }
  }
`;

export const QUERY_REPOSITORY_ISSUES_COMMENTS = gql`
  query Repository_Issues_Comments(
    $name: String!
    $owner: String!
    $first: Int!
    $number: Int!
  ) {
    repository(name: $name, owner: $owner) {
      issue(number: $number) {
        body
        id
        title
        number
        comments(first: $first) {
          nodes {
            id
            body
          }
        }
      }
    }
  }
`;
