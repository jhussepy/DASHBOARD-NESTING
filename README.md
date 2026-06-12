# Vodafone Onboarding Command Center

Sistema web premium para coordinar el onboarding de asesores nuevos Vodafone. Incluye dashboard ejecutivo, modo oscuro/claro/auto, Excel editable como fuente de datos, tablas profesionales, ficha 360 del asesor, modo TV y un **Copiloto IA de Coordinación** como módulo protagonista.

## Ver la aplicación

```bash
npm install
npm run create:workbook
npm run dev
```

Abrir `http://localhost:3000`.

## Excel editable

La fuente de datos está en:

```bash
data/vodafone_onboarding_base_dinamica.xlsx
```

Hojas incluidas:

- `Dashboard_Excel`
- `Asesores`
- `Accesos_Contrato`
- `Induccion`
- `Tarifas`
- `Rebate`
- `Formacion`
- `Calidad`
- `Incidencias`
- `Catalogos`

El archivo Excel no se sube al repositorio porque es binario. Para generarlo localmente ejecuta:

```bash
npm run create:workbook
```

Luego inicia el proyecto normalmente con `npm run dev`. El dashboard seguirá leyendo el Excel desde `/data/vodafone_onboarding_base_dinamica.xlsx`. Puedes modificar el archivo, guardarlo y pulsar **Sincronizar Excel** en el dashboard. También existe auto-refresh opcional cada 30 o 60 segundos.

> Importante: el Excel solo contiene estados operativos. No se guardan contraseñas reales ni credenciales sensibles. Los `.xlsx` locales están ignorados por git (`data/*.xlsx`).

## API de datos

La ruta:

```bash
/api/onboarding
```

lee `data/vodafone_onboarding_base_dinamica.xlsx` con `xlsx` y devuelve:

- `asesores`
- `accesosContrato`
- `induccion`
- `tarifas`
- `rebate`
- `formacion`
- `calidad`
- `incidencias`
- `catalogos`
- `dashboardExcel`

## Comandos útiles

```bash
npm run lint
npm run build
npm run preview:static
```

## Arquitectura

- `src/app/api/onboarding/route.ts`: API route para leer Excel.
- `src/app/page.tsx`: entrada del dashboard con lectura inicial del workbook.
- `src/components/layout`: shell corporativo y navegación.
- `src/components/dashboard`: KPIs, alertas, ranking, modo TV y command center.
- `src/components/tables`: tabla reutilizable con búsqueda, ordenamiento y vistas.
- `src/components/ai`: Copiloto IA de Coordinación.
- `src/components/theme`: selector dark/light/system con localStorage.
- `src/components/advisors`: ficha 360 del asesor.
- `src/lib/excel`: lectura y normalización del workbook.
- `src/lib/types`: tipos TypeScript principales.
- `src/lib/utils`: analítica, IA local, formato y estados.

## Vista estática opcional

También se mantiene `index.html` como preview estática rápida si se quiere abrir una página sin Next.js:

```bash
npm run preview:static
```

Abrir `http://127.0.0.1:4173/index.html`.
