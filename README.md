# CoralTrack - Asistente para Acuarios de Arrecife

Una aplicación web progresiva (PWA) mobile-first para el seguimiento de parámetros del agua y crecimiento de corales en acuarios de arrecife.

## Características

### Módulo 1: Registro y Visualización de Parámetros
- Formulario simple para registrar 7 parámetros del agua
- Gráficos individuales para cada parámetro con Chart.js
- Historial completo de mediciones con notas
- Almacenamiento local en el navegador

### Módulo 2: Galería de Seguimiento de Corales
- Pestañas organizadas por especies (Pachyclavularia, Palythoa)
- Carga de fotos desde cámara o galería
- Visualización en cuadrícula con fechas
- Modal para vista ampliada de fotos

## Instalación

1. Servir los archivos desde un servidor web local
2. Abrir en navegador móvil
3. Agregar a pantalla de inicio para experiencia PWA completa

## Uso

### Registrar Parámetros
1. Completar formulario con valores medidos
2. Agregar notas opcionales
3. Guardar medición
4. Ver gráficos y historial actualizados

### Galería de Corales
1. Seleccionar pestaña de especie
2. Tocar "Cargar Foto"
3. Tomar foto o seleccionar de galería
4. Ver en cuadrícula con fecha
5. Tocar foto para vista ampliada

## Tecnologías
- HTML5, CSS3, JavaScript ES6
- Chart.js para gráficos
- LocalStorage para persistencia
- Service Worker para funcionalidad offline
- PWA con manifest.json