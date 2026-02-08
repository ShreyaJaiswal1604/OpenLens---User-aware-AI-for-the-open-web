var content=(function(){"use strict";function G(e){return e}function I(e,r){const t=e.toLowerCase(),l=r.body?.innerText?.toLowerCase()||"",d=/\$\d+\.?\d{0,2}|\d+\.\d{2}\s*(usd|eur|gbp)/i,p=!!r.querySelector('[class*="cart"], [class*="add-to"], [data-action*="cart"], button[name*="cart"]');if(d.test(l)&&p||t.includes("/product")||t.includes("/item")||t.includes("/dp/"))return"ecommerce";const m=!!r.querySelector('article, [class*="article"], [class*="post-content"]'),b=r.querySelectorAll("p"),v=Array.from(b).filter(h=>(h.textContent?.length||0)>200);if(m||v.length>=3)return"article";if(t.includes("search")||t.includes("q=")||t.includes("query="))return"search";const y=r.querySelectorAll("form"),f=r.querySelectorAll("input, textarea, select").length;return y.length>=1&&f>=4?"form":"generic"}function M(e,r){const t=e.match(/\$[\d,]+\.?\d{0,2}/g)||[],l=[...new Set(t)].slice(0,20),d=/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s*\d{0,4}/gi,p=e.match(d)||[],u=[...new Set(p)].slice(0,10),m=r.querySelectorAll("h1, h2, h3"),b=Array.from(m).map(f=>f.textContent?.trim()||"").filter(f=>f.length>0&&f.length<200).slice(0,15),v=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,y=(e.match(v)||[]).length;return{prices:l,dates:u,headings:b,emailCount:y}}function q(){const e=document,r=window.location.href,t=e.title||"",l=e.querySelector('meta[name="description"]')?.getAttribute("content")||"";let d=e.body?.innerText||"";e.querySelectorAll('input[type="password"]').forEach(()=>{d=d.replace(/password[:\s]*\S+/gi,"password: [MASKED]")});const u=d.slice(0,2e4),m=d.slice(0,5e3),b=e.querySelectorAll("a[href]"),v=Array.from(b).map(n=>({text:(n.textContent?.trim()||"").slice(0,100),href:n.href})).filter(n=>n.text.length>0&&n.href.startsWith("http")).slice(0,20),y=e.querySelectorAll("form"),f=Array.from(y).slice(0,5).map(n=>{const a=n.querySelectorAll("input, textarea, select"),s=Array.from(a).map(o=>{const i=o;return i.type==="password"?`${i.name||i.id||"password"} [password field]`:i.name||i.id||i.type||"unnamed"}).slice(0,10);return{id:n.id||n.name||"unnamed",action:n.action||"",fieldCount:a.length,fields:s}}),h=M(u,e),$=Math.ceil(m.length/4);return{url:r,title:t,metaDescription:l,pageType:I(r,e),textContent:m,links:v,forms:f,structuredData:h,tokenEstimate:$}}function D(e,r=2e3){const t=[];t.push(`Page: ${e.title}`),t.push(`URL: ${e.url}`),t.push(`Type: ${e.pageType}`),e.metaDescription&&t.push(`Description: ${e.metaDescription}`),e.structuredData.headings.length>0&&t.push(`
Headings:
${e.structuredData.headings.map(p=>`- ${p}`).join(`
`)}`),e.structuredData.prices.length>0&&t.push(`
Prices found: ${e.structuredData.prices.join(", ")}`),e.links.length>0&&t.push(`
Key links:
${e.links.slice(0,10).map(p=>`- ${p.text}: ${p.href}`).join(`
`)}`),e.forms.length>0&&t.push(`
Forms: ${e.forms.map(p=>`${p.id} (${p.fieldCount} fields)`).join(", ")}`);const l=Math.ceil(t.join(`
`).length/4),d=r-l;if(d>100){const p=d*4;t.push(`
Page text:
${e.textContent.slice(0,p)}`)}return t.join(`
`)}const _={matches:["<all_urls>"],runAt:"document_idle",main(){if(window.location.protocol==="chrome-extension:"||window.location.protocol==="moz-extension:")return;const e=document.createElement("div");e.id="agentlens-bar",e.style.cssText='all: initial; position: fixed; top: 0; left: 0; width: 100%; z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;',document.body.appendChild(e);const r=e.attachShadow({mode:"closed"}),t=document.createElement("style");t.textContent=`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      .bar {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: rgba(10, 10, 20, 0.95);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid rgba(255,255,255,0.08);
        font-size: 12px;
        color: #e2e8f0;
        min-height: 28px;
        transition: all 0.3s ease;
      }
      .bar.collapsed { cursor: pointer; }
      .bar.collapsed:hover { background: rgba(10, 10, 20, 1); }
      .logo {
        font-weight: 700;
        color: #60a5fa;
        margin-right: 4px;
        white-space: nowrap;
        cursor: pointer;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 8px;
        border-radius: 10px;
        background: rgba(255,255,255,0.06);
        white-space: nowrap;
        cursor: pointer;
        transition: background 0.2s;
        font-size: 11px;
      }
      .pill:hover { background: rgba(255,255,255,0.12); }
      .pill.green { color: #4ade80; }
      .pill.yellow { color: #facc15; }
      .pill.red { color: #f87171; }
      .pill.gray { color: #94a3b8; }
      .sep { width: 1px; height: 14px; background: rgba(255,255,255,0.1); margin: 0 2px; }
      .panel {
        background: rgba(10, 10, 20, 0.98);
        border-bottom: 1px solid rgba(255,255,255,0.08);
        padding: 12px 16px;
        max-height: 300px;
        overflow-y: auto;
        font-size: 13px;
        color: #cbd5e1;
        line-height: 1.5;
      }
      .panel h3 { color: #f1f5f9; font-size: 14px; margin-bottom: 8px; font-weight: 600; }
      .panel .entry { padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .panel .entry:last-child { border-bottom: none; }
      .panel .label { color: #94a3b8; font-size: 11px; }
      .panel .value { color: #e2e8f0; }
      .panel .high { color: #f87171; }
      .panel .medium { color: #facc15; }
      .panel .low { color: #4ade80; }
      .close-btn {
        margin-left: auto;
        cursor: pointer;
        color: #64748b;
        font-size: 14px;
        padding: 0 4px;
      }
      .close-btn:hover { color: #e2e8f0; }

      /* Permission dialog */
      .perm-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483646;
      }
      .perm-dialog {
        background: #1a1a2e;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 20px;
        max-width: 420px;
        width: 90%;
        color: #e2e8f0;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      }
      .perm-dialog h3 {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .perm-dialog .reason {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 12px;
        line-height: 1.4;
      }
      .perm-badge {
        display: inline-block;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 8px;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .perm-badge.low { background: rgba(74,222,128,0.15); color: #4ade80; }
      .perm-badge.medium { background: rgba(250,204,21,0.15); color: #facc15; }
      .perm-badge.high { background: rgba(248,113,113,0.15); color: #f87171; }
      .perm-scope {
        margin-bottom: 16px;
      }
      .perm-scope label {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        font-size: 13px;
        cursor: pointer;
        color: #cbd5e1;
      }
      .perm-scope input[type="radio"] {
        accent-color: #60a5fa;
      }
      .perm-scope .scope-desc {
        font-size: 11px;
        color: #64748b;
      }
      .perm-actions {
        display: flex;
        gap: 8px;
      }
      .perm-actions button {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
      }
      .perm-allow {
        background: #2563eb;
        color: white;
      }
      .perm-allow:hover { background: #1d4ed8; }
      .perm-deny {
        background: rgba(255,255,255,0.08);
        color: #94a3b8;
      }
      .perm-deny:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; }
    `,r.appendChild(t);const l=document.createElement("div");r.appendChild(l);const d=document.createElement("div");r.appendChild(d);let p=null,u="none",m=0,b=!1,v=[],y={totalTokens:0,contextUsed:0,contextLimit:8192,processingLocation:"idle",dataEntries:[],auditEvents:[]};function f(n,a,s){return new Promise(o=>{const i={page_read:"Read This Page",page_action:"Interact With Page",data_send:"Send Data to Cloud"}[n]||n,c={page_read:"📖",page_action:"🎯",data_send:"☁️"}[n]||"🔒";d.innerHTML=`
          <div class="perm-overlay">
            <div class="perm-dialog">
              <h3>${c} AgentLens — ${i}</h3>
              <div class="reason">${a}</div>
              <div class="perm-badge ${s}">${s} sensitivity</div>
              <div class="perm-scope">
                <label><input type="radio" name="perm-scope" value="page" checked> This page only <span class="scope-desc">— revoked on navigation</span></label>
                <label><input type="radio" name="perm-scope" value="site"> This site <span class="scope-desc">— ${new URL(window.location.href).hostname}</span></label>
                <label><input type="radio" name="perm-scope" value="session"> This session <span class="scope-desc">— all sites, 30 min</span></label>
              </div>
              <div class="perm-actions">
                <button class="perm-deny" data-action="deny">Deny</button>
                <button class="perm-allow" data-action="allow">Allow</button>
              </div>
            </div>
          </div>
        `,u="pending",h();const C=d.querySelector(".perm-overlay");C.querySelector('[data-action="allow"]').addEventListener("click",()=>{const k=C.querySelector('input[name="perm-scope"]:checked')?.value||"page";d.innerHTML="",u="granted",h(),o({granted:!0,scope:k})}),C.querySelector('[data-action="deny"]').addEventListener("click",()=>{d.innerHTML="",u="none",h(),o({granted:!1,scope:"page"})})})}function h(){const n=y,a=n.contextLimit>0?Math.round(n.contextUsed/n.contextLimit*100):0,s=a>=90?"red":a>=70?"yellow":"green",o={local:"🟢",cloud:"🔴",mixed:"🟡",idle:"⚪"}[n.processingLocation]||"⚪",i=n.processingLocation==="idle"?"idle":n.processingLocation,c={local:"green",cloud:"red",mixed:"yellow",idle:"gray"}[n.processingLocation]||"gray",k=new Set(n.dataEntries.map(x=>x.origin)).size>1,R=n.dataEntries.some(x=>x.sensitivity==="high"),j=u==="granted"?"🔓":"🔒",W=u==="granted"?"green":u==="pending"?"yellow":"gray",H=u==="granted"?"access":u==="pending"?"asking":"locked";let g='<div class="bar collapsed">';g+='<span class="logo">🔍 AgentLens</span>',g+='<span class="sep"></span>',g+=`<span class="pill ${W}" data-module="permissions">${j} ${H}</span>`,g+=`<span class="pill green" data-module="data-flow">📊 ${n.totalTokens.toLocaleString()}</span>`,k&&(g+=`<span class="pill ${R?"red":"yellow"}" data-module="cross-origin">⚠️ cross-origin</span>`),g+=`<span class="pill ${s}" data-module="context">🧠 ${a}%</span>`,g+=`<span class="pill ${c}" data-module="privacy">${o} ${i}</span>`,g+=`<span class="pill gray" data-module="audit">📋 ${n.auditEvents.length} actions</span>`;const V=b?"yellow":m>0?"green":"gray";g+=`<span class="pill ${V}" data-module="tools">🔧 ${m} tools</span>`,g+='<span class="close-btn" data-action="minimize">✕</span>',g+="</div>",p&&(g+=$(p,n)),l.innerHTML=g,l.querySelectorAll(".pill").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.module;p=p===A?null:A||null,h()})}),l.querySelector('[data-action="minimize"]')?.addEventListener("click",()=>{e.style.display=e.style.display==="none"?"":"none"})}function $(n,a){let s='<div class="panel">';switch(n){case"permissions":{s+="<h3>🔒 Permission State</h3>",s+=`<div class="entry"><span class="value">${u==="granted"?"Page access granted":u==="pending"?"Waiting for approval...":"No access — agent hasn’t requested any"}</span></div>`,s+='<div class="entry"><span class="label">AgentLens only reads pages when you start a task. No passive monitoring.</span></div>';break}case"data-flow":{s+="<h3>📊 Data Flow Tracker</h3>",s+=`<div class="entry"><span class="label">Total tokens in context:</span> <span class="value">${a.totalTokens.toLocaleString()}</span></div>`;const o={};for(const i of a.dataEntries)o[i.origin]||(o[i.origin]={tokens:0,sensitivity:i.sensitivity}),o[i.origin].tokens+=i.tokenCount,i.sensitivity==="high"&&(o[i.origin].sensitivity="high");for(const[i,c]of Object.entries(o))s+=`<div class="entry"><span class="label">${i}</span> — <span class="value">${c.tokens} tokens</span> <span class="${c.sensitivity}">[${c.sensitivity}]</span></div>`;break}case"cross-origin":{s+="<h3>⚠️ Cross-Origin Alert</h3>";const o=[...new Set(a.dataEntries.map(c=>c.origin))];s+=`<div class="entry">Data from <strong>${o.join(", ")}</strong> has merged in the AI context.</div>`;const i=a.dataEntries.filter(c=>c.sensitivity==="high").map(c=>c.origin);i.length>0&&(s+=`<div class="entry high">Sensitive data present from: ${[...new Set(i)].join(", ")}</div>`),s+='<div class="entry"><span class="label">The AI can cross-reference data across these sources.</span></div>';break}case"context":{const o=a.contextLimit>0?Math.round(a.contextUsed/a.contextLimit*100):0;s+="<h3>🧠 Context Window Monitor</h3>",s+=`<div class="entry"><span class="label">Usage:</span> <span class="value">${a.contextUsed.toLocaleString()} / ${a.contextLimit.toLocaleString()} tokens (${o}%)</span></div>`,s+='<div class="entry" style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 4px; margin: 4px 0;">',s+=`<div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1);"><div style="height: 100%; width: ${Math.min(o,100)}%; border-radius: 3px; background: ${o>=90?"#f87171":o>=70?"#facc15":"#4ade80"}; transition: width 0.3s;"></div></div>`,s+="</div>",o>=90?s+='<div class="entry red">Near limit. Oldest data may be dropped.</div>':o>=70&&(s+='<div class="entry medium">Context filling up — AI may lose earlier details.</div>');break}case"privacy":{s+="<h3>🔒 Privacy Router</h3>";const o=a.processingLocation;s+=`<div class="entry"><span class="label">Status:</span> <span class="value ${o==="local"?"low":o==="cloud"?"high":""}">${o==="local"?"🟢 All local — nothing leaving device":o==="cloud"?"🔴 Cloud processing active":o==="mixed"?"🟡 Mixed processing":"⚪ Idle"}</span></div>`;break}case"audit":{s+="<h3>📋 Audit Trail</h3>";const o=a.auditEvents.slice(-10).reverse();o.length===0&&(s+='<div class="entry label">No events yet</div>');for(const i of o){const c=new Date(i.timestamp).toLocaleTimeString();s+=`<div class="entry"><span class="label">${c}</span> ${i.type} <span class="label">from</span> ${i.origin}</div>`}break}case"tools":{s+="<h3>🔧 MCP Tool Calls</h3>",b&&(s+='<div class="entry medium">Tool loop running...</div>'),v.length===0&&(s+='<div class="entry label">No tool calls yet. Use Tool Mode in the Agent Panel.</div>');for(const o of v.slice(-10).reverse()){const i=new Date(o.timestamp).toLocaleTimeString(),c=typeof o.args=="object"?JSON.stringify(o.args).slice(0,80):String(o.args);s+=`<div class="entry"><span class="label">${i}</span> <span class="value">${o.toolName}</span> <span class="label">${c}</span></div>`}break}}return s+="</div>",s}chrome.runtime.onMessage.addListener(n=>{if(n.type==="STATE_UPDATE"){y=n.state,h();return}if(n.type==="READ_PAGE")try{const a=q(),s=D(a,n.maxTokens||2e3);return Promise.resolve({success:!0,context:a,summary:s})}catch(a){return Promise.resolve({success:!1,error:String(a)})}if(n.type==="FIND_ON_PAGE")try{const a=(n.query||"").toLowerCase(),o=(document.body.innerText||"").split(`
`).filter(c=>c.toLowerCase().includes(a)),i=o.slice(0,20).map(c=>c.trim().slice(0,200));return Promise.resolve({success:!0,matches:i,matchCount:o.length})}catch(a){return Promise.resolve({success:!1,error:String(a)})}if(n.type==="CLICK_ELEMENT")try{const{selector:a}=n;let s=null;try{s=document.querySelector(a)}catch{}if(!s){const o=document.querySelectorAll('a, button, [role="button"], [onclick]');s=Array.from(o).find(i=>i.textContent?.trim().toLowerCase().includes(a.toLowerCase()))||null}return s?(s.click(),Promise.resolve({success:!0,clicked:s.textContent?.trim().slice(0,100)})):Promise.resolve({success:!1,error:`Element not found: ${a}`})}catch(a){return Promise.resolve({success:!1,error:String(a)})}if(n.type==="FILL_FORM")try{const{fields:a}=n,s=[];for(const[o,i]of Object.entries(a)){const c=document.querySelector(`input[name="${o}"], textarea[name="${o}"], select[name="${o}"], input[id="${o}"], textarea[id="${o}"], select[id="${o}"]`);c&&c.type!=="password"&&(c.value=i,c.dispatchEvent(new Event("input",{bubbles:!0})),c.dispatchEvent(new Event("change",{bubbles:!0})),s.push(o))}return Promise.resolve({success:!0,filled:s,note:"Fields filled — user must submit manually"})}catch(a){return Promise.resolve({success:!1,error:String(a)})}if(n.type==="SHOW_PERMISSION_DIALOG")return f(n.permType,n.reason,n.sensitivity);if(n.type==="TOOL_CALL_UPDATE"){b=n.state?.running||!1,m=n.state?.callCount||0,v=n.state?.calls||[],h();return}if(n.type==="EXEC_CUSTOM_SCRIPT")try{const s=new Function("args",n.script)(n.args||{});return Promise.resolve({success:!0,data:String(s).slice(0,3e3)})}catch(a){return Promise.resolve({success:!1,error:String(a)})}}),h(),document.body.style.marginTop="28px"}};function w(e,...r){}const N={debug:(...e)=>w(console.debug,...e),log:(...e)=>w(console.log,...e),warn:(...e)=>w(console.warn,...e),error:(...e)=>w(console.error,...e)},L=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;var F=class P extends Event{static EVENT_NAME=E("wxt:locationchange");constructor(r,t){super(P.EVENT_NAME,{}),this.newUrl=r,this.oldUrl=t}};function E(e){return`${L?.runtime?.id}:content:${e}`}function z(e){let r,t;return{run(){r==null&&(t=new URL(location.href),r=e.setInterval(()=>{let l=new URL(location.href);l.href!==t.href&&(window.dispatchEvent(new F(l,t)),t=l)},1e3))}}}var O=class T{static SCRIPT_STARTED_MESSAGE_TYPE=E("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=z(this);receivedMessageIds=new Set;constructor(r,t){this.contentScriptName=r,this.options=t,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(r){return this.abortController.abort(r)}get isInvalid(){return L.runtime?.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(r){return this.signal.addEventListener("abort",r),()=>this.signal.removeEventListener("abort",r)}block(){return new Promise(()=>{})}setInterval(r,t){const l=setInterval(()=>{this.isValid&&r()},t);return this.onInvalidated(()=>clearInterval(l)),l}setTimeout(r,t){const l=setTimeout(()=>{this.isValid&&r()},t);return this.onInvalidated(()=>clearTimeout(l)),l}requestAnimationFrame(r){const t=requestAnimationFrame((...l)=>{this.isValid&&r(...l)});return this.onInvalidated(()=>cancelAnimationFrame(t)),t}requestIdleCallback(r,t){const l=requestIdleCallback((...d)=>{this.signal.aborted||r(...d)},t);return this.onInvalidated(()=>cancelIdleCallback(l)),l}addEventListener(r,t,l,d){t==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),r.addEventListener?.(t.startsWith("wxt:")?E(t):t,l,{...d,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),N.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:T.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(r){const t=r.data?.type===T.SCRIPT_STARTED_MESSAGE_TYPE,l=r.data?.contentScriptName===this.contentScriptName,d=!this.receivedMessageIds.has(r.data?.messageId);return t&&l&&d}listenForNewerScripts(r){let t=!0;const l=d=>{if(this.verifyScriptStartedEvent(d)){this.receivedMessageIds.add(d.data.messageId);const p=t;if(t=!1,p&&r?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",l),this.onInvalidated(()=>removeEventListener("message",l))}};function J(){}function S(e,...r){}const U={debug:(...e)=>S(console.debug,...e),log:(...e)=>S(console.log,...e),warn:(...e)=>S(console.warn,...e),error:(...e)=>S(console.error,...e)};return(async()=>{try{const{main:e,...r}=_;return await e(new O("content",r))}catch(e){throw U.error('The content script "content" crashed on startup!',e),e}})()})();
content;