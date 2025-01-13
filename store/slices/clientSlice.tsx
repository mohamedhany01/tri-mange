import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import ClientServices from "@/firebase/services/client";
import Client from "@/types/Client";

export interface ClientState {
  clients: Record<string, Client>;
}

const initialState: ClientState = {
  clients: {},
};

export const getAllClients = createAsyncThunk("get/all/clients", async () => {
  return await ClientServices.fetchAllClients();
});

export const addOneClient = createAsyncThunk(
  "add/one/client",
  async (client: Omit<Client, "id">) => {
    return await ClientServices.addNewClient(client);
  },
);

export const updateOneClient = createAsyncThunk(
  "update/one/client",
  async ({ id, client }: { id: string; client: Partial<Client> }) => {
    return await ClientServices.updateClient(id, client);
  },
);

export const deleteOneClient = createAsyncThunk(
  "delete/one/client",
  async (id: string) => {
    return await ClientServices.deleteClient(id);
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

export default clientSlice.reducer;
