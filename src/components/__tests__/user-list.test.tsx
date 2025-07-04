import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { UserList } from "../user-list";

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
    }
  }
`;

describe("Apollo Client useSyncExternalStore Polyfill Bug Reproduction", () => {
  it.each([0, 1, 2, 3, 4, 5, 6, 7].flatMap(() => [0, 1, 2, 3, 4, 5, 6, 7]))(
    "should reproduce the Apollo Client useSyncExternalStore polyfill issue",
    async () => {
      const user = userEvent.setup();

      const mocks = Array.from({ length: 8 }, () => ({
        request: { query: GET_ALL_USERS },
        result: {
          data: {
            getAllUsers: [
              { id: "user-1", name: "User 1", email: "user1@example.com" },
              { id: "user-2", name: "User 2", email: "user2@example.com" },
            ],
          },
        },
        delay: 50,
      }));

      const { unmount } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <UserList />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("user-list")).toBeInTheDocument();
      });

      await act(async () => {
        const refreshButton = screen.getByTestId("refresh-button");
        await user.click(refreshButton);

        unmount();
      });

      expect(true).toBe(true);
    }
  );
});
