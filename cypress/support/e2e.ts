// Cypress support file for e2e tests
import "./commands";

// Disable uncaught exception handling for controlled errors
Cypress.on("uncaught:exception", (_err) => {
  // Return false to prevent Cypress from failing the test
  // You can add specific error patterns here if needed
  return false;
});
