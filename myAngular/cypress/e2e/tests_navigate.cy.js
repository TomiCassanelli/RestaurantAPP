describe('| Tests - Navigate into Orders |', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; })

    let baseUrl;

    beforeEach(() => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        baseUrl = Cypress.env('baseUrl');

        if (!baseUrl) {
            baseUrl = 'http://localhost:4200';
        }
    
    });

    it('Verifique que cargue la orden inicial vacia', () => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        cy.visit(`${baseUrl}/order`);
        cy.wait(200);
        
        cy.get('input[name="OrderNo"]').should('exist');
        cy.get('select[name="CustomerID"]').should('have.value', '0: 0');
        cy.get('select[name="PMethod"]').should('have.value', '');
        cy.get('input[name="GTotal"]').should('have.value', '0');
        cy.get('table tbody tr td').should('contain', 'No food item selected for this order.');
    
    })
    
    it('Verifica navegar desde New Order a Arders', () => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        cy.visit(`${baseUrl}/order`);
        cy.wait(200);
        
        cy.get('.btn-outline-dark').click();
        cy.wait(200);
        cy.url().should('include', '/orders');
    })

    it('Verifica navegar desde Orders a New Order', () => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        cy.visit(`${baseUrl}/orders`);
        cy.wait(200);

        cy.get('.btn-outline-success').click();
        cy.wait(200);
        cy.url().should('include', '/order');
    })

    it('Verifica navegar desde Orders a Edit Order', () => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        cy.visit(`${baseUrl}/orders`);
        cy.wait(200);
        
        cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
        cy.wait(200);
        cy.url().should('include', '/order/edit');
    })

    it('Verifica navegar desde Edit Order a Orders', () => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        cy.visit(`${baseUrl}/orders`);
        cy.wait(200);

        cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
        cy.get('.btn-outline-dark').click();
        cy.wait(200);
        cy.url().should('include', '/orders');
    })
})  