import { createSelector } from "@reduxjs/toolkit";

import Client from "@/types/Client";

import { RootState } from "..";

// export const selectAllClients = createSelector(
//   (state: RootState) => state.client.clients,
//   (clients: Record<string, Client>) => ({ ...clients }), // Convert to array
// );

export const selectClientById = (id: string) =>
  createSelector(
    (state: RootState) => state.client.clients,
    (clients: Record<string, Client>) => clients[id] ?? [],
  );
