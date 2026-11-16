import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
const binary=process.platform==='win32'?'node_modules/.bin/':'node_modules/.bin/';
const ext=process.platform==='win32'?'.cmd':'';
const tsc=spawn(resolve(binary+'tsc'+ext),['-p','tsconfig.json','--watch','--preserveWatchOutput'],{stdio:'inherit',shell:process.platform==='win32'});
const vite=spawn(resolve(binary+'vite'+ext),['--host','0.0.0.0'],{stdio:'inherit',shell:process.platform==='win32'});
const stop=()=>{tsc.kill();vite.kill()};
process.on('SIGINT',stop);process.on('SIGTERM',stop);
