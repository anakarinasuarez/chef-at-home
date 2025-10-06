// cypress/support/commands.js

// Comandos personalizados para Chef at Home

// Comando para limpiar localStorage
Cypress.Commands.add('clearAppData', () => {
  cy.window().then(win => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

// Comando para verificar que no hay errores en consola
Cypress.Commands.add('checkConsoleErrors', () => {
  cy.window().then(win => {
    const errors = win.console.error;
    expect(errors).to.not.be.called;
  });
});

// Comando para esperar que las imágenes carguen
Cypress.Commands.add('waitForImages', () => {
  cy.get('img').each($img => {
    cy.wrap($img).should('be.visible');
    cy.wrap($img).should($el => {
      expect($el[0].complete).to.be.true;
    });
  });
});

// Comando para verificar accesibilidad básica
Cypress.Commands.add('checkAccessibility', () => {
  cy.get('main, [role="main"]').should('exist');
  cy.get('h1, h2, h3').should('exist');
  cy.get('button, [role="button"]').should('have.attr', 'aria-label').or('contain.text');
});

// Comando para simular scroll
Cypress.Commands.add('scrollToElement', selector => {
  cy.get(selector).scrollIntoView();
  cy.get(selector).should('be.visible');
});

// Comando para verificar responsive design
Cypress.Commands.add('checkResponsive', () => {
  // Mobile
  cy.viewport(375, 667);
  cy.get('body').should('be.visible');

  // Tablet
  cy.viewport(768, 1024);
  cy.get('body').should('be.visible');

  // Desktop
  cy.viewport(1280, 720);
  cy.get('body').should('be.visible');
});

// Comando para verificar performance básica
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then(win => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0];

    // Verificar que la página carga en menos de 3 segundos
    expect(navigation.loadEventEnd - navigation.loadEventStart).to.be.lessThan(3000);
  });
});

// Comando para generar recetas
Cypress.Commands.add('generateRecipes', ingredients => {
  cy.visit('/create');

  // Ingresar ingredientes
  ingredients.forEach(ingredient => {
    cy.get('[data-testid="ingredient-input"]').type(ingredient);
    cy.get('[data-testid="add-ingredient-button"]').click();
  });

  // Generar recetas
  cy.get('[data-testid="create-recipe-button"]').click();

  // Esperar a que se generen
  cy.get('[data-testid="recipe-card"]').should('be.visible');
});

// Comando para login de usuario
Cypress.Commands.add('loginUser', () => {
  cy.visit('/auth/login');
  cy.get('[data-testid="email-input"]').type('test@example.com');
  cy.get('[data-testid="password-input"]').type('password123');
  cy.get('[data-testid="login-button"]').click();

  // Esperar a que se complete el login
  cy.url().should('not.include', '/auth/login');
});

// Comando para verificar que estamos en modo edición
Cypress.Commands.add('verifyEditMode', () => {
  cy.url().should('include', '/create');
  cy.get('[data-testid="create-recipe-button"]').should('contain', 'Update Recipe');
});

// Comando para verificar que se generó solo 1 receta en modo edición
Cypress.Commands.add('verifySingleRecipeGenerated', () => {
  cy.url().should('include', '/recipes');
  cy.url().should('include', 'editMode=true');
  cy.url().should('include', 'count=1');
  cy.get('[data-testid="recipe-card"]').should('have.length', 1);
});

// Comando para verificar que la card desaparece al guardar
Cypress.Commands.add('verifyCardDisappears', () => {
  cy.get('[data-testid="recipe-card"]').should('not.exist');
  cy.get('[data-testid="success-message"]').should('be.visible');
});

// Comando para verificar que no se genera nueva receta (solo actualización)
Cypress.Commands.add('verifyNoNewRecipeGenerated', () => {
  cy.url().should('not.include', '/recipes');
  cy.url().should('include', '/my-recipes');
  cy.get('[data-testid="success-message"]').should('be.visible');
});
