// cypress/e2e/recipes.cy.js

describe('Generación de Recetas', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.loginUser();
  });

  describe('Página principal de recetas', () => {
    it('debería mostrar la página de recetas', () => {
      cy.visit('/recipes');
      cy.get('h1').should('contain', 'Recetas');
      cy.get('[data-testid="ingredients-input"]').should('be.visible');
      cy.get('[data-testid="servings-input"]').should('be.visible');
      cy.get('[data-testid="generate-button"]').should('be.visible');
    });

    it('debería mostrar el estado vacío inicialmente', () => {
      cy.visit('/recipes');
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="empty-state"]').should('contain', 'Ingresa ingredientes');
    });
  });

  describe('Generación de recetas', () => {
    it('debería generar recetas con ingredientes válidos', () => {
      cy.generateRecipes(['pollo', 'arroz', 'vegetales']);

      // Verificar que aparecen las recetas
      cy.get('[data-testid="recipe-card"]').should('have.length.at.least', 1);
      cy.get('[data-testid="recipe-title"]').should('be.visible');
      cy.get('[data-testid="recipe-image"]').should('be.visible');
    });

    it('debería mostrar loading durante la generación', () => {
      cy.visit('/recipes');
      cy.get('[data-testid="ingredients-input"]').type('pollo, arroz');
      cy.get('[data-testid="generate-button"]').click();

      // Verificar que aparece el loading
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
    });

    it('debería validar campos requeridos', () => {
      cy.visit('/recipes');
      cy.get('[data-testid="generate-button"]').click();

      // Verificar que aparece mensaje de error
      cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('debería permitir cambiar el número de porciones', () => {
      cy.visit('/recipes');
      cy.get('[data-testid="servings-input"]').clear().type('6');
      cy.get('[data-testid="servings-input"]').should('have.value', '6');
    });
  });

  describe('Interacción con recetas', () => {
    beforeEach(() => {
      cy.generateRecipes(['pollo', 'arroz']);
    });

    it('debería mostrar detalles de la receta al hacer click', () => {
      cy.get('[data-testid="recipe-card"]').first().click();
      cy.url().should('include', '/recipes/');
      cy.get('[data-testid="recipe-details"]').should('be.visible');
    });

    it('debería permitir guardar recetas', () => {
      cy.get('[data-testid="save-recipe-button"]').first().click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería mostrar ingredientes e instrucciones', () => {
      cy.get('[data-testid="recipe-card"]').first().click();
      cy.get('[data-testid="ingredients-list"]').should('be.visible');
      cy.get('[data-testid="instructions-list"]').should('be.visible');
    });
  });

  describe('Navegación entre recetas', () => {
    beforeEach(() => {
      cy.generateRecipes(['pollo', 'arroz', 'vegetales']);
    });

    it('debería permitir navegar entre recetas', () => {
      cy.get('[data-testid="recipe-card"]').should('have.length.at.least', 2);

      // Hacer click en diferentes recetas
      cy.get('[data-testid="recipe-card"]').eq(0).click();
      cy.url().should('include', '/recipes/');

      cy.go('back');
      cy.get('[data-testid="recipe-card"]').eq(1).click();
      cy.url().should('include', '/recipes/');
    });
  });

  describe('Responsive design', () => {
    it('debería funcionar en móvil', () => {
      cy.setViewport('mobile');
      cy.visit('/recipes');
      cy.get('[data-testid="ingredients-input"]').should('be.visible');
      cy.get('[data-testid="generate-button"]').should('be.visible');
    });

    it('debería funcionar en tablet', () => {
      cy.setViewport('tablet');
      cy.visit('/recipes');
      cy.get('[data-testid="ingredients-input"]').should('be.visible');
      cy.get('[data-testid="generate-button"]').should('be.visible');
    });
  });
});

