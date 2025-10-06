// cypress/e2e/recipe-editing-simple.cy.js

describe('Edición de Recetas - Flujo Simplificado', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.loginUser();
  });

  it('debería completar el flujo completo de edición con ingredientes', () => {
    // 1. Crear receta inicial
    cy.generateRecipes(['pollo', 'arroz', 'cebolla']);
    cy.get('[data-testid="save-recipe-button"]').first().click();
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 2. Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('[data-testid="saved-recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });

    // 3. Verificar modo edición
    cy.verifyEditMode();

    // 4. Cambiar ingredientes
    cy.get('[data-testid="ingredient-input"]').type('tomate');
    cy.get('[data-testid="add-ingredient-button"]').click();

    // 5. Guardar cambios
    cy.get('[data-testid="create-recipe-button"]').click();

    // 6. Verificar que se genera solo 1 receta
    cy.verifySingleRecipeGenerated();

    // 7. Guardar desde la card
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="save-recipe-button"]').click();
      });

    // 8. Verificar que la card desaparece
    cy.verifyCardDisappears();

    // 9. Verificar que se actualizó en My Recipes
    cy.visit('/my-recipes');
    cy.get('[data-testid="saved-recipe-card"]').should('have.length', 1);
    cy.get('[data-testid="saved-recipe-card"]').should('contain', 'tomate');
  });

  it('debería actualizar solo porciones sin generar nueva receta', () => {
    // 1. Crear receta inicial
    cy.generateRecipes(['pollo', 'arroz']);
    cy.get('[data-testid="save-recipe-button"]').first().click();
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 2. Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('[data-testid="saved-recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });

    // 3. Verificar modo edición
    cy.verifyEditMode();

    // 4. Cambiar solo porciones
    cy.get('[data-testid="servings-select"]').select('4');

    // 5. Guardar cambios
    cy.get('[data-testid="create-recipe-button"]').click();

    // 6. Verificar que NO se genera nueva receta
    cy.verifyNoNewRecipeGenerated();
  });

  it('debería actualizar solo título sin generar nueva receta', () => {
    // 1. Crear receta inicial
    cy.generateRecipes(['pollo', 'arroz']);
    cy.get('[data-testid="save-recipe-button"]').first().click();
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 2. Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('[data-testid="saved-recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });

    // 3. Verificar modo edición
    cy.verifyEditMode();

    // 4. Cambiar solo título
    cy.get('[data-testid="recipe-title-input"]').clear().type('Mi Receta Personalizada');

    // 5. Guardar cambios
    cy.get('[data-testid="create-recipe-button"]').click();

    // 6. Verificar que NO se genera nueva receta
    cy.verifyNoNewRecipeGenerated();

    // 7. Verificar que el título se actualizó
    cy.get('[data-testid="saved-recipe-card"]').should('contain', 'Mi Receta Personalizada');
  });
});
