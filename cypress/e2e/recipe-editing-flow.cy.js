// cypress/e2e/recipe-editing-flow.cy.js

describe('Flujo de Edición de Recetas', () => {
  beforeEach(() => {
    cy.clearAppData();
    // Login
    cy.visit('/auth/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Esperar a que se complete el login
    cy.url().should('not.include', '/auth/login');
  });

  it('debería completar el flujo básico de creación y edición', () => {
    // 1. Crear una receta inicial
    cy.visit('/create');

    // Buscar el input de ingredientes (puede ser cualquier input)
    cy.get('input').first().type('pollo');

    // Buscar el botón de agregar (cualquier botón que contenga "Agregar" o "+")
    cy.get('button').contains('Agregar').click();

    // Agregar otro ingrediente
    cy.get('input').first().type('arroz');
    cy.get('button').contains('Agregar').click();

    // Generar recetas
    cy.get('button').contains('Crear').click();

    // Esperar a que se generen las recetas
    cy.url().should('include', '/recipes');

    // Guardar la primera receta
    cy.get('button').contains('Guardar').first().click();

    // Esperar a que se guarde
    cy.wait(2000);

    // 2. Ir a My Recipes
    cy.visit('/my-recipes');

    // Verificar que hay una receta guardada
    cy.get('body').should('contain', 'pollo');

    // 3. Editar la receta
    cy.get('button').contains('Editar').first().click();

    // Verificar que estamos en modo edición
    cy.url().should('include', '/create');

    // 4. Cambiar ingredientes (agregar nuevo)
    cy.get('input').first().type('tomate');
    cy.get('button').contains('Agregar').click();

    // 5. Verificar que el botón cambia a "Update Recipe"
    cy.get('button').contains('Update').should('exist');

    // 6. Guardar cambios
    cy.get('button').contains('Update').click();

    // 7. Verificar que se genera solo 1 receta nueva
    cy.url().should('include', '/recipes');
    cy.url().should('include', 'editMode=true');
    cy.url().should('include', 'count=1');

    // 8. Guardar la nueva receta desde la card
    cy.get('button').contains('Guardar').first().click();

    // 9. Verificar que se muestra mensaje de éxito
    cy.get('body').should('contain', 'success');

    // 10. Ir a My Recipes y verificar que se actualizó
    cy.visit('/my-recipes');
    cy.get('body').should('contain', 'tomate');
  });

  it('debería poder cambiar solo las porciones sin generar nueva receta', () => {
    // Primero crear y guardar una receta
    cy.visit('/create');
    cy.get('input').first().type('pollo');
    cy.get('button').contains('Agregar').click();
    cy.get('button').contains('Crear').click();

    cy.url().should('include', '/recipes');
    cy.get('button').contains('Guardar').first().click();
    cy.wait(2000);

    // Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('button').contains('Editar').first().click();

    // Cambiar solo las porciones
    cy.get('select').first().select('4');

    // Verificar que el botón dice "Update Recipe"
    cy.get('button').contains('Update').should('exist');

    // Guardar cambios
    cy.get('button').contains('Update').click();

    // Verificar que NO se genera nueva receta (solo se actualiza)
    cy.url().should('not.include', '/recipes');
    cy.url().should('include', '/my-recipes');

    // Verificar que se muestra mensaje de éxito
    cy.get('body').should('contain', 'success');
  });

  it('debería poder cambiar solo el título sin generar nueva receta', () => {
    // Primero crear y guardar una receta
    cy.visit('/create');
    cy.get('input').first().type('pollo');
    cy.get('button').contains('Agregar').click();
    cy.get('button').contains('Crear').click();

    cy.url().should('include', '/recipes');
    cy.get('button').contains('Guardar').first().click();
    cy.wait(2000);

    // Ir a My Recipes y editar
    cy.visit('/my-recipes');
    cy.get('button').contains('Editar').first().click();

    // Cambiar solo el título
    cy.get('input[type="text"]').first().clear().type('Mi Receta Personalizada');

    // Verificar que el botón dice "Update Recipe"
    cy.get('button').contains('Update').should('exist');

    // Guardar cambios
    cy.get('button').contains('Update').click();

    // Verificar que NO se genera nueva receta (solo se actualiza)
    cy.url().should('not.include', '/recipes');
    cy.url().should('include', '/my-recipes');

    // Verificar que se muestra mensaje de éxito
    cy.get('body').should('contain', 'success');

    // Verificar que el título se actualizó
    cy.get('body').should('contain', 'Mi Receta Personalizada');
  });
});
