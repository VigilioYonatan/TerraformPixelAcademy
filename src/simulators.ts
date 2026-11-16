export function parseCIDR(cidr:string):{start:number;end:number;prefix:number}|null{
 const m=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d|[12]\d|3[0-2])$/.exec(cidr.trim());
 if(!m)return null;
 const bytes=m.slice(1,5).map(Number);if(bytes.some(n=>n>255))return null;
 const prefix=Number(m[5]);
 const address=(((bytes[0]*0x1000000)+(bytes[1]<<16)+(bytes[2]<<8)+bytes[3])>>>0);
 const mask=prefix===0?0:(0xffffffff<<(32-prefix))>>>0;
 const start=(address&mask)>>>0;
 return {start,end:(start|( (~mask)>>>0))>>>0,prefix};
}
export function cidrOverlap(a:string,b:string):boolean|null{
 const left=parseCIDR(a),right=parseCIDR(b);
 if(!left||!right)return null;
 return left.start<=right.end&&right.start<=left.end;
}
export function planIntegrity(expected:{commit:string;env:string;digest:string},actual:{commit:string;env:string;digest:string}):{ok:boolean;problems:string[]}{
 const problems=[];
 if(expected.commit!==actual.commit)problems.push('commit diferente');
 if(expected.env!==actual.env)problems.push('entorno diferente');
 if(expected.digest!==actual.digest)problems.push('digest del artefacto diferente');
 return {ok:problems.length===0,problems};
}
export function estimateCost(replicas:number,costPerReplica=61,budget=250){
 const estimate=Math.max(0,Math.min(50,Math.floor(replicas)))*costPerReplica;
 return {estimate,budget,exceeds:estimate>budget,provenance:'SYNTHETIC_FIXTURE' as const};
}
