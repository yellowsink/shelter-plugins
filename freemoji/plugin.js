(()=>{var y=Object.create;var c=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var E=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty;var K=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),H=(e,t)=>{for(var r in t)c(e,r,{get:t[r],enumerable:!0})},m=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of N(t))!k.call(e,s)&&s!==r&&c(e,s,{get:()=>t[s],enumerable:!(o=C(t,s))||o.enumerable});return e};var f=(e,t,r)=>(r=e!=null?y(E(e)):{},m(t||!e||!e.__esModule?c(r,"default",{value:e,enumerable:!0}):r,e)),L=e=>m(c({},"__esModule",{value:!0}),e);var u=K((J,I)=>{I.exports=shelter.solidWeb});var O={};H(O,{onUnload:()=>G,settings:()=>S});var l=()=>shelter.flux.stores.UserStore.getCurrentUser(),n,h=()=>{n||(n=l().premiumType,l().premiumType=2)},g=()=>{n!==void 0&&(l().premiumType=n,n=void 0)};var{plugin:{store:b},flux:{stores:{SelectedGuildStore:M,EmojiStore:$}}}=shelter,w=()=>!!document.querySelector('[data-list-item-id="guildsnav___home"][class*="selected"]'),B=()=>Number.isSafeInteger(parseInt(b.size))?b.size:64,x=e=>{let t=[],r=[];for(let o of e){let s=[];for(let i of o.children){if(i.emoji){let a=$.getCustomEmojiById(i.emoji.emojiId);if(a.guildId!==M.getLastSelectedGuildId()||a.animated||w()){t.push(`${a.url.split("?")[0]}?size=${B()}`);continue}}s.push(i)}r.push({...o,children:s})}for(let o of t)r.push({type:"line",children:[{text:o}]});return r};var Q=f(u(),1),p=f(u(),1),{plugin:{store:d},ui:{Header:F,HeaderTags:U,TextBox:W}}=shelter,S=()=>[(0,p.createComponent)(F,{get tag(){return U.H3},children:"Emoji Size (defaults to 64 if invalid)"}),(0,p.createComponent)(W,{placeholder:"64",get value(){return Number.isSafeInteger(d.size)?d.size:""},onInput:e=>d.size=parseInt(e)})];var{flux:{dispatcher:_},plugin:{store:T},observeDom:z,util:{getFiber:q}}=shelter;T.size===void 0&&(T.size=64);function j(e){let t=(r,o)=>{if(e.event===r){h();let s=z(o,i=>{i.isConnected||(setTimeout(()=>g(),5e3),s())})}};t("expression_picker_opened","#emoji-picker-tab-panel"),t("channel_autocomplete_open","[class*=autocomplete]")}var v=!1,A=e=>{if(e.dataset.YSINK_FM)return;e.dataset.YSINK_FM="1";let r=q(e).child.pendingProps.editor;e.onkeydown=o=>{v||o.key==="Enter"&&!document.querySelector("[class*=autocomplete],[class*=attachedBars]")&&(r.children=x(r.children))}},D=z('[class*="slateContainer-"]',e=>{A(e)});_.subscribe("TRACK",j);var G=()=>{_.unsubscribe("TRACK",j),D(),v=!0};return L(O);})();
