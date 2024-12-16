module.exports = {
  extends: [
    "expo",
    "prettier",
    "universe",
    "universe/shared/typescript-analysis",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "warn",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      files: ["reset-project.js"], // Specify file pattern
      rules: {
        "no-console": "off", // Disable rule for debug and test files
      },
    },
  ],
};
