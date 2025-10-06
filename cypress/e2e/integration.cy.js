// cypress/e2e/integration.cy.js

describe('Flujo Completo de Usuario', () => {
  beforeEach(() => {
    cy.clearAppData();
  });

  it('debería completar el flujo completo: registro → login → generar recetas → guardar → gestionar', () => {
    // 1. Registro de usuario
    cy.registerUser('nuevousuario@chefathome.com', 'TestPassword123!');
    cy.url().should('include', '/recipes');

    // 2. Generar recetas
    cy.generateRecipes(['pollo', 'arroz', 'vegetales']);
    cy.get('[data-testid="recipe-card"]').should('have.length.at.least', 1);

    // 3. Guardar una receta
    cy.get('[data-testid="save-recipe-button"]').first().click();
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 4. Ver detalles de la receta
    cy.get('[data-testid="recipe-card"]').first().click();
    cy.url().should('include', '/recipes/');
    cy.get('[data-testid="recipe-details"]').should('be.visible');

    // 5. Volver a la lista
    cy.go('back');
    cy.url().should('include', '/recipes');

    // 6. Ir a mis recetas
    cy.get('[data-testid="my-recipes-link"]').click();
    cy.url().should('include', '/my-recipes');
    cy.get('[data-testid="saved-recipe-card"]').should('have.length.at.least', 1);

    // 7. Crear una nueva receta manualmente
    cy.get('[data-testid="create-recipe-link"]').click();
    cy.url().should('include', '/create');

    // Llenar formulario
    cy.get('[data-testid="recipe-title-input"]').type('Mi Receta Personalizada');
    cy.get('[data-testid="servings-input"]').clear().type('6');
    cy.get('[data-testid="cooking-time-input"]').type('45 min');
    cy.get('[data-testid="difficulty-select"]').select('Medio');

    // Agregar ingrediente
    cy.get('[data-testid="add-ingredient-button"]').click();
    cy.get('[data-testid="ingredient-name-input"]').type('Pasta');
    cy.get('[data-testid="ingredient-quantity-input"]').type('300');
    cy.get('[data-testid="ingredient-unit-select"]').select('g');
    cy.get('[data-testid="save-ingredient-button"]').click();

    // Agregar instrucción
    cy.get('[data-testid="add-instruction-button"]').click();
    cy.get('[data-testid="instruction-text-input"]').type('Hervir la pasta en agua salada');
    cy.get('[data-testid="save-instruction-button"]').click();

    // Guardar receta
    cy.get('[data-testid="save-recipe-button"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 8. Verificar que aparece en mis recetas
    cy.get('[data-testid="my-recipes-link"]').click();
    cy.get('[data-testid="saved-recipe-card"]').should('contain', 'Mi Receta Personalizada');

    // 9. Logout
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/auth/login');

    // 10. Login nuevamente
    cy.loginUser('nuevousuario@chefathome.com', 'TestPassword123!');
    cy.url().should('include', '/recipes');

    // 11. Verificar que las recetas siguen ahí
    cy.get('[data-testid="my-recipes-link"]').click();
    cy.get('[data-testid="saved-recipe-card"]').should('have.length.at.least', 2);
  });

  it('debería manejar errores de manera elegante', () => {
    // Simular error de red
    cy.intercept('POST', '**/api/recipes/generate', { statusCode: 500 }).as('generateError');

    cy.loginUser();
    cy.visit('/recipes');
    cy.get('[data-testid="ingredients-input"]').type('pollo, arroz');
    cy.get('[data-testid="generate-button"]').click();

    // Verificar que aparece mensaje de error
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('debería funcionar correctamente en diferentes dispositivos', () => {
    cy.loginUser();

    // Desktop
    cy.setViewport('desktop');
    cy.visit('/recipes');
    cy.get('[data-testid="ingredients-input"]').should('be.visible');

    // Tablet
    cy.setViewport('tablet');
    cy.visit('/recipes');
    cy.get('[data-testid="ingredients-input"]').should('be.visible');

    // Mobile
    cy.setViewport('mobile');
    cy.visit('/recipes');
    cy.get('[data-testid="ingredients-input"]').should('be.visible');
  });
});

