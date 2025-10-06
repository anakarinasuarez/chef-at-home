// cypress/e2e/my-recipes.cy.js

describe('Mis Recetas', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.loginUser();
  });

  describe('Página de mis recetas', () => {
    it('debería mostrar la página de mis recetas', () => {
      cy.visit('/my-recipes');
      cy.get('h1').should('contain', 'Mis Recetas');
    });

    it('debería mostrar estado vacío cuando no hay recetas guardadas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="empty-state"]').should('contain', 'No tienes recetas guardadas');
    });
  });

  describe('Guardar y gestionar recetas', () => {
    beforeEach(() => {
      // Generar y guardar una receta
      cy.generateRecipes(['pollo', 'arroz']);
      cy.get('[data-testid="save-recipe-button"]').first().click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería mostrar recetas guardadas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').should('have.length.at.least', 1);
    });

    it('debería permitir eliminar recetas guardadas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="delete-button"]').click();
        });

      // Confirmar eliminación
      cy.get('[data-testid="confirm-delete-button"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('debería permitir editar recetas guardadas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

      cy.url().should('include', '/create');
      cy.get('[data-testid="recipe-title-input"]').should('have.value');
    });

    it('debería mostrar detalles de recetas guardadas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').first().click();
      cy.url().should('include', '/recipes/');
      cy.get('[data-testid="recipe-details"]').should('be.visible');
    });
  });

  describe('Navegación', () => {
    it('debería navegar desde el menú principal', () => {
      cy.visit('/recipes');
      cy.get('[data-testid="my-recipes-link"]').click();
      cy.url().should('include', '/my-recipes');
    });

    it('debería volver a la página principal', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="back-button"]').click();
      cy.url().should('include', '/recipes');
    });
  });

  describe('Filtros y búsqueda', () => {
    beforeEach(() => {
      // Guardar múltiples recetas
      cy.generateRecipes(['pollo', 'arroz']);
      cy.get('[data-testid="save-recipe-button"]').first().click();

      cy.generateRecipes(['pasta', 'tomate']);
      cy.get('[data-testid="save-recipe-button"]').first().click();
    });

    it('debería permitir buscar recetas', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="search-input"]').type('pollo');
      cy.get('[data-testid="saved-recipe-card"]').should('contain', 'pollo');
    });

    it('debería permitir filtrar por dificultad', () => {
      cy.visit('/my-recipes');
      cy.get('[data-testid="difficulty-filter"]').select('Fácil');
      cy.get('[data-testid="saved-recipe-card"]').should('be.visible');
    });
  });

  describe('Responsive design', () => {
    it('debería funcionar en móvil', () => {
      cy.setViewport('mobile');
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').should('be.visible');
    });

    it('debería funcionar en tablet', () => {
      cy.setViewport('tablet');
      cy.visit('/my-recipes');
      cy.get('[data-testid="saved-recipe-card"]').should('be.visible');
    });
  });
});

