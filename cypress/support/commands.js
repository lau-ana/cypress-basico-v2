Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
  cy.get('#firstName').click().type('Ana')
  cy.get('#lastName').click().type('Brito')
  cy.get('#email').click().type('aaa@teste.com')
  cy.get('#open-text-area').click().type('teste') //para o teste ficar mais rapido e não esperar digitat td o texto
  cy.contains('button', 'Enviar').click()
  cy.get('.success').should('be.visible')
})