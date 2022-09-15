import { gql } from "@apollo/client";

export const QUERY_REPOSITORY = gql`
  query Repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
      __typename
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
      id
      __typename
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
        nodes {
          author {
            login
          }
          state
          body
          title
          number
          comments {
            totalCount
          }
        }
      }
    }
  }
`;

export const QUERY_ISSUE = gql`
  query Issue($name: String!, $owner: String!, $number: Int!) {
    repository(name: $name, owner: $owner) {
      id
      __typename
      issue(number: $number) {
        id
        __typename
        state
        body
        id
        title
        number
        author {
          login
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
      id
      __typename
      issue(number: $number) {
        id
        __typename
        comments(last: $last, first: $first, before: $before, after: $after) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          nodes {
            __typename
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

export const SEARCH_ISSUES_QUERY = gql`
  query Search($query: String!, $last: Int) {
    search(query: $query, type: ISSUE, last: $last) {
      issueCount
      edges {
        node {
          ... on Issue {
            title
            url
            createdAt
            number
            state
          }
        }
      }
    }
  }
`;
