before(() => {
  const token = Cypress.env("GITHUB_ACCESS_TOKEN");
  cy.visit(Cypress.env("PAGE_URL"));

  cy.get('input[name="token-input"]').type(token);

  cy.get('button[name="token-submit"]').click();
});

beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

describe("Dashboard", () => {
  it("shows input forms", () => {
    cy.get('input[name="repository-name"]')
      .should("be.visible")
      .should("contain.value", "react");
    cy.get('input[name="repository-owner"]')
      .should("be.visible")
      .should("contain.value", "facebook");
  });
  it("fetches data and saves and load it from localStorage", () => {
    cy.get("button").click();
    cy.get("h2").should("contain.text", "react");
    cy.contains("Owner: facebook");
    cy.reload();
    cy.get("h2").should("contain.text", "react");
    cy.contains("Owner: facebook");
  });
  it("navigates to issue page", () => {
    cy.get('button[name="show-more"]').click();
    cy.get("h2").should("contain.text", "react - facebook");
  });
});
