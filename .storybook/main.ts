import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["./**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-webpack5-compiler-swc", "@storybook/addon-styling"],
  framework: "@storybook/react-webpack5",
};
export default config;
