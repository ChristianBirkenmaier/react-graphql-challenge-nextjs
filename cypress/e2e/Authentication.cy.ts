describe("Token form", () => {
  const token = Cypress.env("GITHUB_ACCESS_TOKEN");

  it("accepts valid github token and shows dashboard", () => {
    cy.visit(Cypress.env("PAGE_URL"));

    cy.get('input[name="token-input"]').should("be.visible");

    cy.get('input[name="token-input"]').type(token);

    cy.get('button[name="token-submit"]').click();

    cy.get("a").should("contain.text", "Repositories");
  });
});
