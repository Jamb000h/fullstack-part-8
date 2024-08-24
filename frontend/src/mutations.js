import { gql } from "@apollo/client";

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation setAuthorBirthYearTo($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      id
    }
  }
`;
