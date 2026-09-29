# Arquitectura

## Objetivo

Separar el cotizador del ecosistema WordPress sin cambiar su propósito ni su lenguaje visual. La aplicación se entrega como sitio estático compilable con Node.js, por lo que no necesita PHP, WooCommerce, Elementor o jQuery.

## Componentes

### Interfaz

`index.html` contiene la ficha de entrada y el modal de cotización. La ficha reemplaza la fuente de datos que antes era una página de producto de WooCommerce.

`src/styles.css` define la presentación completa y sus variantes responsivas. Se mantienen los colores principales del diseño anterior:

- Verde: `#697368`
- Arena: `#a9947e`
- Fondo de resultados: `#e1e1e1`

### Dominio financiero

`src/calculator.js` contiene datos bancarios y funciones puras. La cuota mensual utiliza la fórmula estándar de anualidad:

```text
cuota = capital * (i * (1 + i)^n) / ((1 + i)^n - 1)
```

Donde `i` es la tasa mensual y `n` es el total de meses.

### Controlador del navegador

`src/main.js` coordina:

- Apertura y cierre accesible del modal.
- Cambio de moneda y bancos.
- Actualización del enganche.
- Renderizado de resultados.
- Carga diferida del generador de PDF.

La librería de PDF se importa solamente al exportar, reduciendo el JavaScript inicial.

## Decisiones de migración

- El precio deja de leerse desde etiquetas `bdi` de WooCommerce y se proporciona mediante un campo numérico.
- Se retiraron selectores y eventos exclusivos de Elementor.
- Se reemplazó jQuery por APIs nativas del navegador.
- Se retiraron endpoints CRM, correo y hojas de cálculo para no exponer integraciones ni recopilar información personal desde un proyecto de demostración.
- El PDF se genera completamente en el navegador.

## Flujo de datos

1. El usuario elige proyecto, apartamento y precio.
2. La interfaz selecciona el catálogo bancario correspondiente.
3. `calculateQuote` convierte la moneda y calcula enganche y capital financiado.
4. `monthlyPayment` calcula cada plazo.
5. La interfaz muestra los resultados y habilita la exportación.
6. html2pdf.js captura exclusivamente el bloque de resultados.

## Pruebas

`src/calculator.test.js` valida conversión monetaria, amortización, generación de todos los plazos y el caso de tasa cero. La interfaz queda desacoplada de estas fórmulas para evitar que cambios visuales alteren el cálculo.
