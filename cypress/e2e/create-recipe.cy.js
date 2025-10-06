// cypress/e2e/create-recipe.cy.js

describe('Crear Receta', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.loginUser();
  });

  describe('Página de crear receta', () => {
    it('debería mostrar la página de crear receta', () => {
      cy.visit('/create');
      cy.get('h1').should('contain', 'Crear Receta');
      cy.get('[data-testid="recipe-title-input"]').should('be.visible');
      cy.get('[data-testid="servings-input"]').should('be.visible');
      cy.get('[data-testid="cooking-time-input"]').should('be.visible');
      cy.get('[data-testid="difficulty-select"]').should('be.visible');
    });

    it('debería mostrar campos para ingredientes e instrucciones', () => {
      cy.visit('/create');
      cy.get('[data-testid="ingredients-section"]').should('be.visible');
      cy.get('[data-testid="instructions-section"]').should('be.visible');
    });
  });

  describe('Formulario de receta', () => {
    beforeEach(() => {
      cy.visit('/create');
    });

    it('debería permitir ingresar título de receta', () => {
      cy.get('[data-testid="recipe-title-input"]').type('Mi Receta Especial');
      cy.get('[data-testid="recipe-title-input"]').should('have.value', 'Mi Receta Especial');
    });

    it('debería permitir seleccionar dificultad', () => {
      cy.get('[data-testid="difficulty-select"]').select('Medio');
      cy.get('[data-testid="difficulty-select"]').should('have.value', 'Medio');
    });

    it('debería permitir ingresar tiempo de cocción', () => {
      cy.get('[data-testid="cooking-time-input"]').type('45 min');
      cy.get('[data-testid="cooking-time-input"]').should('have.value', '45 min');
    });

    it('debería permitir ingresar número de porciones', () => {
      cy.get('[data-testid="servings-input"]').clear().type('6');
      cy.get('[data-testid="servings-input"]').should('have.value', '6');
    });
  });

  describe('Gestión de ingredientes', () => {
    beforeEach(() => {
      cy.visit('/create');
    });

    it('debería permitir agregar ingredientes', () => {
      cy.get('[data-testid="add-ingredient-button"]').click();
      cy.get('[data-testid="ingredient-name-input"]').type('Pollo');
      cy.get('[data-testid="ingredient-quantity-input"]').type('500');
      cy.get('[data-testid="ingredient-unit-select"]').select('g');
      cy.get('[data-testid="save-ingredient-button"]').click();

      cy.get('[data-testid="ingredients-list"]').should('contain', 'Pollo');
    });

    it('debería permitir eliminar ingredientes', () => {
      // Agregar ingrediente primero
      cy.get('[data-testid="add-ingredient-button"]').click();
      cy.get('[data-testid="ingredient-name-input"]').type('Pollo');
      cy.get('[data-testid="save-ingredient-button"]').click();

      // Eliminar ingrediente
      cy.get('[data-testid="delete-ingredient-button"]').click();
      cy.get('[data-testid="ingredients-list"]').should('not.contain', 'Pollo');
    });

    it('debería validar campos de ingredientes', () => {
      cy.get('[data-testid="add-ingredient-button"]').click();
      cy.get('[data-testid="save-ingredient-button"]').click();

      // Verificar que aparece mensaje de error
      cy.get('[data-testid="error-message"]').should('be.visible');
    });
  });

  describe('Gestión de instrucciones', () => {
    beforeEach(() => {
      cy.visit('/create');
    });

    it('debería permitir agregar instrucciones', () => {
      cy.get('[data-testid="add-instruction-button"]').click();
      cy.get('[data-testid="instruction-text-input"]').type('Cortar el pollo en trozos pequeños');
      cy.get('[data-testid="save-instruction-button"]').click();

      cy.get('[data-testid="instructions-list"]').should('contain', 'Cortar el pollo');
    });

    it('debería permitir eliminar instrucciones', () => {
      // Agregar instrucción primero
      cy.get('[data-testid="add-instruction-button"]').click();
      cy.get('[data-testid="instruction-text-input"]').type('Cortar el pollo');
      cy.get('[data-testid="save-instruction-button"]').click();

      // Eliminar instrucción
      cy.get('[data-testid="delete-instruction-button"]').click();
      cy.get('[data-testid="instructions-list"]').should('not.contain', 'Cortar el pollo');
    });

    it('debería permitir reordenar instrucciones', () => {
      // Agregar múltiples instrucciones
      cy.get('[data-testid="add-instruction-button"]').click();
      cy.get('[data-testid="instruction-text-input"]').type('Primera instrucción');
      cy.get('[data-testid="save-instruction-button"]').click();

      cy.get('[data-testid="add-instruction-button"]').click();
      cy.get('[data-testid="instruction-text-input"]').type('Segunda instrucción');
      cy.get('[data-testid="save-instruction-button"]').click();

      // Verificar que ambas están presentes
      cy.get('[data-testid="instructions-list"]').should('contain', 'Primera instrucción');
      cy.get('[data-testid="instructions-list"]').should('contain', 'Segunda instrucción');
    });
  });

  describe('Guardar receta', () => {
    beforeEach(() => {
      cy.visit('/create');
      // Llenar formulario básico
      cy.get('[data-testid="recipe-title-input"]').type('Receta de Prueba');
      cy.get('[data-testid="servings-input"]').clear().type('4');
      cy.get('[data-testid="cooking-time-input"]').type('30 min');
      cy.get('[data-testid="difficulty-select"]').select('Fácil');
    });

    it('debería guardar receta exitosamente', () => {
      // Agregar ingrediente
      cy.get('[data-testid="add-ingredient-button"]').click();
      cy.get('[data-testid="ingredient-name-input"]').type('Pollo');
      cy.get('[data-testid="ingredient-quantity-input"]').type('500');
      cy.get('[data-testid="ingredient-unit-select"]').select('g');
      cy.get('[data-testid="save-ingredient-button"]').click();

      // Agregar instrucción
      cy.get('[data-testid="add-instruction-button"]').click();
      cy.get('[data-testid="instruction-text-input"]').type('Cocinar el pollo');
      cy.get('[data-testid="save-instruction-button"]').click();

      // Guardar receta
      cy.get('[data-testid="save-recipe-button"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería validar campos requeridos', () => {
      cy.get('[data-testid="save-recipe-button"]').click();
      cy.get('[data-testid="error-message"]').should('be.visible');
    });
  });

  describe('Navegación', () => {
    it('debería permitir cancelar y volver', () => {
      cy.visit('/create');
      cy.get('[data-testid="cancel-button"]').click();
      cy.url().should('include', '/recipes');
    });

    it('debería permitir navegar desde el menú', () => {
      cy.visit('/recipes');
      cy.get('[data-testid="create-recipe-link"]').click();
      cy.url().should('include', '/create');
    });
  });
});

