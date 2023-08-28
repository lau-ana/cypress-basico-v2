describe('Central de Atendimento ao Cliente TAT', function () {
  beforeEach(function () {
    cy.visit('./src/index.html') // ./ continua no mesmo nível
  })

  it('verifica o título da aplicação', function () {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })


  it('preenche os campos obrigatórios e envia o formulário', function () {
    const longtext = 'teste testetestetestetestetesteteste testetestetestetesteteste testetesteteste'

    cy.get('#firstName').click().type('Ana')
    cy.get('#lastName').click().type('Brito')
    cy.get('#email').click().type('aaa@teste.com')
    cy.get('#open-text-area').click().type(longtext, { delay: 0 }) //para o teste ficar mais rapido e não esperar digitat td o texto
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
    cy.get('#firstName').click().type('Ana')
    cy.get('#lastName').click().type('Brito')
    cy.get('#email').click().type('aaa.teste.com')
    cy.get('#open-text-area').click().type('TESTE')
    cy.get('.button').click()
    cy.get('.error').should('be.visible')
  })

  it('telefone invalido, continua vazio', function () {
    cy.get('#phone')
      .click()
      .type('abc')
      .should('not.be.equal', 'abc') //poderia ser .should('have.value','')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {

    cy.get('#firstName').click().type('Ana')
    cy.get('#lastName').click().type('Brito')
    cy.get('#email').click().type('aaa@teste.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').click().type('TESTE')
    cy.get('.button').click()
    cy.get('.error > strong').should('be.visible')
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
    cy.get('.button').click()
    cy.get('.error').should('be.visible',)

  })
  it('envia formulario com comando personalizado.', function () {
    cy.fillMandatoryFieldsAndSubmit() //comando customizado para evitar duplicidade de códifo
  })
  it('seleciona um produto (YouTube) por seu texto', function () {
    cy.get('#product') //pegou elemento
      .select('YouTube') //selecionou uma das opções pelo seu texto
      .should('have.value', 'youtube') //valida o valor do que foi selecionado

  })
  it('seleciona um produto (Mentoria) por seu valor (value)', function () {
    cy.get('#product') //pegou elemento
      .select('mentoria') //selecionou uma das opções pelo seu value
      .should('have.value', 'mentoria') //valida o valor do que foi selecionado

  })
  it('seleciona um produto (Blog) por seu índice', function () {
    cy.get('#product') //pegou elemento
      .select(1) //selecionou uma das opções pelo seu indice
      .should('have.value', 'blog') //valida o valor do que foi selecionado

  })
  it('marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback"]').check() //input q tem a propriedade type com valor radio e a propriedade value com feedback
      .should('have.value', 'feedback')
  })
  it('marca cada tipo de atendimento', function () {
    cy.get('input[type="radio"]')
      .should('have.length', 3) //verificou que existem 3 elementos do tipo radio
      .each(function ($radio) { //passa por cada um deles e recebe uma função
        cy.wrap($radio).check() //pra cada um deles enpacota essa opção e valida as opções marca e verifica q foi marcado
        cy.wrap($radio).should('be.checked')
      })
  })
  it('marca ambos checkboxes, depois desmarca o último', function () {
    cy.get('input[type="checkbox"]')
      .check() //marca mais de um
      .should('be.checked')
      .last() //pega o ultimo que marcou
      .uncheck() //desmarcou
      .should('not.be.checked') // validou que o ultimo ta desmarcado
  })
  it('seleciona um arquivo da pasta fixture', function () {
    cy.get('input[type="file"]#file-upload') //pegou elemento
      .should('not.have.value') //verificou que não tinha nenhum valor
      .selectFile('./cypress/fixtures/example.json') //seleciona um arquivo da pasta fixtures
      .should(function ($input) { //fez uma função que recebeu o elemento file
        expect($input[0].files[0].name).to.equal('example.json') // verificou que a propriedade nome dentro do arquivo file dentro do input é oq esperava
      })
  })
  it('seleciona um arquivo selecionando drag-drop', function () {
    cy.get('input[type="file"]#file-upload') //pegou elemento
      .should('not.have.value') //verificou que não tinha nenhum valor
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }) //seleciona via drag-drop
      .should(function ($input) { //fez uma função que recebeu o elemento file
        expect($input[0].files[0].name).to.equal('example.json') // verificou que a propriedade nome dentro do arquivo file dentro do input é oq esperava
      })
  })
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
    cy.fixture('example.json').as('ex') //deu um nome para o arquivo com alias
    cy.get('input[type="file"]#file-upload') //pegou elemento
      .selectFile('@ex') //selecionou esse arquivo passando o novo nome
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('#privacy a') //pega o elemento privacy que tem a ancora "a"
      .should('have.attr', 'target', '_blank') //verifica se tem o atributo target com valor blank
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target') //invocou o método de remover atributo e removemos o target para abrir em mesma aba
      .click()
    cy.contains('Talking About').should('be.visible')
  })
})