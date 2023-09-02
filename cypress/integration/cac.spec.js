describe('Central de Atendimento ao Cliente TAT', function () {
  const THREE_SECONDS_IN_MS = 3000

  beforeEach(function () {
    cy.visit('./src/index.html')

    it('verifica o título da aplicação', function () {
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })


    it('preenche os campos obrigatórios e envia o formulário', function () {
      const longtext = 'teste teste teste teste teste teste teste teste teste teste teste teste '
      cy.clock()

      cy.get('#firstName').click().type('Ana')
      cy.get('#lastName').click().type('Brito')
      cy.get('#email').click().type('aaa@teste.com')
      cy.get('#open-text-area').click().type(longtext, { delay: 0 })
      cy.contains('button', 'Enviar').click()
      cy.get('.success').should('be.visible')

      cy.tick(THREE_SECONDS_IN_MS)
      cy.get('.success').should('not.be.visible')

    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
      cy.clock()
      cy.get('#firstName').click().type('Ana')
      cy.get('#lastName').click().type('Brito')
      cy.get('#email').click().type('aaa.teste.com')
      cy.get('#open-text-area').click().type('TESTE')
      cy.get('.button').click()
      cy.get('.error').should('be.visible')
      cy.tick(THREE_SECONDS_IN_MS)
      cy.get('.error').should('not.be.visible')

    })

    it('telefone invalido, continua vazio', function () {
      cy.get('#phone')
        .click()
        .type('abc')
        .should('not.be.equal', 'abc')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {

      cy.clock()

      cy.get('#firstName').click().type('Ana')
      cy.get('#lastName').click().type('Brito')
      cy.get('#email').click().type('aaa@teste.com')
      cy.get('#phone-checkbox').check()
      cy.get('#open-text-area').click().type('TESTE')
      cy.get('.button').click()
      cy.get('.error > strong').should('be.visible')
      cy.tick(THREE_SECONDS_IN_MS)
      cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
      cy.get('#firstName')
        .type('Ana')
        .should('have.value', 'Ana')
        .clear()
        .should('not.have.value', 'Ana')
      cy.get('#lastName')
        .click().type('Brito')
        .should('have.value', 'Brito')
        .clear()
        .should('have.value', '')
      cy.get('#email')
        .type('aaa@teste.com')
        .should('have.value', 'aaa@teste.com')
        .clear()
        .should('have.value', '')
      cy.get('#phone')
        .type('32397130')
        .should('have.value', '32397130')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', function () {
      cy.clock()
      cy.get('.button').click()
      cy.get('.error').should('be.visible',)

      cy.tick(THREE_SECONDS_IN_MS)
      cy.get('.error').should('not.be.visible')

    })
    it('envia formulario com comando personalizado.', function () {
      cy.clock()
      cy.fillMandatoryFieldsAndSubmit()
      cy.get('.success').should('be.visible',)

      cy.tick(THREE_SECONDS_IN_MS)
      cy.get('.success').should('not.be.visible')
    })
    it('seleciona um produto (YouTube) por seu texto', function () {
      cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')

    })
    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
      cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')

    })
    it('seleciona um produto (Blog) por seu índice', function () {
      cy.get('#product')
        .select(1)
        .should('have.value', 'blog')

    })
    it('marca o tipo de atendimento "Feedback"', function () {
      cy.get('input[type="radio"][value="feedback"]').check()
        .should('have.value', 'feedback')
    })
    it('marca cada tipo de atendimento', function () {
      cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function ($radio) {
          cy.wrap($radio).check()
          cy.wrap($radio).should('be.checked')
        })
    })
    it('marca ambos checkboxes, depois desmarca o último', function () {
      cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })
    it('seleciona um arquivo da pasta fixture', function () {
      cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function ($input) {
          expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('seleciona um arquivo selecionando drag-drop', function () {
      cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
        .should(function ($input) {
          expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
      cy.fixture('example.json').as('ex')
      cy.get('input[type="file"]#file-upload')
        .selectFile('@ex')
        .should(function ($input) {
          expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
      cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
      cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
      cy.contains('Talking About').should('be.visible')
    })
    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function () {
      cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })
    it("preenche a area de texto usando o comando invoke", function () {
      const longText = Cypress._.repeat('0123456789', 20)

      cy.get('#open-text-area')
        .invoke('val', longText)
        .should('have.value', longText)

    })

    it('faz uma requisição HTTP', function () {
      cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should(function (response) {
          const { status, statusText, body } = response
          expect(status).to.equal(200)
          expect(statusText).to.equal('OK')
          expect(body).to.include('CAC TAT')
        })
    })
    it('gato', function () {
      cy.get('#cat')
        .invoke('show')
        .should('be.visible')
      cy.get('#title')
        .invoke('text', 'cat tat')
      cy.get('#subtitle')
        .invoke('text', 'eu 💚 cypress')
    })
  })
})