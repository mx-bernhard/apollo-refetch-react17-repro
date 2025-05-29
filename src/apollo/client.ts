import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export const createTestApolloClient = () => {
  const httpLink = createHttpLink({
    uri: "http://localhost/graphql",
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};
