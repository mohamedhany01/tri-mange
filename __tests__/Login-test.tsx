import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";

import LoginScreen from "@/app/auth/login";
import { LocalizationProvider } from "@/context/Localization";
import { getNewStore } from "@/store";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: "fake_user", email: "foobar@test.com" } }),
  ),
  connectAuthEmulator: jest.fn(),
}));

describe("<LoginScreen />", () => {
  test("Login page submit data successfully", async () => {
    const { getByPlaceholderText, getByText } = render(
      <LocalizationProvider>
        <Provider store={getNewStore()}>
          <LoginScreen />
        </Provider>
      </LocalizationProvider>,
    );

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "foobar@test.com");
    fireEvent.changeText(passwordInput, "foobar123");

    expect(loginButton.props.children).toEqual("Login");

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("Login Successfully")).toBeTruthy();
    });
  });
});
