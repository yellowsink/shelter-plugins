(()=>{var g=Object.create;var a=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var T=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var y=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),C=(e,t)=>{for(var n in t)a(e,n,{get:t[n],enumerable:!0})},d=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of x(t))!$.call(e,s)&&s!==n&&a(e,s,{get:()=>t[s],enumerable:!(i=v(t,s))||i.enumerable});return e};var c=(e,t,n)=>(n=e!=null?g(T(e)):{},d(t||!e||!e.__esModule?a(n,"default",{value:e,enumerable:!0}):n,e)),I=e=>d(a({},"__esModule",{value:!0}),e);var o=y((j,f)=>{f.exports=shelter.solidWeb});var F={};C(F,{onUnload:()=>R,settings:()=>U});var p=c(o(),1),m=c(o(),1),h=c(o(),1),E=c(o(),1),w=(0,p.template)('<iframe style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9" allow="fullscreen"></iframe>',2),{plugin:{store:r},observeDom:D,flux:{dispatcher:b,storesFlat:{SelectedChannelStore:G}},util:{reactFiberWalker:M,getFiber:z},ui:{Header:N,HeaderTags:P,TextBox:H}}=shelter;r.instance==="invidious.slipfox.xyz"&&!r.sfmigrate&&(r.sfmigrate=1,r.instance=null);r.instance??="inv.n8pjl.ca";var A=["MESSAGE_CREATE","MESSAGE_UPDATE","UPDATE_CHANNEL_DIMENSIONS"];function S(e){if(!r.instance||(e.type==="MESSAGE_CREATE"||e.type==="MESSAGE_UPDATE")&&e.message.channel_id!==G.getChannelId())return;let t=D('[id^="chat-messages-"] article:not([data-invidivizer])',n=>{n.dataset.invidivizer="1",t(),n.parentElement.querySelector(`iframe[src*="${r.instance}"]`)?.remove();let i=M(z(n),"embed",!0)?.memoizedProps?.embed?.url;if(typeof i!="string"||!i.startsWith("https://www.youtube.com"))return;let s=i.match(/v=([a-zA-Z0-9-_]+)/);if(!s?.[1])return;let l=i.match(/t=(?:\d+|(?:\d+m)?\d+s|\d+m)/),_=l?.[0]?s[1]+"?"+l[0]:s[1];n.style.display="none",n.insertAdjacentElement("afterend",(()=>{let u=w.cloneNode(!0);return(0,E.effect)(()=>(0,h.setAttribute)(u,"src",`https://${r.instance}/embed/${_}`)),u})())});setTimeout(t,1e3)}for(let e of A)b.subscribe(e,S);function R(){for(let e of A)b.unsubscribe(e,S)}var U=()=>[(0,m.createComponent)(N,{get tag(){return P.H3},children:"Invidious Instance"}),(0,m.createComponent)(H,{placeholder:"my.instance.com",get value(){return r.instance},onInput:e=>r.instance=e})];return I(F);})();
