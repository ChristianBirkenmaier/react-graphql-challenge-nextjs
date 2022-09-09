before(() => {
  const token = Cypress.env("GITHUB_ACCESS_TOKEN");
  cy.visit(Cypress.env("PAGE_URL"));

  cy.get("input").type(token);

  cy.get("button").click();
});

beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

describe("CommentsPage", () => {
  it("renders comments page", () => {
    cy.visit(`${Cypress.env("PAGE_URL")}/repository?name=react&owner=facebook`);

    cy.get("button").contains("Show more").click();

    cy.get("#comment-title").should("not.be.empty");
    cy.get("#comment-body").should("not.be.empty");
  });
  it("renders a list of comments", () => {
    cy.visit(
      `${Cypress.env("PAGE_URL")}/issue/25191?name=react&owner=facebook`
    );

    cy.get("#comment-list").children().should("have.length.greaterThan", 1);
  });
});
