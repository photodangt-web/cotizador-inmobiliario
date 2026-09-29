# Cotizador para Empresa Inmobiliaria

Cotizador hipotecario web genérico para proyectos de una empresa inmobiliaria. Esta versión reconstruye como aplicación independiente un cotizador que originalmente estaba integrado con WordPress, Elementor y WooCommerce.

El resultado conserva la identidad visual y el flujo del diseño original, pero puede ejecutarse, probarse y desplegarse sin PHP, base de datos ni una instalación de WordPress.

## Demo

[Ver cotizador en línea](https://photodangt-web.github.io/cotizador-inmobiliario/)

El demo se publica automáticamente en GitHub Pages después de cada cambio enviado a la rama `main`.

## Funcionalidades

- Selección de proyecto y tipo de apartamento.
- Precio editable en dólares.
- Conversión entre USD y GTQ con tasa configurable.
- Enganche ajustable entre 5 % y 30 %.
- Tasas bancarias específicas por proyecto y moneda.
- Cálculo de cuotas para 5, 10, 15, 20, 25 y 30 años.
- Exportación de la cotización a PDF desde el navegador.
- Diseño adaptable para escritorio, tablet y móvil.
- Pruebas automatizadas para la lógica financiera.

## Tecnologías

- HTML5 y CSS3
- JavaScript moderno con módulos ES
- Node.js como entorno de desarrollo
- Vite para desarrollo y compilación
- Vitest para pruebas
- html2pdf.js para exportación local a PDF

## Inicio rápido

Requisitos: Node.js 20.19 o superior y npm.

```bash
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilación optimizada en dist/
npm run preview  # Vista previa de la compilación
npm test         # Pruebas de la lógica financiera
```

## Configuración

Los bancos, tasas, plazos y tipo de cambio se encuentran en `src/calculator.js`:

- `EXCHANGE_RATE`: quetzales por dólar.
- `TERMS_IN_YEARS`: plazos disponibles.
- `BANKS`: bancos y tasas anuales por proyecto y moneda.

El precio se captura en USD y se convierte únicamente cuando el usuario selecciona GTQ.

## Arquitectura

```text
cotizador-inmobiliario/
|-- docs/
|   `-- ARCHITECTURE.md
|-- src/
|   |-- calculator.js
|   |-- calculator.test.js
|   |-- main.js
|   `-- styles.css
|-- index.html
|-- package.json
`-- README.md
```

`calculator.js` no depende del DOM, lo que permite probar las fórmulas de forma aislada. `main.js` controla la interfaz, el estado del cotizador y la descarga del PDF. `styles.css` conserva la paleta, el fondo, los controles y la estructura visual del cotizador anterior.

## Despliegue

Ejecuta `npm run build` y publica el contenido de `dist/` en GitHub Pages, Netlify, Vercel o cualquier servidor de archivos estáticos. No se requiere backend en producción.

Todos los fondos se generan con CSS y el proyecto no carga imágenes ni recursos pertenecientes a una marca externa.

## Origen de la migración

La implementación anterior obtenía el precio desde elementos HTML generados por WooCommerce y mezclaba en un mismo script llamadas a Elementor, jQuery, CRM, correo y formularios del sitio. Esta versión elimina esas dependencias y conserva solamente el comportamiento propio del cotizador.

Los formularios y endpoints de terceros no fueron trasladados. La exportación se realiza localmente en el navegador y no transmite datos personales.

## Aviso

Las cuotas son estimaciones calculadas mediante amortización de cuota fija. No incluyen seguros ni sustituyen una cotización formal de una entidad bancaria.
