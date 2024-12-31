import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { Accordion, AccordionItem } from "@/components/Accordion";
import Entity from "@/components/Entity";
import NoResult from "@/components/NoResult";
import { useLocalization } from "@/context/Localization";
import { useAppSelector } from "@/store";
import {
  selectCompleteProductsByClientId,
  selectIncompleteProductsByClientId,
} from "@/store/selectors/product";
import Client from "@/types/Client";
import { convertNumerals, NumeralSystem } from "@/utilities/localization";

import ActionButtons from "./ActionButtons";
import ClientInfo from "./ClientInfo";

interface ClientStageProps {
  client: Client;
  onUpdate: () => void;
  onDelete: () => void;
  onAddProduct: () => void;
}

const ClientStage = ({
  client,
  onUpdate,
  onDelete,
  onAddProduct,
}: ClientStageProps) => {
  const completeProducts = useAppSelector(
    selectCompleteProductsByClientId(client.id),
  );
  const incompleteProducts = useAppSelector(
    selectIncompleteProductsByClientId(client.id),
  );

  const handleProductPress = (id: string) => {
    router.push({
      pathname: `/utilities/product/[id]`,
      params: {
        id,
      },
    });
  };

  const { t, locale } = useLocalization();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {client ? (
        <>
          <View style={styles.viewContainer}>
            <ClientInfo client={client} />
            <ActionButtons
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddProduct={onAddProduct}
            />
          </View>

          <ScrollView>
            <Accordion>
              <AccordionItem
                title={`${t("complete")} (${convertNumerals(completeProducts.length, locale as NumeralSystem)})`}
              >
                {completeProducts.length > 0 ? (
                  completeProducts.map((entity) => (
                    <Entity
                      key={entity.id}
                      entity={entity}
                      onPress={() => {
                        handleProductPress(entity.id);
                      }}
                    />
                  ))
                ) : (
                  <NoResult />
                )}
              </AccordionItem>

              <AccordionItem
                title={`${t("incomplete")}  (${convertNumerals(incompleteProducts.length, locale as NumeralSystem)})`}
              >
                {incompleteProducts.length > 0 ? (
                  incompleteProducts.map((entity) => (
                    <Entity
                      key={entity.id}
                      entity={entity}
                      onPress={() => {
                        handleProductPress(entity.id);
                      }}
                    />
                  ))
                ) : (
                  <NoResult />
                )}
              </AccordionItem>
            </Accordion>
          </ScrollView>
        </>
      ) : (
        <Text>{t("loadingText")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  viewContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  product: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default ClientStage;
