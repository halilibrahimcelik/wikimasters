import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
  },
});
