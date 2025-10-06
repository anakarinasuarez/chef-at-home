// cypress/e2e/recipe-editing-simple-test.cy.js

describe('Edición de Recetas - Test Simple', () => {
  beforeEach(() => {
    cy.clearAppData();
    // Login básico
    cy.visit('/auth/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Esperar a que se complete el login
    cy.url().should('not.include', '/auth/login');
  });

  it('debería poder navegar a la página de crear recetas', () => {
    cy.visit('/create');
    // Verificar que la página carga (cualquier h1)
    cy.get('h1').should('exist');
  });

  it('debería poder navegar a My Recipes', () => {
    cy.visit('/my-recipes');
    // Verificar que la página carga (cualquier h1)
    cy.get('h1').should('exist');
  });

  it('debería poder navegar a la página de recetas generadas', () => {
    cy.visit('/recipes');
    // Verificar que la página carga
    cy.get('body').should('be.visible');
  });

  it('debería poder hacer login correctamente', () => {
    // Este test ya debería pasar porque está en beforeEach
    cy.url().should('not.include', '/auth/login');
    cy.get('body').should('be.visible');
  });
});
