# Matriz de cumplimiento Frontend - IRIS (Angular 21)

## Reto 1 - Funcionalidades Principales

- [x] **Alta de tareas:** Campo de texto con adición por botón `+` o tecla Enter.
- [x] **Validación de entrada:** Rechaza títulos vacíos o con solo espacios; limpia el campo tras agregar.
- [x] **Estado completado:** Casilla de verificación para marcar/desmarcar con indicador visual de tachado.
- [x] **Eliminación de tarea:** Botón de borrado directo.
- [x] **Filtros por estado:** Alternancia entre `Todas`, `Completadas` y `Pendientes` con título dinámico.
- [x] **Estado vacío:** Mensaje e icono amigable cuando no existen tareas para el filtro actual.
- [x] **Manejo de errores:** Notificaciones visuales y opción de reintento.
- [x] **Responsive design:** Maquetación fluida y adaptable a móvil, tablet y escritorio.
- [x] **Accesibilidad:** Etiquetas `label`, foco visible, navegación por teclado y regiones `aria-live`.

---

## Reto 2 - Extensiones Senior

- [x] **Edición en línea:** Doble clic o botón de editar para modificar el título de la tarea in-situ.
- [x] **Fechas límite y alertas:** Fecha de vencimiento con clasificación visual de `vencida`, `próxima` o `normal`.
- [x] **Categorización:** Etiquetas visuales para `Trabajo`, `Personal`, `Estudio` u `Otra`.
- [x] **Búsqueda en tiempo real:** Campo de búsqueda con debounce de 300ms.
- [x] **Ordenamiento estricto:** Por orden manual, fecha de creación, título, prioridad o fecha límite.
- [x] **Drag & drop:** Reordenamiento mediante arrastre con `@angular/cdk/drag-drop` y actualización persistente.
- [x] **Papelera de reciclaje:** Vista de tareas eliminadas lógicamente con restauración y borrado definitivo.
- [x] **Tema claro / oscuro:** Alternador persistido en `localStorage`.
- [x] **Contadores en vivo:** Indicador de total de pendientes y completadas.
