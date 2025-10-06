// cypress/support/index.js

// Configuración adicional de Cypress

// Configurar timeouts globales
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 10000);
Cypress.config('responseTimeout', 10000);

// Configurar viewport por defecto
Cypress.config('viewportWidth', 1280);
Cypress.config('viewportHeight', 720);

// Configurar captura de videos y screenshots
Cypress.config('video', true);
Cypress.config('screenshotOnRunFailure', true);

// Configurar base URL
Cypress.config('baseUrl', 'http://localhost:3001');

// Configurar experimental features
Cypress.config('experimentalStudio', true);

