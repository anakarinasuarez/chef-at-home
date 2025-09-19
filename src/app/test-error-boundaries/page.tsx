"use client";

import React, { useState } from "react";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { ErrorBoundaryAdvanced } from "@/components/ErrorBoundaryAdvanced";
import Button from "@/components/Button";
import { colors } from "@/design-system";

// Componente que puede lanzar errores
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("¡Error intencional para probar Error Boundaries!");
  }
  return (
    <div className="text-green-500">
      ✅ Componente funcionando correctamente
    </div>
  );
};

// Componente que puede lanzar errores de promesa
const PromiseErrorComponent = ({ shouldReject }: { shouldReject: boolean }) => {
  const [result, setResult] = useState<string>("");

  const handleAsyncError = async () => {
    if (shouldReject) {
      // Simular una promesa rechazada
      Promise.reject(new Error("¡Promesa rechazada!"));
    } else {
      setResult("✅ Promesa resuelta correctamente");
    }
  };

  return (
    <div>
      <Button onClick={handleAsyncError} variant="secondary" className="mb-4">
        {shouldReject ? "Lanzar Error de Promesa" : "Ejecutar Promesa Correcta"}
      </Button>
      {result && <div className="text-green-500">{result}</div>}
    </div>
  );
};

export default function TestErrorBoundariesPage() {
  const [componentError, setComponentError] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [criticalError, setCriticalError] = useState(false);
  const [promiseError, setPromiseError] = useState(false);

  const resetAll = () => {
    setComponentError(false);
    setPageError(false);
    setCriticalError(false);
    setPromiseError(false);
  };

  return (
    <PageErrorBoundary pageName="Test Error Boundaries">
      <div
        className="min-h-screen p-8"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: colors.interface.text.primary }}
          >
            🧪 Prueba de Error Boundaries
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test 1: Error Boundary de Componente */}
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.interface.text.primary }}
              >
                🔧 Error Boundary de Componente
              </h2>
              <p
                className="mb-4 text-sm"
                style={{ color: colors.interface.text.secondary }}
              >
                Prueba el manejo de errores a nivel de componente individual.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => setComponentError(!componentError)}
                  variant={componentError ? "secondary" : "primary"}
                  className="w-full"
                >
                  {componentError
                    ? "✅ Resetear Componente"
                    : "💥 Lanzar Error en Componente"}
                </Button>

                <ErrorBoundaryAdvanced
                  level="component"
                  errorBoundaryName="TestComponent"
                  allowRetry={true}
                  showDetails={true}
                >
                  <ErrorThrowingComponent shouldThrow={componentError} />
                </ErrorBoundaryAdvanced>
              </div>
            </div>

            {/* Test 2: Error Boundary de Página */}
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.interface.text.primary }}
              >
                📄 Error Boundary de Página
              </h2>
              <p
                className="mb-4 text-sm"
                style={{ color: colors.interface.text.secondary }}
              >
                Prueba el manejo de errores a nivel de página completa.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => setPageError(!pageError)}
                  variant={pageError ? "secondary" : "primary"}
                  className="w-full"
                >
                  {pageError
                    ? "✅ Resetear Página"
                    : "💥 Lanzar Error en Página"}
                </Button>

                <ErrorBoundaryAdvanced
                  level="page"
                  errorBoundaryName="TestPage"
                  allowRetry={true}
                  showDetails={true}
                >
                  <ErrorThrowingComponent shouldThrow={pageError} />
                </ErrorBoundaryAdvanced>
              </div>
            </div>

            {/* Test 3: Error Boundary Crítico */}
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.interface.text.primary }}
              >
                🚨 Error Boundary Crítico
              </h2>
              <p
                className="mb-4 text-sm"
                style={{ color: colors.interface.text.secondary }}
              >
                Prueba el manejo de errores críticos del sistema.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => setCriticalError(!criticalError)}
                  variant={criticalError ? "secondary" : "primary"}
                  className="w-full"
                >
                  {criticalError
                    ? "✅ Resetear Crítico"
                    : "💥 Lanzar Error Crítico"}
                </Button>

                <ErrorBoundaryAdvanced
                  level="critical"
                  errorBoundaryName="TestCritical"
                  allowRetry={true}
                  showDetails={true}
                >
                  <ErrorThrowingComponent shouldThrow={criticalError} />
                </ErrorBoundaryAdvanced>
              </div>
            </div>

            {/* Test 4: Error de Promesas */}
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.interface.text.primary }}
              >
                ⚡ Error de Promesas
              </h2>
              <p
                className="mb-4 text-sm"
                style={{ color: colors.interface.text.secondary }}
              >
                Prueba el manejo de promesas rechazadas.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => setPromiseError(!promiseError)}
                  variant={promiseError ? "secondary" : "primary"}
                  className="w-full"
                >
                  {promiseError
                    ? "✅ Resetear Promesa"
                    : "💥 Lanzar Error de Promesa"}
                </Button>

                <PromiseErrorComponent shouldReject={promiseError} />
              </div>
            </div>
          </div>

          {/* Botón de Reset Global */}
          <div className="mt-8 text-center">
            <Button
              onClick={resetAll}
              variant="secondary"
              className="px-8 py-3"
            >
              🔄 Resetear Todos los Tests
            </Button>
          </div>

          {/* Información de Debugging */}
          <div
            className="mt-8 p-6 rounded-lg"
            style={{
              backgroundColor: colors.interface.background.secondary,
              borderColor: colors.interface.border.light,
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              🔍 Información de Debugging
            </h3>
            <div
              className="text-sm space-y-2"
              style={{ color: colors.interface.text.secondary }}
            >
              <p>
                • <strong>Component Error:</strong>{" "}
                {componentError ? "❌ Activo" : "✅ Inactivo"}
              </p>
              <p>
                • <strong>Page Error:</strong>{" "}
                {pageError ? "❌ Activo" : "✅ Inactivo"}
              </p>
              <p>
                • <strong>Critical Error:</strong>{" "}
                {criticalError ? "❌ Activo" : "✅ Inactivo"}
              </p>
              <p>
                • <strong>Promise Error:</strong>{" "}
                {promiseError ? "❌ Activo" : "✅ Inactivo"}
              </p>
            </div>
            <div
              className="mt-4 text-xs"
              style={{ color: colors.interface.text.tertiary }}
            >
              <p>
                💡 <strong>Tip:</strong> Abre las herramientas de desarrollador
                (F12) para ver los logs de errores en la consola.
              </p>
              <p>
                📊 <strong>Logging:</strong> Los errores se guardan
                automáticamente en localStorage para debugging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  );
}
