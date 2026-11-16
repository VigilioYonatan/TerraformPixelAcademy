# TerraPixel Academy v1.7 — Nota de entrega

## Petición cubierta

Se añadió al **nivel raíz del ZIP** el documento `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, completo y autocontenido. Incluye:

- Matriz de 20 requisitos y estado real (implementado, parcial, no verificado).
- Diseño aprobado en PNG, 12 poses Terra, responsive, accesibilidad y estado de componentes.
- 14 rutas de producto y recorridos de principiante y Senior.
- Contratos técnicos, límites educativos, CLI, seguridad, persistencia, Plan Inspector y Release Gate.
- Desarrollo específico de las **36 lecciones** con objetivos, práctica, pregunta, aceptación y archivos.
- Desarrollo específico de los **18 casos Senior** con incidente, controles, prueba negativa, evidencia, decisión y paquete.
- Ocho hitos del capstone S18 con Definition of Done.
- 5 minijuegos, 8 itinerarios, controles zero-omissions, gates y órdenes de ejecución.
- Anexo íntegro de la especificación maestra auditada v1.1 para no perder detalle histórico.

## Código presente en esta rama

Vistas Preact de catálogo, evidencias CLI y los 18 escenarios Senior, incorporadas en `src/main.ts` sin eliminar las rutas o plantillas anteriores. Se conservan los archivos existentes y los assets de GoPixel/TerraPixel. Este cambio no convierte CodeMirror 5 en 6 ni valida Terraform CLI, Vite o navegador HTTP.

## Estado de release

**Entrega parcial / no aprobada como producción** hasta cerrar todos los gates P1 de `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`. El ZIP puede pasar integridad y pruebas locales sin que eso certifique los laboratorios cloud o la experiencia E2E.
