describe('| Tests - Submit items to Orders |', () => {
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

        cy.get('.btn.btn-sm.btn-success.text-white').click(); 
        cy.wait(200);
    });

    it('Verifica que se pueda cargar un item de orden completo', () => {
        cy.get('select[name="ItemID"]').select('1');
        cy.get('input[name="Quantity"]').clear().type('3'); 
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.get('.toast-message').should('include.text', 'Order item saved successfully!');    
    })

    it('Verifica que no se pueda cargar un item de orden sin item', () => {
        cy.get('input[name="Quantity"]').clear().clear().type('6'); 
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.get('.toast-message').should('include.text', 'Please select an item.');
    })

    it('Verifica que no se pueda cargar un item de orden sin cantidad', () => {
        cy.get('select[name="ItemID"]').select('4');
        cy.wait(200);
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.get('.toast-message').should('include.text', 'Please enter a valid quantity.');    
    })
    
    it('Verifica que no se pueda cargar un item de orden vacio', () => {
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.get('.toast-message').eq(0).should('include.text', 'Please enter a valid quantity.');
        cy.get('.toast-message').eq(1).should('include.text', 'Please select an item.');
    })

    it('Verifica que no se pueda cargar un item de orden vacio', () => {
        cy.get('button.btn.btn-outline-dark.ml-1').click();    
    })

    it('Verifica que se pueda cargar mas de un item de orden a la orden', () => {
        cy.get('select[name="ItemID"]').select('9');
        cy.get('input[name="Quantity"]').clear().type('1'); 
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.get('.toast-message').should('include.text', 'Order item saved successfully!');    

        cy.wait(200);
        cy.get('.btn.btn-sm.btn-success.text-white').click(); 
        cy.get('select[name="ItemID"]').select('10');
        cy.get('input[name="Quantity"]').clear().type('5'); 
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.get('.toast-message').should('include.text', 'Order item saved successfully!');   
    })
})  