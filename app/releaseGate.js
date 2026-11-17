export const emptyGateAnswers = () => ({
    environment: 'prod',
    provenanceVerified: false,
    ownersApproved: false,
    driftInvestigated: false,
    destructiveReviewed: false,
    rollbackDocumented: false,
    costReviewed: false
});
export function evaluateReleaseGate(plan, answer) {
    const findings = [];
    const block = (id, message) => findings.push({ id, severity: 'BLOCK', message });
    const review = (id, message) => findings.push({ id, severity: 'REVIEW', message });
    if (plan.total === 0)
        review('EMPTY', 'El plan declara cero recursos modificados: confirma que corresponde al workspace esperado.');
    if (plan.summary.unknown > 0)
        block('UNKNOWN', `${plan.summary.unknown} operaciones desconocidas; el plan no debe utilizarse para autorizar cambios.`);
    if (!answer.provenanceVerified)
        block('PROVENANCE', 'Falta cotejar commit, entorno, origen y checksum del plan aprobado.');
    if (plan.driftCount > 0 && !answer.driftInvestigated)
        block('DRIFT', `Hay ${plan.driftCount} eventos de drift sin investigación declarada.`);
    if (plan.destructive > 0 && !answer.destructiveReviewed)
        block('DESTRUCTIVE', `${plan.destructive} operaciones destructivas o reemplazos requieren revisión por recurso.`);
    if (plan.driftDestructive > 0)
        review('DRIFT_DESTRUCTIVE', `${plan.driftDestructive} eventos de drift destructivo: requiere diagnóstico fuera de esta herramienta.`);
    if (answer.environment === 'prod' && !answer.ownersApproved)
        block('APPROVAL', 'Falta revisión declarada de los owners para producción.');
    else if (!answer.ownersApproved)
        review('OWNER', 'No consta aprobación del responsable del entorno.');
    if (!answer.rollbackDocumented)
        review('ROLLBACK', 'Falta runbook de recuperación y condición de parada.');
    if (!answer.costReviewed)
        review('FINOPS', 'Falta revisión de costos y cuota presupuestaria.');
    if (plan.sensitiveCount > 0)
        review('SENSITIVE', `Existen ${plan.sensitiveCount} indicadores sensitive: restringe acceso a plan/state.`);
    const checksRequired = 6;
    const checksPassed = [
        answer.provenanceVerified,
        answer.ownersApproved,
        answer.driftInvestigated,
        answer.destructiveReviewed,
        answer.rollbackDocumented,
        answer.costReviewed
    ].filter(Boolean).length;
    const status = findings.some((f) => f.severity === 'BLOCK')
        ? 'BLOCKED'
        : findings.some((f) => f.severity === 'REVIEW')
            ? 'NEEDS_EVIDENCE'
            : 'READY_FOR_HUMAN_REVIEW';
    return {
        provenance: 'LOCAL_TRAINING_ONLY',
        status,
        findings,
        checksPassed,
        checksRequired,
        environment: answer.environment,
        destructive: plan.destructive,
        driftCount: plan.driftCount,
        unknownActions: plan.summary.unknown
    };
}
/** Markdown never claims an actual GO or cloud approval, and never includes plan values. */
export function exportGateReview(review) {
    const line = (s) => s.replace(/\p{Cc}/gu, ' ').slice(0, 300);
    return `# TerraPixel — revisión didáctica de release

**Procedencia:** ${review.provenance}  
**Estado:** ${review.status}  
**Ambiente declarado:** ${review.environment}  
**Controles declarados:** ${review.checksPassed}/${review.checksRequired}  
**Cambios destructivos:** ${review.destructive}  
**Drift reportado:** ${review.driftCount}  
**Operaciones desconocidas:** ${review.unknownActions}

## Hallazgos

${review.findings.map((f) => `- [${f.severity}] ${f.id}: ${line(f.message)}`).join('\n') || 'Sin hallazgos de estas reglas educativas.'}

## Límites de validez

- Este informe es **autoevaluación local**; no aprueba un deploy, ni acredita la firma o autenticidad de un plan.
- No se ejecutó terraform plan, terraform apply, CI, cloud ni verificación externa.
- Confirmar con el responsable del entorno todo control declarado antes de un cambio real.
- El reporte nunca incluye valores de recursos, variables ni outputs del plan.
`;
}
