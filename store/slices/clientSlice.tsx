import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addNewClient,
  deleteClient,
  fetchAllClients,
  updateClient,
} from "@/firebase/services/client";
import Client from "@/types/Client";

export interface ClientState {
  clients: Record<string, Client>;
}

const initialState: ClientState = {
  clients: {},
};

export const getAllClients = createAsyncThunk("get/all/clients", async () => {
  const clients = await fetchAllClients();
  return clients;
});

export const addOneClient = createAsyncThunk(
  "add/one/client",
  async (client: Omit<Client, "id">) => {
    const clients = await addNewClient(client);
    return clients;
  },
);

export const updateOneClient = createAsyncThunk(
  "update/one/client",
  async ({ id, client }: { id: string; client: Partial<Client> }) => {
    const updatedClient = await updateClient(id, client);
    return updatedClient;
  },
);

export const deleteOneClient = createAsyncThunk(
  "delete/one/client",
  async (id: string) => {
    const deletedId = await deleteClient(id);
    return deletedId;
  },
);

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllClients.fulfilled, (state, action) => {
      state.clients = action.payload;
    });
    builder.addCase(addOneClient.fulfilled, (state, action) => {
      state.clients = {
        [action.payload.id]: { ...action.payload },
        ...state.clients,
      };
    });
    builder.addCase(updateOneClient.fulfilled, (state, action) => {
      state.clients[action.payload.id] = { ...action.payload };
    });
    builder.addCase(deleteOneClient.fulfilled, (state, action) => {
      if (state.clients[action.payload]) {
        delete state.clients[action.payload];
      } else {
        throw new Error(
          `Client with ID ${action.payload} wasn't found for deletion`,
        );
      }
    });
  },
});

// Export the actions and reducer
export default clientSlice.reducer;

// export const { addClient } = clientSlice.actions;

// export const addOneItem = createAsyncThunk(
//   'add/one/item',
//   async ({ clientId, item }: { clientId: string; item: Omit<ItemDTO, 'id'> }) => {
//     const newItem: ItemDTO | null = await addItem(clientId, item);
//     return newItem || null; // Explicitly return null if no clients
//   },
// );

// builder.addCase(addOneItem.fulfilled, (state, action) => {
//   if (action.payload && state.clients) {
//     const index = state.clients.findIndex((c) => c.id === action.payload?.clientId);

//     if (index !== -1) {
//       // Update the existing client in place
//       state.clients[index].items?.push(action.payload);
//     }
//   }
// });
