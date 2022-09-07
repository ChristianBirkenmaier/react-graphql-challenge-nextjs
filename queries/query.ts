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
    $last: Int!
    $states: [IssueState!]
    $before: String
  ) {
    repository(name: $name, owner: $owner) {
      issues(last: $last, states: $states, before: $before) {
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
          state
          body
          title
          number
        }
      }
    }
  }
`;

export const QUERY_COMMENTS = gql`
  query Comments($name: String!, $owner: String!, $first: Int!, $number: Int!) {
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
        comments(first: $first) {
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
