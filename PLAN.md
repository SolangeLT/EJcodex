# Plan de Frontend - Aplicación de Biblioteca

## Objetivo
Construir un frontend en **HTML + CSS + Bootstrap** para una biblioteca digital, preparado para integrarse con un backend desarrollado por otro equipo.

## Alcance funcional

### 1) Búsqueda y filtros
- Barra de búsqueda por **título** o **autor**.
- Filtro por **categoría**.
- Filtro por **disponibilidad** (Disponible / Rentado).
- Mensaje de estado cuando no hay resultados o no está disponible.

### 2) Catálogo de libros
- Vista en tarjetas (cards) con:
  - Portada.
  - Título y autor.
  - Estado del libro (Disponible / Rentado).
  - Precio de **compra**.
  - Precio de **renta**.

### 3) Detalle del libro
- Información ampliada del libro seleccionado:
  - Descripción.
  - Precio de compra y renta.
  - Estado actual.
- Acciones:
  - Botón **Comprar**.
  - Botón **Rentar** (deshabilitado si está rentado).
  - Botón **Avisarme cuando se libere** para libros no disponibles.

### 4) Disponibilidad por renta
- Si el libro está rentado, mostrar:
  - Mensaje de no disponibilidad.
  - **Fecha estimada de liberación**.

### 5) Historial del usuario
- Sección de ejemplo para **Mis rentas/compras**.

## Sugerencias incluidas (según ajuste)
- Historial de rentas/compras.
- Paginación o “cargar más” para escalar catálogo.
- Estados de carga (spinner/skeleton).
- Accesibilidad básica (labels, contraste, navegación por teclado).

## Estructura técnica actual
- `index.html`: estructura de UI y secciones principales.
- `styles.css`: estilos visuales y efectos de tarjetas.
- `app.js`: datos mock y lógica de renderizado/filtros/detalle.

## Próximos pasos de integración
1. Reemplazar datos mock por endpoints reales del backend.
2. Definir contrato API (`GET /books`, `GET /books/:id`).
3. Conectar acciones de compra/renta con flujo real.
4. Implementar notificaciones reales para “avisarme cuando se libere”.
