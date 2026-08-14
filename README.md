# IRIS Project App - Frontend Web Client

![Angular](https://img.shields.io/badge/Angular-v21.2.0-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178C6?style=for-the-badge&logo=typescript)
![Signals](https://img.shields.io/badge/Angular-Signals-FF2D55?style=for-the-badge&logo=angular)
![SCSS](https://img.shields.io/badge/Styles-Vanilla%20SCSS-CC6699?style=for-the-badge&logo=sass)
![Vitest](https://img.shields.io/badge/Vitest-50%20Tests%20Passed-6E9F18?style=for-the-badge&logo=vitest)
![Coverage](https://img.shields.io/badge/Coverage-92.6%25%20Lines-brightgreen?style=for-the-badge)

Cliente web Single Page Application (SPA) desarrollado para el sistema **IRIS Project To-Do List**, construido con **Angular 21**, **Angular Signals**, **Componentes Standalone**, **Angular CDK Drag & Drop**, **Reactive Forms** y **Vitest**.

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Matriz de Cumplimiento Técnico (Reto 1 & Reto 2 - Perfil Senior)](#matriz-de-cumplimiento-técnico-reto-1--reto-2---perfil-senior)
3. [Acceso Rápido con Usuarios de Prueba (Demo Selector)](#acceso-rápido-con-usuarios-de-prueba-demo-selector)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Instalación y Configuración Local](#instalación-y-configuración-local)
7. [Pruebas y Cobertura de Código](#pruebas-y-cobertura-de-código)
8. [Compilación para Producción](#compilación-para-producción)
9. [Accesibilidad y Experiencia de Usuario](#accesibilidad-y-experiencia-de-usuario)
10. [Despliegue en Producción](#despliegue-en-producción)

---

## Descripción General

La aplicación cliente de IRIS permite a los usuarios gestionar tareas de forma intuitiva, fluida y accesible. Implementa un diseño receptivo (responsive), soporte para modo claro y oscuro persistente, edición modal completa, ordenamiento dinámico, filtros por estado, búsqueda con debounce, categorización por etiquetas, paginación inteligente a 5 elementos por página y reordenamiento de tareas mediante arrastrar y soltar (Drag & Drop).

---

## Matriz de Cumplimiento Técnico (Reto 1 & Reto 2 - Perfil Senior)

### Reto 1 — Vista Principal (70% Evaluación)

| Requisito | Estado | Implementación en Código / Detalles |
| :--- | :---: | :--- |
| **Agregar Tarea** | **COMPLETO** | Campo de texto con botón `+` y tecla `Enter`. Limpia el campo tras agregar y bloquea textos vacíos o solo espacios (`.trim()`). |
| **Completar / Descompletar** | **COMPLETO** | Checkbox interactivo que refleja el cambio visualmente con tachado y atenuación de opacidad. |
| **Eliminar Tarea** | **COMPLETO** | Botón de eliminación mediante ícono vectorial que envía la tarea a la papelera. |
| **Filtrado por Estado** | **COMPLETO** | Selector con opciones `Todas`, `Completadas` y `Pendientes`, actualizando dinámicamente el encabezado de la lista. |
| **Mensajes de Estado Vacío** | **COMPLETO** | Mensaje descriptivo con diseño cuando no existen tareas o ninguna cumple con los filtros activos. |
| **Estados de Carga y Error** | **COMPLETO** | Spinner reactivo de carga y panel de alerta de error con botón de reintento (`store.load()`). |
| **Diseño y Responsividad** | **COMPLETO** | Maquetación con Flexbox/Grid responsiva adaptada a móviles, tablets y escritorio. Paleta corporativa IRIS (Teal, Dark Teal, Lime). |
| **Accesibilidad (Senior)** | **COMPLETO** | `<label>` asociados a inputs y checkboxes (o `.sr-only`), navegación completa por teclado y alto contraste WCAG. |
| **Pruebas Unitarias (>70% Senior)** | **COMPLETO** | **50/50 pruebas pasadas con 92.56% de cobertura en líneas** (evaluando renderizado, adición, edición, completado, borrado y filtros). |

### Reto 2 — Funcionalidades Adicionales (30% Evaluación - Perfil Senior)

| Funcionalidad Elegida | Estado | Detalles Técnicos de Implementación |
| :--- | :---: | :--- |
| **Edición Completa en Línea / Modal** | **COMPLETO** | Modal emergente flotante con animación que permite modificar título, categoría, prioridad y fecha límite. |
| **Fecha Límite e Indicadores** | **COMPLETO** | Formateo localizado de fechas con insignias de vencimiento (Rojo Coral `overdue` / Verde Esmeralda `soon`). |
| **Categorías y Etiquetas con Color** | **COMPLETO** | Etiquetas distintivas para `Trabajo` (Teal), `Personal` (Púrpura), `Estudio` (Azul) y `Otra` (Gris). |
| **Buscador & Ordenamiento Avanzado** | **COMPLETO** | Búsqueda por texto en tiempo real con debounce de 300ms y orden por fecha límite, alfabético, prioridad o manual. |
| **Reordenar mediante Drag & Drop** | **COMPLETO** | Integración con `@angular/cdk/drag-drop`, transiciones fluidas de 250ms e integración con API backend (`reorder`). |
| **Papelera y Restauración (Soft Delete)** | **COMPLETO** | Panel de papelera desplegable para restaurar tareas o eliminarlas de forma definitiva de la base de datos. |
| **Modo Oscuro y Modo Claro** | **COMPLETO** | Conmutador de tema visual con persistencia automática en `localStorage`. |
| **Contadores de Estado** | **COMPLETO** | Badges reactivos computados en tiempo real (`store.pendingCount()`, `store.completedCount()`). |
| **Paginación Inteligente** | **COMPLETO** | Control paginado que se activa automáticamente únicamente cuando la lista supera **5 elementos** (Página X de Y). |

---

## Acceso Rápido con Usuarios de Prueba (Demo Selector)

La pantalla de inicio de sesión (`LoginComponent`) incluye un **mecanismo de Selección Rápida de Usuarios de Prueba** (Dropdown Selector) que permite autocompletar credenciales sin iniciar sesión automáticamente:

| # | Correo Electrónico | Nombre | Rol | Contraseña Única | Tareas Sembradas | Comportamiento UI |
|---|:---|:---|:---|:---|:---:|:---|
| 1 | `admin@iris.com` | Administrador IRIS | Administrador General | `Password123!` | **0 tareas** | Sin tareas (Estado Vacío) |
| 2 | `senior.dev@iris.com` | Desarrollador Senior | Desarrollo Full Stack | `Password123!` | **0 tareas** | Sin tareas (Estado Vacío) |
| 3 | `tech.lead@iris.com` | Líder Técnico | Arquitectura de Software | `Password123!` | **3 tareas** | Sin paginador (<= 5 tareas) |
| 4 | `qa.engineer@iris.com` | Ingeniero QA | Aseguramiento de Calidad | `Password123!` | **3 tareas** | Sin paginador (<= 5 tareas) |
| 5 | `ux.designer@iris.com` | Diseñador UX/UI | Diseño de Producto | `Password123!` | **4 tareas** | Sin paginador (<= 5 tareas) |
| 6 | `product.owner@iris.com` | Product Owner | Gestión de Dominio | `Password123!` | **4 tareas** | Sin paginador (<= 5 tareas) |
| 7 | `scrum.master@iris.com` | Scrum Master | Metodologías Ágiles | `Password123!` | **5 tareas** | Límite 1 página (<= 5 tareas) |
| 8 | `devops.engineer@iris.com` | Ingeniero DevOps | Infraestructura & CI/CD | `Password123!` | **5 tareas** | Límite 1 página (<= 5 tareas) |
| 9 | `backend.dev@iris.com` | Desarrollador Backend | API REST & Base de Datos | `Password123!` | **6 tareas** | **Paginación Activa** (*Pág 1 de 2*) |
| 10 | `frontend.dev@iris.com` | Desarrollador Frontend | Angular & UI Components | `Password123!` | **6 tareas** | **Paginación Activa** (*Pág 1 de 2*) |

---

## Tecnologías Utilizadas

- **Angular 21:** Framework principal con sintaxis moderna de control de flujo (`@if`, `@for`).
- **Angular Signals:** Gestión de estado reactivo granular en componentes y servicios.
- **Componentes Standalone:** Arquitectura pura basada en componentes independientes sin uso de `NgModule`.
- **Angular CDK Drag & Drop:** Módulo oficial para el reordenamiento interactivo de listas con soporte táctil.
- **Reactive & Template-Driven Forms:** Formularios para autenticación y captura de tareas con validación en tiempo real.
- **Vanilla SCSS:** Sistema de estilos estructurado con variables CSS nativas para tematización dinámica.
- **Vitest & Angular Testing Library:** Suite de pruebas unitarias integradas con alta velocidad de ejecución.

---

## Estructura del Proyecto

El proyecto sigue una **Arquitectura Guiada por Características y Dominios (Feature-Driven Architecture)** recomendada para desarrollo en Angular de nivel Senior:

```text
frontend/
├── docs/                      # Documentación técnica de arquitectura y matriz de requisitos
│   ├── architecture.md
│   └── requirements-checklist.md
├── scripts/                   # Scripts de automatización de entornos de compilación
│   └── generate-env.mjs
├── src/
│   ├── app/
│   │   ├── features/          # Módulos de dominio aislados y simétricos
│   │   │   ├── auth/          # Dominio de Autenticación
│   │   │   │   ├── components/
│   │   │   │   │   └── login/
│   │   │   │   │       ├── login.component.html
│   │   │   │   │       ├── login.component.scss
│   │   │   │   │       ├── login.component.spec.ts
│   │   │   │   │       └── login.component.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.spec.ts
│   │   │   │   │   └── auth.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.spec.ts
│   │   │   │   │   └── auth.interceptor.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── auth.models.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.spec.ts
│   │   │   │       └── auth.service.ts
│   │   │   └── tasks/         # Dominio de Tareas
│   │   │       ├── components/
│   │   │       │   └── task-list/
│   │   │       │       ├── task-list.component.html
│   │   │       │       ├── task-list.component.scss
│   │   │       │       ├── task-list.component.spec.ts
│   │   │       │       └── task-list.component.ts
│   │   │       ├── models/
│   │   │       │   └── task.model.ts
│   │   │       └── services/
│   │   │           ├── task.service.spec.ts
│   │   │           ├── task.service.ts
│   │   │           ├── task.store.spec.ts
│   │   │           └── task.store.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts      # Configuración de proveedores globales HTTP y Router
│   │   └── app.routes.ts      # Enrutamiento principal con lazy loading
│   ├── assets/                # Recursos estáticos e imágenes
│   ├── environments/          # Generación dinámica de variables de entorno
│   ├── index.html             # Plantilla HTML5 principal
│   ├── main.ts                # Bootstrapping de la aplicación Angular
│   └── styles.scss            # Sistema de tokens CSS, paleta de colores y temas
├── angular.json               # Configuración del CLI de Angular y ejecutor Vitest
├── package.json               # Dependencias y scripts de desarrollo
├── tsconfig.json              # Configuración de compilación TypeScript
└── vitest.config.ts           # Configuración del ejecutor de pruebas
```

---

## Instalación y Configuración Local

### Requisitos Previos

- **Node.js:** Versión 22.x o superior.
- **npm:** Versión 10.x o superior.

### Pasos de Instalación

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

La aplicación se abrirá en `http://localhost:4200` y se conectará automáticamente con la API backend en `http://localhost:3000/api/v1`.

---

## Pruebas y Cobertura de Código

El proyecto cuenta con 50 pruebas unitarias desarrolladas con **Vitest**, evaluando la lógica de componentes, servicios, guards, interceptores y la tienda de estado (`TaskStore`).

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas una vez
npm test -- --watch=false

# Generar informe de cobertura de código
npm run test:coverage
```

### Reporte de Cobertura Obtenido (100% de Pruebas Aprobadas - 50/50)

| Métrica | Cobertura Alcanzada | Umbral Mínimo | Estado |
| :--- | :---: | :---: | :---: |
| **Líneas (Lines)** | **92.56%** | 80% | Aprobado |
| **Sentencias (Statements)** | **85.82%** | 80% | Aprobado |
| **Ramas (Branches)** | **84.77%** | 80% | Aprobado |
| **Funciones (Functions)** | **81.15%** | 80% | Aprobado |

---

## Compilación para Producción

Para generar el paquete de distribución optimizado:

```bash
# Definir la URL de la API de producción (opcional)
API_BASE_URL=https://api-backend.example.com/api/v1 npm run build
```

El proceso ejecuta automáticamente el script de generación de entorno y empaqueta la aplicación compilada en el directorio `dist/iris-todo`.

---

## Accesibilidad y Experiencia de Usuario

- **Asociación de Controles:** Todos los campos de entrada cuentan con etiquetas HTML `<label>` asociadas directamente o clases `.sr-only` para lectores de pantalla.
- **Navegación por Teclado:** Foco visualmente resaltado y soporte de teclas `Enter` y `Escape` para adición y edición en línea.
- **Regiones Dinámicas:** Indicadores de estado utilizando atributos `aria-live`, `aria-busy` y `role="alert"`.
- **Iconografía Profesional:** Iconos vectoriales SVG limpios e integrados sin dependencia de tipografías externas o emoticonos.
- **Modo Claro y Oscuro:** Alternancia dinámica respetando el contraste adecuado y persistiendo la preferencia en `localStorage`.

---

## Despliegue en Producción

La aplicación está lista para su despliegue en plataformas como **Vercel**:

1. Vincular el directorio `frontend` al proyecto en Vercel.
2. Definir la variable de entorno `API_BASE_URL` apuntando a la URL del backend en producción.
3. El comando de compilación es `npm run build` y el directorio de salida es `dist/iris-todo`.
