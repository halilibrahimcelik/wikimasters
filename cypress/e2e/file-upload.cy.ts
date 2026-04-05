describe("File Upload", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/wiki/edit/new");
  });

  it("displays file upload button", () => {
    cy.get('[data-testid="upload-image-button"]').should("be.visible");
  });

  it("opens file picker on click", () => {
    cy.get('[data-testid="upload-image-button"]').click();
    cy.get('input[type="file"]').should("exist");
  });

  it("displays uploaded image preview", () => {
    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-image.jpg");
    cy.get('[data-testid="image-preview"]').should("be.visible");
  });

  it("includes image in article", () => {
    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-image.jpg");
    cy.get('input[name="title"]').type("Article with Image");
    cy.get('[data-testid="editor-content"]').type("Content with image above");
    cy.get('button[type="submit"]').click();
    cy.get("img").should("have.length.greaterThan", 0);
  });

  it("handles upload errors", () => {
    cy.get('[data-testid="upload-image-button"]').click();
    cy.get('input[type="file"]').selectFile(
      "cypress/fixtures/invalid-file.txt",
    );
    cy.get('[data-testid="upload-error"]').should("be.visible");
  });
});
