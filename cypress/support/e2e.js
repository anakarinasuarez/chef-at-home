// cypress/support/e2e.js

// Importar comandos personalizados
import './commands';

// Configuración global
Cypress.on('uncaught:exception', (err, runnable) => {
  // No fallar en errores no controlados de la aplicación
  // Esto es útil para errores de desarrollo que no afectan la funcionalidad
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('location is not defined')) {
    return false;
  }
  return true;
});

// Configurar interceptores globales
beforeEach(() => {
  // Interceptar llamadas a APIs externas para evitar dependencias externas
  cy.intercept('GET', '**/api/recipes/generate', { fixture: 'recipes.json' }).as('generateRecipes');
  cy.intercept('POST', '**/api/auth/login', { fixture: 'auth-success.json' }).as('globalLogin');
  cy.intercept('POST', '**/api/auth/register', { fixture: 'auth-success.json' }).as(
    'globalRegister'
  );
});

// Configurar viewport por defecto
Cypress.Commands.add('setViewport', size => {
  if (size === 'mobile') {
    cy.viewport(375, 667);
  } else if (size === 'tablet') {
    cy.viewport(768, 1024);
  } else {
    cy.viewport(1280, 720);
  }
});

// Comando para login rápido
Cypress.Commands.add(
  'loginUser',
  (email = 'test@chefathome.com', password = 'TestPassword123!') => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/recipes');
  }
);

// Comando para registro rápido
Cypress.Commands.add(
  'registerUser',
  (email = 'newuser@chefathome.com', password = 'TestPassword123!') => {
    cy.visit('/auth/signup');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="confirm-password-input"]').type(password);
    cy.get('[data-testid="signup-button"]').click();
    cy.url().should('include', '/recipes');
  }
);

// Comando para generar recetas
Cypress.Commands.add('generateRecipes', (ingredients = ['chicken', 'rice', 'vegetables']) => {
  cy.visit('/recipes');
  cy.get('[data-testid="ingredients-input"]').type(ingredients.join(', '));
  cy.get('[data-testid="servings-input"]').clear().type('4');
  cy.get('[data-testid="generate-button"]').click();
  cy.wait('@generateRecipes');
});

// Comando para esperar que la página cargue completamente
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
});
