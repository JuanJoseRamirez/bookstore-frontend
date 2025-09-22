describe('Authors E2E Test', () => {
  it('should delete Jules Verne from the authors list', () => {
    cy.visit('http://localhost:3000');

    cy.contains('Authors').click();

    cy.url().should('include', '/authors');

    cy.contains('Jules Verne')
      .parents('[data-testid="author-card"]') 
      .within(() => {
        cy.contains('Eliminar').click();
      });

    cy.contains('Jules Verne').should('not.exist');
  });
});
