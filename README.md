# Tu Salario RD

Calculadora salarial para República Dominicana, optimizada para funcionar como sitio estático/PWA en GitHub Pages.

## Funciones

- Salario bruto → neto.
- Salario neto → bruto.
- Cálculo mensual o quincenal.
- Desglose educativo de AFP, SFS e ISR.
- Comparación visual entre salario bruto, descuentos y neto.
- SEO preparado para `https://tusalario.com/`.
- Cálculos locales en el navegador; no se envían salarios a un servidor.

## Parámetros

La versión actual utiliza los parámetros de nómina 2026 definidos en el motor de cálculo de `app.js`. La interfaz muestra explícitamente el año de referencia para evitar confundir los resultados con reglas de otro período fiscal.

La estructura del proyecto permite incorporar versiones posteriores de los parámetros manteniendo la interfaz y los modos de cálculo separados del motor principal.

> Los resultados son estimaciones informativas y no sustituyen asesoría contable, fiscal o laboral profesional.
