const validKinds = [
    'create',
    'update',
    'delete',
    'replace',
    'forget',
    'read',
    'no-op',
    'unknown'
];
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
function classifyActions(actions) {
    if (!Array.isArray(actions) || actions.length === 0 || !actions.every((x) => typeof x === 'string')) {
        return { kind: 'unknown' };
    }
    if (actions.length === 1) {
        switch (actions[0]) {
            case 'no-op':
                return { kind: 'no-op' };
            case 'create':
                return { kind: 'create' };
            case 'read':
                return { kind: 'read' };
            case 'update':
                return { kind: 'update' };
            case 'delete':
                return { kind: 'delete' };
            case 'forget':
                return { kind: 'forget' };
            default:
                return { kind: 'unknown' };
        }
    }
    if (actions.length === 2) {
        if (actions[0] === 'delete' && actions[1] === 'create') {
            return { kind: 'replace', replaceOrder: 'delete-then-create' };
        }
        if (actions[0] === 'create' && actions[1] === 'delete') {
            return { kind: 'replace', replaceOrder: 'create-before-destroy' };
        }
        if (actions[0] === 'forget' && actions[1] === 'create') {
            return { kind: 'forget' };
        }
        if (actions[0] === 'create' && actions[1] === 'read') {
            return { kind: 'read' };
        }
    }
    return { kind: 'unknown' };
}
/** The caller enforces a file-size cap BEFORE reading. */
export function inspectTerraformPlan(data) {
    const root = obj(data);
    if (!/^\d+\.\d+$/.test(str(root.format_version, 20))) {
        throw new Error('JSON no reconocido: falta format_version de Terraform show -json.');
    }
    if (!Array.isArray(root.resource_changes)) {
        throw new Error('Este JSON no contiene resource_changes de un plan Terraform.');
    }
    const changes = root.resource_changes;
    const driftEntries = Array.isArray(root.resource_drift) ? root.resource_drift : [];
    if (driftEntries.length > 150000)
        throw new Error('El reporte de drift excede 150.000 cambios.');
    if (changes.length > 150000)
        throw new Error('El plan excede el máximo de 150.000 cambios.');
    const summary = Object.fromEntries(validKinds.map((key) => [key, 0]));
    const shown = [];
    let destructive = 0;
    let replaceDeleteThenCreate = 0;
    let replaceCreateBeforeDestroy = 0;
    let sensitiveCount = 0;
    for (const raw of changes) {
        const resource = obj(raw);
        const change = obj(resource.change);
        const classified = classifyActions(change.actions);
        const action = classified.kind;
        // Only metadata & sensitivity booleans are read; NEVER read before/after/variables/outputs/planned_values/state.
        const sensitive = isSensitive(change.before_sensitive) || isSensitive(change.after_sensitive);
        summary[action]++;
        if (action === 'delete' || action === 'replace')
            destructive++;
        if (classified.replaceOrder === 'delete-then-create')
            replaceDeleteThenCreate++;
        if (classified.replaceOrder === 'create-before-destroy')
            replaceCreateBeforeDestroy++;
        if (sensitive)
            sensitiveCount++;
        if (shown.length < 100) {
            const entry = {
                address: str(resource.address) || '(recurso sin dirección)',
                kind: action,
                sensitive,
                provider: str(resource.provider_name, 100) || 'n/d'
            };
            if (classified.replaceOrder) {
                entry.replaceOrder = classified.replaceOrder;
            }
            shown.push(entry);
        }
    }
    let driftDestructive = 0;
    const drift = [];
    for (const raw of driftEntries) {
        const resource = obj(raw);
        const change = obj(resource.change);
        const classified = classifyActions(change.actions);
        const operation = classified.kind;
        if (operation === 'delete' || operation === 'replace')
            driftDestructive++;
        if (drift.length < 40) {
            const entry = {
                address: str(resource.address) || '(sin dirección)',
                kind: operation,
                sensitive: isSensitive(change.before_sensitive) || isSensitive(change.after_sensitive),
                provider: str(resource.provider_name, 100) || 'n/d'
            };
            if (classified.replaceOrder) {
                entry.replaceOrder = classified.replaceOrder;
            }
            drift.push(entry);
        }
    }
    const forgottenCount = summary.forget;
    const notices = [
        'Archivo elegido por el estudiante; la academia NO lo generó ni verificó su procedencia.',
        'Se excluyen expresamente valores before/after, secretos, outputs, variables y contenido de state.',
        'Una operación no-op no prueba que el entorno real esté seguro; revisión humana obligatoria.',
        'Las direcciones de recursos y nombres de providers pueden identificar sistemas internos: trata el informe exportado como dato privado.'
    ];
    if (driftEntries.length) {
        notices.push(`El plan reporta ${driftEntries.length} evento(s) resource_drift; se muestran hasta 40, sin valores antes/después.`);
    }
    if (changes.length > 100) {
        notices.push(`Se muestran 100 de ${changes.length} cambios. Totales calculados sobre todo el archivo.`);
    }
    if (destructive) {
        notices.push(`${destructive} acciones destructivas o de reemplazo requieren revisión de impacto, backups y aprobación.`);
    }
    if (replaceDeleteThenCreate > 0) {
        notices.push(`${replaceDeleteThenCreate} reemplazo(s) delete-then-create (["delete","create"]) implican corte potencial antes de recrear el recurso.`);
    }
    if (replaceCreateBeforeDestroy > 0) {
        notices.push(`${replaceCreateBeforeDestroy} reemplazo(s) create-before-destroy (["create","delete"]): verifica cuotas dobles y colisiones de nombres únicos.`);
    }
    if (forgottenCount > 0) {
        notices.push(`${forgottenCount} operación(es) forget (bloques removed): los objetos saldrán del state sin destruirse en el proveedor cloud.`);
    }
    if (summary.unknown) {
        notices.push(`${summary.unknown} acciones desconocidas: verifica la versión/formato del plan.`);
    }
    if (sensitiveCount) {
        notices.push(`Indicadores sensitive detectados en ${sensitiveCount} cambios; no se mostrarán datos de recursos.`);
    }
    return {
        provenance: 'USER_SUPPLIED_TERRAFORM_JSON',
        formatVersion: str(root.format_version, 20),
        terraformVersion: str(root.terraform_version, 80) || 'desconocida',
        total: changes.length,
        shown: shown.length,
        destructive,
        replaceDeleteThenCreate,
        replaceCreateBeforeDestroy,
        forgottenCount,
        sensitiveCount,
        driftCount: driftEntries.length,
        driftDestructive,
        drift,
        summary,
        changes: shown,
        notices
    };
}
