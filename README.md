# Vodafone Onboarding Command Center

Aplicación web profesional creada con Next.js, TypeScript y Tailwind CSS para coordinar el ingreso de asesores nuevos de Vodafone. El panel centraliza asesores, accesos operativos, retail, contrato, formación, inducción, evidencias, calidad, reportes y seguimiento de producción inicial.

## Características principales

- Dashboard general con KPIs, ranking de avance, semáforos y alertas automáticas.
- Gestión demo de asesores: crear, editar estado, eliminar y consultar historial.
- Control de credenciales y accesos sin guardar contraseñas ni datos sensibles.
- Módulo de inducción operativa con checklist, evidencias y constancia interna.
- Biblioteca dinámica de tarifas Vodafone con argumentos comerciales y rebate recomendado.
- Biblioteca de objeciones y rebate profesional con ejemplos de llamada.
- Formación comercial con módulos iniciales, avance, notas y resultado final.
- IA principal visible para análisis, reportes, mensajes, riesgos y recomendaciones.
- Calidad comercial inicial y reportes preparados para exportación.
- Modo TV para coordinación en pantalla completa.
- Configuración dinámica para ampliar campos, estados, módulos, checklists e incidencias.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Datos demo en memoria, preparados para reemplazarse por servicios y base de datos real


## Ver la aplicación ahora sin instalar dependencias

Si el entorno no permite instalar paquetes de npm, abre directamente el archivo estático `index.html` en el navegador. También puedes servirlo con Python:

```bash
python3 -m http.server 4173
```

Después abre `http://localhost:4173`. Esta vista estática incluye el dashboard, datos demo, módulos principales e IA simulada para poder revisar la experiencia visual inmediatamente.

## Ejecutar la versión Next.js en local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000` en el navegador.

## Comandos útiles

```bash
npm run build
npm run lint
```

## Estructura

- `app/page.tsx`: interfaz principal, módulos funcionales y estado demo en frontend.
- `app/globals.css`: tema visual premium oscuro con acentos Vodafone.
- `lib/types.ts`: contratos TypeScript para asesores, accesos, formación, tarifas, rebate, calidad y configuración.
- `lib/demo-data.ts`: datos iniciales para probar el sistema.
- `lib/analytics.ts`: KPIs, alertas automáticas y respuestas IA demo.

## Preparación para base de datos real

La aplicación separa tipos, datos y analítica. Para conectar una base de datos real, sustituir `lib/demo-data.ts` por funciones de acceso a datos y mover las mutaciones de `app/page.tsx` a rutas de servidor o acciones seguras. Los estados de credenciales se mantienen como valores operativos y no almacenan contraseñas reales.
