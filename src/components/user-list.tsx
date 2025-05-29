import React, { useCallback, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
    }
  }
`;

export interface User {
  id: string;
  name: string;
  email: string;
}

export const UserList = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleRefresh = useCallback(() => {
    if (!mountedRef.current) return;
    refetch();
    setTimeout(() => {
      if (!mountedRef.current) return;
      return refetch();
    }, 10);
    setTimeout(() => {
      if (!mountedRef.current) return;
      return refetch();
    }, 20);
  }, [refetch]);

  if (loading && !data) {
    return <div data-testid="loading">Loading users...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error.message}</div>;
  }

  const users = data?.getAllUsers ?? [];

  return (
    <div data-testid="user-list">
      <h2>Users ({users.length})</h2>
      <button data-testid="refresh-button" onClick={handleRefresh}>
        Refresh
      </button>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};
