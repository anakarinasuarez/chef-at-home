// cypress/e2e/recipe-editing-no-login.cy.js

describe('Edición de Recetas - Sin Login', () => {
  beforeEach(() => {
    cy.clearAppData();
  });

  it('debería poder navegar a la página de login', () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

  it('debería poder hacer login básico', () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Esperar más tiempo para el login
    cy.wait(5000);

    // Verificar que se redirige
    cy.url().should('not.include', '/auth/login');
  });

  it('debería poder navegar a la página de crear recetas después del login', () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Esperar más tiempo para el login
    cy.wait(5000);

    // Navegar a create
    cy.visit('/create');

    // Verificar que los elementos están presentes
    cy.get('[data-testid="ingredient-input"]').should('be.visible');
    cy.get('[data-testid="add-ingredient-button"]').should('be.visible');
    cy.get('[data-testid="create-recipe-button"]').should('be.visible');
  });

  it('debería poder navegar a My Recipes después del login', () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Esperar más tiempo para el login
    cy.wait(5000);

    // Navegar a my-recipes
    cy.visit('/my-recipes');

    // Verificar que los elementos están presentes
    cy.get('[data-testid="my-recipes-title"]').should('be.visible');
    cy.get('[data-testid="empty-state"]').should('be.visible');
  });
});
