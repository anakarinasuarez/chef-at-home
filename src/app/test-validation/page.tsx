"use client";

import { useState } from "react";
import { useToast } from "@/hooks";
import { 
  loginSchema, 
  registerSchema, 
  generateRecipeRequestSchema,
  safeValidateSchema, 
  getFirstZodError 
} from "@/schemas";

export default function TestValidationPage() {
  const { showSuccess, showError } = useToast();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLoginValidation = () => {
    addResult("Testing login validation...");
    
    // Test valid data
    const validLogin = { email: "test@example.com", password: "password123" };
    const validResult = safeValidateSchema(loginSchema, validLogin);
    if (validResult.success) {
      addResult("✅ Valid login data passed validation");
    } else {
      addResult("❌ Valid login data failed validation");
    }

    // Test invalid email
    const invalidEmail = { email: "invalid-email", password: "password123" };
    const emailResult = safeValidateSchema(loginSchema, invalidEmail);
    if (!emailResult.success) {
      addResult(`✅ Invalid email correctly rejected: ${getFirstZodError(emailResult.error)}`);
    } else {
      addResult("❌ Invalid email was accepted");
    }

    // Test short password
    const shortPassword = { email: "test@example.com", password: "123" };
    const passwordResult = safeValidateSchema(loginSchema, shortPassword);
    if (!passwordResult.success) {
      addResult(`✅ Short password correctly rejected: ${getFirstZodError(passwordResult.error)}`);
    } else {
      addResult("❌ Short password was accepted");
    }
  };

  const testRegisterValidation = () => {
    addResult("Testing register validation...");
    
    // Test valid data
    const validRegister = { 
      name: "John Doe", 
      email: "john@example.com", 
      password: "Password123" 
    };
    const validResult = safeValidateSchema(registerSchema, validRegister);
    if (validResult.success) {
      addResult("✅ Valid register data passed validation");
    } else {
      addResult("❌ Valid register data failed validation");
    }

    // Test invalid name (numbers)
    const invalidName = { 
      name: "John123", 
      email: "john@example.com", 
      password: "Password123" 
    };
    const nameResult = safeValidateSchema(registerSchema, invalidName);
    if (!nameResult.success) {
      addResult(`✅ Invalid name correctly rejected: ${getFirstZodError(nameResult.error)}`);
    } else {
      addResult("❌ Invalid name was accepted");
    }

    // Test weak password
    const weakPassword = { 
      name: "John Doe", 
      email: "john@example.com", 
      password: "password" 
    };
    const passwordResult = safeValidateSchema(registerSchema, weakPassword);
    if (!passwordResult.success) {
      addResult(`✅ Weak password correctly rejected: ${getFirstZodError(passwordResult.error)}`);
    } else {
      addResult("❌ Weak password was accepted");
    }
  };

  const testRecipeGenerationValidation = () => {
    addResult("Testing recipe generation validation...");
    
    // Test valid data
    const validRecipe = {
      ingredients: ["chicken", "rice", "vegetables"],
      servings: 4,
      cuisine: "Asian",
      count: 2,
      title: "Delicious Chicken Rice"
    };
    const validResult = safeValidateSchema(generateRecipeRequestSchema, validRecipe);
    if (validResult.success) {
      addResult("✅ Valid recipe data passed validation");
    } else {
      addResult("❌ Valid recipe data failed validation");
    }

    // Test empty ingredients
    const emptyIngredients = {
      ingredients: [],
      servings: 4,
      cuisine: "Asian",
      count: 1
    };
    const ingredientsResult = safeValidateSchema(generateRecipeRequestSchema, emptyIngredients);
    if (!ingredientsResult.success) {
      addResult(`✅ Empty ingredients correctly rejected: ${getFirstZodError(ingredientsResult.error)}`);
    } else {
      addResult("❌ Empty ingredients was accepted");
    }

    // Test too many ingredients
    const tooManyIngredients = {
      ingredients: Array(25).fill("ingredient"),
      servings: 4,
      cuisine: "Asian",
      count: 1
    };
    const manyResult = safeValidateSchema(generateRecipeRequestSchema, tooManyIngredients);
    if (!manyResult.success) {
      addResult(`✅ Too many ingredients correctly rejected: ${getFirstZodError(manyResult.error)}`);
    } else {
      addResult("❌ Too many ingredients was accepted");
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Zod Validation Testing</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Login Validation</h2>
            <button
              onClick={testLoginValidation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Test Login Schema
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Register Validation</h2>
            <button
              onClick={testRegisterValidation}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Test Register Schema
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recipe Generation</h2>
            <button
              onClick={testRecipeGenerationValidation}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Test Recipe Schema
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Clear Results
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click a test button above.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Validation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Login Schema:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Email format validation</li>
                <li>• Password minimum 6 characters</li>
                <li>• Required field validation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Register Schema:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Name: letters and spaces only</li>
                <li>• Strong password requirements</li>
                <li>• Email format validation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recipe Schema:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 1-20 ingredients required</li>
                <li>• Servings: 1-20 range</li>
                <li>• Count: 1-5 recipes max</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">API Integration:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Server-side validation</li>
                <li>• Client-side validation</li>
                <li>• Error message formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
