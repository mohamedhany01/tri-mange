import { useFocusEffect, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";

import Snackbar from "@/components/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { getAllClients } from "@/store/slices/clientSlice";
import Client from "@/types/Client";

import Entity from "./Entity";
import NoResult from "./NoResult";
import SearchBox from "./SearchBox";

const SearchClientBox = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const clients = useAppSelector((state) => state.client.clients);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllClients()).catch((error: FirebaseError) => {
        showSnackbar(`Failed to fetch clients, ${error.message}`, "error");
      });

      // .then(() => {
      //   showSnackbar("Fetched clients successfully.", "success");
      // })
    }, [dispatch, showSnackbar]),
  );

  useFocusEffect(
    useCallback(() => {
      setFilteredClients(Object.values(clients));
    }, [clients]),
  );

  useEffect(() => {
    const filtered = Object.values(clients).filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  return (
    <>
      <SearchBox term={searchTerm} setTerm={setSearchTerm} />
      <ScrollView>
        {filteredClients && filteredClients.length > 0 ? (
          filteredClients.map((entity) => (
            <Entity
              key={entity.id}
              entity={entity}
              onPress={() => {
                router.push({
                  pathname: `/utilities/client/[id]`,
                  params: {
                    id: entity.id,
                  },
                });
              }}
            />
          ))
        ) : (
          <NoResult />
        )}
      </ScrollView>

      {snackbar.visible && (
        <Snackbar
          message={snackbar.message}
          backgroundColor={snackbar.backgroundColor}
          duration={3000}
          position="bottom"
          onClose={hideSnackbar}
        />
      )}
    </>
  );
};

export default SearchClientBox;
