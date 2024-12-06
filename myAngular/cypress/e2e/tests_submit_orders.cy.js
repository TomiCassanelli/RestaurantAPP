describe('| Tests - Submit Orders |', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; })
    let baseUrl;
    
    beforeEach(() => {
        // const baseUrl = Cypress.env('baseUrl')
        // cy.visit(baseUrl);
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200';
        }

        cy.visit(`${baseUrl}/order`);
        cy.wait(200);
    });

    it('Verifica que se pueda enviar una orden completa', () => {
        cy.get('select[name="CustomerID"]').select('1');
        cy.get('select[name="PMethod"]').select('Cash');
        cy.get('.btn.btn-sm.btn-success.text-white').click(); 
        cy.get('select[name="ItemID"]').select('1');
        cy.get('input[name="Quantity"]').clear().type('3'); 
        cy.wait(200);
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').should('include.text', 'Submitted Successfully');
    })

    
    it('Verifica que no se pueda enviar una orden sin seleccionar cliente', () => {
        cy.get('select[name="PMethod"]').select('Cash');
        cy.get('.btn.btn-sm.btn-success.text-white').click();
        cy.get('select[name="ItemID"]').select('1');
        cy.get('input[name="Quantity"]').clear().type('3');
        cy.wait(200);
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').should('include.text', 'Please select a customer.');
    })

    it('Verifica que no se pueda enviar una orden sin seleccionar item', () => {
        cy.get('select[name="CustomerID"]').select('1');
        cy.get('select[name="PMethod"]').select('Cash');
        cy.get('table tbody tr').should('have.length', 1);
        cy.get('table tbody tr td').should('contain', 'No food item selected for this order.');
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').should('include.text', 'Please add at least one item to the order.');
    })
    
    it('Verifica que no se pueda enviar una orden sin seleccionar metodo de pago', () => {
        cy.get('select[name="CustomerID"]').select('1'); 
        cy.get('.btn.btn-sm.btn-success.text-white').click();
        cy.get('select[name="ItemID"]').select('1'); 
        cy.get('input[name="Quantity"]').clear().type('3');
        cy.wait(200);
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').should('include.text', 'Please select a payment method.');
    })

    it('Verifica que no se pueda enviar una orden vacía', () => {
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').eq(0).should('include.text', 'Please add at least one item to the order.');
        cy.get('.toast-message').eq(1).should('include.text', 'Please select a payment method.');
        cy.get('.toast-message').eq(2).should('include.text', 'Please select a customer.');
    })
})  