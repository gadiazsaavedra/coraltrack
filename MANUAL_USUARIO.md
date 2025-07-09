# Manual de Usuario - CoralTrack PWA

## 🐠 ¿Qué es CoralTrack?

CoralTrack es una aplicación web progresiva (PWA) diseñada específicamente para aficionados a los acuarios de arrecife. Te permite registrar, visualizar y analizar los parámetros del agua de tu acuario, además de realizar un seguimiento fotográfico del crecimiento de tus corales.

## 📱 Características Principales

### ✅ 100% Mobile-First
- Diseñada para dispositivos móviles
- Interfaz táctil optimizada
- Responsive en todos los tamaños de pantalla

### ✅ PWA (Progressive Web App)
- Funciona offline una vez cargada
- Instalable en tu dispositivo como app nativa
- Sin necesidad de descargar desde app store

### ✅ Almacenamiento Local
- Todos los datos se guardan en tu dispositivo
- No requiere conexión a internet para funcionar
- Privacidad total de tus datos

## 🧪 Módulo 1: Registro y Visualización de Parámetros

### Parámetros que puedes registrar:

1. **Fecha de Medición** - Selector de fecha (por defecto día actual)
2. **Densidad (Salinidad)** - Ejemplo: 1.025
3. **KH (Alcalinidad)** - Ejemplo: 8.5
4. **Calcio (Ca)** - En ppm, ejemplo: 420
5. **Magnesio (Mg)** - En ppm, ejemplo: 1350
6. **Nitratos (NO₃)** - En ppm, ejemplo: 5
7. **Fosfatos (PO₄)** - En ppm, ejemplo: 0.03
8. **Temperatura** - En °C, ejemplo: 25.5
9. **Notas** - Campo de texto libre para observaciones

### Cómo registrar parámetros:

1. **Abrir la app** → Pestaña "Parámetros" (activa por defecto)
2. **Completar el formulario** con los valores medidos
3. **Agregar notas** (opcional) como:
   - "Aparición de algas"
   - "Coloración intensa en corales"
   - "Cambio de sal realizado"
4. **Tocar "Guardar Medición"**
5. **Ver resultados** inmediatamente en gráficos e historial

### Visualización de Datos:

#### 📊 Gráficos Individuales
- **7 gráficos separados** (uno por parámetro)
- **Tipo:** Gráficos de línea interactivos
- **Eje X:** Fechas de medición
- **Eje Y:** Valores del parámetro
- **Tooltips:** Toca cualquier punto para ver fecha exacta y valor
- **Actualización automática** con cada nueva medición

#### 📋 Historial Completo
- **Lista ordenada** por fecha (más reciente primero)
- **Todos los parámetros** de cada medición
- **Notas incluidas** para cada entrada
- **Formato legible** con unidades de medida

## 📸 Módulo 2: Galería de Seguimiento de Corales

### Especies Disponibles:
- **Pachyclavularia** (pestaña dedicada)
- **Palythoa** (pestaña dedicada)
- **Extensible** para agregar más especies

### Cómo usar la galería:

1. **Ir a pestaña "Galería"**
2. **Seleccionar especie** (Pachyclavularia o Palythoa)
3. **Tocar "Cargar Foto"**
4. **Elegir fuente:**
   - Tomar foto con cámara
   - Seleccionar de galería
5. **La foto se guarda automáticamente** con fecha actual

### Visualización de Fotos:

#### 🖼️ Cuadrícula Organizada
- **Vista en grid** responsive
- **Fecha visible** en cada foto
- **Ordenadas** por fecha (más reciente primero)
- **Optimizadas** para visualización móvil

#### 🔍 Vista Ampliada
- **Toca cualquier foto** para verla en pantalla completa
- **Modal con fecha** de captura
- **Navegación fácil** para cerrar

## 🚀 Instalación y Configuración

### Instalación como PWA:

#### En iOS (Safari):
1. Abrir la app en Safari
2. Tocar botón **Compartir** (cuadrado con flecha)
3. Seleccionar **"Agregar a pantalla de inicio"**
4. Confirmar instalación

#### En Android (Chrome):
1. Abrir la app en Chrome
2. Tocar **menú** (tres puntos)
3. Seleccionar **"Agregar a pantalla de inicio"**
4. Confirmar instalación

### Resultado de la instalación:
- ✅ Icono en pantalla de inicio
- ✅ Se abre como app nativa (sin barra del navegador)
- ✅ Funciona offline
- ✅ Experiencia móvil optimizada

## 💾 Gestión de Datos

### Almacenamiento:
- **LocalStorage del navegador** - Datos seguros en tu dispositivo
- **Sin servidores externos** - Privacidad total
- **Persistente** - Los datos no se pierden al cerrar la app

### Backup y Restauración:
- Los datos están vinculados al navegador específico
- Para backup manual: exportar datos desde herramientas de desarrollador
- Recomendación: usar siempre el mismo navegador

## 🔧 Funcionalidades Técnicas

### Tecnologías Utilizadas:
- **HTML5, CSS3, JavaScript ES6**
- **Chart.js** para gráficos interactivos
- **Service Worker** para funcionalidad offline
- **Web App Manifest** para instalación PWA

### Compatibilidad:
- **iOS Safari** 11.1+
- **Android Chrome** 67+
- **Desktop** (Chrome, Firefox, Safari, Edge)

### Rendimiento:
- **Carga rápida** - Archivos optimizados
- **Offline first** - Funciona sin internet
- **Responsive** - Adaptable a cualquier pantalla

## 📊 Casos de Uso Típicos

### Mantenimiento Rutinario:
1. **Medición semanal** de parámetros
2. **Registro de cambios** de agua
3. **Seguimiento de tendencias** en gráficos
4. **Notas de observaciones** importantes

### Seguimiento de Corales:
1. **Fotos mensuales** de crecimiento
2. **Comparación visual** entre fechas
3. **Documentación** de cambios de coloración
4. **Registro** de nuevas colonias

### Resolución de Problemas:
1. **Identificar tendencias** problemáticas en parámetros
2. **Correlacionar** cambios con notas
3. **Documentar** tratamientos aplicados
4. **Seguir evolución** post-tratamiento

## 🎯 Mejores Prácticas

### Para Parámetros:
- **Medir siempre** a la misma hora
- **Calibrar equipos** regularmente
- **Anotar cambios** significativos en notas
- **Revisar gráficos** semanalmente

### Para Fotos:
- **Misma iluminación** para comparaciones
- **Ángulo consistente** de cada coral
- **Fotos mensuales** mínimo
- **Documentar cambios** notables

## ❓ Preguntas Frecuentes

**¿Necesito internet para usar la app?**
No, una vez cargada funciona completamente offline.

**¿Se pierden mis datos si actualizo el navegador?**
No, los datos persisten en LocalStorage.

**¿Puedo usar la app en múltiples dispositivos?**
Los datos son locales a cada dispositivo/navegador.

**¿Hay límite de fotos o mediciones?**
Solo el límite de almacenamiento de tu dispositivo.

**¿Puedo agregar más especies de corales?**
Actualmente no desde la interfaz, requiere modificación del código.

## 🆘 Soporte

Para problemas técnicos o sugerencias:
- Revisar que el navegador sea compatible
- Verificar espacio de almacenamiento disponible
- Probar en modo incógnito para descartar extensiones
- Contactar al desarrollador con detalles específicos del problema