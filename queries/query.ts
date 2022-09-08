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
export const QUERY_ISSUES = gql`
  query Issues(
    $name: String!
    $owner: String!
    $last: Int
    $first: Int
    $states: [IssueState!]
    $before: String
    $after: String
  ) {
    repository(name: $name, owner: $owner) {
      issues(
        last: $last
        first: $first
        states: $states
        before: $before
        after: $after
      ) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
        edges {
          cursor
          node {
            author {
              login
            }
            state
            body
            title
            number
          }
        }
      }
    }
  }
`;

export const QUERY_COMMENTS = gql`
  query Comments(
    $name: String!
    $owner: String!
    $first: Int
    $number: Int!
    $last: Int
    $before: String
    $after: String
  ) {
    repository(name: $name, owner: $owner) {
      issue(number: $number) {
        state
        body
        id
        title
        number
        author {
          login
        }
        comments(last: $last, first: $first, before: $before, after: $after) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          nodes {
            author {
              login
            }
            id
            body
          }
        }
      }
    }
  }
`;
