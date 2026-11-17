const validKinds = ['create', 'update', 'delete', 'replace', 'read', 'no-op', 'unknown'];
function isSensitive(value, depth = 0) {
    if (value === true)
        return true;
    if (depth >= 12 || value === null || typeof value !== 'object')
        return false;
    const members = Array.isArray(value) ? value : Object.values(value);
    return members.slice(0, 1000).some((x) => isSensitive(x, depth + 1));
}
const str = (value, limit = 260) => (typeof value === 'string' ? value.slice(0, limit) : '');
const obj = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
function kind(actions) {
    if (!Array.isArray(actions) || !actions.every((x) => typeof x === 'string'))
        return 'unknown';
    if (actions.includes('delete') && actions.includes('create'))
        return 'replace';
    if (actions.includes('delete'))
        return 'delete';
    if (actions.includes('create'))
        return 'create';
    if (actions.includes('update'))
        return 'update';
    if (actions.includes('read'))
        return 'read';
    if (actions.length === 1 && actions[0] === 'no-op')
        return 'no-op';
    return 'unknown';
}
/** The caller enforces a file-size cap BEFORE reading. */
export function inspectTerraformPlan(data) {
    const root = obj(data);
    if (!/^\d+\.\d+$/.test(str(root.format_version, 20)))
        throw new Error('JSON no reconocido: falta format_version de Terraform show -json.');
    if (!Array.isArray(root.resource_changes))
        throw new Error('Este JSON no contiene resource_changes de un plan Terraform.');
    const changes = root.resource_changes;
    const driftEntries = Array.isArray(root.resource_drift) ? root.resource_drift : [];
    if (driftEntries.length > 150000)
        throw new Error('El reporte de drift excede 150.000 cambios.');
    if (changes.length > 150000)
        throw new Error('El plan excede el máximo de 150.000 cambios.');
    const summary = Object.fromEntries(validKinds.map((key) => [key, 0]));
    const shown = [];
    let destructive = 0, sensitiveCount = 0;
    for (const raw of changes) {
        const resource = obj(raw), change = obj(resource.change);
        const action = kind(change.actions);
        // Only the name and action are read; NEVER read/change.before/after, variables, outputs, planned_values or state.
        const sensitive = isSensitive(change.before_sensitive) || isSensitive(change.after_sensitive);
        summary[action]++;
        if (action === 'delete' || action === 'replace')
            destructive++;
        if (sensitive)
            sensitiveCount++;
        if (shown.length < 100)
            shown.push({
                address: str(resource.address) || '(recurso sin dirección)',
                kind: action,
                sensitive,
                provider: str(resource.provider_name, 100) || 'n/d'
            });
    }
    let driftDestructive = 0;
    const drift = [];
    for (const raw of driftEntries) {
        const resource = obj(raw), change = obj(resource.change), operation = kind(change.actions);
        if (operation === 'delete' || operation === 'replace')
            driftDestructive++;
        if (drift.length < 40)
            drift.push({
                address: str(resource.address) || '(sin dirección)',
                kind: operation,
                sensitive: isSensitive(change.before_sensitive) || isSensitive(change.after_sensitive),
                provider: str(resource.provider_name, 100) || 'n/d'
            });
    }
    const notices = [
        'Archivo elegido por el estudiante; la academia NO lo generó ni verificó su procedencia.',
        'Se excluyen expresamente valores before/after, secretos, outputs, variables y contenido de state.',
        'Una operación no-op no prueba que el entorno real esté seguro; revisión humana obligatoria.',
        'Las direcciones de recursos y nombres de providers pueden identificar sistemas internos: trata el informe exportado como dato privado.'
    ];
    if (driftEntries.length)
        notices.push(`El plan reporta ${driftEntries.length} evento(s) resource_drift; se muestran hasta 40, sin valores antes/después.`);
    if (changes.length > 100)
        notices.push(`Se muestran 100 de ${changes.length} cambios. Totales calculados sobre todo el archivo.`);
    if (destructive)
        notices.push(`${destructive} acciones destructivas o de reemplazo requieren revisión de impacto, backups y aprobación.`);
    if (summary.unknown)
        notices.push(`${summary.unknown} acciones desconocidas: verifica la versión/formato del plan.`);
    if (sensitiveCount)
        notices.push(`Indicadores sensitive detectados en ${sensitiveCount} cambios; no se mostrarán datos de recursos.`);
    return {
        provenance: 'USER_SUPPLIED_TERRAFORM_JSON',
        formatVersion: str(root.format_version, 20),
        terraformVersion: str(root.terraform_version, 80) || 'desconocida',
        total: changes.length,
        shown: shown.length,
        destructive,
        sensitiveCount,
        driftCount: driftEntries.length,
        driftDestructive,
        drift,
        summary,
        changes: shown,
        notices
    };
}
