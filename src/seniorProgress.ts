import {getSeniorDrill,evaluateSeniorDrill} from './seniorWhatIf.js';
import type {AcademyState} from './engine.js';
import {canCompleteSenior} from './engine.js';
import type {Case} from './senior.js';

/** Capstone notes are declarations by a student, NOT external evidence validation. */
export function capstoneNoteValid(value:string):boolean {
 const text=value.trim();
 if(text.length<45||text.length>2500) return false;
 if(!/\b(PASS|FAIL|NOT_RUN|BLOCKED)\b/i.test(text))return false;
 if(/^(?:todo|tbd|pendiente|x+|\.{3})$/i.test(text))return false;
 return true;
}
export function capstoneGate(state:AcademyState):{ok:boolean;reasons:string[]} {
 const reasons:string[]=[];
 if(state.capstoneDone.length!==8||new Set(state.capstoneDone).size!==8 || !state.capstoneDone.every(n=>Number.isInteger(n)&&n>=0&&n<8))
  reasons.push('Marca los ocho hitos S18 tras documentar su evidencia.');
 for(let i=0;i<8;i++)if(!capstoneNoteValid(state.capstoneEvidence[String(i)]||''))
  reasons.push(`Hito ${i+1}: documenta al menos 45 caracteres, control/riesgo y estado PASS/FAIL/NOT_RUN/BLOCKED.`);
 const texts=Array.from({length:8},(_,i)=>(state.capstoneEvidence[String(i)]||'').toLowerCase().replace(/\s+/g,' ').trim());
 if(new Set(texts).size!==8)reasons.push('Cada hito requiere evidencia distinta, no el mismo texto copiado.');
 return {ok:reasons.length===0,reasons};
}
export function seniorGate(state:AcademyState,c:Case):{ok:boolean;reasons:string[]} {
 const gate=canCompleteSenior(state.seniorDecisions[c.id]===c.correct,state.seniorChecklist[c.id]||[],state.seniorEvidence[c.id]||'');
 const drill=getSeniorDrill(c.id);
 if(!drill || !evaluateSeniorDrill(c.id,state.seniorDrillAnswers[c.id]??-1)?.ok) gate.reasons.push('Resuelve correctamente el desafío what-if de este incidente.');
 gate.ok=gate.reasons.length===0;
 if(c.id!=='S18')return gate;
 const capstone=capstoneGate(state);
 return {ok:gate.ok&&capstone.ok,reasons:[...gate.reasons,...capstone.reasons]};
}
/** Remove stale/forged completion from imported or subsequently edited local data. */
export function reconcileSeniorCompletion(state:AcademyState,cases:Case[]):string[] {
 const index=new Map(cases.map(c=>[c.id,c]));
 const before=state.seniorCompleted;
 state.seniorCompleted=before.filter(id=>{const c=index.get(id);return !!c && seniorGate(state,c).ok;});
 return before.filter(id=>!state.seniorCompleted.includes(id));
}
