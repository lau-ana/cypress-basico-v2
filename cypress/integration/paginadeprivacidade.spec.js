Cypress._.times(3, function () { //executa 3x o mesmo teste com uso do lodash
  it('testa a página da política de privacidade de forma independente', function () {
    cy.visit('./src/privacy.html')
    cy.contains('Talking About').should('be.visible')
  })
})