import { capstoneSteps } from './senior.js';
import { capstoneNoteValid, seniorGate } from './seniorProgress.js';
import { seniorSnippets } from './seniorSnippets.js';
import { evaluateSeniorDrill, getSeniorDrill } from './seniorWhatIf.js';
import { defaultSimulatorInputs } from './simulators.js';
import { h } from './vendor/preact.mjs';
const tag = (value, color = 'purple') => h('span', { className: `chip chip-${color}` }, value);
const action = (label, name, id = '', klass = 'btn btn-primary', index) => h('button', {
    type: 'button',
    className: klass,
    'data-action': name,
    'data-id': id,
    'data-index': index
}, label);
const spacer = () => h('div', { className: 'space16' });
const reviewBox = (title, body) => h('div', { className: 'case-review' }, h('b', {}, title), h('p', {}, body));
const stage = (text) => h('div', { className: 'side-step' }, text);
function simTextField(label, key, value, ariaLabel) {
    return h('div', {}, h('label', { className: 'field-label' }, label), h('input', {
        className: 'search-bar',
        type: 'text',
        'data-input': 'sim-text',
        'data-id': key,
        value,
        'aria-label': ariaLabel
    }));
}
function simNumberField(label, key, value, min, max, ariaLabel) {
    return h('div', {}, h('label', { className: 'field-label' }, label), h('input', {
        className: 'search-bar',
        type: 'number',
        min,
        max,
        'data-input': 'sim-num',
        'data-id': key,
        value,
        'aria-label': ariaLabel
    }));
}
function simCheckField(label, key, checked) {
    return h('label', { className: 'check-row' }, h('input', {
        type: 'checkbox',
        'data-input': 'sim-bool',
        'data-id': key,
        checked
    }), label);
}
function simSelectField(label, key, value, options, ariaLabel) {
    return h('div', {}, h('label', { className: 'field-label' }, label), h('select', {
        className: 'input-select',
        'data-input': 'sim-select',
        'data-id': key,
        value,
        'aria-label': ariaLabel
    }, ...options.map(([optVal, optLabel]) => h('option', { key: optVal, value: optVal, selected: value === optVal }, optLabel))));
}
function buildCaseSimulatorControls(id, inp) {
    switch (id) {
        case 'S01':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simTextField('Clave anterior for_each', 'oldKey', inp.oldKey, 'Clave anterior'), simTextField('Clave nueva for_each', 'newKey', inp.newKey, 'Clave nueva')), simCheckField('Declarar bloque moved explícito', 'hasMovedBlock', inp.hasMovedBlock), spacer(), action('Evaluar direcciones →', 'run-case-sim', id));
        case 'S02':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simNumberField('Antigüedad del lock (minutos)', 'lockAgeMinutes', inp.lockAgeMinutes, 0, 240, 'Minutos lock'), simCheckField('Writer A sigue ejecutándose en CI', 'writerActive', inp.writerActive), simCheckField('Autorización dual del owner documentada', 'lockDualApproved', inp.lockDualApproved), spacer(), action('Evaluar concurrencia de lock →', 'run-case-sim', id));
        case 'S03':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simTextField('Owner en Git (HCL)', 'hclOwner', inp.hclOwner, 'Owner Git'), simTextField('Owner observado en Cloud', 'remoteOwner', inp.remoteOwner, 'Owner Cloud')), simCheckField('La deriva modifica reglas de red / seguridad', 'driftTouchesSecurity', inp.driftTouchesSecurity), spacer(), action('Diagnosticar drift →', 'run-case-sim', id));
        case 'S04':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simSelectField('Entorno afectado', 'criticalEnv', inp.criticalEnv, [
                ['prod', 'Producción'],
                ['staging', 'Staging'],
                ['dev', 'Development']
            ], 'Entorno afectado'), simCheckField('lifecycle.prevent_destroy = true activo', 'hasPreventDestroy', inp.hasPreventDestroy), simCheckField('Backup 3-2-1 con restore drill verificado', 'hasVerifiedBackup', inp.hasVerifiedBackup), spacer(), action('Evaluar guardia anti-destrucción →', 'run-case-sim', id));
        case 'S05':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simCheckField('Pipelines escritores congelados', 'writersFrozen', inp.writersFrozen), simCheckField('Backup versionado verificado antes de migrar', 'migrationBackupVerified', inp.migrationBackupVerified), simCheckField('Bloqueo nativo S3 (use_lockfile = true) en destino', 'migrationLockEnabled', inp.migrationLockEnabled), spacer(), action('Verificar preflight migrate-state →', 'run-case-sim', id));
        case 'S06':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simSelectField('Mecanismo aplicado al secreto sintético', 'secretHandling', inp.secretHandling, [
                ['sensitive_var', 'variable sensitive = true'],
                ['ephemeral_var', 'variable ephemeral = true (Terraform >= 1.10)'],
                ['raw_output', 'output público sin redacción']
            ], 'Mecanismo de manejo de secreto'), simCheckField('El valor se pasa a un atributo que persiste en state', 'secretInState', inp.secretInState), spacer(), action('Auditar exposición en state/logs →', 'run-case-sim', id));
        case 'S07':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simTextField('Versión actual del provider', 'providerFrom', inp.providerFrom, 'Versión origen'), simTextField('Versión objetivo del provider', 'providerTo', inp.providerTo, 'Versión destino')), simCheckField('.terraform.lock.hcl fijado y verificado en PR', 'lockfilePinned', inp.lockfilePinned), spacer(), action('Evaluar compatibilidad SemVer →', 'run-case-sim', id));
        case 'S08':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simNumberField('Recursos acoplados en un solo state', 'stateResourceCount', inp.stateResourceCount, 1, 2000, 'Recursos en state'), simNumberField('Referencias circulares entre módulos', 'cycleCount', inp.cycleCount, 0, 10, 'Ciclos DAG')), spacer(), action('Analizar blast radius y acoplamiento →', 'run-case-sim', id));
        case 'S09':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simTextField('CIDR de development', 'cidrA', inp.cidrA, 'CIDR desarrollo'), simTextField('CIDR de producción', 'cidrB', inp.cidrB, 'CIDR producción')), spacer(), action('Comprobar rangos →', 'run-case-sim', id));
        case 'S10':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simTextField('Claim sub permitido en IAM OIDC', 'oidcSubject', inp.oidcSubject, 'Claim sub OIDC'), simTextField('Audience (aud) requerida', 'oidcAudience', inp.oidcAudience, 'Audience OIDC')), simCheckField('Requiere GitHub Environment protegido con reviewers', 'oidcProtectedEnv', inp.oidcProtectedEnv), spacer(), action('Validar trust policy OIDC →', 'run-case-sim', id));
        case 'S11':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simTextField('Commit del plan aprobado', 'approvedCommit', inp.approvedCommit, 'Commit aprobado'), simTextField('Commit usado para apply', 'appliedCommit', inp.appliedCommit, 'Commit aplicado')), spacer(), action('Verificar identidad del fixture →', 'run-case-sim', id));
        case 'S12':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simCheckField('Suite .tftest.hcl con mock_provider en PASS', 'mockTestsPass', inp.mockTestsPass), simCheckField('Integración ejecutada en cuenta sandbox efímera aislada', 'sandboxIntegrationPass', inp.sandboxIntegrationPass), spacer(), action('Clasificar cobertura real vs mock →', 'run-case-sim', id));
        case 'S13':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, h('div', { className: 'cards-2' }, simSelectField('Severidad del hallazgo Policy-as-Code', 'policySeverity', inp.policySeverity, [
                ['CRITICAL', 'CRITICAL'],
                ['HIGH', 'HIGH'],
                ['MEDIUM', 'MEDIUM']
            ], 'Severidad policy'), simNumberField('Vigencia solicitada (días, máx. 14)', 'exceptionTtlDays', inp.exceptionTtlDays, 0, 365, 'TTL días')), simTextField('Owner responsable del riesgo', 'exceptionOwner', inp.exceptionOwner, 'Owner de excepción'), spacer(), action('Evaluar excepción OPA/Conftest →', 'run-case-sim', id));
        case 'S14':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simNumberField('Número ficticio de réplicas (base USD 61/mes, umbral USD 250)', 'simulatedReplicas', inp.simulatedReplicas, 0, 50, 'Número de réplicas'), simCheckField('Etiquetas Owner, CostCenter y Environment presentes', 'hasFinOpsTags', inp.hasFinOpsTags), simCheckField('Mover base de datos primaria stateful a nodos Spot', 'statefulOnSpot', inp.statefulOnSpot), spacer(), action('Calcular estimación FinOps →', 'run-case-sim', id));
        case 'S15':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simNumberField('RTO cronometrado en simulacro (minutos)', 'drRtoMinutes', inp.drRtoMinutes, 1, 480, 'RTO minutos'), simCheckField('Todos los writers CI/CD pausados', 'drWritersPaused', inp.drWritersPaused), simCheckField('Revisión y aprobación dual confirmada', 'drDualApproved', inp.drDualApproved), spacer(), action('Evaluar recuperación de emergencia →', 'run-case-sim', id));
        case 'S16':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simCheckField('Terraform gestiona VPC, EKS base y Pod Identity', 'tfOwnsCluster', inp.tfOwnsCluster), simCheckField('Terraform aplica Deployments/ConfigMaps de apps', 'tfOwnsWorkloads', inp.tfOwnsWorkloads), simCheckField('Argo CD / Helm reconcilia Deployments de apps', 'gitopsOwnsWorkloads', inp.gitopsOwnsWorkloads), spacer(), action('Comprobar matriz de ownership →', 'run-case-sim', id));
        case 'S17':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simCheckField('RFC propone toda la nube en un único state monolítico', 'rfcMonolithicState', inp.rfcMonolithicState), simCheckField('Incluye plan de rollback y backup verificado', 'rfcHasRollback', inp.rfcHasRollback), simCheckField('Define gates automatizados y CODEOWNERS por capa', 'rfcHasGates', inp.rfcHasGates), spacer(), action('Priorizar hallazgos P0/P1/P2 →', 'run-case-sim', id));
        case 'S18':
            return h('div', { className: 'case-sim-controls', 'data-sim-case': id }, simSelectField('Etapa de promoción objetivo', 'capstoneTargetEnv', inp.capstoneTargetEnv, [
                ['dev', 'Development'],
                ['staging', 'Staging'],
                ['prod', 'Production']
            ], 'Entorno objetivo Capstone'), simCheckField('Gates fmt / validate / test / policy en PASS', 'capstoneGatesGreen', inp.capstoneGatesGreen), simCheckField('Identidad OIDC aislada por entorno', 'capstoneOidcScoped', inp.capstoneOidcScoped), simCheckField('Presupuesto FinOps y revisión de plan aprobados', 'capstoneFinOpsApproved', inp.capstoneFinOpsApproved), spacer(), action('Simular gate de promoción →', 'run-case-sim', id));
        default:
            return null;
    }
}
function Simulator({ scenario, state, simResult, simInputs }) {
    const id = scenario.id;
    const drill = getSeniorDrill(id);
    const selected = state.seniorDrillAnswers[id];
    const result = selected === undefined ? null : evaluateSeniorDrill(id, selected);
    const inputs = simInputs ?? defaultSimulatorInputs();
    const control = buildCaseSimulatorControls(id, inputs);
    if (!drill)
        return null;
    return h('section', { className: 'content-panel mt-20' }, h('div', { className: 'flex space-between' }, h('div', {}, h('div', { className: 'eyebrow' }, `SIMULADOR DETERMINISTA · ${id}`), h('h3', { className: 'mt-8' }, 'Prueba una hipótesis')), tag('SIMULADO', 'yellow')), spacer(), control, simResult ? h('div', { className: 'alert mt-14', role: 'status' }, simResult) : null, h('div', { className: 'what-if' }, h('div', { className: 'eyebrow' }, `DESAFÍO WHAT-IF · ${id}`), h('h3', { className: 'what-if-title' }, drill.prompt), h('div', { className: 'what-if-choices' }, ...drill.options.map((option, i) => action(`${String.fromCharCode(65 + i)}. ${option}`, 'what-if-answer', id, `btn btn-soft ${selected === i ? 'selected' : ''}`.trim(), i))), result
        ? h('div', { className: `what-if-result ${result.ok ? 'ok' : 'unsafe'}`, role: 'status' }, h('b', {}, result.ok ? '✓ Decisión defendible' : '⚠ Riesgo no resuelto'), h('p', {}, result.message), h('p', {}, h('b', {}, 'Evidencia que exigirías: '), result.next), h('small', {}, 'Ejercicio sintético, no Terraform real.'))
        : null), h('p', { className: 'small-note mt-15' }, 'No se lee state remoto ni se ejecuta Terraform. Datos sintéticos.'));
}
function ReviewSnippet({ scenario, showFix }) {
    const snip = seniorSnippets[scenario.id];
    if (!snip)
        return null;
    return h('div', {}, h('div', { className: 'space24' }), h('div', { className: 'flex space-between' }, h('div', {}, h('div', { className: 'eyebrow' }, 'FRAGMENTO DIDÁCTICO · NO EJECUTAR'), h('h3', {}, snip.file)), action(showFix ? 'Mostrar riesgo' : 'Mostrar enfoque seguro', 'review-fix', '', 'btn btn-sm btn-soft')), h('pre', { className: 'code-preview' }, h('code', {}, showFix ? snip.after : snip.before)), reviewBox('Revisión', snip.review));
}
function Capstone({ state }) {
    return h('div', {}, h('div', { className: 'space24' }), h('div', { className: 'eyebrow' }, 'CAPSTONE · 8 HITOS'), h('h3', { className: 'my-12' }, 'Checklist de entregables'), ...capstoneSteps.map((step, i) => {
        const note = state.capstoneEvidence[String(i)] || '';
        const valid = capstoneNoteValid(note);
        return h('div', { className: 'capstone-stage', key: step.name }, h('label', { className: 'check-row' }, h('input', {
            type: 'checkbox',
            id: `capstone-check-${i}`,
            'data-input': 'capstone-check',
            'data-index': i,
            checked: state.capstoneDone.includes(i),
            disabled: !valid
        }), h('span', {}, h('b', {}, `${i + 1}. ${step.name}`), h('span', { className: 'small-note' }, ` — ${step.detail}`))), h('label', { className: 'field-label', htmlFor: `capstone-note-${i}` }, `Evidencia del hito ${i + 1} (autodeclarada)`), h('textarea', {
            id: `capstone-note-${i}`,
            className: 'capstone-note',
            'data-input': 'capstone-note',
            'data-index': i,
            maxLength: 2500,
            placeholder: 'Control, riesgo, estado: NOT_RUN / PASS / FAIL / BLOCKED, responsable y siguiente paso…',
            value: note
        }), h('p', { id: `capstone-status-${i}`, className: 'small-note' }, valid
            ? 'Estructura lista. Marca el hito si revisaste la evidencia.'
            : 'Pendiente: mínimo 45 caracteres y estado PASS/FAIL/NOT_RUN/BLOCKED.'));
    }), spacer(), tag(`${state.capstoneDone.length}/8 hitos declarados`), h('p', { className: 'small-note' }, 'Las notas son autodeclaradas; sin ejecución ni aprobación externa.'));
}
function TabContent(props) {
    const c = props.scenario;
    const decision = props.state.seniorDecisions[c.id];
    const correct = decision === c.correct;
    const evidence = props.state.seniorEvidence[c.id] || '';
    if (props.tab === 'investigar')
        return h('section', { className: 'case-panel' }, h('div', { className: 'eyebrow' }, 'ETAPA 01 · INVESTIGACIÓN'), h('h2', {}, '¿Qué está ocurriendo?'), h('p', {}, c.subtitle), reviewBox('Tu misión', c.mission), h('h3', {}, 'Artefactos del incidente'), h('p', {}, c.artifacts), spacer(), h('a', { className: 'btn btn-sm btn-soft', href: `./assets/senior/${c.id}.zip`, download: `${c.id}-incident.zip` }, '↓ Descargar artefactos del incidente'), spacer(), h('div', { className: 'alert' }, h('b', {}, 'Prueba negativa: '), c.negative), h(Simulator, props), h('div', { className: 'space24' }), h('div', { className: 'flex-wrap' }, h('a', { className: 'btn btn-sm btn-soft', href: '#/planes' }, 'Explorar un plan ficticio →'), h('a', { className: 'btn btn-sm btn-soft', href: '#/grafo' }, 'Explorar dependencias →'), action('Tomar una decisión →', 'case-tab', 'decision', 'btn btn-primary btn-sm')));
    if (props.tab === 'decision')
        return h('section', { className: 'case-panel' }, h('div', { className: 'eyebrow' }, 'ETAPA 02 · DECISIÓN'), h('h2', {}, 'Escoge una respuesta defendible'), h('p', {}, c.mission), spacer(), ...c.choices.map((choice, i) => h('button', {
            key: `${c.id}-choice-${i}`,
            type: 'button',
            className: `quiz-answer ${decision === i ? (correct ? 'correct' : 'incorrect') : ''}`.trim(),
            'data-action': 'case-decision',
            'data-id': c.id,
            'data-index': i
        }, h('span', { className: 'quiz-letter' }, String.fromCharCode(65 + i)), choice)), decision !== undefined
            ? h('div', { className: `feedback ${correct ? '' : 'fail'}`.trim(), role: 'status' }, h('h3', {}, correct ? '✓ Decisión defendible' : '○ Se requiere una opción más segura'), h('p', {}, c.explanation))
            : null, h('div', { className: 'space24' }), action('Continuar al review →', 'case-tab', 'review'));
    if (props.tab === 'review')
        return h('section', { className: 'case-panel' }, h('div', { className: 'eyebrow' }, 'ETAPA 03 · CODE / ARCHITECTURE REVIEW'), h('h2', {}, 'Hallazgos y límites de prueba'), h('p', {}, 'Revisa el peligro antes de recomendar cambios. Los artefactos de este caso son sintéticos; se exige una hipótesis verificable.'), reviewBox(`Hallazgo principal (${c.pillar})`, c.negative), reviewBox('Acción profesional esperada', c.mission), reviewBox('Qué revisar en un PR / RFC', c.artifacts), h(ReviewSnippet, { scenario: c, showFix: props.showFix }), h('h3', {}, 'Rúbrica de revisión'), ...[
            'Impacto y blast radius explícitos',
            'Evidencia reproducible con fuente y fecha',
            'Control preventivo y criterio GO/NO-GO',
            'Rollback o procedimiento de contención'
        ].map((step) => stage(`✓ ${step}`)), h('div', { className: 'space24' }), action('Documentar evidencia →', 'case-tab', 'evidencia'));
    if (props.tab === 'evidencia')
        return h('section', { className: 'case-panel' }, h('div', { className: 'eyebrow' }, 'ETAPA 04 · EVIDENCIA / ADR'), h('h2', {}, 'Documenta tu decisión'), h('p', {}, 'La web comprueba secciones y longitud, no la veracidad de tu ADR; no certifica calidad ni ejecución real.'), reviewBox('Contrato de evidencia', c.evidence), h('label', { className: 'field-label', htmlFor: 'senior-evidence' }, 'Tu ADR o explicación técnica (almacenada localmente)'), h('textarea', {
            className: 'evidence-textarea',
            'data-input': 'case-evidence',
            'data-id': c.id,
            id: 'senior-evidence',
            value: evidence,
            placeholder: 'Contexto…\nDecisión y alternativas…\nRiesgos…\nEvidencia: NOT_RUN…\nRollback…'
        }), h('p', { className: 'small-note', id: 'evidence-count' }, `${evidence.trim().length} caracteres. Mínimo: 120 y cinco secciones.`), h('div', { className: 'space24' }), action('↓ Exportar mi ADR', 'export-senior', c.id, 'btn btn-soft'), ' ', action('Preparar operaciones →', 'case-tab', 'operaciones'));
    return h('section', { className: 'case-panel' }, h('div', { className: 'eyebrow' }, 'ETAPA 05 · OPERACIONES / HANDOFF'), h('h2', {}, '¿Qué ocurre después?'), h('p', {}, 'Diseña controles y handoff sin inventar ejecuciones que no han ocurrido.'), ...[
        'Antes del cambio: autorizar, respaldar y verificar owners.',
        'Durante el cambio: monitorear y detener ante un gate fallido.',
        'Si falla: contención y rollback diseñado.',
        'Después: guardar evidencia real con estado y comunicar resultados.'
    ].map((text, i) => stage(`${i + 1}. ${text}`)), reviewBox('Escenario de rehabilitación', c.negative), c.id === 'S18' ? h(Capstone, { state: props.state }) : null, h('div', { className: 'space24' }), action('← Revisar mi ADR', 'case-tab', 'evidencia'));
}
export function SeniorCasePage(props) {
    const c = props.scenario;
    const state = props.state;
    const checked = state.seniorChecklist[c.id] || [];
    const done = state.seniorCompleted.includes(c.id);
    const gate = seniorGate(state, c);
    const idx = props.cases.findIndex((x) => x.id === c.id);
    const prev = props.cases[idx - 1];
    const next = props.cases[idx + 1];
    const tabs = [
        ['investigar', 'Investigar'],
        ['decision', 'Decisión'],
        ['review', 'Code Review'],
        ['evidencia', 'Evidencia'],
        ['operaciones', 'Operaciones']
    ];
    return h('div', { id: 'preact-senior-case' }, h('div', { className: 'breadcrumb' }, h('a', { href: '#/inicio' }, 'Inicio'), ' / ', h('a', { href: '#/senior' }, 'Senior Mode'), ` / ${c.id}`), h('div', { className: 'flex-wrap' }, tag(c.id), tag(c.severity, c.severity === 'Crítico' ? 'red' : 'yellow'), tag(c.pillar, 'cyan'), h('span', { id: 'current-case-status' }, tag(done ? '✓ Autoevaluado' : 'Caso abierto', done ? 'green' : 'purple'))), h('h1', { className: 'page-title case-title-max' }, c.title), h('p', { className: 'page-lead case-lead-max' }, c.subtitle), h('div', { className: 'space24' }), h('div', { className: 'case-details' }, h('div', {}, h('nav', { className: 'case-steps', 'aria-label': 'Fases del caso' }, ...tabs.map(([id, title], i) => h('button', {
        key: id,
        type: 'button',
        className: `tab ${props.tab === id ? 'active' : ''}`.trim(),
        'data-action': 'case-tab',
        'data-id': id,
        'aria-current': props.tab === id ? 'step' : undefined
    }, `${i + 1}. ${title}`))), h(TabContent, props), h('div', { className: 'space24' }), h('div', { className: 'case-panel' }, h('div', { className: 'flex space-between' }, h('div', {}, h('div', { className: 'eyebrow' }, 'GATE DE AUTOEVALUACIÓN'), h('h2', {}, '¿Caso completado?')), h('span', { id: 'senior-gate-status' }, tag(done ? '✓ Autoevaluado' : 'Pendiente', done ? 'green' : 'yellow'))), h('p', {}, 'Se requiere decisión y what-if correctos, cuatro controles y un ADR con cinco secciones. Es autoevaluación, no verificación del contenido ni pruebas reales.'), ...gate.reasons.map((r) => stage(`○ ${r}`)), spacer(), action(`↓ Exportar informe/ADR ${c.id}`, 'export-senior', c.id, 'btn btn-soft'), ' ', h('button', {
        type: 'button',
        className: 'btn btn-primary',
        'data-action': 'finish-case',
        'data-id': c.id,
        disabled: !gate.ok
    }, done ? '✓ Revalidar caso' : '♛ Marcar autoevaluación completa')), spacer(), h('a', { href: '#/evidencias', className: 'btn btn-soft' }, 'Ver evidencia CLI real →'), h('div', { className: 'lesson-footer' }, h('a', { className: 'btn', href: prev ? `#/senior/${prev.id}` : '#/senior' }, prev ? `← ${prev.id} · ${prev.title}` : '← Todos los casos'), h('a', { className: 'btn btn-primary', href: next ? `#/senior/${next.id}` : '#/senior' }, next ? `${next.id} →` : 'Volver al dashboard'))), h('aside', { className: 'case-sidebar' }, h('div', { className: 'content-panel' }, h('div', { className: 'flex space-between' }, h('h3', {}, 'Ficha del incidente'), tag('FICTICIO', 'yellow')), h('img', {
        className: 'side-terra',
        src: `./assets/terra/${done ? 'exito' : 'arquitectura'}.png`,
        alt: 'Terra analizando arquitectura'
    }), stage(`Severidad: ${c.severity}`), stage(`Dominio: ${c.pillar}`), stage(`Puntos: ${c.xp} XP`), stage(`Evidencia: ${c.mode}`)), h('div', { className: 'content-panel' }, h('h3', {}, 'Autoverificación'), ...c.checklist.map((text, i) => h('label', { key: `${c.id}-chk-${i}`, className: 'check-row' }, h('input', {
        type: 'checkbox',
        'data-input': 'case-check',
        'data-id': c.id,
        'data-index': i,
        checked: checked.includes(i)
    }), text)), h('p', { className: 'small-note' }, 'Estas casillas son declaraciones del estudiante, no pruebas automatizadas.')))));
}
