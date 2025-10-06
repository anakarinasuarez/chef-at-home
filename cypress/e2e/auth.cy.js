// cypress/e2e/auth.cy.js

describe('Autenticación', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit('/');
  });

  describe('Login', () => {
    it('debería mostrar la página de login', () => {
      cy.visit('/auth/login');
      cy.get('h1').should('contain', 'Welcome back chef');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('debería hacer login exitosamente', () => {
      cy.visit('/auth/login');
      cy.get('[data-testid="email-input"]').type('test@chefathome.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');

      // Verificar que el interceptor está funcionando
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('[data-testid="login-button"]').click();

      // Esperar a que se haga la llamada
      cy.wait('@loginRequest').then(interception => {
        console.log('Login request intercepted:', interception);
      });

      cy.url().should('include', '/recipes');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('debería mostrar error con credenciales inválidas', () => {
      cy.visit('/auth/login');

      // Interceptar con respuesta de error
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          error: 'Invalid email or password',
        },
      }).as('loginError');

      cy.get('[data-testid="email-input"]').type('invalid@email.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();

      // Verificar que aparece un mensaje de error
      cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('debería validar campos requeridos', () => {
      cy.visit('/auth/login');
      cy.get('[data-testid="login-button"]').click();

      // Verificar validaciones
      cy.get('[data-testid="email-input"]').should('have.attr', 'required');
      cy.get('[data-testid="password-input"]').should('have.attr', 'required');
    });
  });

  describe('Registro', () => {
    it('debería mostrar la página de registro', () => {
      cy.visit('/auth/signup');
      cy.get('h1').should('contain', 'Join our community');
      cy.get('[data-testid="name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirm-password-input"]').should('be.visible');
      cy.get('[data-testid="signup-button"]').should('be.visible');
    });

    it('debería registrar usuario exitosamente', () => {
      cy.visit('/auth/signup');
      cy.get('[data-testid="name-input"]').type('Nuevo Usuario');
      cy.get('[data-testid="email-input"]').type('newuser@chefathome.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');

      // Verificar que el interceptor está funcionando
      cy.intercept('POST', '**/api/auth/register').as('registerRequest');

      cy.get('[data-testid="signup-button"]').click();

      // Esperar a que se haga la llamada
      cy.wait('@registerRequest').then(interception => {
        console.log('Register request intercepted:', interception);
      });

      cy.url().should('include', '/recipes');

      // Esperar a que el usuario se establezca en el store
      cy.wait(1000);

      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('debería validar que las contraseñas coincidan', () => {
      cy.visit('/auth/signup');
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('different123');
      cy.get('[data-testid="signup-button"]').click();

      // Verificar mensaje de error
      cy.get('[data-testid="error-message"]').should('be.visible');
    });
  });

  describe('Logout', () => {
    it('debería hacer logout exitosamente', () => {
      cy.loginUser();
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Navegación de autenticación', () => {
    it('debería redirigir a login cuando no está autenticado', () => {
      cy.visit('/recipes');
      cy.url().should('include', '/auth/login');
    });

    it('debería redirigir a recipes después del login', () => {
      cy.loginUser();
      cy.url().should('include', '/recipes');
    });
  });
});
