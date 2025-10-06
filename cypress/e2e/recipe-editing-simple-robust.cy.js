// cypress/e2e/recipe-editing-simple-robust.cy.js

describe('Edición de Recetas - Tests Simples Robustos', () => {
  beforeEach(() => {
    cy.clearAppData();
    // Login usando data-testid
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Esperar a que se complete el login
    cy.url().should('not.include', '/auth/login');
  });

  it('debería poder navegar a la página de crear recetas', () => {
    cy.visit('/create');
    cy.get('[data-testid="ingredient-input"]').should('be.visible');
    cy.get('[data-testid="add-ingredient-button"]').should('be.visible');
    cy.get('[data-testid="create-recipe-button"]').should('be.visible');
  });

  it('debería poder agregar ingredientes', () => {
    cy.visit('/create');

    // Agregar ingredientes usando data-testid
    cy.get('[data-testid="ingredient-input"]').type('pollo');
    cy.get('[data-testid="add-ingredient-button"]').click();

    // Verificar que se agregó el ingrediente
    cy.get('body').should('contain', 'pollo');

    // Agregar otro ingrediente
    cy.get('[data-testid="ingredient-input"]').type('arroz');
    cy.get('[data-testid="add-ingredient-button"]').click();

    // Verificar que se agregó el segundo ingrediente
    cy.get('body').should('contain', 'arroz');
  });

  it('debería poder seleccionar servings', () => {
    cy.visit('/create');

    // Seleccionar diferentes servings
    cy.get('[data-testid="servings-2-button"]').click();
    cy.get('[data-testid="servings-4-button"]').click();
    cy.get('[data-testid="servings-6-button"]').click();
  });

  it('debería poder cambiar el título de la receta', () => {
    cy.visit('/create');

    // Cambiar el título
    cy.get('[data-testid="recipe-title-input"]').type('Mi Receta Personalizada');
    cy.get('[data-testid="recipe-title-input"]').should('have.value', 'Mi Receta Personalizada');
  });

  it('debería poder ir a My Recipes', () => {
    cy.visit('/my-recipes');
    cy.get('[data-testid="my-recipes-title"]').should('be.visible');
    cy.get('[data-testid="my-recipes-title"]').should('contain', 'My Saved Recipes');
  });

  it('debería mostrar estado vacío cuando no hay recetas guardadas', () => {
    cy.visit('/my-recipes');
    cy.get('[data-testid="empty-state"]').should('be.visible');
    cy.get('[data-testid="empty-state"]').should('contain', 'No saved recipes yet');
  });

  it('debería poder generar recetas básicas', () => {
    cy.visit('/create');

    // Agregar ingredientes
    cy.get('[data-testid="ingredient-input"]').type('pollo');
    cy.get('[data-testid="add-ingredient-button"]').click();

    cy.get('[data-testid="ingredient-input"]').type('arroz');
    cy.get('[data-testid="add-ingredient-button"]').click();

    // Seleccionar servings
    cy.get('[data-testid="servings-2-button"]').click();

    // Generar recetas
    cy.get('[data-testid="create-recipe-button"]').click();

    // Esperar a que se generen las recetas
    cy.url().should('include', '/recipes');

    // Verificar que la página carga
    cy.get('body').should('be.visible');
  });
});
