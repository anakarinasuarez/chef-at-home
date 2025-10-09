/**
 * Test script for session limits functionality
 * Run this in the browser console to test the session limits
 */

// Test function to verify session limits
function testSessionLimits() {
  console.log('🧪 Testing Session Limits...');

  // Import the session limits manager
  const { sessionLimitsManager } = require('@/lib/sessionLimits');

  const testUserId = 'test-user-123';

  console.log('1. Testing initial state...');
  console.log('Can generate recipe:', sessionLimitsManager.canGenerateRecipe(testUserId));
  console.log('Remaining recipes:', sessionLimitsManager.getRemainingRecipes(testUserId));

  console.log('2. Recording first recipe generation...');
  const recorded1 = sessionLimitsManager.recordRecipeGeneration(testUserId);
  console.log('First recipe recorded:', recorded1);
  console.log(
    'Can generate recipe after first:',
    sessionLimitsManager.canGenerateRecipe(testUserId)
  );
  console.log(
    'Remaining recipes after first:',
    sessionLimitsManager.getRemainingRecipes(testUserId)
  );

  console.log('3. Attempting second recipe generation...');
  const recorded2 = sessionLimitsManager.recordRecipeGeneration(testUserId);
  console.log('Second recipe recorded:', recorded2);
  console.log(
    'Can generate recipe after second:',
    sessionLimitsManager.canGenerateRecipe(testUserId)
  );
  console.log(
    'Remaining recipes after second:',
    sessionLimitsManager.getRemainingRecipes(testUserId)
  );

  console.log('4. Resetting session...');
  sessionLimitsManager.resetSession(testUserId);
  console.log(
    'Can generate recipe after reset:',
    sessionLimitsManager.canGenerateRecipe(testUserId)
  );
  console.log(
    'Remaining recipes after reset:',
    sessionLimitsManager.getRemainingRecipes(testUserId)
  );

  console.log('✅ Session limits test completed!');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testSessionLimits = testSessionLimits;
  console.log('🔧 Test function available as window.testSessionLimits()');
}

export { testSessionLimits };
