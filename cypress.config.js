import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://frontend.vm1.test",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});
