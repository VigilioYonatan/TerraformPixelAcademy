/**
 * Declarative Preact IaC Library, Reactive Glossary (`#/recursos`), and 404 Route (`F3-08`).
 */
import { filterGlossary } from './store.js';
import { ROUTES, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';
export const GLOSSARY_ENTRIES = [
    ['HCL', 'Lenguaje de configuración de HashiCorp, con bloques, argumentos y expresiones.'],
    ['Provider', 'Plugin que expone tipos de recursos y data sources para una API.'],
    ['Resource', 'Declaración de un objeto administrado por Terraform.'],
    ['Data source', 'Consulta de datos existentes, sin declarar su gestión.'],
    ['State', 'Registro del mapeo entre configuración y objetos administrados; puede contener secretos.'],
    ['Backend', 'Configuración para almacenar y bloquear state.'],
    ['Lock', 'Mecanismo que impide escritores concurrentes sobre un estado.'],
    ['Drift', 'Desviación observada entre la configuración/estado y recursos externos.'],
    ['Plan', 'Representación de cambios propuestos antes de apply.'],
    ['Apply', 'Operación que ejecuta modificaciones reales autorizadas.'],
    ['Destroy', 'Operación que plantea eliminar objetos administrados.'],
    ['Module', 'Unidad reusable de configuración con variables, recursos y outputs.'],
    ['Output', 'Contrato de valores expuestos por un módulo.'],
    ['Variable', 'Entrada parametrizable tipada del módulo.'],
    ['Local', 'Valor derivado reusable dentro de un módulo.'],
    ['for_each', 'Multiplica instancias de recursos por claves estables.'],
    ['count', 'Multiplica instancias por índice posicional.'],
    ['moved', 'Declara un traslado de dirección de recurso administrado.'],
    ['Import', 'Asocia un objeto existente a una dirección de estado.'],
    ['Remote state', 'Estado compartido gestionado en un backend externo.'],
    ['Policy as Code', 'Reglas automáticas auditables aplicadas a configuración o planes.'],
    ['OIDC', 'Identidad federada temporal para workloads, por ejemplo CI/CD.'],
    ['Sensitive', 'Marca de exposición para ciertos valores; no asegura excluirlos del state.'],
    ['Ephemeral', 'Propiedad de ciertas entradas/salidas que evita su persistencia en contextos soportados.'],
    ['Blast radius', 'Alcance potencial de un cambio o incidente.'],
    ['ADR', 'Registro de decisión arquitectónica con alternativas y consecuencias.'],
    ['FinOps', 'Gestión colaborativa de costo, valor y riesgo cloud.'],
    ['GitOps', 'Reconciliación declarativa de entornos a partir de Git.'],
    ['Mock provider', 'Sustituto de proveedor en determinadas pruebas Terraform.'],
    ['Plan fixture', 'Datos sintéticos para análisis de un plan; no provienen de CLI real.']
];
export const RESOURCE_LINKS = [
    {
        title: 'Documentación oficial Terraform',
        description: 'Lenguaje HCL, módulos, providers, state y CLI.',
        href: 'https://developer.hashicorp.com/terraform/docs',
        tag: 'Oficial'
    },
    {
        title: 'Tutoriales y guías de Terraform',
        description: 'Aprendizaje práctico y ejercicios oficiales.',
        href: 'https://developer.hashicorp.com/terraform/tutorials',
        tag: 'Oficial'
    },
    {
        title: 'Terraform test',
        description: 'Documentación del marco de pruebas, mocks y advertencias.',
        href: 'https://developer.hashicorp.com/terraform/language/tests',
        tag: 'Oficial'
    },
    {
        title: 'Backends y state',
        description: 'Protección de state y almacenamiento remoto.',
        href: 'https://developer.hashicorp.com/terraform/language/backend',
        tag: 'Oficial'
    },
    {
        title: 'Referencia HCL',
        description: 'Bloques, expresiones y funciones.',
        href: 'https://developer.hashicorp.com/terraform/language',
        tag: 'Oficial'
    },
    {
        title: 'Guía de marca HashiCorp',
        description: 'Uso descriptivo de Terraform y restricciones de marca.',
        href: 'https://www.hashicorp.com/en/trademark-policy',
        tag: 'Legal'
    },
    {
        title: 'Open Policy Agent',
        description: 'Motor de políticas que puede complementar IaC.',
        href: 'https://www.openpolicyagent.org/docs',
        tag: 'Externo'
    },
    {
        title: 'Infracost',
        description: 'Estimaciones de costo para revisión de infraestructura.',
        href: 'https://www.infracost.io/docs/',
        tag: 'Externo'
    },
    {
        title: 'Vigilio: guía de implementación',
        description: 'Archivo MASTER_SPEC auditado incluido en docs del ZIP.',
        href: './docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md',
        tag: 'Proyecto'
    }
];
function chip(text, variant = 'purple') {
    return h('span', { className: `chip chip-${variant}` }, text);
}
function sectionHead(eyebrow, title) {
    return h('div', { className: 'section-heading' }, h('div', {}, h('div', { className: 'eyebrow' }, eyebrow), h('h2', {}, title)));
}
export function ResourcesPage({ glossarySearch }) {
    const visibleGlossary = filterGlossary(GLOSSARY_ENTRIES, glossarySearch);
    return h('div', { id: 'resources-page' }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Recursos')), h('div', { className: 'eyebrow' }, 'BIBLIOTECA IAC'), h('h1', { className: 'page-title' }, 'Recursos para aprender mejor'), h('p', { className: 'page-lead' }, 'Enlaces a documentación oficial, guías técnicas y un glosario de conceptos clave para revisar antes de usar infraestructura real.'), h('section', { className: 'section' }, sectionHead('BIBLIOTECA', 'Documentación y herramientas'), h('div', { className: 'resource-grid' }, ...RESOURCE_LINKS.map((r) => {
        const external = r.href.startsWith('https:');
        return h('div', { key: r.title, className: 'resource-card' }, chip(r.tag, 'purple'), h('h3', { className: 'mt-11' }, r.title), h('p', {}, r.description), h('a', {
            href: r.href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noopener noreferrer' : undefined
        }, 'Consultar ↗'));
    }))), h('section', { className: 'section' }, sectionHead('A—Z', 'Glosario de Terraform'), h('input', {
        className: 'search-bar',
        type: 'search',
        id: 'glossary-search',
        value: glossarySearch,
        placeholder: '⌕ Buscar un término…',
        'aria-label': 'Buscar glosario'
    }), h('div', { className: 'space16' }), visibleGlossary.length > 0
        ? h('div', { className: 'cards-3', id: 'glossary-list' }, ...visibleGlossary.map(([term, description]) => h('div', { key: term, className: 'card glossary-tile' }, h('h3', { className: 'glossary-term' }, term), h('p', { className: 'card-desc mt-9' }, description))))
        : h('div', { className: 'card', role: 'status' }, h('h3', { className: 'card-title' }, 'Sin términos coincidentes'), h('p', { className: 'card-desc' }, 'No se encontraron conceptos en el glosario para esa búsqueda.'))));
}
export function NotFoundPage() {
    return h('div', { id: 'not-found-page', className: 'empty-state' }, h('img', {
        src: mascotUrl('pensando'),
        alt: 'Terra confuso',
        width: 210,
        className: 'mx-auto'
    }), h('h1', { className: 'page-title' }, 'No encontré esta ruta'), h('p', {}, 'Revisa la URL o regresa al inicio.'), h('div', { className: 'space24' }), h('a', { href: ROUTES.home, className: 'btn btn-primary' }, 'Volver a la academia →'));
}
