const oneLine = (value) => value
    .replace(/\p{Cc}/gu, ' ')
    .replace(/[|`]/g, '-')
    .slice(0, 260);
const printChanges = (changes) => changes
    .map((item) => `| ${oneLine(item.kind)} | ${oneLine(item.address)} | ${oneLine(item.provider)} | ${item.sensitive ? 'sí' : 'no'} |`)
    .join('\n') || '| — | Sin cambios listados | — | — |';
export function buildPlanReviewMarkdown(plan) {
    return `# Revisión local de plan Terraform — TerraPixel Academy

> **Estado:** ANÁLISIS LOCAL DE ARCHIVO APORTADO POR EL ALUMNO. No acredita autenticidad del plan ni aprobación para aplicar infraestructura.

## Procedencia y controles

- Procedencia: ${plan.provenance}
- Versión informada de Terraform: ${oneLine(plan.terraformVersion)}
- Versión de formato: ${oneLine(plan.formatVersion)}
- Cambios declarados: ${plan.total} (muestra: ${plan.shown})
- Eliminaciones/reemplazos: ${plan.destructive}
- Recursos marcados sensitive: ${plan.sensitiveCount}
- Eventos resource_drift declarados: ${plan.driftCount} (destructivos: ${plan.driftDestructive})
- Terraform CLI, cloud, firma y origen del artefacto: **NOT_RUN / NO VERIFICADOS**

## Operaciones declaradas

${Object.entries(plan.summary)
        .map(([kind, count]) => `- ${oneLine(kind)}: ${count}`)
        .join('\n')}

## Recursos del plan (solo metadatos)

| Operación | Dirección | Provider | Indicador sensitive |
|---|---|---|---|
${printChanges(plan.changes)}

## Drift reportado (solo metadatos)

| Operación | Dirección | Provider | Indicador sensitive |
|---|---|---|---|
${printChanges(plan.drift)}

## Advertencias

${plan.notices.map((note) => `- ${oneLine(note)}`).join('\n')}

## Revisión humana requerida

- [ ] Validar procedencia, commit, workspace, backend y firma o controles equivalentes.
- [ ] Revisar cada eliminación/reemplazo con owners, dependencia y rollback.
- [ ] Verificar drift frente al estado remoto autorizado.
- [ ] Confirmar que las direcciones del plan pueden compartirse antes de distribuir este reporte.

**Privacidad:** el reporte NO incluye valores de recursos, variables, outputs, state ni before/after. Las direcciones y nombres de proveedores pueden ser sensibles. No se transmitieron datos a servicios externos desde esta función.
`;
}
