import{$ as c,F as i,ax as f,H as s,v as u,w as n,x as l,y as d}from"./index-D5e0EpkC.js";function k(){let e=null;const t=s();function a(){e!==null&&(clearTimeout(e),e=null)}return c(a),i(a),{removeTimeout:a,registerTimeout(r,o){a(),f(t)===!1&&(e=setTimeout(()=>{e=null,r()},o))}}}const g=u({name:"QCardSection",props:{tag:{type:String,default:"div"},horizontal:Boolean},setup(e,{slots:t}){const a=n(()=>`q-card__section q-card__section--${e.horizontal===!0?"horiz row no-wrap":"vert"}`);return()=>l(e.tag,{class:a.value},d(t.default))}}),m={dark:{type:Boolean,default:null}};function q(e,t){return n(()=>e.dark===null?t.dark.isActive:e.dark)}const h=u({name:"QCard",props:{...m,tag:{type:String,default:"div"},square:Boolean,flat:Boolean,bordered:Boolean},setup(e,{slots:t}){const{proxy:{$q:a}}=s(),r=q(e,a),o=n(()=>"q-card"+(r.value===!0?" q-card--dark q-dark":"")+(e.bordered===!0?" q-card--bordered":"")+(e.square===!0?" q-card--square no-border-radius":"")+(e.flat===!0?" q-card--flat no-shadow":""));return()=>l(e.tag,{class:o.value},d(t.default))}});export{h as Q,q as a,k as b,g as c,m as u};
