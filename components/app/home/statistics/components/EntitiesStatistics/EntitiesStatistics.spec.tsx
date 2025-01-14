import { fireEvent, render } from "@testing-library/react-native";

import EntitiesStatistics  from "./EntitiesStatistics";

describe("<EntitiesStatistics />", () => {
  test("renders statistics correctly (no clickable wrapper)", async () => {
    const { getByText } = render(
      <EntitiesStatistics
        statistics={[
          {
            title: "Foo",
            count: 10,
          },
        ]}
      />,
    );

    const title = getByText("Foo");
    const count = getByText("10");

    expect(title).toBeTruthy();
    expect(count).toBeTruthy();
  });
});

describe("<EntitiesStatistics />", () => {
  test("renders statistics correctly (with clickable wrapper)", async () => {
    const onPressMock = jest.fn();

    const { getByText } = render(
      <EntitiesStatistics
        statistics={[
          {
            title: "Foo",
            count: 10,
            onPress: onPressMock,
          },
        ]}
      />,
    );

    const title = getByText("Foo");
    const count = getByText("10");

    expect(title).toBeTruthy();
    expect(count).toBeTruthy();

    fireEvent.press(title);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
