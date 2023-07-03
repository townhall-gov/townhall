// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('HomePage', () => {
	it('rooms load more button test & card count ', () => {
		cy.viewport(1450, 850);
		// Start from the index page
		cy.visit('http://localhost:3000/').then(() => {
			cy.get('.ant-dropdown-trigger').should('be.visible');
			const elm = cy.get('.ant-dropdown-trigger');
			elm.click({ force: true }).should('have.length',1);
			cy.contains('.ant-dropdown-menu-item', /Houses|All|Rooms/);
			cy.contains('.ant-dropdown-menu-item', 'Rooms').click();
			cy.get('.cards-container').find('.single-room-card').then(cards => {
				if (cards.length < 10) {
					cy.contains('load more').should('not.exist');
				}
				else {
					cy.contains('load more').should('exist');
				}
			});
		});

	});
	it('houses load more button test & card count', () => {
		cy.viewport(1450, 850);
		// Start from the index page
		cy.visit('http://localhost:3000/').then(() => {
			cy.get('.ant-dropdown-trigger').should('be.visible');
			const elm = cy.get('.ant-dropdown-trigger');
			elm.click({ force: true }).should('have.length',1);
			cy.contains('.ant-dropdown-menu-item', /Houses|All|Rooms/);
			cy.contains('.ant-dropdown-menu-item', 'Houses').click();
			cy.get('.cards-container').find('.single-house').then(cards => {
				if (cards.length < 10) {
					cy.contains('load more').should('not.exist');
				}
				else
				{
					cy.contains('load more').should('exist');
				}
			});
		});

	});
});