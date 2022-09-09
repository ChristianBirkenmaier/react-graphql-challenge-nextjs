before(() => {
  const token = Cypress.env("GITHUB_ACCESS_TOKEN");
  cy.visit(Cypress.env("PAGE_URL"));

  cy.get("input").type(token);

  cy.get("button").click();
});

describe("IssuePage", () => {
  it("renders a list of issue", () => {
    cy.visit(`${Cypress.env("PAGE_URL")}/repository?name=react&owner=facebook`);

    cy.get("#issue-list").children().should("have.length.greaterThan", 1);
  });
});
