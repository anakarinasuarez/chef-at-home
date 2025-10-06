// cypress/e2e/recipe-editing-robust.cy.js

describe('Edición de Recetas - Tests Robustos', () => {
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

  it('debería completar el flujo completo de edición con ingredientes', () => {
    // 1. Crear una receta inicial
    cy.visit('/create');

    // Agregar ingredientes usando data-testid
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

    // Guardar la primera receta
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="save-recipe-button"]').click();
      });

    // Esperar a que se guarde
    cy.wait(2000);

    // 2. Ir a My Recipes
    cy.visit('/my-recipes');

    // Verificar que hay una receta guardada
    cy.get('[data-testid="saved-recipes-container"]').should('be.visible');
    cy.get('[data-testid="recipe-card"]').should('contain', 'pollo');

    // 3. Editar la receta
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });

    // Verificar que estamos en modo edición
    cy.url().should('include', '/create');

    // 4. Cambiar ingredientes (agregar nuevo)
    cy.get('[data-testid="ingredient-input"]').type('tomate');
    cy.get('[data-testid="add-ingredient-button"]').click();

    // 5. Verificar que el botón cambia a "Update Recipe"
    cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');

    // 6. Guardar cambios
    cy.get('[data-testid="create-recipe-button"]').click();

    // 7. Verificar que se genera solo 1 receta nueva
    cy.url().should('include', '/recipes');
    cy.url().should('include', 'editMode=true');
    cy.url().should('include', 'count=1');
    cy.get('[data-testid="recipe-card"]').should('have.length', 1);

    // 8. Guardar la nueva receta desde la card
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="save-recipe-button"]').click();
      });

    // 9. Verificar que la card desaparece
    cy.get('[data-testid="recipe-card"]').should('not.exist');

    // 10. Ir a My Recipes y verificar que se actualizó
    cy.visit('/my-recipes');
    cy.get('[data-testid="recipe-card"]').should('have.length', 1);
    cy.get('[data-testid="recipe-card"]').should('contain', 'tomate');
  });

  it('debería poder cambiar solo las porciones sin generar nueva receta', () => {
    // Primero crear y guardar una receta
    cy.visit('/create');
    cy.get('[data-testid="ingredient-input"]').type('pollo');
    cy.get('[data-testid="add-ingredient-button"]').click();
    cy.get('[data-testid="servings-2-button"]').click();
    cy.get('[data-testid="create-recipe-button"]').click();

    cy.url().should('include', '/recipes');
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="save-recipe-button"]').click();
      });
    cy.wait(2000);

    // Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });

    // Cambiar solo las porciones
    cy.get('[data-testid="servings-4-button"]').click();

    // Verificar que el botón dice "Update Recipe"
    cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');

    // Guardar cambios
    cy.get('[data-testid="create-recipe-button"]').click();

    // Verificar que NO se genera nueva receta (solo se actualiza)
    cy.url().should('not.include', '/recipes');
    cy.url().should('include', '/my-recipes');
  });

  it('debería poder cambiar solo el título sin generar nueva receta', () => {
    // Primero crear y guardar una receta
    cy.visit('/create');
    cy.get('[data-testid="ingredient-input"]').type('pollo');
    cy.get('[data-testid="add-ingredient-button"]').click();
    cy.get('[data-testid="servings-2-button"]').click();
    cy.get('[data-testid="create-recipe-button"]').click();

    cy.url().should('include', '/recipes');
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="save-recipe-button"]').click();
      });
    cy.wait(2000);

    // Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });

    // Cambiar solo el título
    cy.get('[data-testid="recipe-title-input"]').clear().type('Mi Receta Personalizada');

    // Verificar que el botón dice "Update Recipe"
    cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');

    // Guardar cambios
    cy.get('[data-testid="create-recipe-button"]').click();

    // Verificar que NO se genera nueva receta (solo se actualiza)
    cy.url().should('not.include', '/recipes');
    cy.url().should('include', '/my-recipes');

    // Verificar que el título se actualizó
    cy.get('[data-testid="recipe-card"]').should('contain', 'Mi Receta Personalizada');
  });

  it('debería mostrar estado vacío cuando no hay recetas guardadas', () => {
    cy.visit('/my-recipes');
    cy.get('[data-testid="empty-state"]').should('be.visible');
    cy.get('[data-testid="empty-state"]').should('contain', 'No saved recipes yet');
  });

  it('debería poder eliminar una receta guardada', () => {
    // Primero crear y guardar una receta
    cy.visit('/create');
    cy.get('[data-testid="ingredient-input"]').type('pollo');
    cy.get('[data-testid="add-ingredient-button"]').click();
    cy.get('[data-testid="servings-2-button"]').click();
    cy.get('[data-testid="create-recipe-button"]').click();

    cy.url().should('include', '/recipes');
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="save-recipe-button"]').click();
      });
    cy.wait(2000);

    // Ir a My Recipes
    cy.visit('/my-recipes');

    // Eliminar la receta
    cy.get('[data-testid="recipe-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="delete-button"]').click();
      });

    // Confirmar eliminación (si hay modal)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="confirm-delete-button"]').length > 0) {
        cy.get('[data-testid="confirm-delete-button"]').click();
      }
    });

    // Verificar que se muestra estado vacío
    cy.get('[data-testid="empty-state"]').should('be.visible');
  });
});
