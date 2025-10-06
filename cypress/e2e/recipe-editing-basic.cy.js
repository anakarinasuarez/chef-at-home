// cypress/e2e/recipe-editing-basic.cy.js

describe('Edición de Recetas - Test Básico', () => {
  beforeEach(() => {
    cy.clearAppData();
    // Login básico usando la interfaz real
    cy.visit('/auth/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Esperar a que se complete el login
    cy.url().should('not.include', '/auth/login');
  });

  it('debería poder navegar a la página de crear recetas', () => {
    cy.visit('/create');
    cy.get('h1').should('contain', 'Crear Receta');
  });

  it('debería poder agregar ingredientes', () => {
    cy.visit('/create');

    // Buscar el input de ingredientes (puede ser un input normal)
    cy.get('input[placeholder*="ingrediente"], input[placeholder*="Ingredient"]')
      .first()
      .type('pollo');

    // Buscar el botón de agregar (puede ser un botón normal)
    cy.get('button').contains('Agregar').click();

    // Verificar que se agregó el ingrediente
    cy.get('body').should('contain', 'pollo');
  });

  it('debería poder generar recetas', () => {
    cy.visit('/create');

    // Agregar ingredientes
    cy.get('input[placeholder*="ingrediente"], input[placeholder*="Ingredient"]')
      .first()
      .type('pollo');
    cy.get('button').contains('Agregar').click();

    cy.get('input[placeholder*="ingrediente"], input[placeholder*="Ingredient"]')
      .first()
      .type('arroz');
    cy.get('button').contains('Agregar').click();

    // Generar recetas
    cy.get('button').contains('Crear').click();

    // Esperar a que se generen las recetas
    cy.url().should('include', '/recipes');
    cy.get('body').should('contain', 'Recetas Generadas');
  });

  it('debería poder guardar una receta', () => {
    // Primero generar recetas
    cy.visit('/create');
    cy.get('input[placeholder*="ingrediente"], input[placeholder*="Ingredient"]')
      .first()
      .type('pollo');
    cy.get('button').contains('Agregar').click();
    cy.get('button').contains('Crear').click();

    // Esperar a que se generen
    cy.url().should('include', '/recipes');

    // Buscar el botón de guardar (puede ser un botón normal)
    cy.get('button').contains('Guardar').first().click();

    // Verificar que se muestra mensaje de éxito
    cy.get('body').should('contain', 'success');
  });

  it('debería poder ir a My Recipes', () => {
    cy.visit('/my-recipes');
    cy.get('h1').should('contain', 'Mis Recetas');
  });

  it('debería poder editar una receta existente', () => {
    // Primero crear y guardar una receta
    cy.visit('/create');
    cy.get('input[placeholder*="ingrediente"], input[placeholder*="Ingredient"]')
      .first()
      .type('pollo');
    cy.get('button').contains('Agregar').click();
    cy.get('button').contains('Crear').click();

    cy.url().should('include', '/recipes');
    cy.get('button').contains('Guardar').first().click();

    // Ir a My Recipes
    cy.visit('/my-recipes');

    // Buscar el botón de editar
    cy.get('button').contains('Editar').first().click();

    // Verificar que estamos en modo edición
    cy.url().should('include', '/create');
    cy.get('button').contains('Update').should('exist');
  });
});
