// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('HomePage', () => {
	it('should navigate to the about page', () => {
		cy.viewport(1450, 850);
		// Start from the index page
		cy.visit('http://localhost:3000/');

		const elm = cy.get('input.search');
		elm.type('Moonbase', { force: true });

		elm.should('have.value', 'Moonbase');
		cy.get('#moonbase').should('have.attr', 'data-link','/moonbase/proposals');
	});
});