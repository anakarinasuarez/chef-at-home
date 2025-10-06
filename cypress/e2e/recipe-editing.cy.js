// cypress/e2e/recipe-editing.cy.js

describe('Edición de Recetas', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.loginUser();
  });

  describe('Flujo completo de edición', () => {
    it('debería permitir editar ingredientes y generar nueva receta', () => {
      // 1. Crear una receta inicial
      cy.generateRecipes(['pollo', 'arroz', 'cebolla']);
      cy.get('[data-testid="save-recipe-button"]').first().click();
      cy.get('[data-testid="success-message"]').should('be.visible');

      // 2. Ir a My Recipes
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').should('have.length.at.least', 1);

      // 3. Editar la receta
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // 4. Verificar que estamos en modo edición
      cy.url().should('include', '/create');
      cy.get('[data-testid="recipe-title-input"]').should('have.value');

      // 5. Cambiar ingredientes (agregar nuevo ingrediente)
      cy.get('[data-testid="ingredient-input"]').type('tomate');
      cy.get('[data-testid="add-ingredient-button"]').click();

      // 6. Verificar que el botón cambia a "Update Recipe"
      cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');

      // 7. Guardar cambios (debería generar nueva receta)
      cy.get('[data-testid="create-recipe-button"]').click();

      // 8. Verificar que se genera solo 1 receta nueva
      cy.url().should('include', '/recipes');
      cy.url().should('include', 'editMode=true');
      cy.url().should('include', 'count=1');
      cy.get('[data-testid="recipe-card"]').should('have.length', 1);

      // 9. Guardar la nueva receta desde la card
      cy.get('[data-testid="recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="save-recipe-button"]').click();
        });

      // 10. Verificar que la card desaparece
      cy.get('[data-testid="recipe-card"]').should('not.exist');

      // 11. Verificar que se muestra mensaje de éxito
      cy.get('[data-testid="success-message"]').should('be.visible');

      // 12. Ir a My Recipes y verificar que la receta se actualizó
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').should('have.length', 1);
      cy.get('[data-testid="saved-recipe-card"]').should('contain', 'tomate');
    });

    it('debería permitir cambiar solo las porciones sin generar nueva receta', () => {
      // 1. Crear una receta inicial
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

      // 3. Cambiar solo las porciones
      cy.get('[data-testid="servings-select"]').select('4');

      // 4. Verificar que el botón dice "Update Recipe"
      cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');

      // 5. Guardar cambios
      cy.get('[data-testid="create-recipe-button"]').click();

      // 6. Verificar que NO se genera nueva receta (solo se actualiza)
      cy.url().should('not.include', '/recipes');
      cy.url().should('include', '/my-recipes');

      // 7. Verificar que se muestra mensaje de éxito
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería permitir cambiar solo el título sin generar nueva receta', () => {
      // 1. Crear una receta inicial
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

      // 3. Cambiar solo el título
      cy.get('[data-testid="recipe-title-input"]').clear().type('Mi Receta Personalizada');

      // 4. Verificar que el botón dice "Update Recipe"
      cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');

      // 5. Guardar cambios
      cy.get('[data-testid="create-recipe-button"]').click();

      // 6. Verificar que NO se genera nueva receta (solo se actualiza)
      cy.url().should('not.include', '/recipes');
      cy.url().should('include', '/my-recipes');

      // 7. Verificar que se muestra mensaje de éxito
      cy.get('[data-testid="success-message"]').should('be.visible');

      // 8. Verificar que el título se actualizó
      cy.get('[data-testid="saved-recipe-card"]').should('contain', 'Mi Receta Personalizada');
    });
  });

  describe('Validaciones de edición', () => {
    beforeEach(() => {
      // Crear una receta inicial
      cy.generateRecipes(['pollo', 'arroz']);
      cy.get('[data-testid="save-recipe-button"]').first().click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería mostrar error si se intenta guardar sin ingredientes', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // Eliminar todos los ingredientes
      cy.get('[data-testid="ingredient-item"]').each(() => {
        cy.get('[data-testid="remove-ingredient-button"]').first().click();
      });

      // Intentar guardar
      cy.get('[data-testid="create-recipe-button"]').click();

      // Verificar que se muestra error
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Please add at least one ingredient'
      );
    });

    it('debería mostrar error si el título está vacío', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // Limpiar el título
      cy.get('[data-testid="recipe-title-input"]').clear();

      // Intentar guardar
      cy.get('[data-testid="create-recipe-button"]').click();

      // Verificar que se muestra error
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Please enter a recipe title');
    });
  });

  describe('Navegación en modo edición', () => {
    beforeEach(() => {
      // Crear una receta inicial
      cy.generateRecipes(['pollo', 'arroz']);
      cy.get('[data-testid="save-recipe-button"]').first().click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería permitir cancelar la edición', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // Hacer algunos cambios
      cy.get('[data-testid="recipe-title-input"]').clear().type('Título Temporal');

      // Cancelar (volver atrás)
      cy.get('[data-testid="back-button"]').click();

      // Verificar que volvemos a My Recipes sin cambios
      cy.url().should('include', '/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').should('not.contain', 'Título Temporal');
    });

    it('debería mantener el estado al navegar entre páginas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // Hacer cambios
      cy.get('[data-testid="recipe-title-input"]').clear().type('Título Persistente');
      cy.get('[data-testid="ingredient-input"]').type('ajo');
      cy.get('[data-testid="add-ingredient-button"]').click();

      // Navegar a otra página y volver
      cy.get('[data-testid="my-recipes-link"]').click();
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // Verificar que los cambios se mantienen
      cy.get('[data-testid="recipe-title-input"]').should('have.value', 'Título Persistente');
      cy.get('[data-testid="ingredient-item"]').should('contain', 'ajo');
    });
  });

  describe('Performance y UX', () => {
    beforeEach(() => {
      // Crear una receta inicial
      cy.generateRecipes(['pollo', 'arroz']);
      cy.get('[data-testid="save-recipe-button"]').first().click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería cargar la página de edición rápidamente', () => {
      cy.visit('/my-recipes');

      const startTime = Date.now();
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      cy.url().should('include', '/create');

      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(2000); // Menos de 2 segundos
      });
    });

    it('debería mostrar loading state durante la generación', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      // Cambiar ingredientes para generar nueva receta
      cy.get('[data-testid="ingredient-input"]').type('tomate');
      cy.get('[data-testid="add-ingredient-button"]').click();

      // Guardar y verificar loading
      cy.get('[data-testid="create-recipe-button"]').click();
      cy.get('[data-testid="loading-spinner"]').should('be.visible');

      // Esperar a que termine la generación
      cy.get('[data-testid="recipe-card"]').should('be.visible');
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });
  });
});
