(()=>{"use strict";class e{constructor(e){this.token=e,this.userData=null}async getUserData(){return null!==this.userData?this.userData:this.get("getMySelf").then((e=>e.ok?e.json():{user:null,status:e.status})).then((e=>(this.userData=e?.user,this.userData)))}async notify(e,t={}){return this.query(`notify?reason=${e}`,{reason:e,data:t})}async get(e){return this.query(e,{},"GET")}async query(e,t,s="POST"){return fetch(`https://myvisit.appetited.com/api/${e}`,{method:s,headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.token}`},body:"GET"!==s?JSON.stringify(t):null})}}const t=document.querySelector("#token"),s=document.querySelector("#save"),n=document.querySelector("#status"),i=document.querySelector("#switchOff"),r=document.querySelector("#switchOn");async function a(t){if(!t)return!1;const s=new e(t),n=await s.getUserData();return n&&(document.querySelector("#userDetail").style.visibility="visible",document.querySelector("#name").innerText=n.name,document.querySelector("#idNumber").innerText=n.idNumber,document.querySelector("#shortMobilePhone").innerText=n.shortMobilePhone),null!==n}function o(e){e?(i.style.visibility="hidden",r.style.visibility="visible"):(i.style.visibility="visible",r.style.visibility="hidden")}i.addEventListener("click",(async e=>{chrome.storage.sync.set({isDisabled:!0}),o(!0)})),r.addEventListener("click",(async e=>{chrome.storage.sync.set({isDisabled:!1}),o(!1)})),s.addEventListener("click",(async e=>{const s=t.value.trim();let i="Ok";await a(s)?chrome.storage.sync.set({personalToken:s}):i="Неверный токен",n.innerText=i,setTimeout((()=>{n.innerText=""}),2e3),e.preventDefault()})),(async()=>{t.value=await async function(){return(await chrome.storage.sync.get("personalToken")).personalToken||""}(),a(t.value),o((await chrome.storage.sync.get("isDisabled")).isDisabled)})()})();