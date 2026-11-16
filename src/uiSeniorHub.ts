/** Senior dashboard as native, declarative Preact UI (no HTML string injection). */
import {h} from './vendor/preact.mjs';
import type {AcademyState} from './engine.js';
import type {Case} from './senior.js';

interface Props {state:AcademyState; cases:readonly Case[]}
function chip(value:string,tone='purple'){
 return h('span',{className:`chip chip-${tone}`},value);
}
function stat(value:string|number,description:string,icon:string){
 return h('div',{className:'stat-pill'},
   h('span',{style:'font-size:28px;color:var(--purple)'},icon),
   h('div',{},h('div',{className:'number'},String(value)),h('div',{className:'caption'},description))
 );
}
export function SeniorDashboard({state,cases}:Props){
 const completed=state.seniorCompleted.length;
 return h('div',{id:'senior-dashboard'},
   h('div',{className:'breadcrumb'},h('a',{href:'#/inicio'},'Inicio'),' / ',h('span',{},'Senior Mode')),
   h('section',{className:'senior-hero'},
     h('div',{},
       h('div',{className:'eyebrow',style:'color:#dab3ff'},'♛ TERRAPIXEL · SENIOR MODE'),
       h('h1',{},'Decide como un',h('br',{}),h('span',{style:'color:#c68dff'},'Platform Engineer')),
       h('p',{className:'hero-desc'},'Investiga incidentes de Terraform, revisa planes, protege el state y defiende tus decisiones con evidencia.'),
       h('div',{className:'flex-wrap'},
         h('button',{type:'button',className:'btn btn-primary','data-action':'toggle-senior'},state.seniorEnabled?'✓ Senior Mode activo':'Activar Senior Mode'),
         h('a',{className:'btn btn-ghost',href:'#/senior/S01'},'Empezar S01 →'),
         h('button',{type:'button',className:'btn btn-soft','data-action':'export-portfolio'},'↓ Portafolio Senior (18 ADR)'),
         h('a',{className:'btn btn-soft',href:'#/planes'},'Revisar gate de plan →'),
         h('a',{className:'btn btn-soft',href:'#/evidencias'},'Evidencias CLI →')
       )
     ),
     h('img',{src:'./assets/terra/senior.png',alt:'Terra, ingeniero Senior en pixel art'})
   ),
   h('div',{className:'space24'}),
   h('div',{className:'cards-4'},
     stat(cases.length,'Escenarios','♛'),
     stat(new Set(cases.map(c=>c.pillar)).size,'Dominios técnicos','⚑'),
     stat(completed,'Casos autoevaluados','✓'),
     stat(`${Math.round(completed/Math.max(1,cases.length)*100)}%`,'Avance Senior','✦')
   ),
   h('div',{className:'space24'}),
   h('div',{className:'notice'},'Una autoevaluación comprueba respuestas y formato del ADR. NO verifica semánticamente evidencias ni acredita experiencia profesional. Las simulaciones no ejecutan Terraform real.'),
   h('section',{className:'section'},
     h('div',{className:'section-heading'},
       h('div',{},h('div',{className:'eyebrow'},'18 ESCENARIOS · INFRASTRUCTURE AS CODE'),h('h2',{},'Mapa Senior')),
       chip(`${completed}/${cases.length} completados`)
     ),
     h('label',{className:'field-label',htmlFor:'senior-search'},'Buscar un caso Senior'),
     h('input',{id:'senior-search',type:'search',className:'search-bar',placeholder:'Buscar incidentes, dominios o controles…','aria-label':'Buscar casos Senior'}),
     h('div',{className:'space16'}),
     h('div',{className:'cards-3',id:'senior-case-list'},...cases.map(c=>{
       const done=state.seniorCompleted.includes(c.id);
       return h('a',{
         href:`#/senior/${c.id}`,className:'senior-case',
         'data-title':`${c.id} ${c.title} ${c.pillar} ${c.subtitle}`.toLowerCase()
       },
         h('div',{className:'flex space-between'},chip(c.id),chip(done?'✓ Autoevaluado':c.severity,done?'green':c.severity==='Crítico'?'red':'yellow')),
         h('div',{className:'eyebrow',style:'font-size:10px;margin-top:6px'},c.pillar),
         h('h3',{},c.title),h('p',{},c.subtitle),
         h('div',{className:'flex space-between'},h('span',{className:'small-note'},`${c.xp} XP`),h('span',{className:'color-purple',style:'font-size:12px;font-weight:800'},'Abrir caso →'))
       );
     }))
   ),
   h('section',{className:'section'},
     h('div',{className:'senior-banner'},
       h('div',{},h('div',{className:'eyebrow'},'CAPSTONE S18 · OCHO HITOS'),
         h('h3',{},'Diseña una plataforma IaC con límites claros'),
         h('p',{},'Estados, módulos, controles, costos y recuperación documentados en un laboratorio local.'),
         h('div',{className:'space16'}),h('a',{href:'#/senior/S18',className:'btn btn-primary'},'Abrir proyecto final →')
       ),
       h('img',{src:'./assets/terra/graduacion.png',alt:'Terra celebra su graduación'})
     )
   )
 );
}
