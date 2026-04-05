describe("Article Management", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("View Articles", () => {
    it("displays articles list on home page", () => {
      cy.get('[data-testid="articles-grid"]').should("exist");
      cy.get('[data-testid="wiki-card"]').should("have.length.greaterThan", 0);
    });

    it("displays article details", () => {
      cy.get('[data-testid="wiki-card"]').first().click();
      cy.get('[data-testid="article-content"]').should("be.visible");
      cy.get('[data-testid="article-title"]').should("not.be.empty");
    });

    it("displays article metadata", () => {
      cy.get('[data-testid="wiki-card"]').first().click();
      cy.get('[data-testid="article-author"]').should("be.visible");
      cy.get('[data-testid="article-date"]').should("be.visible");
    });
  });

  describe("Create Article", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/");
    });

    it("navigates to create article page", () => {
      cy.get('[data-testid="new-article-link"]').click();
      cy.url().should("include", "/wiki/edit/new");
    });

    it("creates new article", () => {
      cy.createArticle(
        "Test Article Title",
        "This is the test article content",
      );
      cy.url().should("match", /\/wiki\/\d+/);
      cy.get('[data-testid="article-title"]').should(
        "contain",
        "Test Article Title",
      );
    });

    it("displays validation errors", () => {
      cy.visit("/wiki/edit/new");
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="error-message"]').should("be.visible");
    });
  });

  describe("Edit Article", () => {
    beforeEach(() => {
      cy.login();
      cy.createArticle("Original Title", "Original content");
    });

    it("opens edit form", () => {
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="editor-form"]').should("be.visible");
    });

    it("updates article content", () => {
      cy.get('[data-testid="edit-button"]').click();
      cy.get('input[name="title"]').clear().type("Updated Title");
      cy.get('[data-testid="editor-content"]').clear().type("Updated content");
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="article-title"]').should(
        "contain",
        "Updated Title",
      );
    });
  });

  describe("Delete Article", () => {
    beforeEach(() => {
      cy.login();
      cy.createArticle("Article to Delete", "Content");
    });

    it("deletes article with confirmation", () => {
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="confirm-delete"]').click();
      cy.url().should("not.include", "/wiki/");
    });

    it("cancels delete operation", () => {
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="cancel-delete"]').click();
      cy.get('[data-testid="article-content"]').should("be.visible");
    });
  });
});
