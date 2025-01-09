import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";

import StatisticsScreen from "@/app/home/statistics";
import { LocalizationProvider } from "@/context/Localization";
import { getNewStore } from "@/store";

describe("<StatisticsScreen />", () => {
  test("Text renders correctly on StatisticsScreen", () => {
    const { getByText } = render(
      <LocalizationProvider>
        <Provider store={getNewStore()}>
          <StatisticsScreen />
        </Provider>
      </LocalizationProvider>,
    );

    expect(getByText("Total Clients")).toBeTruthy();
    expect(getByText("Total Products")).toBeTruthy();
    expect(getByText("Total Payments")).toBeTruthy();
    expect(getByText("Total Revenue")).toBeTruthy();
    expect(getByText("Average Payment")).toBeTruthy();
  });
});
