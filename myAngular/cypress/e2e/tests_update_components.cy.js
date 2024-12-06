describe('Tests - Update Components from Orders |', () => {
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

        cy.get('select[name="CustomerID"]').select('1');
        cy.get('select[name="PMethod"]').select('Cash');
        cy.get('.btn.btn-sm.btn-success.text-white').click(); 
        cy.get('select[name="ItemID"]').select('1');
        cy.get('input[name="Quantity"]').clear().type('1'); 
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.wait(200);
        cy.get('tbody > tr').last().find('td:nth-child(2)').click();
        cy.wait(200);
    });

    it('Verifica que se pueda actualizar el cliente', () => {
        cy.get('select[name="CustomerID"]').select('5');
    })

    it('Verifica que se pueda actualizar el metodo de pago', () => {
        cy.get('select[name="PMethod"]').select('Card');
    })

    it('Verifica que se pueda actualizar la orden de item', () => {
        cy.get('a.btn.btn-sm.btn-info.text-white').click();
        cy.get('select[name="ItemID"]').select('9');
        cy.get('input[name="Quantity"]').clear().clear().type('5');
        cy.wait(200);
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.get('.toast-message').should('include.text', 'Order item saved successfully!');    

    })

    it('Verifica que se actualice el total del item de comida', () => {
        cy.get('a.btn.btn-sm.btn-info.text-white').click();
        cy.get('input[name="Total"]').invoke('val').then((initialTotal) => {
            cy.get('input[name="Quantity"]').clear().clear().type('4'); 
            cy.get('input[name="Total"]').invoke('val').should('not.equal', initialTotal);
        })
    })

    it('Verifica que se actualice el total de la orden', () => {
        cy.get('input[name="GTotal"]').invoke('val').then((initialTotal) => {
            cy.get('a.btn.btn-sm.btn-info.text-white').click();
            cy.get('input[name="Quantity"]').clear().clear().type('6'); 
            cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
            cy.get('input[name="GTotal"]').invoke('val').should('not.equal', initialTotal);
        })
    })

    it('Verifica que se actualice la orden', () => {
        cy.get('select[name="CustomerID"]').select('2');
        cy.get('select[name="PMethod"]').select('Card');
        cy.get('a.btn.btn-sm.btn-info.text-white').click();
        cy.get('select[name="ItemID"]').select('11');
        cy.get('input[name="Quantity"]').clear().clear().type('5');
        cy.wait(200);
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').should('include.text', 'Submitted Successfully');
    })
})  