import '../sharedSteps';
import '../WidgetEnrollment';
import '../WidgetProfile';

beforeEach(() => {
    cy.loginThroughForm();
});


Then(/you should see tabs: (.*)/, (tabNames) => {
    const tabs = tabNames.split(',');
    cy.get('[data-test="add-event-enrollment-page-content"]').within(() => {
        cy.get('[data-test="new-event-tab-bar"]').should('exist');
        cy.get('[data-test="new-event-tab-bar"]').within(() => {
            tabs.forEach((tab) => {
                cy.get('button').contains(tab).should('exist');
            });
        });
    });
});

When(/you click switch tab to (.*)/, (tabName) => {
    cy.get('[data-test="new-event-tab-bar"]').get('button').contains(tabName).click();
});

Then('you should see warning dialog', () => {
    cy.get('div[role="dialog"]')
        .contains('Current data will be lost if you switch tab before saving it')
        .should('exist');

    cy.get('div[role="dialog"]').contains('Yes, discard').click();
});
