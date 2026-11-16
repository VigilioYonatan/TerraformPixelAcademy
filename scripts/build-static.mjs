import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css']) await cp(file,`dist/${file}`);
for(const folder of ['app','assets','docs']) await cp(folder,`dist/${folder}`,{recursive:true});
console.log('Static build listo en dist/ (ES modules compilados, sin runtime npm)');
