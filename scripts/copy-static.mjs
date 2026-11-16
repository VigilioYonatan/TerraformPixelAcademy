import {cp,mkdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await cp('assets','dist/assets',{recursive:true,force:true});
await mkdir('dist/docs',{recursive:true});
await cp('docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md','dist/docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md',{recursive:true,force:true});
console.log('Assets/terra, packs ZIP y especificación copiados a dist/.');
