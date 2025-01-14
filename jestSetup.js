jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "",
}));

jest.mock("@expo/vector-icons/Ionicons", () => {
  return {
    __esModule: true,
    default: () => null,
  };
});
