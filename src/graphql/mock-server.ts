import { createHandler } from "@apollo/graphql-testing-library";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getAllUsers: [User!]!
  }
`;

const resolvers = {
  Query: {
    getAllUsers: () => {
      return Array.from({ length: 3 }, (_, index) => ({
        id: `user-${index + 1}`,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
      }));
    },
  },
};

export const graphqlHandler = createHandler({
  typeDefs,
  resolvers,
});
