var q="https://www.rsatu.ru/students/raspisanie-sessii/",ee=[{id:"session",title:"\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438",url:q},{id:"classes",title:"\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u043D\u044F\u0442\u0438\u0439",url:"https://www.rsatu.ru/students/raspisanie-zanyatiy/"}],et=new TextEncoder;async function F(e){let t=typeof e=="string"?et.encode(e):e;return[...new Uint8Array(await crypto.subtle.digest("SHA-256",t))].map(n=>n.toString(16).padStart(2,"0")).join("")}function de(e){return Array.isArray(e)?"["+e.map(de).join(",")+"]":e&&typeof e=="object"?"{"+Object.keys(e).sort().map(t=>JSON.stringify(t)+":"+de(e[t])).join(",")+"}":JSON.stringify(e)}function pe(e,t=!1){let n={};if(e?.schemaVersion!==1||!Array.isArray(e.sheets)||e.sheets.length>30)throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435");for(let a of e.sheets){if(!["groups","teachers","rooms"].includes(a.kind))throw new Error("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0432\u0438\u0434 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F");for(let r of a.entities)for(let o of r.entries){if(!/^20\d\d-\d\d-\d\d$/.test(o.date)||!Number.isInteger(o.pair)||o.pair<1||o.pair>20||typeof o.text!="string")throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C");if(t&&a.kind!=="groups")continue;let i=[a.kind,r.name,o.date,o.pair,...a.sourceId?[a.sourceId]:[]].join("|"),s=o.text.replace(/\s+/g," ").trim();if(i in n&&n[i]!==s)throw new Error("\u041F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0430\u0449\u0438\u0435 \u0437\u0430\u043F\u0438\u0441\u0438");n[i]=s}}if(!Object.keys(n).length)throw new Error("\u041F\u0443\u0441\u0442\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442 \u0431\u0430\u0437\u0443");return n}async function Te(e,t=[]){return F(de({records:pe(e),notices:t}))}function De(e,t){let n=e?pe(e,!0):{},a=pe(t,!0),r={added:0,changed:0,removed:0},o=[];for(let[i,s]of Object.entries(a))i in n?n[i]!==s&&(r.changed++,o.push({kind:"changed",key:i,before:n[i],after:s})):(r.added++,o.push({kind:"added",key:i,after:s}));for(let[i,s]of Object.entries(n))i in a||(r.removed++,o.push({kind:"removed",key:i,before:s}));return{changes:r,details:o}}var U=Uint8Array,$=Uint16Array,tt=Int32Array,Re=new U([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Qe=new U([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),nt=new U([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ne=function(e,t){for(var n=new $(31),a=0;a<31;++a)n[a]=t+=1<<e[a-1];for(var r=new tt(n[30]),a=1;a<30;++a)for(var o=n[a];o<n[a+1];++o)r[o]=o-n[a]<<5|a;return{b:n,r}},ze=Ne(Re,2),Oe=ze.b,at=ze.r;Oe[28]=258,at[258]=28;var Fe=Ne(Qe,0),rt=Fe.b,It=Fe.r,ge=new $(32768);for(m=0;m<32768;++m)J=(m&43690)>>1|(m&21845)<<1,J=(J&52428)>>2|(J&13107)<<2,J=(J&61680)>>4|(J&3855)<<4,ge[m]=((J&65280)>>8|(J&255)<<8)>>1;var J,m,te=(function(e,t,n){for(var a=e.length,r=0,o=new $(t);r<a;++r)e[r]&&++o[e[r]-1];var i=new $(t);for(r=1;r<t;++r)i[r]=i[r-1]+o[r-1]<<1;var s;if(n){s=new $(1<<t);var c=15-t;for(r=0;r<a;++r)if(e[r])for(var g=r<<4|e[r],h=t-e[r],l=i[e[r]-1]++<<h,p=l|(1<<h)-1;l<=p;++l)s[ge[l]>>c]=g}else for(s=new $(a),r=0;r<a;++r)e[r]&&(s[r]=ge[i[e[r]-1]++]>>15-e[r]);return s}),ne=new U(288);for(m=0;m<144;++m)ne[m]=8;var m;for(m=144;m<256;++m)ne[m]=9;var m;for(m=256;m<280;++m)ne[m]=7;var m;for(m=280;m<288;++m)ne[m]=8;var m,Je=new U(32);for(m=0;m<32;++m)Je[m]=5;var m;var it=te(ne,9,1);var st=te(Je,5,1),ue=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},D=function(e,t,n){var a=t/8|0;return(e[a]|e[a+1]<<8)>>(t&7)&n},he=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ot=function(e){return(e+7)/8|0},me=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new U(e.subarray(t,n))};var lt=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],T=function(e,t,n){var a=new Error(t||lt[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,T),!n)throw a;return a},ct=function(e,t,n,a){var r=e.length,o=a?a.length:0;if(!r||t.f&&!t.l)return n||new U(0);var i=!n,s=i||t.i!=2,c=t.i;i&&(n=new U(r*3));var g=function(Me){var Ue=n.length;if(Me>Ue){var je=new U(Math.max(Ue*2,Me));je.set(n),n=je}},h=t.f||0,l=t.p||0,p=t.b||0,d=t.l,b=t.d,E=t.m,u=t.n,A=r*8;do{if(!d){h=D(e,l,1);var B=D(e,l+1,3);if(l+=3,B)if(B==1)d=it,b=st,E=9,u=5;else if(B==2){var N=D(e,l,31)+257,S=D(e,l+10,15)+4,w=N+D(e,l+5,31)+1;l+=14;for(var v=new U(w),C=new U(19),f=0;f<S;++f)C[nt[f]]=D(e,l+f*3,7);l+=S*3;for(var k=ue(C),W=(1<<k)-1,K=te(C,k,1),f=0;f<w;){var z=K[D(e,l,W)];l+=z&15;var y=z>>4;if(y<16)v[f++]=y;else{var M=0,O=0;for(y==16?(O=3+D(e,l,3),l+=2,M=v[f-1]):y==17?(O=3+D(e,l,7),l+=3):y==18&&(O=11+D(e,l,127),l+=7);O--;)v[f++]=M}}var Ee=v.subarray(0,N),H=v.subarray(N);E=ue(Ee),u=ue(H),d=te(Ee,E,1),b=te(H,u,1)}else T(1);else{var y=ot(l)+4,I=e[y-4]|e[y-3]<<8,j=y+I;if(j>r){c&&T(0);break}s&&g(p+I),n.set(e.subarray(y,j),p),t.b=p+=I,t.p=l=j*8,t.f=h;continue}if(l>A){c&&T(0);break}}s&&g(p+131072);for(var Ve=(1<<E)-1,$e=(1<<u)-1,oe=l;;oe=l){var M=d[he(e,l)&Ve],V=M>>4;if(l+=M&15,l>A){c&&T(0);break}if(M||T(2),V<256)n[p++]=V;else if(V==256){oe=l,d=null;break}else{var Ie=V-254;if(V>264){var f=V-257,_=Re[f];Ie=D(e,l,(1<<_)-1)+Oe[f],l+=_}var le=b[he(e,l)&$e],ce=le>>4;le||T(3),l+=le&15;var H=rt[ce];if(ce>3){var _=Qe[ce];H+=he(e,l)&(1<<_)-1,l+=_}if(l>A){c&&T(0);break}s&&g(p+131072);var Se=p+Ie;if(p<H){var Be=o-H,_e=Math.min(H,Se);for(Be+p<0&&T(3);p<_e;++p)n[p]=a[Be+p]}for(;p<Se;++p)n[p]=n[p-H]}}t.l=d,t.p=oe,t.b=p,t.f=h,d&&(h=1,t.m=E,t.d=b,t.n=u)}while(!h);return p!=n.length&&i?me(n,0,p):n.subarray(0,p)};var dt=new U(0);var Q=function(e,t){return e[t]|e[t+1]<<8},R=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},fe=function(e,t){return R(e,t)+R(e,t+4)*4294967296};function pt(e,t){return ct(e,{i:2},t&&t.out,t&&t.dictionary)}var ve=typeof TextDecoder<"u"&&new TextDecoder,ut=0;try{ve.decode(dt,{stream:!0}),ut=1}catch{}var ht=function(e){for(var t="",n=0;;){var a=e[n++],r=(a>127)+(a>223)+(a>239);if(n+r>e.length)return{s:t,r:me(e,n-1)};r?r==3?(a=((a&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|a>>10,56320|a&1023)):r&1?t+=String.fromCharCode((a&31)<<6|e[n++]&63):t+=String.fromCharCode((a&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(a)}};function Ae(e,t){if(t){for(var n="",a=0;a<e.length;a+=16384)n+=String.fromCharCode.apply(null,e.subarray(a,a+16384));return n}else{if(ve)return ve.decode(e);var r=ht(e),o=r.s,n=r.r;return n.length&&T(8),o}}var ft=function(e,t){return t+30+Q(e,t+26)+Q(e,t+28)},gt=function(e,t,n){var a=Q(e,t+28),r=Ae(e.subarray(t+46,t+46+a),!(Q(e,t+8)&2048)),o=t+46+a,i=R(e,t+20),s=n&&i==4294967295?vt(e,o):[i,R(e,t+24),R(e,t+42)],c=s[0],g=s[1],h=s[2];return[Q(e,t+10),c,g,r,o+Q(e,t+30)+Q(e,t+32),h]},vt=function(e,t){for(;Q(e,t)!=1;t+=4+Q(e,t+2));return[fe(e,t+12),fe(e,t+4),fe(e,t+20)]};function Pe(e,t){for(var n={},a=e.length-22;R(e,a)!=101010256;--a)(!a||e.length-a>65558)&&T(13);var r=Q(e,a+8);if(!r)return{};var o=R(e,a+16),i=o==4294967295||r==65535;if(i){var s=R(e,a-12);i=R(e,s)==101075792,i&&(r=R(e,s+32),o=R(e,s+48))}for(var c=t&&t.filter,g=0;g<r;++g){var h=gt(e,o,i),l=h[0],p=h[1],d=h[2],b=h[3],E=h[4],u=h[5],A=ft(e,u);o=E,(!c||c({name:b,size:p,originalSize:d,compression:l}))&&(l?l==8?n[b]=pt(e.subarray(A,A+p),{out:new U(d)}):T(14,"unknown compression type "+l):n[b]=me(e,A,A+p))}return n}var mt=64*1024*1024;function re(e=""){return e.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi,(t,n)=>{if(n[0]==="#"){let a=parseInt(n.slice(n[1].toLowerCase()==="x"?2:1),n[1].toLowerCase()==="x"?16:10);return a>0&&a<=1114111?String.fromCodePoint(a):""}return{amp:"&",lt:"<",gt:">",quot:'"',apos:"'"}[n]??t})}function P(e,t){let n=e.match(new RegExp("(?:^|\\s)"+t+`\\s*=\\s*(["'])(.*?)\\1`,"s"));return re(n?.[2]||"")}function Le(e){return[...e.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map(t=>re(t[1])).join("")}function we(e){let t=0;for(let n of e.match(/^[A-Z]+/)?.[0]||"")t=t*26+n.charCodeAt(0)-64;return t}function At(e){let t="";for(;e;)e--,t=String.fromCharCode(65+e%26)+t,e=Math.floor(e/26);return t}function wt(e,t){let n=e.trim().match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);if(n){let r=+n[3]<100?+n[3]+2e3:+n[3],o=+n[2],i=+n[1],s=new Date(Date.UTC(r,o-1,i));return s.getUTCFullYear()===r&&s.getUTCMonth()===o-1&&s.getUTCDate()===i?s.toISOString().slice(0,10):null}let a=Number(e);return!e.trim()||!Number.isFinite(a)||a<1||a>9e4?null:new Date((t?Date.UTC(1904,0,1):Date.UTC(1899,11,30))+Math.floor(a)*864e5).toISOString().slice(0,10)}async function Ye(e,t){let n=0,a=0,r=Pe(new Uint8Array(e),{filter:d=>{if(++a>2048||(n+=d.originalSize)>mt)throw new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 Excel");return d.name.startsWith("xl/")&&/\.(xml|rels)$/.test(d.name)}});function o(d){if(!r[d])throw new Error("\u0412 XLSX \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 "+d);let b=Ae(r[d]);if(/<!DOCTYPE|<!ENTITY/i.test(b))throw new Error("XML \u0441 DTD \u0437\u0430\u043F\u0440\u0435\u0449\u0451\u043D");return b}let i=o("xl/workbook.xml"),s={};for(let d of o("xl/_rels/workbook.xml.rels").matchAll(/<(?:\w+:)?Relationship\b[^>]*>/g))s[P(d[0],"Id")]=P(d[0],"Target");let c=r["xl/sharedStrings.xml"]?[...o("xl/sharedStrings.xml").matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)].map(d=>Le(d[1])):[],g=/date1904\s*=\s*["'](?:1|true)["']/.test(i),h=[],l=[],p=0;for(let d of i.matchAll(/<(?:\w+:)?sheet\b[^>]*>/g)){let b=s[P(d[0],"r:id")];if(!b)continue;let E=b.startsWith("/")?b.slice(1):"xl/"+b;if(E.includes(".."))throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u043B\u0438\u0441\u0442\u0430");let u=o(E),A=new Map;for(let w of u.matchAll(/<(?:\w+:)?row\b([^>]*)(?<!\/)>([\s\S]*?)<\/(?:\w+:)?row>/g)){let v=+P(w[1],"r");if(!v||v>2e4)throw new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u043E\u043A");let C=new Map;for(let f of w[2].matchAll(/<(?:\w+:)?c\b([^>]*)(?<!\/)>([\s\S]*?)<\/(?:\w+:)?c>/g)){let k=we(P(f[1],"r"));if(!k||k>2e3)throw new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0441\u0442\u043E\u043B\u0431\u0446\u043E\u0432");let W=P(f[1],"t"),K=f[2].match(/<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1]||"",z=W==="s"?c[+K]:W==="inlineStr"?Le(f[2]):re(K);if(z===void 0)throw new Error("\u041F\u043E\u0432\u0440\u0435\u0436\u0434\u0451\u043D \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u0442\u0440\u043E\u043A");z.trim()&&C.set(k,z)}A.set(v,C)}for(let w of u.matchAll(/<(?:\w+:)?mergeCell\b[^>]*>/g)){let[v,C]=P(w[0],"ref").split(":");if(!C)continue;let f=we(v),k=we(C),W=+v.replace(/\D/g,""),K=+C.replace(/\D/g,"");if(K>2e4||k>2e3||(K-W+1)*(k-f+1)>5e4)throw new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u0430\u044F \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u0451\u043D\u043D\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C");let z=A.get(W)?.get(f);if(z)for(let M=W;M<=K;M++){A.has(M)||A.set(M,new Map);for(let O=f;O<=k;O++)A.get(M).has(O)||A.get(M).set(O,z)}}let B=[...A].sort((w,v)=>w[0]-v[0]),y=B.find(([w,v])=>w<=80&&/дат/i.test(v.get(1)||"")&&/групп|преподавател|помещен|аудитор/i.test(v.get(2)||""));if(!y)continue;let I=/групп/i.test(y[1].get(2))?"groups":/преподавател/i.test(y[1].get(2))?"teachers":"rooms",j=[...y[1]].filter(([w])=>w>2).sort((w,v)=>w[0]-v[0]).map(([w,v])=>({column:w,id:"",name:v.trim(),entries:[]}));for(let w of j)l.push(F(I+"|"+w.name).then(v=>{w.id=I+"-"+v.slice(0,24)}));let N=new Set,S;for(let[w,v]of B){if(w<=y[0]||(v.has(1)&&(S=wt(v.get(1),g)),!S))continue;N.add(S);let C=(v.get(2)||"").trim().match(/^(\d{1,2})\s*(?:пара|пары|п\.?)(?:\s.*)?$/i);if(!(!C||+C[1]<1||+C[1]>20))for(let f of j){let k=v.get(f.column);k?.trim()&&(f.entries.push({date:S,pair:+C[1],text:k,cell:At(f.column)+w}),p++)}}for(let w of j)delete w.column;h.push({id:"s"+h.length,title:P(d[0],"name"),kind:I,dates:[...N].sort(),entities:j})}if(await Promise.all(l),!h.length||!p)throw new Error("\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441 \u0434\u0430\u0442\u0430\u043C\u0438 \u0438 \u043F\u0430\u0440\u0430\u043C\u0438");return{schemaVersion:1,source:{name:t,pageUrl:q},sheets:h}}function ye(e){return re(e.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim()}function We(e,t=q){let n=[];for(let r of e.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){let o=P(r[1],"href"),i;try{i=new URL(o,t)}catch{continue}if(!["www.rsatu.ru","rsatu.ru"].includes(i.hostname)||!["http:","https:"].includes(i.protocol)||!/\.xlsx$/i.test(i.pathname))continue;let s=ye(r[2])||decodeURIComponent(i.pathname.split("/").pop()),c=decodeURIComponent(i.pathname),g=ye(e.slice(Math.max(0,r.index-400),r.index));if(!/ФЗО|FZO|заочн/i.test(c+" "+s+" "+g))continue;let h=(c+s).match(/20\d{2}/g)||["2000"],l=(c+s).match(/(\d{2})[._-](\d{2})[._-](20\d{2})/),p=Math.max(...h.map(Number))*1e4+(l?+l[2]*100+ +l[1]:0)+(/FZO|ФЗО|заочн/i.test(c)?1e3:0);n.push({url:i.href,name:s,score:p})}let a=[...new Set(e.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,"").split(/<[^>]+>/).map(ye).filter(r=>r.length>20&&/ФЗО|заочн|расписание звонков|\d\s*пара|экзамены.*начина/i.test(r)))].sort().slice(0,60);return{links:n.sort((r,o)=>o.score-r.score),notices:a}}var L=new TextEncoder,Z=e=>btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),X=e=>Uint8Array.from(atob(e.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-e.length%4)%4)),t=>t.charCodeAt(0)),ae=(...e)=>{let t=new Uint8Array(e.reduce((a,r)=>a+r.length,0)),n=0;for(let a of e)t.set(a,n),n+=a.length;return t};async function se(e,t){return new Uint8Array(await crypto.subtle.sign("HMAC",await crypto.subtle.importKey("raw",e,{name:"HMAC",hash:"SHA-256"},!1,["sign"]),t))}async function Ke(e,t,n){return(await se(e,ae(L.encode(t),new Uint8Array([1])))).slice(0,n)}async function yt(e,t){let n=X(e.keys.p256dh),a=X(e.keys.auth);if(n.length!==65||n[0]!==4||a.length!==16)throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u043A\u043B\u044E\u0447\u0438 push");let r=await crypto.subtle.generateKey({name:"ECDH",namedCurve:"P-256"},!0,["deriveBits"]),o=new Uint8Array(await crypto.subtle.exportKey("raw",r.publicKey)),i=await crypto.subtle.importKey("raw",n,{name:"ECDH",namedCurve:"P-256"},!1,[]),s=new Uint8Array(await crypto.subtle.deriveBits({name:"ECDH",public:i},r.privateKey,256)),c=(await se(await se(a,s),ae(L.encode("WebPush: info\0"),n,o,new Uint8Array([1])))).slice(0,32),g=crypto.getRandomValues(new Uint8Array(16)),h=await se(g,c),l=await Ke(h,"Content-Encoding: aes128gcm\0",16),p=await Ke(h,"Content-Encoding: nonce\0",12),d=ae(L.encode(JSON.stringify(t)),new Uint8Array([2]));if(d.length>3500)throw new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 push");let b=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:p},await crypto.subtle.importKey("raw",l,"AES-GCM",!1,["encrypt"]),d));return ae(g,new Uint8Array([0,0,16,0,65]),o,b)}async function xt(e,t,n){let a=Z(L.encode(JSON.stringify({typ:"JWT",alg:"ES256"}))),r=Z(L.encode(JSON.stringify({aud:new URL(e).origin,exp:Math.floor(Date.now()/1e3)+12*3600,sub:n}))),o=await crypto.subtle.importKey("jwk",t,{name:"ECDSA",namedCurve:"P-256"},!1,["sign"]),i=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},o,L.encode(a+"."+r)),s=Z(ae(new Uint8Array([4]),X(t.x),X(t.y)));return"vapid t="+a+"."+r+"."+Z(i)+", k="+s}var ie;async function bt(e){if(ie?.expires>Date.now()+6e4)return ie.value;let t=Z(L.encode(JSON.stringify({alg:"RS256",typ:"JWT"}))),n=Math.floor(Date.now()/1e3),a=Z(L.encode(JSON.stringify({iss:e.client_email,scope:"https://www.googleapis.com/auth/firebase.messaging",aud:"https://oauth2.googleapis.com/token",iat:n,exp:n+3600}))),r=X(e.private_key.replace(/-----[^-]+-----|\s/g,"")),o=await crypto.subtle.importKey("pkcs8",r,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),i=Z(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",o,L.encode(t+"."+a))),s=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:t+"."+a+"."+i}),signal:AbortSignal.timeout(15e3)});if(!s.ok)throw new Error("FCM \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430");let c=await s.json();return ie={value:c.access_token,expires:Date.now()+c.expires_in*1e3},ie.value}async function He(e,t,n){if(t.transport==="web"){let r=JSON.parse(t.payload),o=JSON.parse(e.VAPID_PRIVATE);return fetch(r.endpoint,{method:"POST",headers:{Authorization:await xt(r.endpoint,o,e.SELF_URL),TTL:"86400",Urgency:"normal","Content-Encoding":"aes128gcm","Content-Type":"application/octet-stream"},body:await yt(r,n),signal:AbortSignal.timeout(15e3)})}if(!e.FCM_SERVICE_ACCOUNT)throw new Error("FCM \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D");let a=JSON.parse(e.FCM_SERVICE_ACCOUNT);return fetch("https://fcm.googleapis.com/v1/projects/"+a.project_id+"/messages:send",{method:"POST",headers:{Authorization:"Bearer "+await bt(a),"Content-Type":"application/json"},body:JSON.stringify({message:{token:JSON.parse(t.payload).token,data:{revision:n.revision,title:n.title,body:n.body},android:{priority:"HIGH",ttl:"86400s"}}}),signal:AbortSignal.timeout(15e3)})}var xe={"/app/index.html":{content:`<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#F6F7F9">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://rgatu-calendar-api.ivan-s-2001.workers.dev; object-src 'none'; base-uri 'none'">
  <title>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u0420\u0413\u0410\u0422\u0423</title>
  <link rel="stylesheet" href="app.css">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" href="app-icon.svg" type="image/svg+xml">
  <script src="pwa.js" defer><\/script>
  <script src="app.js" defer><\/script>
</head>
<body>
  <div id="app" class="app">
    <header class="topbar">
      <div class="brand"><span class="brand-mark" aria-hidden="true"><i class="icon" data-icon="calendar"></i></span><div><b>\u0420\u0413\u0410\u0422\u0423</b><span>\u0438\u043C\u0435\u043D\u0438 \u041F. \u0410. \u0421\u043E\u043B\u043E\u0432\u044C\u0451\u0432\u0430 \xB7 \u0420\u044B\u0431\u0438\u043D\u0441\u043A</span></div></div>
      <button class="icon-button" data-action="search-toggle" aria-label="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E"><i class="icon" data-icon="search" aria-hidden="true"></i></button>
    </header>
    <main id="main"><div class="skeleton" aria-label="\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F"></div></main>
    <nav class="bottom-nav" aria-label="\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B">
      <button data-nav="schedule" aria-current="page"><i class="icon" data-icon="calendar" aria-hidden="true"></i><span>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435</span></button>
      <button data-nav="university"><i class="icon" data-icon="school" aria-hidden="true"></i><span>\u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442</span></button>
      <button data-nav="settings"><i class="icon" data-icon="settings" aria-hidden="true"></i><span>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</span></button>
    </nav>
  </div>
  <div id="overlay" class="overlay" hidden>
    <div class="scrim" data-action="close-modal"></div>
    <section id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"></section>
  </div>
  <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
</body>
</html>
`,type:"text/html"},"/app/pwa.js":{content:`'use strict';
(() => {
  if (typeof Android !== 'undefined') return;
  const API = 'https://rgatu-calendar-api.ivan-s-2001.workers.dev';
  const CACHE = 'rgatu-database-v1';
  let registration, installPrompt, checking = false;
  const owner = () => {
    let key = localStorage.getItem('rgatu-push-owner');
    if (!key) { key = [...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2, '0')).join(''); localStorage.setItem('rgatu-push-owner', key); }
    return key;
  };
  const decode = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
  async function request(path, input) {
    const response = await fetch(API + path, { ...(input ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) } : {}), signal: AbortSignal.timeout(15000), cache: 'no-store' });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || '\u0421\u0435\u0440\u0432\u0435\u0440 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D'); return data;
  }
  async function store(data) { const cache = await caches.open(CACHE); await cache.put(API + '/api/schedule', new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })); }
  async function saved() { try { const response = await (await caches.open(CACHE)).match(API + '/api/schedule'); return response ? await response.json() : null; } catch { return null; } }
  async function sync(silent = false) {
    if (checking) return; checking = true;
    try {
      const manifest = await request('/api/latest'), old = await saved();
      const changed = !old || old.revision !== manifest.revision;
      let data = old;
      if (changed) {
        const response = await fetch(API + '/api/schedule', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435');
        const text = await response.text();
        const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(x => x.toString(16).padStart(2, '0')).join('');
        data = JSON.parse(text);
        if (digest !== manifest.sha256 || data.revision !== manifest.revision) throw new Error('\u0411\u0430\u0437\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0435\u0442\u0441\u044F. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443 \u043F\u043E\u0437\u0436\u0435.');
        await store(data);
      }
      const result = { changed, data, message: changed ? '\u041E\u0442\u043A\u0440\u044B\u0442\u0430 \u043D\u043E\u0432\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0439 \u0431\u0430\u0437\u044B.' : '\u0411\u0430\u0437\u0430 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0435\u0439.' };
      if (silent) window.onAutoSync?.(result); else window.onSyncComplete?.(result);
    } catch (error) { if (!silent) window.onSyncComplete?.({ error: error.message + '. \u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0444\u043B\u0430\u0439\u043D.' }); }
    finally { checking = false; }
  }
  window.PWA = {
    enabled: false,
    async data() {
      const cached = await saved();
      if (cached) { queueMicrotask(() => sync(true)); return cached; }
      try { const data = await request('/api/schedule'); await store(data); return data; }
      catch { const response = await fetch('schedule.json'); if (!response.ok) throw new Error('\u041D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u043E\u0433\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F'); const data = await response.json(); await store(data); return data; }
    },
    sync,
    async notifications(enabled) {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) throw new Error('\u042D\u0442\u043E\u0442 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 push. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0432 Chrome \u043D\u0430 Android.');
        registration = await navigator.serviceWorker.ready;
        const current = await registration.pushManager.getSubscription();
        if (!enabled) {
          const id = localStorage.getItem('rgatu-push-id');
          if (id) await request('/api/push/unsubscribe', { id, owner: owner() }).catch(() => {});
          if (current) await current.unsubscribe();
          localStorage.removeItem('rgatu-push-id'); this.enabled = false;
        } else {
          if (await Notification.requestPermission() !== 'granted') throw new Error('\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430.');
          const config = await request('/api/config');
          const subscription = current || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decode(config.vapidPublicKey) });
          const result = await request('/api/push/subscribe', { subscription: subscription.toJSON(), owner: owner() });
          localStorage.setItem('rgatu-push-id', result.id); this.enabled = true;
        }
        window.onNotificationPermission?.(); window.notify?.(enabled ? '\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u044B' : '\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u044B');
      } catch (error) { this.enabled = false; window.onNotificationPermission?.(); window.notify?.(error.message); }
    },
    async install() {
      if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; }
      else window.notify?.('\u0412 \u043C\u0435\u043D\u044E \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \xAB\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435\xBB \u0438\u043B\u0438 \xAB\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D\xBB.');
    },
  };
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(async reg => {
      registration = reg;
      const subscription = await reg.pushManager.getSubscription();
      PWA.enabled = !!subscription && Notification.permission === 'granted' && !!localStorage.getItem('rgatu-push-id');
      window.onNotificationPermission?.();
    }).catch(() => {});
    navigator.serviceWorker.addEventListener('message', async event => { if (event.data?.type === 'schedule-updated') { const data = await saved(); if (data) window.onAutoSync?.({ changed: true, data }); } });
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync(true); });
  window.addEventListener('online', () => sync(true));
  setInterval(() => { if (document.visibilityState === 'visible') sync(true); }, 60 * 60 * 1000);
})();
`,type:"text/javascript"},"/app/app-icon-192.png":{content:"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",type:"image/png",base64:!0},"/app/app-icon.svg":{content:`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#174A8B"/><g fill="none" stroke="#FFF" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"><rect x="136" y="154" width="240" height="228" rx="24"/><path d="M136 222h240M200 130v48M312 130v48M190 278h40M282 278h40M190 330h40"/></g></svg>
`,type:"image/svg+xml"},"/app/app.css":{content:`:root{color-scheme:light;--bg:#f6f7f9;--surface:#fff;--ink:#202631;--muted:#606a7a;--line:#d6dce5;--soft:#e9edf3;--blue:#254fbf;--on-blue:#fff;--blue-soft:#e8eefc;--green:#286847;--green-soft:#e9f3ec;--amber:#805513;--amber-soft:#fbf1dc;--danger:#ac343c;--scrim:rgba(19,25,35,.48);--radius:16px;--transition:160ms ease;--viewport:100dvh;font-family:Roboto,"Segoe UI",Arial,sans-serif;font-size:16px}
:root[data-theme=dark]{color-scheme:dark;--bg:#14171c;--surface:#20252e;--ink:#eef1f6;--muted:#abb6c6;--line:#475261;--soft:#2b333f;--blue:#a4bcff;--on-blue:#152858;--blue-soft:#263654;--green:#a2d2b0;--green-soft:#243b2f;--amber:#efd193;--amber-soft:#403524;--danger:#ffb0b5;--scrim:rgba(0,0,0,.68)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);-webkit-tap-highlight-color:transparent;line-height:1.5}button,input{font:inherit}button{cursor:pointer;color:inherit}button,a,input{touch-action:manipulation}button{border:0;background:none}button:disabled{opacity:.4;cursor:default}button:active:not(:disabled),a:active{background-color:var(--soft)}button:focus-visible,a:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:3px}a{color:var(--blue);text-decoration:none}h1,h2,h3,p{margin:0}h1{font-size:30px;line-height:1.2;letter-spacing:-.7px}h2{font-size:22px;line-height:1.3;letter-spacing:-.3px}h3{font-size:18px;line-height:1.4}p{color:var(--muted)}[hidden]{display:none!important}.app{max-width:760px;margin:auto;min-height:100vh}.topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px;gap:12px}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand b{font-size:18px;letter-spacing:1.2px}.brand span:not(.brand-mark){display:block;font-size:12px;color:var(--muted)}.brand-mark{background:var(--blue);color:var(--on-blue);border-radius:12px;width:42px;height:42px;display:grid;place-items:center;flex-shrink:0}.brand-mark .icon{width:26px;height:26px}.icon{display:inline-block;width:22px;height:22px;background-color:currentColor;mask-image:var(--icon);-webkit-mask-image:var(--icon);mask-size:contain;-webkit-mask-size:contain;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;flex-shrink:0;vertical-align:middle}.icon-button{min-width:48px;min-height:48px;border-radius:12px;display:grid;place-items:center;color:var(--muted)}.icon-button.selected{color:var(--blue);background:var(--blue-soft)}main{padding:12px 20px 112px}.intro{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:4px 0 22px}.intro p{font-size:14px;margin-top:5px}.offline-label{white-space:nowrap;font-size:12px;color:var(--green);display:flex;gap:6px;align-items:center;padding-top:8px}.offline-label:before{content:"";width:6px;height:6px;border-radius:50%;background:var(--green)}.mode-switch{display:flex;padding:4px;background:var(--soft);border-radius:12px;margin-bottom:16px;gap:2px}.mode-switch button{flex:1;min-height:48px;font-size:14px;padding:8px 4px;border-radius:8px;color:var(--muted);transition:background var(--transition),color var(--transition)}.mode-switch button[aria-pressed=true]{background:var(--surface);color:var(--ink);font-weight:600}.entity-bar{display:flex;gap:8px;align-items:center;background:var(--surface);padding:8px 8px 8px 16px;border:1px solid var(--line);border-radius:var(--radius);margin-bottom:16px}.entity-select{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:56px;flex:1;min-width:0;text-align:left;padding:2px 0}.entity-select strong{display:block;font-size:22px;line-height:1.25;overflow-wrap:anywhere}.entity-select small{display:block;color:var(--muted);font-size:13px;margin-top:3px}.entity-select .icon{color:var(--muted)}.favorite-on{color:var(--amber)}.favorite-on .icon{background-color:var(--amber)}.session-note{display:flex;gap:10px;align-items:center;font-size:13px;color:var(--muted);margin:16px 0}.session-note .icon{width:18px;height:18px}.session-note span{flex:1}.session-note button{font-size:13px;color:var(--blue);min-height:48px;padding:0 8px;white-space:nowrap}.view-switch{display:flex;border-bottom:1px solid var(--line);gap:12px;margin:8px 0 20px}.view-switch button{min-height:48px;flex:1;font-size:14px;color:var(--muted);position:relative;padding:8px 2px}.view-switch button[aria-pressed=true]{color:var(--ink);font-weight:600}.view-switch button[aria-pressed=true]:after{content:"";height:3px;background:var(--blue);position:absolute;bottom:-1px;left:12px;right:12px;border-radius:2px}.date-controls{display:flex;align-items:center;gap:8px;margin-bottom:12px}.date-controls h2{font-size:20px;flex:1}.date-controls .small-button{font-size:13px;color:var(--blue);min-height:48px;padding:0 12px}.week-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin:0 0 20px}.day-button{border-radius:12px;min-height:70px;padding:7px 0;text-align:center;position:relative}.day-button small{display:block;color:var(--muted);font-size:12px}.day-button b{display:block;font-size:18px;font-weight:500}.day-button[aria-pressed=true]{background:var(--blue);color:var(--on-blue)}.day-button[aria-pressed=true] small{color:var(--on-blue)}.day-button .dot{height:4px;width:4px;border-radius:50%;background:var(--blue);display:block;margin:3px auto}.day-button[aria-pressed=true] .dot{background:var(--on-blue)}.day-button.today:not([aria-pressed=true]){box-shadow:inset 0 0 0 1px var(--blue)}.section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.section-title h2{font-size:18px}.section-title span{font-size:13px;color:var(--muted)}.event-list{display:flex;flex-direction:column;gap:12px}.event{display:block;width:100%;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:16px;transition:border-color var(--transition),background var(--transition)}.event-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}.pair{font-size:14px;font-weight:600;letter-spacing:.1px}.badge{font-size:12px;font-weight:500;color:var(--muted);background:var(--soft);padding:3px 9px;border-radius:6px;flex-shrink:0}.badge.exam{color:var(--blue);background:var(--blue-soft)}.badge.credit{color:var(--green);background:var(--green-soft)}.badge.consult{color:var(--amber);background:var(--amber-soft)}.event h3{font-size:17px;line-height:1.4;font-weight:600;overflow-wrap:anywhere;margin-bottom:12px}.event-meta{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:14px;margin-top:5px;overflow-wrap:anywhere}.event-meta .icon{width:17px;height:17px}.event-meta span{min-width:0}.event-foot{display:flex;justify-content:space-between;gap:10px;margin-top:12px;font-size:12px;color:var(--muted)}.day-group{margin-bottom:24px}.calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin-bottom:24px}.calendar .weekday{text-align:center;font-size:12px;color:var(--muted);padding:4px 0 8px}.calendar .day-button{min-height:56px}.calendar .day-button b{font-size:16px}.calendar .day-button small{font-size:10px;min-height:15px}.muted-day{opacity:.35}.empty{padding:32px 20px;text-align:center;border:1px dashed var(--line);border-radius:var(--radius);margin-top:12px}.empty .icon{width:36px;height:36px;color:var(--muted);margin-bottom:14px}.empty h3{margin-bottom:8px}.empty p{font-size:14px;max-width:320px;margin:auto}.primary,.secondary{border-radius:12px;min-height:48px;padding:12px 18px;display:inline-flex;align-items:center;justify-content:center;gap:9px;font-size:15px;font-weight:600}.primary{background:var(--blue);color:var(--on-blue)}.primary:active{background:var(--blue)!important;opacity:.88}.secondary{border:1px solid var(--line);background:var(--surface)}.full{width:100%;margin-top:16px}.search-row{margin-bottom:20px}.field-label{font-size:13px;color:var(--muted);display:block;margin-bottom:6px}.search-input{background:var(--surface);border:1px solid var(--line);border-radius:12px;min-height:48px;padding:11px 14px;width:100%;color:var(--ink);font-size:16px}.search-input::placeholder{color:var(--muted)}.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}.filter-row button{border:1px solid var(--line);border-radius:9px;padding:8px 12px;min-height:48px;font-size:13px;color:var(--muted)}.filter-row button[aria-pressed=true]{border-color:var(--blue);background:var(--blue-soft);color:var(--blue)}.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:760px;background:var(--surface);border-top:1px solid var(--line);display:flex;gap:4px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));z-index:10}.bottom-nav button{flex:1;min-height:60px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;color:var(--muted);border-radius:12px}.bottom-nav button span{font-size:12px}.bottom-nav button[aria-current=page]{color:var(--blue);background:var(--blue-soft)}.overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center}.scrim{position:absolute;inset:0;background:var(--scrim)}.modal{position:relative;background:var(--surface);border-radius:24px 24px 0 0;width:100%;max-width:760px;max-height:calc(var(--viewport) - 24px);display:flex;flex-direction:column;padding-bottom:env(safe-area-inset-bottom);box-shadow:0 -12px 48px rgba(15,30,50,.08);animation:sheet-in 200ms ease;overflow:hidden}.modal:before{content:"";width:36px;height:4px;border-radius:4px;background:var(--line);align-self:center;margin:10px 0 0;flex-shrink:0}.modal-head{padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0}.modal-head h2{font-size:22px}.modal-body{padding:0 20px 24px;overflow-y:auto;overscroll-behavior:contain;min-height:0}.picker-search{padding:0 20px 14px;flex-shrink:0}.picker-list{overflow-y:auto;padding:0 12px 20px;overscroll-behavior:contain;min-height:0}.picker-section{font-size:12px;color:var(--muted);font-weight:600;padding:16px 8px 8px}.picker-item{width:100%;min-height:52px;display:flex;align-items:center;justify-content:space-between;text-align:left;padding:12px 8px;border-radius:8px;gap:16px;overflow-wrap:anywhere}.picker-item[aria-pressed=true]{background:var(--blue-soft);color:var(--blue);font-weight:600}.picker-item small{display:block;color:var(--muted);font-size:12px}.picker-item .icon{width:18px;height:18px}.detail-subject{font-size:24px;line-height:1.3;margin:6px 0 16px}.detail-info{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line)}.detail-info .icon{color:var(--muted)}.detail-info small{font-size:12px;color:var(--muted);display:block}.raw{font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6;margin-top:12px}.raw-info{padding-top:20px}.raw-info summary{min-height:48px;cursor:pointer;color:var(--muted);font-size:14px}.source-caption{font-size:12px;color:var(--muted);margin-top:20px;overflow-wrap:anywhere}.settings-section{margin-top:26px}.settings-section h2{font-size:17px;margin-bottom:10px}.settings-box{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:16px}.settings-row{min-height:56px;display:flex;align-items:center;gap:12px;width:100%;padding:10px 0;text-align:left}.settings-row+.settings-row{border-top:1px solid var(--line)}.settings-row .icon{color:var(--muted)}.settings-row>div{flex:1;min-width:0}.settings-row b{font-size:15px;display:block;font-weight:500}.settings-row small{display:block;font-size:12px;color:var(--muted);overflow-wrap:anywhere}.settings-row input[type=checkbox]{width:24px;height:24px;accent-color:var(--blue);flex-shrink:0}.link-list{margin-top:24px}.link-row{display:flex;align-items:center;gap:14px;min-height:80px;padding:16px 0;border-bottom:1px solid var(--line);color:var(--ink)}.link-row>div{flex:1;min-width:0}.link-row b{font-size:16px;display:block}.link-row small{font-size:13px;display:block;color:var(--muted);margin-top:3px}.link-row .icon{color:var(--blue)}.note-panel{padding:16px;border-left:3px solid var(--blue);background:var(--blue-soft);border-radius:0 12px 12px 0;margin:24px 0;font-size:14px}.note-panel p{color:var(--ink)}.stats-line{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:var(--muted);margin-top:18px}.stats-line strong{color:var(--ink)}.toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);width:calc(100% - 40px);max-width:600px;padding:14px 18px;background:var(--ink);color:var(--bg);border-radius:12px;font-size:14px;z-index:80}.skeleton{height:180px;border-radius:var(--radius);background:var(--soft);margin:20px 0}.divider{height:1px;background:var(--line);margin:20px 0}.error-text{color:var(--danger);font-size:14px;margin-top:12px}.status-text{font-size:14px;margin-top:12px;color:var(--muted)}.count-label{color:var(--muted);font-size:13px}.onboarding{padding-top:12px}.onboarding>p{font-size:15px;margin:16px 0}.onboarding h2{font-size:26px}.muted{color:var(--muted)}
@keyframes sheet-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@media(min-width:600px){.topbar{padding:28px 32px 16px}main{padding:16px 32px 112px}.modal{margin:24px;border-radius:24px;max-height:calc(var(--viewport) - 48px)}.overlay{align-items:center}.event{padding:20px}.event h3{font-size:19px}}
@media(max-width:359px){.topbar{padding:16px 12px 8px}main{padding:12px 12px 112px}.brand span:not(.brand-mark){font-size:11px}.mode-switch button{font-size:12px}.day-button b{font-size:16px}.offline-label{display:none}.modal-head,.modal-body{padding-left:16px;padding-right:16px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
.intro{margin-bottom:12px}.intro h1{font-size:26px}.intro p{font-size:13px}.entity-bar{margin-bottom:8px}.session-note{margin:8px 0}.view-switch{margin:4px 0 12px}.filter-row{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:6px;margin-bottom:10px}.filter-row::-webkit-scrollbar{display:none}.filter-row button{white-space:nowrap;flex-shrink:0;min-height:44px}.week-strip{margin-bottom:14px}.day-button{min-height:60px}.date-controls{margin-bottom:6px}
`,type:"text/css"},"/app/app-icon-512.png":{content:"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juCr/3RXD79XBuA2AsB1q+b7K8kA3MZ7AFyx+fT/Z8o6YR8CwEtmTdVZq4XlBIBnTZynE9cMqwgAQJQAcNncq/TclcPBBAAgSgC4YPolevr64RgCABAlAABRAgAQJQAAUQIAECUAAFECwAXTP1lz+vrhGAIAECUAXDb3Ej135XAwAQCIEgCeNfEqPXHNsIoA8JJZ83TWamE5AeCKKVN1yjphH74UnuseZuu2H7Fp9MNtBIDX2jADRj+8hwDwNmYunIb3AACiBAAgSgAAogQAIEoAAKIEACBKAACiBAAgSgAAogQAIEoAAKIEACBKAACiBAAgSgAAonwfwMlt9f0twFa8AgCIEgCAKAEAiBKATfnqXc7Eed6TAABECQBAlAAARAnAvvzZlHNwkrclAABRArA1Vyemc4Z3JgAAUQKwOxco5nJ6NycAA3iKmMi53Z8AAEQJwAwuU8zixI4gAGN4opjCWZ1CACbxXLE/p3QQARjG08XOnM9ZPn/9/mv1GriF73pkK0b/RF4BTOV5Yx9O41BeAYznpQALGf2jCcBJyAAHM/pPQABOSAy4E0P/ZAQAIMqbwABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQJQAAUQIAECUAAFECABAlAABRAgAQ9T9PLrhWlmqITgAAAABJRU5ErkJggg==",type:"image/png",base64:!0},"/app/app.js":{content:`'use strict';
const $ = s => document.querySelector(s);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = ['calendar','calendar-month','list','search','chevron-down','chevron-left','chevron-right','star','x','moon','sun','settings','download','file-spreadsheet','school','external-link','share','map-pin','user','check','refresh','info-circle','arrow-right','users'];
const icon = name => '<i class="icon" data-icon="'+name+'" aria-hidden="true"></i>';
const isNative = typeof Android !== 'undefined';
let db, entities = [], saved = {}, state, eventMap = [], currentModal = '', returnFocus, toastTimer, updateBusy = false, syncBusy = false;
try { saved = JSON.parse(isNative ? Android.state() : localStorage.getItem('rgatu-state') || '{}'); } catch(e){}
state = Object.assign({mode:'groups',selected:{},favorites:[],view:'day',date:'',theme:'system',page:'schedule',filter:'all',query:'',showSearch:false},saved,{page:'schedule',filter:'all',query:'',showSearch:false});
const weekdays = ['\u0412\u0441','\u041F\u043D','\u0412\u0442','\u0421\u0440','\u0427\u0442','\u041F\u0442','\u0421\u0431'];
const dateObj = s => new Date(s+'T12:00:00');
const iso = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const today = () => iso(new Date());
const longDate = s => dateObj(s).toLocaleDateString('ru-RU',{day:'numeric',month:'long',weekday:'long'});
const shortDate = s => dateObj(s).toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
const monthName = s => dateObj(s).toLocaleDateString('ru-RU',{month:'long',year:'numeric'}).replace(' \u0433.','');
const selected = () => entities.find(e=>e.id===state.selected[state.mode]);
function applyIcons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>{if(icons.includes(e.dataset.icon))e.style.setProperty('--icon','url(icons/'+e.dataset.icon+'.svg)');});}
function persist(){const s=JSON.stringify({mode:state.mode,selected:state.selected,favorites:state.favorites,view:state.view,date:state.date,theme:state.theme});try{localStorage.setItem('rgatu-state',s);}catch(e){}if(isNative)Android.saveState(s);}
function applyTheme(){const dark=state.theme==='dark'||(state.theme==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';if(isNative)Android.theme(dark);}
function notify(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
let deepLinkApplied=false;
function loadDataset(data){if(!data||!Array.isArray(data.sheets)||!data.sheets.length)throw new Error('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435.');db=data;entities=[];for(const sheet of db.sheets)for(const e of sheet.entities)entities.push(Object.assign({},e,{sheet:sheet.title,kind:sheet.kind,dates:sheet.dates}));if(!entities.some(e=>e.kind===state.mode))state.mode=entities[0].kind;state.favorites=state.favorites.filter(id=>entities.some(e=>e.id===id));if(state.selected[state.mode]&&!selected())delete state.selected[state.mode];if(!deepLinkApplied){deepLinkApplied=true;const params=new URLSearchParams(location.search),name=params.get('group');if(name){const found=entities.find(e=>e.kind==='groups'&&e.name===name);if(found){state.mode='groups';state.selected.groups=found.id;state.date=params.get('date')||firstDate(found);}}}
const e=selected();if(e&&!e.dates.includes(state.date))state.date=firstDate(e);persist();render();}
function firstDate(e){const all=lessons(e);const future=all.find(x=>x.date>=today());return future?future.date:all.length?all[0].date:e.dates[0]||today();}
function choose(id){const e=entities.find(x=>x.id===id);if(!e)return;state.mode=e.kind;state.selected[e.kind]=id;state.date=firstDate(e);state.query='';state.filter='all';closeModal();persist();render();}
function parseRecord(raw,e){let text=raw.trim().replace(/\\s+/g,' ');const groups=[];const groupRe=/^([\u0410-\u042F\u0401A-Za-z][\u0410-\u042F\u0430-\u044F\u0401\u0451A-Za-z0-9]*-\\d{2}(?:-\\d+)?)\\s+/;let m;while((m=text.match(groupRe))){groups.push(m[1]);text=text.slice(m[0].length);}let room='';const roomMatch=text.match(/\\s+([\u0413\u0433\\d]+-\\d+[\u0410-\u042F\u0430-\u044FA-Za-z]?)\\s*$/);if(roomMatch){room=roomMatch[1];text=text.slice(0,roomMatch.index).trim();}if(e.kind==='rooms'&&!room)room=e.name.split(/\\s/)[0];let teacher='';const teacherMatches=[...text.matchAll(/[\u0410-\u042F\u0401][\u0430-\u044F\u0451-]+(?:\\s+[\u0410-\u042F\u0401][\u0430-\u044F\u0451-]+)?\\s+[\u0410-\u042F\u0401]\\.\\s*[\u0410-\u042F\u0401]\\./g)];if(teacherMatches.length){const t=teacherMatches[teacherMatches.length-1];teacher=t[0];text=(text.slice(0,t.index)+text.slice(t.index+t[0].length)).trim();}if(!teacher&&e.kind==='teachers')teacher=e.name;const types=[...text.matchAll(/(?:^|\\s)(\u042D\u043A\u0437\u0430\u043C\u0435\u043D|\u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u044F|\u0417\u0430\u0447[\u0435\u0451]\u0442(?: \u0441 \u043E\u0446\u0435\u043D\u043A\u043E\u0439)?|\u0417\u0430\u0449\u0438\u0442\u0430|\u041B\u0420|\u041B|\u041F)(?=\\s|$)/gi)];let type='\u0417\u0430\u043D\u044F\u0442\u0438\u0435';if(types.length){const t=types[types.length-1];type=t[1];text=(text.slice(0,t.index)+text.slice(t.index+t[0].length)).trim();}const category=/\u044D\u043A\u0437\u0430\u043C\u0435\u043D/i.test(type)?'exam':/\u0437\u0430\u0447|\u0437\u0430\u0449\u0438\u0442\u0430/i.test(type)?'credit':/\u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446/i.test(type)?'consult':'other';return{subject:text||raw.trim(),teacher,room,groups,type,category,raw};}
function lessons(e){if(!e)return[];if(e._lessons)return e._lessons;const parts=[];for(const record of e.entries){for(const line of record.text.split(/\\r?\\n+/)){if(!line.trim())continue;const data=parseRecord(line,e);parts.push(Object.assign(data,{date:record.date,start:record.pair,end:record.pair,cells:[record.cell],entity:e.name,key:record.date+'|'+line.trim().replace(/\\s+/g,' ')}));}}parts.sort((a,b)=>a.date.localeCompare(b.date)||a.start-b.start||a.subject.localeCompare(b.subject,'ru'));const merged=[];const lastByKey=new Map();for(const part of parts){const prev=lastByKey.get(part.key);if(prev&&part.start===prev.end+1){prev.end=part.end;prev.cells.push(...part.cells);}else if(prev&&part.start===prev.end){prev.cells.push(...part.cells);}else{merged.push(part);lastByKey.set(part.key,part);}}e._lessons=merged.sort((a,b)=>a.date.localeCompare(b.date)||a.start-b.start);return e._lessons;}
function filtered(e){const q=state.query.trim().toLowerCase().replace(/\u0451/g,'\u0435');return lessons(e).filter(x=>(state.filter==='all'||x.category===state.filter)&&(!q||[x.subject,x.teacher,x.room,x.raw,x.date,shortDate(x.date)].join(' ').toLowerCase().replace(/\u0451/g,'\u0435').includes(q)));}
function card(x){const idx=eventMap.push(x)-1;const range=x.start===x.end?x.start:x.start+'\u2013'+x.end;return '<button class="event" data-event="'+idx+'" aria-label="'+esc(range+' \u043F\u0430\u0440\u0430. '+x.subject+'. '+x.type)+'"><div class="event-top"><span class="pair">'+(x.start===x.end?'\u041F\u0430\u0440\u0430 ':'\u041F\u0430\u0440\u044B ')+range+'</span><span class="badge '+x.category+'">'+esc(x.type)+'</span></div><h3>'+esc(x.subject)+'</h3>'+(x.teacher?'<div class="event-meta">'+icon('user')+'<span>'+esc(x.teacher)+'</span></div>':'')+(x.room?'<div class="event-meta">'+icon('map-pin')+'<span>\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F '+esc(x.room)+'</span></div>':'')+(state.mode!=='groups'?'<div class="event-meta">'+icon('users')+'<span>'+esc(x.groups.join(', '))+'</span></div>':'')+'</button>';}
function empty(title,body,action){return '<div class="empty">'+icon('calendar')+'<h3>'+title+'</h3><p>'+body+'</p>'+(action?'<button class="secondary full" data-action="'+action+'">'+(action==='next-lesson'?'\u041A \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u043C\u0443 \u0434\u043D\u044E \u0437\u0430\u043D\u044F\u0442\u0438\u0439':'\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443')+'</button>':'')+'</div>';}
function heading(title,sub){return '<div class="intro"><div><h1>'+title+'</h1><p>'+sub+'</p></div><span class="offline-label">\u041E\u0444\u043B\u0430\u0439\u043D</span></div>';}
function dayStrip(e){const d=dateObj(state.date);d.setDate(d.getDate()-((d.getDay()+6)%7));let html='<div class="date-controls"><h2>'+esc(monthName(state.date))+'</h2><button class="small-button" data-action="today">\u0421\u0435\u0433\u043E\u0434\u043D\u044F</button><button class="icon-button" data-step="-7" aria-label="\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F">'+icon('chevron-left')+'</button><button class="icon-button" data-step="7" aria-label="\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F">'+icon('chevron-right')+'</button></div><div class="week-strip">';const eventDates=new Set(filtered(e).map(x=>x.date));for(let i=0;i<7;i++){const s=iso(d);html+='<button class="day-button '+(s===today()?'today':'')+'" data-date="'+s+'" aria-pressed="'+(s===state.date)+'"><small>'+weekdays[d.getDay()]+'</small><b>'+d.getDate()+'</b>'+(eventDates.has(s)?'<span class="dot"></span>':'')+'</button>';d.setDate(d.getDate()+1);}return html+'</div>';}
function calendar(e){const date=dateObj(state.date);const start=new Date(date.getFullYear(),date.getMonth(),1,12);const end=new Date(date.getFullYear(),date.getMonth()+1,0,12);const map={};for(const x of filtered(e))map[x.date]=(map[x.date]||0)+1;let html='<div class="date-controls"><h2>'+esc(monthName(state.date))+'</h2><button class="icon-button" data-month="-1" aria-label="\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446">'+icon('chevron-left')+'</button><button class="icon-button" data-month="1" aria-label="\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446">'+icon('chevron-right')+'</button></div><div class="calendar">';for(const w of ['\u041F\u043D','\u0412\u0442','\u0421\u0440','\u0427\u0442','\u041F\u0442','\u0421\u0431','\u0412\u0441'])html+='<div class="weekday">'+w+'</div>';for(let i=0;i<(start.getDay()+6)%7;i++)html+='<span></span>';for(let i=1;i<=end.getDate();i++){const d=new Date(date.getFullYear(),date.getMonth(),i,12),s=iso(d);html+='<button class="day-button '+(s===today()?'today':'')+'" data-date="'+s+'" aria-pressed="'+(s===state.date)+'" aria-label="'+esc(shortDate(s)+(map[s]?', \u0437\u0430\u043D\u044F\u0442\u0438\u0439 '+map[s]:', \u0431\u0435\u0437 \u0437\u0430\u043D\u044F\u0442\u0438\u0439'))+'"><b>'+i+'</b><small>'+(map[s]?map[s]+' \u0437\u0430\u043D.':'')+'</small></button>';}return html+'</div>';}
function renderSchedule(){const e=selected();let html=heading('\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435','\u0417\u0430\u043E\u0447\u043D\u043E\u0435 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435');html+='<div class="mode-switch" aria-label="\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F">'+[['groups','\u0413\u0440\u0443\u043F\u043F\u044B'],['teachers','\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438'],['rooms','\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438']].filter(([k])=>entities.some(x=>x.kind===k)).map(([k,t])=>'<button data-mode="'+k+'" aria-pressed="'+(state.mode===k)+'">'+t+'</button>').join('')+'</div>';html+='<div class="entity-bar"><button class="entity-select" data-action="picker" aria-haspopup="dialog"><div><strong>'+esc(e?e.name:state.mode==='groups'?'\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443':state.mode==='teachers'?'\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C':'\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F')+'</strong><small>'+esc(e?e.sheet:'\u041D\u0430\u0439\u0434\u0438\u0442\u0435 \u0441\u0432\u043E\u0451 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435')+'</small></div>'+icon('chevron-down')+'</button>'+(e?'<button class="icon-button '+(state.favorites.includes(e.id)?'favorite-on':'')+'" data-action="favorite" aria-label="'+(state.favorites.includes(e.id)?'\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E':'\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435')+'" aria-pressed="'+state.favorites.includes(e.id)+'">'+icon('star')+'</button>':'')+'</div>';if(!e){html+='<div class="onboarding"><h2>\u0412\u0441\u044F \u0441\u0435\u0441\u0441\u0438\u044F \u043F\u043E\u0434 \u0440\u0443\u043A\u043E\u0439</h2><p>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443 \u043E\u0434\u0438\u043D \u0440\u0430\u0437. \u0414\u0430\u0442\u044B, \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B, \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438 \u0438 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438 \u0431\u0443\u0434\u0443\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0431\u0435\u0437 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430.</p><button class="primary full" data-action="picker">\u0412\u044B\u0431\u0440\u0430\u0442\u044C '+(state.mode==='groups'?'\u0433\u0440\u0443\u043F\u043F\u0443':state.mode==='teachers'?'\u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044F':'\u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044E')+icon('arrow-right')+'</button></div><div class="stats-line"><span><strong>'+entities.filter(x=>x.kind==='groups').length+'</strong> \u0433\u0440\u0443\u043F\u043F</span><span><strong>'+db.sheets.length+'</strong> \u043B\u0438\u0441\u0442\u0430 Excel</span></div>';return html;}
if(state.showSearch)html+='<div class="search-row"><label class="field-label" for="schedule-search">\u041F\u043E\u0438\u0441\u043A \u0432 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0438 '+esc(e.name)+'</label><input id="schedule-search" class="search-input" type="search" autocomplete="off" placeholder="\u041F\u0440\u0435\u0434\u043C\u0435\u0442, \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C, \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F" value="'+esc(state.query)+'"></div>';const dates=[...e.dates].sort();const archived=dates[dates.length-1]<today();html+='<div class="session-note">'+icon(archived?'info-circle':'calendar')+'<span>'+(archived?'\u0410\u0440\u0445\u0438\u0432\u043D\u0430\u044F \u0441\u0435\u0441\u0441\u0438\u044F \xB7 ':'\u0421\u0435\u0441\u0441\u0438\u044F \xB7 ')+esc(shortDate(dates[0]))+' \u2014 '+esc(shortDate(dates[dates.length-1]))+' '+dates[0].slice(0,4)+'</span><button data-action="source">\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A</button></div>';html+='<div class="view-switch" aria-label="\u0412\u0438\u0434 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F">'+[['day','\u0414\u0435\u043D\u044C'],['month','\u041C\u0435\u0441\u044F\u0446'],['all','\u0412\u0441\u044F \u0441\u0435\u0441\u0441\u0438\u044F']].map(([v,t])=>'<button data-view="'+v+'" aria-pressed="'+(state.view===v)+'">'+t+'</button>').join('')+'</div>';html+='<div class="filter-row" aria-label="\u0422\u0438\u043F \u0437\u0430\u043D\u044F\u0442\u0438\u0439">'+[['all','\u0412\u0441\u0435'],['exam','\u042D\u043A\u0437\u0430\u043C\u0435\u043D\u044B'],['credit','\u0417\u0430\u0447\u0451\u0442\u044B / \u0437\u0430\u0449\u0438\u0442\u044B'],['consult','\u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u0438']].map(([f,t])=>'<button data-filter="'+f+'" aria-pressed="'+(state.filter===f)+'">'+t+'</button>').join('')+'</div>';const all=filtered(e);if(state.query||state.view==='all'){if(!all.length)return html+empty('\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E','\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u0437\u0430\u043F\u0440\u043E\u0441 \u0438\u043B\u0438 \u0442\u0438\u043F \u0437\u0430\u043D\u044F\u0442\u0438\u0439.');const days=[...new Set(all.map(x=>x.date))];html+='<div class="section-title"><h2>'+(state.query?'\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430':'\u0412\u0441\u044F \u0441\u0435\u0441\u0441\u0438\u044F')+'</h2><span>'+all.length+' \u0437\u0430\u043D\u044F\u0442\u0438\u0439</span></div>';for(const day of days)html+='<section class="day-group"><div class="section-title"><h2>'+esc(longDate(day))+'</h2></div><div class="event-list">'+all.filter(x=>x.date===day).map(card).join('')+'</div></section>';return html;}html+=state.view==='month'?calendar(e):dayStrip(e);const dayEvents=all.filter(x=>x.date===state.date);html+='<div class="section-title"><h2>'+esc(longDate(state.date))+'</h2><span>'+dayEvents.length+' \u0437\u0430\u043D\u044F\u0442\u0438\u0439</span></div>';if(!dayEvents.length)return html+empty('\u0417\u0430\u043D\u044F\u0442\u0438\u0439 \u043D\u0435\u0442',lessons(e).length?'\u041D\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0443\u044E \u0434\u0430\u0442\u0443 \u0432 \u044D\u0442\u043E\u043C \u0444\u0430\u0439\u043B\u0435 \u043D\u0435\u0442 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0445 \u0437\u0430\u043F\u0438\u0441\u0435\u0439.':'\u0412 \u0438\u0441\u0445\u043E\u0434\u043D\u043E\u043C \u0444\u0430\u0439\u043B\u0435 \u0434\u043B\u044F \u044D\u0442\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u044B \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439.',lessons(e).length?'next-lesson':null);return html+'<div class="event-list">'+dayEvents.map(card).join('')+'</div><p class="source-caption">\u0423\u043A\u0430\u0437\u0430\u043D\u044B \u043D\u043E\u043C\u0435\u0440\u0430 \u043F\u0430\u0440 \u0438\u0437 Excel. \u0412\u0440\u0435\u043C\u044F \u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043B\u044F \u0437\u0430\u043E\u0447\u043D\u043E\u0439 \u0444\u043E\u0440\u043C\u044B \u0432 \u044D\u0442\u043E\u043C \u0444\u0430\u0439\u043B\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442.</p>';}
const links=[['\u041B\u041A1 \xB7 \u043B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442','old.rsatu.ru','https://old.rsatu.ru/fzo/kod.php','user'],['\u041B\u041A2 \xB7 \u043B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442','lk.rsatu.ru','https://lk.rsatu.ru/user/sign-in/login?_referrer=%2Fsite%2Findex','user'],['\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438','\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B \u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F','https://www.rsatu.ru/students/raspisanie-sessii/','calendar'],['\u0424\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442 \u0437\u0430\u043E\u0447\u043D\u043E\u0433\u043E \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F','\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E\u0431 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0438 \u043D\u0430 \u0424\u0417\u041E','https://www.rsatu.ru/zaochnoe/','school'],['\u041E\u0431\u0443\u0447\u0430\u044E\u0449\u0438\u043C\u0441\u044F \u0424\u0417\u041E','\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u0434\u043B\u044F \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u043E\u0432 \u0437\u0430\u043E\u0447\u043D\u043E\u0439 \u0444\u043E\u0440\u043C\u044B','https://www.rsatu.ru/zaochnoe/students/','file-spreadsheet'],['\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u043D\u044F\u0442\u0438\u0439','\u0421\u0440\u043E\u043A\u0438 \u0437\u0430\u043D\u044F\u0442\u0438\u0439 \u0438 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0433\u0440\u0443\u043F\u043F','https://www.rsatu.ru/students/raspisanie-zanyatiy/','list'],['\u0426\u0435\u043D\u0442\u0440 \u043F\u043E \u0440\u0430\u0431\u043E\u0442\u0435 \u0441 \u043E\u0431\u0443\u0447\u0430\u044E\u0449\u0438\u043C\u0438\u0441\u044F','\u0423\u0447\u0435\u0431\u043D\u044B\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F','https://www.rsatu.ru/students/tsentr-po-rabote-s-obuchayushchimisya/','users']];
function renderUniversity(){return heading('\u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442','\u0420\u044B\u0431\u0438\u043D\u0441\u043A\u0438\u0439 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0430\u0432\u0438\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0443\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442')+'<div class="note-panel"><p>\u0420\u0413\u0410\u0422\u0423 \u0438\u043C\u0435\u043D\u0438 \u041F. \u0410. \u0421\u043E\u043B\u043E\u0432\u044C\u0451\u0432\u0430. \u041F\u043E\u043B\u0435\u0437\u043D\u044B\u0435 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B \u0434\u043B\u044F \u0437\u0430\u043E\u0447\u043D\u0438\u043A\u043E\u0432.</p></div><div class="link-list">'+links.map(([title,sub,url,i])=>'<a class="link-row" href="'+url+'" data-official="'+url+'" target="_blank" rel="noopener">'+icon(i)+'<div><b>'+title+'</b><small>'+sub+'</small></div>'+icon('external-link')+'</a>').join('')+'</div><p class="source-caption">\u0412\u043D\u0435\u0448\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435. \u0414\u043B\u044F \u043D\u0438\u0445 \u043D\u0443\u0436\u0435\u043D \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442.</p>';}
function renderSettings(){let version=isNative?Android.version():'1.0.0';let enabled=isNative&&typeof Android.notificationsEnabled==='function'?Android.notificationsEnabled():!!window.PWA?.enabled;return heading('\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438','\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u0420\u0413\u0410\u0422\u0423')+(!isNative?'<button class="primary full" data-action="install">'+icon('download')+'\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C PWA \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D</button>':'')+'<section class="settings-section"><h2>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F</h2><div class="settings-box"><div class="settings-row">'+icon('file-spreadsheet')+'<div><b>\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0444\u0430\u0439\u043B</b><small>'+esc(db.source.name)+'</small></div></div><button class="settings-row" data-action="sync">'+icon('refresh')+'<div><b>\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435</b><small>\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0431\u0430\u0437\u0443 \u0438\u0437 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0430</small></div>'+icon('chevron-right')+'</button><button class="settings-row" data-action="import">'+icon('file-spreadsheet')+'<div><b>\u041E\u0442\u043A\u0440\u044B\u0442\u044C Excel \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430</b><small>XLSX \u0441 \u0433\u0440\u0443\u043F\u043F\u0430\u043C\u0438, \u0434\u0430\u0442\u0430\u043C\u0438 \u0438 \u043D\u043E\u043C\u0435\u0440\u0430\u043C\u0438 \u043F\u0430\u0440</small></div>'+icon('chevron-right')+'</button><label class="settings-row">'+icon('info-circle')+'<div><b>\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445</b><small>\u041D\u043E\u0432\u044B\u0435, \u0438\u0437\u043C\u0435\u043D\u0451\u043D\u043D\u044B\u0435 \u0438 \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u044B\u0435 \u0437\u0430\u043F\u0438\u0441\u0438</small></div><input id="notifications" type="checkbox" '+(enabled?'checked':'')+' aria-label="\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F"></label><button class="settings-row" data-action="reset">'+icon('refresh')+'<div><b>\u0412\u0435\u0440\u043D\u0443\u0442\u044C \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435</b><small>\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u0430\u044F \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0431\u0430\u0437\u0430</small></div></button></div><p class="source-caption">\u0421\u0435\u0440\u0432\u0435\u0440 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442 \u0441\u0430\u0439\u0442 \u0420\u0413\u0410\u0422\u0423 \u0440\u0430\u0437 \u0432 \u0447\u0430\u0441. \u041F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445 \u0431\u0430\u0437\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0435\u0442\u0441\u044F, \u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u0430\u043C \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.</p></section><section class="settings-section"><h2>\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435</h2><div class="mode-switch">'+[['system','\u041A\u0430\u043A \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435'],['light','\u0421\u0432\u0435\u0442\u043B\u043E\u0435'],['dark','\u0422\u0451\u043C\u043D\u043E\u0435']].map(([k,t])=>'<button data-theme="'+k+'" aria-pressed="'+(state.theme===k)+'">'+t+'</button>').join('')+'</div></section><section class="settings-section"><h2>\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435</h2><div class="settings-box"><button class="settings-row" data-action="update">'+icon('download')+'<div><b>\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E</b><small>\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0432\u0435\u0440\u0441\u0438\u044F '+esc(version)+'</small></div>'+icon('chevron-right')+'</button><button class="settings-row" data-action="page">'+icon('external-link')+'<div><b>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u044F APK</b><small>\u0412\u0435\u0440\u0441\u0438\u0438 \u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F</small></div>'+icon('chevron-right')+'</button></div></section><p class="source-caption">\u041D\u0435\u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0449\u0438\u043A. \u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0431\u0435\u0440\u0451\u0442\u0441\u044F \u0438\u0437 \u0444\u0430\u0439\u043B\u0430 \u0443\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0430 \u0438\u043B\u0438 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u0432\u0430\u043C\u0438 Excel. \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435.</p>';}
function render(){eventMap=[];$('#main').innerHTML=state.page==='schedule'?renderSchedule():state.page==='university'?renderUniversity():renderSettings();document.querySelectorAll('[data-nav]').forEach(b=>b.setAttribute('aria-current',b.dataset.nav===state.page?'page':'false'));applyIcons();}
function showModal(title,body,extra=''){returnFocus=document.activeElement;currentModal=extra||'detail';$('#modal').innerHTML='<div class="modal-head"><h2 id="modal-title">'+title+'</h2><button class="icon-button" data-action="close-modal" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C">'+icon('x')+'</button></div>'+body;$('#overlay').hidden=false;$('#app').inert=true;document.body.style.overflow='hidden';applyIcons($('#modal'));$('#modal').focus();}
function closeModal(){if($('#overlay').hidden)return;$('#overlay').hidden=true;$('#app').inert=false;document.body.style.overflow='';currentModal='';if(returnFocus&&document.contains(returnFocus))returnFocus.focus();}
function picker(){const names={groups:'\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443',teachers:'\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C',rooms:'\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F'};showModal(names[state.mode],'<div class="picker-search"><label class="field-label" for="picker-search">\u041F\u043E\u0438\u0441\u043A '+(state.mode==='groups'?'\u0433\u0440\u0443\u043F\u043F\u044B':state.mode==='teachers'?'\u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044F':'\u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438')+'</label><input id="picker-search" type="search" class="search-input" placeholder="\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0432\u0432\u043E\u0434\u0438\u0442\u044C \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" autocomplete="off"></div><div id="picker-list" class="picker-list"></div>','picker');renderPicker('');}
function renderPicker(query){const q=query.toLowerCase().trim().replace(/\u0451/g,'\u0435');const list=entities.filter(e=>e.kind===state.mode&&e.name.toLowerCase().replace(/\u0451/g,'\u0435').includes(q));let html='';const row=e=>'<button class="picker-item" data-choose="'+e.id+'" aria-pressed="'+(selected()&&selected().id===e.id)+'"><span>'+esc(e.name)+'</span>'+icon(state.favorites.includes(e.id)?'star':selected()&&selected().id===e.id?'check':'chevron-right')+'</button>';const fav=list.filter(e=>state.favorites.includes(e.id));if(fav.length)html+='<div class="picker-section">\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</div>'+fav.map(row).join('');for(const sheet of [...new Set(list.map(e=>e.sheet))]){html+='<div class="picker-section">'+esc(sheet)+'</div>'+list.filter(e=>e.sheet===sheet).map(row).join('');}$('#picker-list').innerHTML=html||'<p class="status-text">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.</p>';applyIcons($('#picker-list'));}
function detail(x){const e=selected();showModal('\u0417\u0430\u043D\u044F\u0442\u0438\u0435','<div class="modal-body"><span class="badge '+x.category+'">'+esc(x.type)+'</span><h3 class="detail-subject">'+esc(x.subject)+'</h3><div class="detail-info">'+icon('calendar')+'<div><small>'+esc(longDate(x.date))+'</small><b>'+(x.start===x.end?'\u041F\u0430\u0440\u0430 '+x.start:'\u041F\u0430\u0440\u044B '+x.start+'\u2013'+x.end)+'</b></div></div>'+(x.teacher?'<div class="detail-info">'+icon('user')+'<div><small>\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C</small>'+esc(x.teacher)+'</div></div>':'')+(x.room?'<div class="detail-info">'+icon('map-pin')+'<div><small>\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F</small>'+esc(x.room)+'</div></div>':'')+'<div class="detail-info">'+icon('users')+'<div><small>\u0413\u0440\u0443\u043F\u043F\u044B \u0432 \u0438\u0441\u0445\u043E\u0434\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438</small>'+esc(x.groups.join(', ')||e.name)+'</div></div><button class="secondary full" data-action="share" data-share="'+esc(shareText(x))+'">'+icon('share')+'\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F</button><details class="raw-info"><summary>\u0418\u0441\u0445\u043E\u0434\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C Excel</summary><div class="raw">'+esc(x.raw)+'</div><p class="source-caption">'+esc(e.sheet)+' \xB7 \u044F\u0447\u0435\u0439\u043A\u0438 '+esc(x.cells.join(', '))+'</p></details></div>');}
function shareText(x){return '\u0420\u0413\u0410\u0422\u0423 \xB7 '+(selected()?selected().name:'')+'\\n'+longDate(x.date)+'\\n'+(x.start===x.end?'\u041F\u0430\u0440\u0430 '+x.start:'\u041F\u0430\u0440\u044B '+x.start+'\u2013'+x.end)+'\\n'+x.subject+' \xB7 '+x.type+(x.teacher?'\\n'+x.teacher:'')+(x.room?'\\n\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F '+x.room:'');}
function source(){showModal('\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F','<div class="modal-body"><p>'+esc(db.source.name)+'</p><div class="note-panel"><p>\u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B \u0438 \u043D\u043E\u0432\u044B\u0435 \u0444\u0430\u0439\u043B\u044B \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0435\u0442 \u0443\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442. \u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0444\u0430\u0439\u043B \u043C\u043E\u0436\u043D\u043E \u043F\u0440\u043E\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u0431\u0435\u0437 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430.</p></div><a class="secondary full" href="'+links[2][2]+'" data-official="'+links[2][2]+'">'+icon('external-link')+'\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430</a><button class="primary full" data-action="sync">'+icon('refresh')+'\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435</button><button class="secondary full" data-action="import">'+icon('file-spreadsheet')+'\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439 Excel</button></div>');}
function checkUpdate(){if(updateBusy)return;updateBusy=true;showModal('\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F','<div class="modal-body"><p class="status-text">\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E\u2026</p></div>','update');if(isNative)Android.checkUpdate();else window.onUpdate({available:false,versionName:'1.0.0'});}
window.onUpdate = result => {updateBusy=false;if(currentModal!=='update')return;if(result.error){showModal('\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F','<div class="modal-body"><p class="error-text">'+esc(result.error)+'</p><button class="secondary full" data-action="update">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button></div>','update');return;}showModal('\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F','<div class="modal-body"><h3>'+(result.available?'\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0432\u0435\u0440\u0441\u0438\u044F '+esc(result.versionName):'\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F')+'</h3><p class="status-text">'+esc(result.available?result.notes||'\u0421\u043A\u0430\u0447\u0430\u0439\u0442\u0435 APK \u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u043F\u043E\u0432\u0435\u0440\u0445 \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u0432\u0435\u0440\u0441\u0438\u0438.':('\u0412\u0435\u0440\u0441\u0438\u044F '+result.versionName))+'</p>'+(result.available?'<button class="primary full" data-action="download" data-apk="'+esc(result.apk)+'">'+icon('download')+'\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435</button>':'')+'</div>','update');};
window.onImportStart = () => {closeModal();showModal('\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C Excel','<div class="modal-body"><p class="status-text">\u0427\u0438\u0442\u0430\u0435\u043C \u0433\u0440\u0443\u043F\u043F\u044B, \u0434\u0430\u0442\u044B \u0438 \u0437\u0430\u043D\u044F\u0442\u0438\u044F\u2026</p></div>','import');};
window.onImportError = r => showModal('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u0430\u0439\u043B','<div class="modal-body"><p class="error-text">'+esc(r.error)+'</p><button class="primary full" data-action="import">\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439 \u0444\u0430\u0439\u043B</button></div>');
window.onDataset = data => {closeModal();loadDataset(data);notify('\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E');};
window.onSyncComplete = result => {syncBusy=false;closeModal();if(result.error){showModal('\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F','<div class="modal-body"><p class="error-text">'+esc(result.error)+'</p><button class="secondary full" data-action="sync">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button></div>');return;}if(result.data)loadDataset(result.data);showModal('\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F','<div class="modal-body"><h3>'+(result.changed?'\u0411\u0430\u0437\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430':'\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u043D\u0435\u0442')+'</h3><p class="status-text">'+esc(result.message||'\u041E\u0442\u043A\u0440\u044B\u0442\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435.')+'</p></div>');};
window.onNotificationPermission = () => {if(state.page==='settings')render();};
window.onAutoSync = result => {if(!result.error&&result.changed&&result.data){loadDataset(result.data);notify('\u0411\u0430\u0437\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430');}};
window.refreshFromDevice = () => {if(isNative){try{const data=JSON.parse(Android.data());if(data.revision&&data.revision!==db.revision)loadDataset(data);}catch(e){}}};
window.handleBack = () => {if(!$('#overlay').hidden){closeModal();return true;}if(state.showSearch){state.showSearch=false;state.query='';render();return true;}if(state.page!=='schedule'){state.page='schedule';render();return true;}return false;};
function sync(){if(syncBusy)return;if(!isNative){syncBusy=true;showModal('\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F','<div class="modal-body"><p class="status-text">\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0430\u0437\u0435\u2026</p></div>','sync');PWA.sync();return;}syncBusy=true;showModal('\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F','<div class="modal-body"><p class="status-text">\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0430\u0437\u0435\u2026</p></div>','sync');Android.syncData();}
document.addEventListener('click',async event=>{const target=event.target.closest('button,a,[data-action]');if(!target)return;const d=target.dataset;if(d.official){if(isNative){event.preventDefault();Android.openOfficial(d.official);}return;}if(d.choose){choose(d.choose);return;}if(d.event!=null){detail(eventMap[Number(d.event)]);return;}if(d.date){state.date=d.date;persist();render();return;}if(d.step){const day=dateObj(state.date);day.setDate(day.getDate()+Number(d.step));state.date=iso(day);persist();render();return;}if(d.month){const date=dateObj(state.date);state.date=iso(new Date(date.getFullYear(),date.getMonth()+Number(d.month),1,12));persist();render();return;}if(d.mode){state.mode=d.mode;state.query='';state.filter='all';const e=selected();if(e)state.date=firstDate(e);persist();render();if(!e)picker();return;}if(d.view){state.view=d.view;persist();render();return;}if(d.filter){state.filter=d.filter;render();return;}if(d.nav){state.page=d.nav;render();window.scrollTo(0,0);return;}if(d.theme){state.theme=d.theme;applyTheme();persist();render();return;}
switch(d.action){case'picker':picker();break;case'close-modal':closeModal();break;case'favorite':{const id=selected().id;if(state.favorites.includes(id))state.favorites=state.favorites.filter(x=>x!==id);else state.favorites.push(id);persist();render();break;}case'search-toggle':state.page='schedule';state.showSearch=!state.showSearch;if(!state.showSearch)state.query='';render();if($('#schedule-search'))$('#schedule-search').focus();break;case'today':state.date=today();persist();render();break;case'next-lesson':{const list=filtered(selected());state.date=(list.find(x=>x.date>state.date)||list[0]||{date:firstDate(selected())}).date;persist();render();break;}case'source':source();break;case'import':if(isNative)Android.importFile();else notify('Excel \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432 APK. \u0412 PWA \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u0430 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0431\u0430\u0437\u0430.');break;case'reset':if(isNative)Android.resetData();else notify('\u0412 APK \u043C\u043E\u0436\u043D\u043E \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435');break;case'share':if(isNative)Android.share(d.share);else if(navigator.share)await navigator.share({text:d.share}).catch(()=>{});else {try{await navigator.clipboard.writeText(d.share);notify('\u0417\u0430\u043F\u0438\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0430');}catch(e){notify('\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E');}}break;case'update':checkUpdate();break;case'sync':sync();break;case'install':if(!isNative)PWA.install();break;case'page':if(isNative)Android.openPage();else window.open('https://ivan-s-2001.github.io/rgatu-calendar/','_blank','noopener');break;case'download':if(isNative)Android.download(d.apk);break;}});
document.addEventListener('input',event=>{if(event.target.id==='picker-search')renderPicker(event.target.value);if(event.target.id==='schedule-search'){state.query=event.target.value;const pos=event.target.selectionStart;render();const input=$('#schedule-search');input.focus();try{input.setSelectionRange(pos,pos);}catch(e){}}});
document.addEventListener('change',event=>{if(event.target.id==='notifications'){if(isNative&&typeof Android.setNotifications==='function')Android.setNotifications(event.target.checked);else PWA.notifications(event.target.checked);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){window.handleBack();event.preventDefault();}if(event.key==='Tab'&&!$('#overlay').hidden){const items=[...$('#modal').querySelectorAll('button,input,a,summary,[tabindex="0"]')].filter(x=>!x.disabled);const first=items[0],last=items[items.length-1];if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('#modal'))){event.preventDefault();if(last)last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();if(first)first.focus();}}});
function viewport(){document.documentElement.style.setProperty('--viewport',(window.visualViewport?window.visualViewport.height:window.innerHeight)+'px');}
if(window.visualViewport)window.visualViewport.addEventListener('resize',viewport);window.addEventListener('resize',viewport);matchMedia('(prefers-color-scheme:dark)').addEventListener('change',applyTheme);
applyTheme();viewport();applyIcons();
(async()=>{try{loadDataset(isNative?JSON.parse(Android.data()):await PWA.data());}catch(e){$('#main').innerHTML=heading('\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435','\u0417\u0430\u043E\u0447\u043D\u043E\u0435 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435')+empty('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435','\u041F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 Excel.');applyIcons();}})();
`,type:"text/javascript"},"/app/manifest.webmanifest":{content:`{"id":"./","name":"\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u0420\u0413\u0410\u0422\u0423","short_name":"\u0420\u0413\u0410\u0422\u0423 \xB7 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435","description":"\u0421\u0435\u0441\u0441\u0438\u044F \u0424\u0417\u041E: \u0433\u0440\u0443\u043F\u043F\u044B, \u043F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u0438, \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u0445.","lang":"ru","start_url":"./","scope":"./","display":"standalone","background_color":"#F6F7F9","theme_color":"#F6F7F9","icons":[{"src":"app-icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},{"src":"app-icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]}
`,type:"application/manifest+json"},"/app/sw.js":{content:`'use strict';
const UI = 'rgatu-ui-bc111403774fbdee', DATA = 'rgatu-database-v1';
const API = 'https://rgatu-calendar-api.ivan-s-2001.workers.dev';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'pwa.js', 'manifest.webmanifest', 'app-icon.svg', 'app-icon-192.png', 'app-icon-512.png'];
const ICONS = ['calendar','calendar-month','list','search','chevron-down','chevron-left','chevron-right','star','x','moon','sun','settings','download','file-spreadsheet','school','external-link','share','map-pin','user','check','refresh','info-circle','arrow-right','users'];
self.addEventListener('install', event => { event.waitUntil(caches.open(UI).then(cache => cache.addAll([...FILES, ...ICONS.map(x => 'icons/' + x + '.svg')]))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil((async () => { for (const key of await caches.keys()) if (key.startsWith('rgatu-ui-') && key !== UI) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/') || url.pathname.endsWith('schedule.json')) return;
  event.respondWith((async () => { const cache = await caches.open(UI), saved = await cache.match(event.request); if (saved) return saved; try { const response = await fetch(event.request); if (response.ok) await cache.put(event.request, response.clone()); return response; } catch { if (event.request.mode === 'navigate') return cache.match('index.html'); throw new Error('\u041D\u0435\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F'); } })());
});
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let message; try { message = event.data.json(); } catch { return; }
    if (!/^[a-f0-9]{64}$/.test(message.revision || '')) return;
    const cache = await caches.open(DATA), marker = new URL('_last-notified', self.registration.scope).href;
    const last = await cache.match(marker);
    if (last && await last.text() === message.revision) return;
    await self.registration.showNotification(message.title || '\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0420\u0413\u0410\u0422\u0423 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E', { body: message.body || '\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435.', icon: new URL('app-icon-192.png', self.registration.scope).href, badge: new URL('app-icon-192.png', self.registration.scope).href, tag: 'rgatu-schedule', data: { url: self.registration.scope, revision: message.revision } });
    await cache.put(marker, new Response(message.revision));
    try {
      const response = await fetch(API + '/api/schedule', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      if (response.ok) { const data = await response.clone().json(); if (/^[a-f0-9]{64}$/.test(data.revision || '')) { await cache.put(API + '/api/schedule', response); for (const client of await self.clients.matchAll({ type: 'window', includeUncontrolled: true })) client.postMessage({ type: 'schedule-updated' }); } }
    } catch { /* The notification remains visible; the app will refresh after reconnecting. */ }
  })());
});
self.addEventListener('notificationclick', event => { event.notification.close(); event.waitUntil((async () => { const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); for (const client of windows) if (client.url.startsWith(self.registration.scope)) { await client.focus(); client.postMessage({ type: 'schedule-updated' }); return; } await self.clients.openWindow(self.registration.scope); })()); });
`,type:"text/javascript"},"/app/icons/share.svg":{content:`<!--
category: System
tags: [network, link, connection, share, distribute, send, publish, broadcast, spread]
version: "1.0"
unicode: "eb21"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M8.7 10.7l6.6 -3.4" />
  <path d="M8.7 13.3l6.6 3.4" />
</svg>
`,type:"image/svg+xml"},"/app/icons/calendar-month.svg":{content:`<!--
tags: [monthly-calendar, month-view, date-month, monthly-schedule, timeframe, calendar-grid, month, month-planner, monthly, date-grid]
category: System
version: "2.41"
unicode: "fd2f"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
  <path d="M16 3v4" />
  <path d="M8 3v4" />
  <path d="M4 11h16" />
  <path d="M8 14v4" />
  <path d="M12 14v4" />
  <path d="M16 14v4" />
</svg>
`,type:"image/svg+xml"},"/app/icons/list.svg":{content:`<!--
tags: [task, unordered, bullets, agenda, shopping, list, typography, writing, font, character]
category: Text
version: "1.2"
unicode: "eb6b"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9 6l11 0" />
  <path d="M9 12l11 0" />
  <path d="M9 18l11 0" />
  <path d="M5 6l0 .01" />
  <path d="M5 12l0 .01" />
  <path d="M5 18l0 .01" />
</svg>
`,type:"image/svg+xml"},"/app/icons/settings.svg":{content:`<!--
tags: [cog, edit, gear, preferences, tools, settings, config, options, control, operation]
category: System
version: "1.0"
unicode: "eb20"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
</svg>
`,type:"image/svg+xml"},"/app/icons/chevron-down.svg":{content:`<!--
tags: [move, next, swipe, bottom, chevron, down, decrease, navigation, flow, fall]
category: Arrows
version: "1.0"
unicode: "ea5f"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M6 9l6 6l6 -6" />
</svg>
`,type:"image/svg+xml"},"/app/icons/users.svg":{content:`<!--
tags: [people, persons, accounts, users, control, operation, function, interface, management]
category: System
version: "1.7"
unicode: "ebf2"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
</svg>
`,type:"image/svg+xml"},"/app/icons/chevron-left.svg":{content:`<!--
tags: [move, previous, back, chevron, left, navigation, flow, movement, route, path]
category: Arrows
version: "1.0"
unicode: "ea60"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M15 6l-6 6l6 6" />
</svg>
`,type:"image/svg+xml"},"/app/icons/info-circle.svg":{content:`<!--
tags: [information, advice, news, tip, sign, info, circle, control, operation, round]
category: System
version: "1.0"
unicode: "eac5"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M12 9h.01" />
  <path d="M11 12h1v4h1" />
</svg>
`,type:"image/svg+xml"},"/app/icons/calendar.svg":{content:`<!--
tags: [date, day, plan, schedule, agenda, calender, calendar, control, operation, function]
category: System
version: "1.0"
unicode: "ea53"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
  <path d="M16 3v4" />
  <path d="M8 3v4" />
  <path d="M4 11h16" />
  <path d="M11 15h1" />
  <path d="M12 15v3" />
</svg>
`,type:"image/svg+xml"},"/app/icons/download.svg":{content:`<!--
tags: [save, arrow, download, navigation, flow, movement, route, path]
category: Arrows
version: "1.0"
unicode: "ea96"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
  <path d="M7 11l5 5l5 -5" />
  <path d="M12 4l0 12" />
</svg>
`,type:"image/svg+xml"},"/app/icons/star.svg":{content:`<!--
tags: [favorite, like, mark, bookmark, grade, star, control, operation, rating, function]
category: System
version: "1.0"
unicode: "eb2e"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
</svg>
`,type:"image/svg+xml"},"/app/icons/moon.svg":{content:`<!--
tags: [night, dark mode, moon, climate, forecast, meteorology, atmospheric, conditions]
category: Weather
version: "1.0"
unicode: "eaf8"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" />
</svg>
`,type:"image/svg+xml"},"/app/icons/x.svg":{content:`<!--
category: System
tags: [cancel, remove, delete, empty, close, x]
version: "1.0"
unicode: "eb55"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>
`,type:"image/svg+xml"},"/app/icons/refresh.svg":{content:`<!--
tags: [synchronization, reload, restart, spinner, loader, ajax, update, arrows, refresh, navigation]
category: Arrows
version: "1.0"
unicode: "eb13"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>
`,type:"image/svg+xml"},"/app/icons/chevron-right.svg":{content:`<!--
tags: [move, checklist, next, chevron, right, navigation, flow, movement, route, path]
category: Arrows
version: "1.0"
unicode: "ea61"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9 6l6 6l-6 6" />
</svg>
`,type:"image/svg+xml"},"/app/icons/file-spreadsheet.svg":{content:`<!--
tags: [table, extension, excel, format, file, spreadsheet, document, data, content, record]
category: Document
version: "1.56"
unicode: "f03e"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
</svg>
`,type:"image/svg+xml"},"/app/icons/search.svg":{content:`<!--
category: System
tags: [find, magnifier, magnifying glass, search, look, seek, query, browse]
version: "1.0"
unicode: "eb1c"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M21 21l-6 -6" />
</svg>
`,type:"image/svg+xml"},"/app/icons/arrow-right.svg":{content:`<!--
tags: [next, proceed, swipe, arrow, right, direction, pointer, navigation, flow, navigate]
category: Arrows
version: "1.0"
unicode: "ea1f"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5 12l14 0" />
  <path d="M13 18l6 -6" />
  <path d="M13 6l6 6" />
</svg>
`,type:"image/svg+xml"},"/app/icons/check.svg":{content:`<!--
tags: [tick, "yes", confirm, check, control, operation, approve, function, interface, management]
category: System
version: "1.0"
unicode: "ea5e"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5 12l5 5l10 -10" />
</svg>
`,type:"image/svg+xml"},"/app/icons/external-link.svg":{content:`<!--
tags: [connection, outbound, redirect, new tab, tab, square, arrow, external, link, control]
category: System
version: "1.0"
unicode: "ea99"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
  <path d="M11 13l9 -9" />
  <path d="M15 4h5v5" />
</svg>
`,type:"image/svg+xml"},"/app/icons/map-pin.svg":{content:`<!--
tags: [navigation, location, travel, pin, position, marker, map, attach, fix, mark]
category: Map
version: "1.0"
unicode: "eae8"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" />
</svg>
`,type:"image/svg+xml"},"/app/icons/school.svg":{content:`<!--
category: Map
tags: [students, class, teachers, professors, doctors, hall, classroom, subject, science, break, lesson]
version: "1.22"
unicode: "ecf7"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
  <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
</svg>
`,type:"image/svg+xml"},"/app/icons/user.svg":{content:`<!--
tags: [person, account, user, control, operation, profile, member, function, interface, management]
category: System
version: "1.0"
unicode: "eb4d"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
</svg>
`,type:"image/svg+xml"},"/app/icons/sun.svg":{content:`<!--
tags: [weather, light, mode, brightness, sun, climate, forecast, meteorology, atmospheric, conditions]
category: Weather
version: "1.0"
unicode: "eb30"
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
</svg>
`,type:"image/svg+xml"},"/app/":{content:`<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#F6F7F9">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://rgatu-calendar-api.ivan-s-2001.workers.dev; object-src 'none'; base-uri 'none'">
  <title>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0437\u0430\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u0420\u0413\u0410\u0422\u0423</title>
  <link rel="stylesheet" href="app.css">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" href="app-icon.svg" type="image/svg+xml">
  <script src="pwa.js" defer><\/script>
  <script src="app.js" defer><\/script>
</head>
<body>
  <div id="app" class="app">
    <header class="topbar">
      <div class="brand"><span class="brand-mark" aria-hidden="true"><i class="icon" data-icon="calendar"></i></span><div><b>\u0420\u0413\u0410\u0422\u0423</b><span>\u0438\u043C\u0435\u043D\u0438 \u041F. \u0410. \u0421\u043E\u043B\u043E\u0432\u044C\u0451\u0432\u0430 \xB7 \u0420\u044B\u0431\u0438\u043D\u0441\u043A</span></div></div>
      <button class="icon-button" data-action="search-toggle" aria-label="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E"><i class="icon" data-icon="search" aria-hidden="true"></i></button>
    </header>
    <main id="main"><div class="skeleton" aria-label="\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F"></div></main>
    <nav class="bottom-nav" aria-label="\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B">
      <button data-nav="schedule" aria-current="page"><i class="icon" data-icon="calendar" aria-hidden="true"></i><span>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435</span></button>
      <button data-nav="university"><i class="icon" data-icon="school" aria-hidden="true"></i><span>\u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442</span></button>
      <button data-nav="settings"><i class="icon" data-icon="settings" aria-hidden="true"></i><span>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</span></button>
    </nav>
  </div>
  <div id="overlay" class="overlay" hidden>
    <div class="scrim" data-action="close-modal"></div>
    <section id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"></section>
  </div>
  <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
</body>
</html>
`,type:"text/html"}};var x=(e,t=200)=>new Response(JSON.stringify(e),{status:t,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}}),Y=()=>new Date().toISOString();async function be(e,t=16384){let n=await Ze(e.body,t);return JSON.parse(new TextDecoder().decode(n))}async function Ze(e,t){if(!e)throw new Error("\u041F\u0443\u0441\u0442\u043E\u0439 \u043E\u0442\u0432\u0435\u0442");let n=e.getReader(),a=[],r=0;try{for(;;){let{value:s,done:c}=await n.read();if(c)break;if(r+=s.length,r>t)throw new Error("\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u0440\u0430\u0437\u043C\u0435\u0440 \u0434\u0430\u043D\u043D\u044B\u0445");a.push(s)}}finally{await n.cancel().catch(()=>{})}let o=new Uint8Array(r),i=0;for(let s of a)o.set(s,i),i+=s.length;return o}async function Ge(e,t){for(let n=0;n<4;n++){let a=new URL(e);if(!["www.rsatu.ru","rsatu.ru"].includes(a.hostname)||!["http:","https:"].includes(a.protocol)||a.username||a.password)throw new Error("\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A");let r=await fetch(a.href,{redirect:"manual",headers:{"User-Agent":"RGATU-Calendar/1.0 (schedule check every hour)",Accept:"text/html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},signal:AbortSignal.timeout(25e3)});if([301,302,303,307,308].includes(r.status)){let o=r.headers.get("Location");if(await r.body?.cancel(),!o)throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F");e=new URL(o,a).href;continue}if(!r.ok)throw await r.body?.cancel(),new Error("\u0421\u0430\u0439\u0442 \u0420\u0413\u0410\u0422\u0423 \u0432\u0435\u0440\u043D\u0443\u043B HTTP "+r.status);return{bytes:await Ze(r.body,t),url:a.href,contentType:r.headers.get("Content-Type")||""}}throw new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0439")}async function G(e){return e.DB.prepare("SELECT * FROM state WHERE id=1").first()}async function Xe(e,t,n=[],a="",r=!0){let o=await G(e),i=o.json?JSON.parse(o.json):null,s=await Te(t,n),c=Y();if(s===o.revision){let B=JSON.parse(o.manifest);return B.checkedAt=c,await e.DB.prepare("UPDATE state SET manifest=?,source_hash=? WHERE id=1").bind(JSON.stringify(B),a||o.source_hash||"").run(),{changed:!1,revision:s}}let g=De(i,t);i||(g.changes={added:0,changed:0,removed:0},g.details=[]);let h=JSON.stringify(i?.notices||[])!==JSON.stringify(n);t={...t,revision:s,notices:n,source:{...t.source,pageUrl:q}};let l=JSON.stringify(t),p={revision:s,data:"api/schedule",sha256:await F(l),checkedAt:c,publishedAt:c,sourceUrl:q,fileUrl:t.source.fileUrl||"",changes:g.changes,infoChanged:h,checkFrequency:"60 minutes"},{added:d,changed:b,removed:E}=g.changes,u=JSON.stringify({revision:s,title:"\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0420\u0413\u0410\u0422\u0423 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E",body:`\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E: ${d}. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E: ${b}. \u0423\u0434\u0430\u043B\u0435\u043D\u043E: ${E}.${h?" \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043D\u0430 \u0441\u0430\u0439\u0442\u0435.":""}`,url:"/app/"}),A=[e.DB.prepare("UPDATE state SET revision=?,json=?,manifest=?,source_hash=? WHERE id=1").bind(s,l,JSON.stringify(p),a),e.DB.prepare("INSERT OR IGNORE INTO revisions(revision,published_at,changes) VALUES(?,?,?)").bind(s,c,JSON.stringify({revision:s,publishedAt:c,changes:g.changes,infoChanged:h,details:g.details}))];return r&&i&&A.push(e.DB.prepare("INSERT OR IGNORE INTO outbox(revision,subscription_id,payload) SELECT ?,id,? FROM subscriptions").bind(s,u)),await e.DB.batch(A),{changed:!0,revision:s,changes:g.changes,infoChanged:h}}async function ke(e){let t=Date.now();if(!(await e.DB.prepare("UPDATE state SET lease_until=? WHERE id=1 AND lease_until<?").bind(t+10*6e4,t).run()).meta.changes)return{skipped:!0};let a=JSON.parse((await G(e)).status||"{}"),r={lastAttempt:Y(),intervalMinutes:60,sources:[],lastSuccess:a.lastSuccess||null,lastChange:a.lastChange||null};await e.DB.prepare("UPDATE state SET status=? WHERE id=1").bind(JSON.stringify(r)).run();try{let o=await G(e),i=a,s=await e.DB.prepare("SELECT * FROM source_snapshots").all(),c=new Map(s.results.map(u=>[u.source,u]));!c.has("session")&&o.json&&c.set("session",{source:"session",json:o.json,notices:JSON.stringify(JSON.parse(o.json).notices||[]),source_hash:o.source_hash});let g=!1;for(let u of ee)try{let A=await Ge(u.url,4194304),B=new TextDecoder(/windows-1251|cp1251/i.test(A.contentType)?"windows-1251":"utf-8").decode(A.bytes),{links:y,notices:I}=We(B,u.url),j=c.get(u.id);if(!y.length){let f={source:u.id,json:j?.json||null,notices:JSON.stringify(I),source_hash:await F(JSON.stringify(I)),checked_at:Y()};c.set(u.id,f),await e.DB.prepare("INSERT INTO source_snapshots(source,json,notices,source_hash,checked_at) VALUES(?,?,?,?,?) ON CONFLICT(source) DO UPDATE SET notices=excluded.notices,source_hash=excluded.source_hash,checked_at=excluded.checked_at").bind(f.source,f.json,f.notices,f.source_hash,f.checked_at).run(),r.sources.push({...u,checkedAt:Y(),fileFound:!1,error:null}),g=!0;continue}let N=y[0],S=await Ge(N.url,25*1024*1024);if(S.bytes[0]!==80||S.bytes[1]!==75)throw new Error("\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0432\u0435\u0440\u043D\u0443\u043B \u043D\u0435 XLSX");let w=new TextEncoder().encode(JSON.stringify(I)),v=new Uint8Array(w.length+S.bytes.length);v.set(w),v.set(S.bytes,w.length);let C=await F(v);if(C!==j?.source_hash||!j?.json){let f=await Ye(S.bytes,N.name);f.source={...f.source,pageUrl:u.url,fileUrl:S.url};let k={source:u.id,json:JSON.stringify(f),notices:JSON.stringify(I),source_hash:C,checked_at:Y()};await e.DB.prepare("INSERT INTO source_snapshots(source,json,notices,source_hash,checked_at) VALUES(?,?,?,?,?) ON CONFLICT(source) DO UPDATE SET json=excluded.json,notices=excluded.notices,source_hash=excluded.source_hash,checked_at=excluded.checked_at").bind(k.source,k.json,k.notices,k.source_hash,k.checked_at).run(),c.set(u.id,k)}r.sources.push({...u,checkedAt:Y(),fileFound:!0,error:null}),g=!0}catch(A){r.sources.push({...u,checkedAt:Y(),error:String(A.message).slice(0,200)})}if(!g)throw new Error("\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B");let h=ee.filter(u=>c.get(u.id)?.json),l=JSON.parse(c.get("session")?.json||c.get(h[0]?.id)?.json||o.json),p=[],d=[];for(let u of ee){let A=c.get(u.id);if(!A||(d.push(...JSON.parse(A.notices).map(y=>u.id==="session"?y:u.title+": "+y)),!A.json))continue;let B=JSON.parse(A.json);for(let y of B.sheets)p.push(u.id==="session"?y:{...y,id:u.id+"-"+y.id,sourceId:u.id,title:u.title+" \xB7 "+y.title,entities:y.entities.map(I=>({...I,id:u.id+"-"+I.id}))})}let b={schemaVersion:1,source:{...l.source,name:h.length>1?"\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438 \u0438 \u0437\u0430\u043D\u044F\u0442\u0438\u0439 \u0424\u0417\u041E":l.source.name,pages:ee.map(u=>u.url)},sheets:p},E=await Xe(e,b,[...new Set(d)].sort());return Object.assign(r,{lastSuccess:Y(),sourceError:r.sources.some(u=>u.error)?"\u0427\u0430\u0441\u0442\u044C \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430; \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0435":null,lastChange:E.changed?Y():i.lastChange||null}),E}catch(o){let i=await G(e),s=a;return Object.assign(r,{lastSuccess:s.lastSuccess||null,lastChange:s.lastChange||null,sourceError:String(o.message).slice(0,250)}),{error:r.sourceError}}finally{await e.DB.prepare("UPDATE state SET status=?,lease_until=0 WHERE id=1").bind(JSON.stringify(r)).run(),await e.DB.batch([e.DB.prepare("DELETE FROM limits WHERE expires<?").bind(Date.now()),e.DB.prepare("DELETE FROM outbox WHERE delivered_at<?").bind(Date.now()-30*864e5),e.DB.prepare("DELETE FROM revisions WHERE revision NOT IN (SELECT revision FROM revisions ORDER BY published_at DESC LIMIT 30)")])}}async function Ce(e,t=!0){let n=await e.DB.prepare("SELECT o.*,s.transport,s.payload AS subscription FROM outbox o LEFT JOIN subscriptions s ON s.id=o.subscription_id WHERE o.delivered_at IS NULL AND o.next_attempt<=? AND o.attempts<8 LIMIT 10").bind(Date.now()).all();for(let a of n.results){if(!(await e.DB.prepare("UPDATE outbox SET next_attempt=? WHERE revision=? AND subscription_id=? AND delivered_at IS NULL AND next_attempt<=?").bind(Date.now()+12e4,a.revision,a.subscription_id,Date.now()).run()).meta.changes)continue;let o=!a.transport,i=o;try{if(!o){let s=await He(e,{transport:a.transport,payload:a.subscription},JSON.parse(a.payload));i=s.ok,o=s.status===410||a.transport==="web"&&s.status===404,a.transport==="android"&&s.status===404?o=(await s.text()).includes("UNREGISTERED"):await s.body?.cancel()}}catch{}if(i||o){let s=[e.DB.prepare("UPDATE outbox SET delivered_at=? WHERE revision=? AND subscription_id=?").bind(Date.now(),a.revision,a.subscription_id)];o&&s.push(e.DB.prepare("DELETE FROM subscriptions WHERE id=?").bind(a.subscription_id)),await e.DB.batch(s)}else await e.DB.prepare("UPDATE outbox SET attempts=attempts+1,next_attempt=? WHERE revision=? AND subscription_id=?").bind(Date.now()+Math.min(864e5,6e4*2**a.attempts),a.revision,a.subscription_id).run()}return t&&n.results.length===10&&await(await fetch(e.SELF_URL+"/internal/deliver",{method:"POST",headers:{Authorization:"Bearer "+e.ADMIN_TOKEN},signal:AbortSignal.timeout(2e4)})).body?.cancel(),{processed:n.results.length}}function kt(e,t,n){let a=e.headers.get("Origin");return a&&[t.PWA_ORIGIN,t.SELF_URL].includes(a)&&(n.headers.set("Access-Control-Allow-Origin",a),n.headers.set("Vary","Origin")),n.headers.set("X-Content-Type-Options","nosniff"),n.headers.set("Referrer-Policy","no-referrer"),n}async function qe(e,t){let n=await F((e.headers.get("CF-Connecting-IP")||"unknown")+"|"+Math.floor(Date.now()/6e4));return(await t.DB.prepare("INSERT INTO limits(bucket,count,expires) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count").bind(n,Date.now()+12e4).first()).count<=10}async function Ct(e,t,n){let a=new URL(e.url),r=a.pathname;if(r.startsWith("/internal/")){if(e.method!=="POST"||!t.ADMIN_TOKEN||e.headers.get("Authorization")!=="Bearer "+t.ADMIN_TOKEN)return x({error:"\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E"},401);if(r==="/internal/ingest"){let i=await be(e,16777216);return x(await Xe(t,i.data,i.notices||[],i.sourceHash||"",i.notify!==!1))}if(r==="/internal/poll"){let i=await ke(t);return n.waitUntil(Ce(t)),x(i)}return r==="/internal/deliver"?(n.waitUntil(Ce(t)),x({queued:!0})):x({error:"\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E"},404)}let o=e.headers.get("Origin");if(o&&![t.PWA_ORIGIN,t.SELF_URL].includes(o))return x({error:"\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0437\u0430\u043F\u0440\u043E\u0441\u0430"},403);if(e.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"86400"}});if(e.method==="GET"){if(r==="/api/config")return x({intervalMinutes:60,vapidPublicKey:t.VAPID_PUBLIC,android:t.FCM_PUBLIC_CONFIG?JSON.parse(t.FCM_PUBLIC_CONFIG):null,fcmConfigured:!!t.FCM_SERVICE_ACCOUNT});if(r==="/api/status"){let i=await G(t),s=JSON.parse(i.status||"{}");return!s.lastAttempt&&i.json?(await ke(t),x({...JSON.parse((await G(t)).status||"{}"),revision:i.revision,databaseReady:!0,intervalMinutes:60,fcmConfigured:!!t.FCM_SERVICE_ACCOUNT})):x({...s,revision:i.revision,databaseReady:!!i.json,intervalMinutes:60,fcmConfigured:!!t.FCM_SERVICE_ACCOUNT})}if(r==="/api/latest"){let i=await G(t);return i.manifest?new Response(i.manifest,{headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}}):x({error:"\u0411\u0430\u0437\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u0430"},503)}if(r==="/api/schedule"||r==="/app/schedule.json"){let i=await G(t);if(!i.json)return x({error:"\u0411\u0430\u0437\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u0430"},503);let s={"Content-Type":"application/json; charset=utf-8",ETag:'"'+i.revision+'"',"Cache-Control":"no-cache"};return new Response(e.headers.get("If-None-Match")===s.ETag?null:i.json,{status:e.headers.get("If-None-Match")===s.ETag?304:200,headers:s})}if(r==="/api/changes"){let i=await t.DB.prepare("SELECT changes FROM revisions ORDER BY published_at DESC LIMIT 1").first();return i?new Response(i.changes,{headers:{"Content-Type":"application/json; charset=utf-8"}}):x({changes:{added:0,changed:0,removed:0}})}}if(r==="/api/push/subscribe"||r==="/api/android/subscribe"){if(e.method!=="POST")return x({error:"\u041C\u0435\u0442\u043E\u0434 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F"},405);if(!await qe(e,t))return x({error:"\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u043E\u0432"},429);let i=await be(e),s=r.includes("/android/");if(!/^[a-f0-9]{64}$/.test(i.owner||""))return x({error:"\u041D\u0435\u0442 \u043A\u043B\u044E\u0447\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438"},400);let c,g;if(s){if(!t.FCM_SERVICE_ACCOUNT||!t.FCM_PUBLIC_CONFIG)return x({error:"Push Android \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D"},503);if(typeof i.token!="string"||!/^[A-Za-z0-9_:.-]{50,4096}$/.test(i.token))return x({error:"\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0442\u043E\u043A\u0435\u043D"},400);c=i.token,g=JSON.stringify({token:i.token})}else{let p=i.subscription,d;try{d=new URL(p.endpoint)}catch{return x({error:"\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430"},400)}if(!(d.hostname==="fcm.googleapis.com"||d.hostname==="updates.push.services.mozilla.com"||d.hostname.endsWith(".push.services.mozilla.com")||d.hostname==="web.push.apple.com"||d.hostname.endsWith(".notify.windows.com"))||d.protocol!=="https:"||d.port||d.username||d.password||d.href.length>4096||!p.keys||!/^[A-Za-z0-9_-]{87}$/.test(p.keys.p256dh||"")||!/^[A-Za-z0-9_-]{22}$/.test(p.keys.auth||"")||X(p.keys.p256dh)[0]!==4)return x({error:"\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430"},400);c=d.href,g=JSON.stringify({endpoint:c,keys:p.keys})}let h=await F(c),l=await t.DB.prepare("SELECT owner FROM subscriptions WHERE id=?").bind(h).first();return l&&l.owner!==i.owner?x({error:"\u041A\u043B\u044E\u0447 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u043B"},409):(await t.DB.prepare("INSERT INTO subscriptions(id,transport,payload,owner,created_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload").bind(h,s?"android":"web",g,i.owner,Date.now()).run(),x({id:h,subscribed:!0}))}if(r==="/api/push/unsubscribe"&&e.method==="POST"){if(!await qe(e,t))return x({error:"\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u043E\u0432"},429);let i=await be(e);return await t.DB.prepare("DELETE FROM subscriptions WHERE id=? AND owner=?").bind(i.id||"",i.owner||"").run(),x({subscribed:!1})}if(e.method==="GET"&&xe[r]){let i=xe[r];return new Response(i.base64?Uint8Array.from(atob(i.content),s=>s.charCodeAt(0)):i.content,{headers:{"Content-Type":i.type,"Cache-Control":r.endsWith("sw.js")?"no-cache":"public,max-age=300",...r.endsWith("sw.js")?{"Service-Worker-Allowed":"/app/"}:{}}})}return r==="/"?Response.redirect(t.SELF_URL+"/app/",302):x({error:"\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E"},404)}var zt={async fetch(e,t,n){let a;try{a=await Ct(e,t,n)}catch{a=x({error:"\u0417\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C"},500)}return kt(e,t,a)},async scheduled(e,t,n){await ke(t),n.waitUntil(Ce(t))}};export{zt as default};
