import { Platform } from "react-native";
/**
 * Enum representing the different application modes.
 */
export enum AppMode {
  Development = "development",
  Testing = "test",
  Production = "production",
}

/**
 * Helper function to get the current application mode based on the `NODE_ENV` environment variable.
 *
 * @returns {AppMode} The current application mode (`development`, `testing`, or `production`).
 * @throws {Error} Throws an error if the `NODE_ENV` is not recognized.
 *
 * @example
 * if (getAppMode() === AppMode.Production) {
 *   console.log("Running in production mode");
 * }
 */
export function getAppMode(): AppMode {
  switch (process.env.NODE_ENV) {
    case AppMode.Development:
      return AppMode.Development;
    case AppMode.Testing:
      return AppMode.Testing;
    case AppMode.Production:
      return AppMode.Production;
    default:
      throw new Error(
        `Unknown application mode: "${process.env.NODE_ENV}". Please set NODE_ENV to "development", "testing", or "production".`,
      );
  }
}
/**
 * Helper function to check if the app is running in development mode.
 *
 * @returns {boolean} `true` if the app is in development mode, `false` otherwise.
 */
export function isDevelopment(): boolean {
  return getAppMode() === AppMode.Development;
}

/**
 * Helper function to check if the app is running in testing mode.
 *
 * @returns {boolean} `true` if the app is in testing mode, `false` otherwise.
 */
export function isTesting(): boolean {
  return getAppMode() === AppMode.Testing;
}

/**
 * Helper function to check if the app is running in production mode.
 *
 * @returns {boolean} `true` if the app is in production mode, `false` otherwise.
 */
export function isProduction(): boolean {
  return getAppMode() === AppMode.Production;
}

export class PlatformDetector {
  // Private constructor to prevent instantiation
  private constructor() {}

  // Detects if the platform is iOS
  public static isIOS(): boolean {
    return Platform.OS === "ios";
  }

  // Detects if the platform is Android
  public static isAndroid(): boolean {
    return Platform.OS === "android";
  }

  // Detects if the platform is a Web browser
  public static isWeb(): boolean {
    return Platform.OS === "web";
  }

  // Returns the current platform name
  public static getPlatformName(): string {
    return Platform.OS; // 'ios', 'android', or 'web'
  }

  // Determines if the platform is a TV
  public static isTV(): boolean {
    return Platform.isTV;
  }

  // Checks if the platform version is greater than or equal to a specific version
  public static isVersionOrAbove(version: number): boolean {
    const platformVersion = parseInt(Platform.Version as string, 10);
    return platformVersion >= version;
  }

  // Utility to run platform-specific logic
  public static runPlatformSpecific<T>(
    iosLogic: () => T,
    androidLogic: () => T,
    webLogic?: () => T,
  ): T {
    if (this.isIOS()) {
      return iosLogic();
    } else if (this.isAndroid()) {
      return androidLogic();
    } else if (this.isWeb() && webLogic) {
      return webLogic();
    } else {
      throw new Error("Unsupported platform");
    }
  }
}

export const CURRENT_APP_MODE = getAppMode();
