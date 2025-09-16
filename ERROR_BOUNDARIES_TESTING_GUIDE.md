# 🧪 Guía de Pruebas - Sistema de Error Boundaries

## 🚀 **Cómo Probar el Sistema**

### **1. 🌐 Acceso a la Página de Pruebas**

1. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

2. **Navega a la página de pruebas:**
   ```
   http://localhost:3000/test-error-boundaries
   ```

### **2. 🧪 Tests Disponibles**

#### **🔧 Test 1: Error Boundary de Componente**

- **Qué hace**: Prueba errores a nivel de componente individual
- **Cómo probar**:
  1. Haz clic en "💥 Lanzar Error en Componente"
  2. Observa el fallback UI minimalista
  3. Haz clic en "Retry" para recuperar
- **Resultado esperado**:
  - Fallback UI con icono de advertencia
  - Botón de retry funcional
  - Error loggeado en consola

#### **📄 Test 2: Error Boundary de Página**

- **Qué hace**: Prueba errores a nivel de página completa
- **Cómo probar**:
  1. Haz clic en "💥 Lanzar Error en Página"
  2. Observa el fallback UI de página
  3. Prueba los botones de navegación
- **Resultado esperado**:
  - Fallback UI con branding de Chef at Home
  - Botones: "Go Home", "Try Again", "Contact Support"
  - Error loggeado con contexto de página

#### **🚨 Test 3: Error Boundary Crítico**

- **Qué hace**: Prueba errores críticos del sistema
- **Cómo probar**:
  1. Haz clic en "💥 Lanzar Error Crítico"
  2. Observa el fallback UI crítico
  3. Prueba la funcionalidad de retry
- **Resultado esperado**:
  - Fallback UI con icono de explosión 💥
  - Título "Critical Error"
  - Opciones de recuperación avanzadas

#### **⚡ Test 4: Error de Promesas**

- **Qué hace**: Prueba el manejo de promesas rechazadas
- **Cómo probar**:
  1. Haz clic en "💥 Lanzar Error de Promesa"
  2. Observa el comportamiento asíncrono
  3. Revisa la consola para logs
- **Resultado esperado**:
  - Error capturado por el error boundary global
  - Log en consola con contexto completo

### **3. 🔍 Verificación de Funcionalidades**

#### **📊 Logging de Errores**

1. **Abre las herramientas de desarrollador** (F12)
2. **Ve a la pestaña Console**
3. **Lanza algunos errores** y observa:
   - Logs estructurados con contexto
   - Información del usuario y sesión
   - Stack traces completos

#### **💾 Persistencia en localStorage**

1. **Ve a la pestaña Application/Storage**
2. **Busca en localStorage**:
   - Claves que empiecen con `error_log_`
   - Datos JSON con información completa del error
3. **Verifica que se limpian automáticamente** después de 24 horas

#### **🔄 Funcionalidad de Retry**

1. **Lanza un error** en cualquier test
2. **Haz clic en "Try Again"**
3. **Verifica que**:
   - El componente se recupera
   - El contador de retry disminuye
   - Después de 3 intentos, el botón desaparece

#### **📧 Reporte de Errores**

1. **Lanza un error** en cualquier test
2. **Haz clic en "Report Error"**
3. **Verifica que**:
   - Se abre el cliente de email
   - El asunto incluye el ID del error
   - El cuerpo contiene información detallada

### **4. 🎯 Casos de Prueba Específicos**

#### **Caso 1: Error en Componente Individual**

```
1. Ve a Test 1 (Error Boundary de Componente)
2. Haz clic en "Lanzar Error en Componente"
3. Verifica que solo ese componente muestra el fallback
4. Haz clic en "Retry" y verifica la recuperación
```

#### **Caso 2: Error en Página Completa**

```
1. Ve a Test 2 (Error Boundary de Página)
2. Haz clic en "Lanzar Error en Página"
3. Verifica que toda la página muestra el fallback
4. Prueba la navegación con los botones
```

#### **Caso 3: Error Crítico**

```
1. Ve a Test 3 (Error Boundary Crítico)
2. Haz clic en "Lanzar Error Crítico"
3. Verifica el UI crítico con icono de explosión
4. Prueba todas las opciones de recuperación
```

#### **Caso 4: Error de Promesa**

```
1. Ve a Test 4 (Error de Promesas)
2. Haz clic en "Lanzar Error de Promesa"
3. Verifica que el error se captura globalmente
4. Revisa los logs en la consola
```

### **5. 🔧 Debugging Avanzado**

#### **Verificar Error Logger**

```javascript
// En la consola del navegador
console.log(errorLogger.getErrors());
console.log(errorLogger.exportErrors());
```

#### **Verificar User Actions**

```javascript
// En la consola del navegador
errorLogger.trackUserAction("Test action");
console.log(errorLogger.getErrors()[0].userActions);
```

#### **Limpiar Logs Manualmente**

```javascript
// En la consola del navegador
errorLogger.clearErrors();
localStorage.clear();
```

### **6. 📱 Pruebas en Diferentes Dispositivos**

#### **Desktop**

- Prueba todos los tests
- Verifica responsive design
- Revisa hover effects

#### **Mobile**

- Prueba en modo responsive
- Verifica touch interactions
- Revisa que los botones sean accesibles

### **7. 🚨 Casos Edge**

#### **Múltiples Errores Simultáneos**

```
1. Activa varios errores al mismo tiempo
2. Verifica que cada uno se maneja independientemente
3. Revisa que no hay conflictos en el logging
```

#### **Errores en Cascada**

```
1. Lanza un error en un componente
2. Desde el fallback, intenta lanzar otro error
3. Verifica que se maneja correctamente
```

#### **Recuperación Después de Múltiples Fallos**

```
1. Lanza un error y haz retry
2. Lanza otro error inmediatamente
3. Verifica que el contador de retry se resetea
```

### **8. ✅ Checklist de Verificación**

- [ ] **Error Boundary de Componente** funciona correctamente
- [ ] **Error Boundary de Página** funciona correctamente
- [ ] **Error Boundary Crítico** funciona correctamente
- [ ] **Error de Promesas** se captura globalmente
- [ ] **Logging** funciona en consola
- [ ] **Persistencia** en localStorage funciona
- [ ] **Retry functionality** funciona con límites
- [ ] **Reporte de errores** abre email correctamente
- [ ] **Cleanup automático** de logs funciona
- [ ] **User action tracking** funciona
- [ ] **Responsive design** funciona en mobile
- [ ] **Accessibility** es correcta

### **9. 🐛 Problemas Comunes y Soluciones**

#### **Error: "Try Again" no funciona**

- **Causa**: El componente sigue lanzando el error
- **Solución**: Verifica que el estado se resetea correctamente

#### **Error: Logs no aparecen en consola**

- **Causa**: Console está filtrado o cerrado
- **Solución**: Abre herramientas de desarrollador y verifica filtros

#### **Error: localStorage no funciona**

- **Causa**: Modo incógnito o localStorage deshabilitado
- **Solución**: Usa modo normal del navegador

#### **Error: Email no se abre**

- **Causa**: No hay cliente de email configurado
- **Solución**: Verifica que el sistema tiene un cliente de email

---

**🎉 ¡Disfruta probando el sistema de Error Boundaries!**

**📞 Si encuentras algún problema, revisa la consola y los logs para debugging.**
