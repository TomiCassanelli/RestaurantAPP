describe('| Tests - Delete Components from Orders |', () => {
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
        cy.get('select[name="ItemID"]').select('2');
        cy.get('input[name="Quantity"]').clear().type('3'); 
        cy.get('.form-container > form.ng-valid > :nth-child(4) > .btn-dark').click();
        cy.wait(200);
    });

    it('Verifica que se pueda borrar el cliente', () => {
        cy.get('.row > :nth-child(1) > :nth-child(2) > .form-control').select('0: 0');
    })

    it('Verifica que se pueda borrar el metodo de pago', () => {
        cy.get(':nth-child(1) > .form-control').select('-Select-');
    })

    it('Verifica que se pueda borrar la orden de item', () => {
        cy.get('a.btn.btn-sm.btn-danger.text-white.ml-1').click();
        cy.get('.toast-message').should('include.text', 'Item removed successfully');
    })

    it('Verifica que se actualice el total de la orden al eliminar un item', () => {
        cy.get('input[name="GTotal"]').invoke('val').then((initialTotal) => {
            cy.wait(200);
            cy.get('a.btn.btn-sm.btn-danger.text-white.ml-1').click();
            cy.get('input[name="GTotal"]').invoke('val').should('not.equal', initialTotal);
        })
    })

    it('Verifica que al borrar todos los componentes, no se pueda enviar la orden', () => {
        cy.get('.row > :nth-child(1) > :nth-child(2) > .form-control').select('0: 0');
        cy.get(':nth-child(1) > .form-control').select('-Select-');
        cy.get('a.btn.btn-sm.btn-danger.text-white.ml-1').click();
        cy.wait(200);
        cy.contains('button', 'Submit').click();
        cy.get('.toast-message').eq(0).should('include.text', 'Please add at least one item to the order.');
        cy.get('.toast-message').eq(1).should('include.text', 'Please select a payment method.');
        cy.get('.toast-message').eq(2).should('include.text', 'Please select a customer.');
    })

    it('Verifica que al enviar la orden, se pueda eliminar', () => {
        cy.contains('button', 'Submit').click();
        cy.wait(200);
        cy.get('tbody > tr').last().find('a.btn.text-danger').click();
        cy.get('.toast-message').should('include.text', 'Deleted Successfully');
    })
})  