describe("Token form", () => {
  const token = Cypress.env("GITHUB_ACCESS_TOKEN");
  console.log(Cypress.env());

  it("accepts valid github token and shows dashboard", () => {
    cy.visit(Cypress.env("PAGE_URL"));

    cy.get("input").should("be.visible");

    cy.get("input").type(token);

    cy.get("button").click();

    cy.get("a").should("contain.text", "Repositories");
  });
});
