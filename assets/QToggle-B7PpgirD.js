import{v as y,w as a,x as c,y as C,H as I,D as S,aP as R,aQ as f,a1 as F,aR as K,Y as V,af as M}from"./index-D5e0EpkC.js";import{u as _,a as $}from"./QCard-CmvuOAoH.js";import{t as U,v as H}from"./SquadsStore-BUv8OVmM.js";const X=["ul","ol"],ne=y({name:"QList",props:{..._,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(t,{slots:r}){const e=I(),u=$(t,e.proxy.$q),s=a(()=>X.includes(t.tag)?null:"list"),n=a(()=>"q-list"+(t.bordered===!0?" q-list--bordered":"")+(t.dense===!0?" q-list--dense":"")+(t.separator===!0?" q-list--separator":"")+(u.value===!0?" q-list--dark":"")+(t.padding===!0?" q-list--padding":""));return()=>c(t.tag,{class:n.value,role:s.value},C(r.default))}}),h={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},Y=Object.keys(h);h.all=!0;function oe(t){const r={};for(const e of Y)t[e]===!0&&(r[e]=!0);return Object.keys(r).length===0?h:(r.horizontal===!0?r.left=r.right=!0:r.left===!0&&r.right===!0&&(r.horizontal=!0),r.vertical===!0?r.up=r.down=!0:r.up===!0&&r.down===!0&&(r.vertical=!0),r.horizontal===!0&&r.vertical===!0&&(r.all=!0),r)}const G=["INPUT","TEXTAREA"];function ue(t,r){return r.event===void 0&&t.target!==void 0&&t.target.draggable!==!0&&typeof r.handler=="function"&&G.includes(t.target.nodeName.toUpperCase())===!1&&(t.qClonedBy===void 0||t.qClonedBy.indexOf(r.uid)===-1)}function J(t,r){const e=S(null),u=a(()=>t.disable===!0?null:c("span",{ref:e,class:"no-outline",tabindex:-1}));function s(n){const i=r.value;n!==void 0&&n.type.indexOf("key")===0?i!==null&&document.activeElement!==i&&i.contains(document.activeElement)===!0&&i.focus():e.value!==null&&(n===void 0||i!==null&&i.contains(n.target)===!0)&&e.value.focus()}return{refocusTargetEl:u,refocusTarget:s}}const W={xs:30,sm:35,md:40,lg:50,xl:60},Z={..._,...K,...U,modelValue:{required:!0,default:null},val:{},trueValue:{default:!0},falseValue:{default:!1},indeterminateValue:{default:null},checkedIcon:String,uncheckedIcon:String,indeterminateIcon:String,toggleOrder:{type:String,validator:t=>t==="tf"||t==="ft"},toggleIndeterminate:Boolean,label:String,leftLabel:Boolean,color:String,keepColor:Boolean,dense:Boolean,disable:Boolean,tabindex:[String,Number]},ee=["update:modelValue"];function te(t,r){const{props:e,slots:u,emit:s,proxy:n}=I(),{$q:i}=n,B=$(e,i),p=S(null),{refocusTargetEl:k,refocusTarget:w}=J(e,p),O=R(e,W),v=a(()=>e.val!==void 0&&Array.isArray(e.modelValue)),g=a(()=>{const l=f(e.val);return v.value===!0?e.modelValue.findIndex(d=>f(d)===l):-1}),o=a(()=>v.value===!0?g.value!==-1:f(e.modelValue)===f(e.trueValue)),m=a(()=>v.value===!0?g.value===-1:f(e.modelValue)===f(e.falseValue)),q=a(()=>o.value===!1&&m.value===!1),T=a(()=>e.disable===!0?-1:e.tabindex||0),A=a(()=>`q-${t} cursor-pointer no-outline row inline no-wrap items-center`+(e.disable===!0?" disabled":"")+(B.value===!0?` q-${t}--dark`:"")+(e.dense===!0?` q-${t}--dense`:"")+(e.leftLabel===!0?" reverse":"")),z=a(()=>{const l=o.value===!0?"truthy":m.value===!0?"falsy":"indet",d=e.color!==void 0&&(e.keepColor===!0||o.value===!0)?` text-${e.color}`:"";return`q-${t}__inner relative-position non-selectable q-${t}__inner--${l}${d}`}),E=a(()=>{const l={type:"checkbox"};return e.name!==void 0&&Object.assign(l,{".checked":o.value,"^checked":o.value===!0?"checked":void 0,name:e.name,value:v.value===!0?e.val:e.trueValue}),l}),P=H(E),Q=a(()=>{const l={tabindex:T.value,role:"switch","aria-label":e.label,"aria-checked":q.value===!0?"mixed":o.value===!0?"true":"false"};return e.disable===!0&&(l["aria-disabled"]="true"),l});function b(l){l!==void 0&&(V(l),w(l)),e.disable!==!0&&s("update:modelValue",j(),l)}function j(){if(v.value===!0){if(o.value===!0){const l=e.modelValue.slice();return l.splice(g.value,1),l}return e.modelValue.concat([e.val])}if(o.value===!0){if(e.toggleOrder!=="ft"||e.toggleIndeterminate===!1)return e.falseValue}else if(m.value===!0){if(e.toggleOrder==="ft"||e.toggleIndeterminate===!1)return e.trueValue}else return e.toggleOrder!=="ft"?e.trueValue:e.falseValue;return e.indeterminateValue}function D(l){(l.keyCode===13||l.keyCode===32)&&V(l)}function L(l){(l.keyCode===13||l.keyCode===32)&&b(l)}const N=r(o,q);return Object.assign(n,{toggle:b}),()=>{const l=N();e.disable!==!0&&P(l,"unshift",` q-${t}__native absolute q-ma-none q-pa-none`);const d=[c("div",{class:z.value,style:O.value,"aria-hidden":"true"},l)];k.value!==null&&d.push(k.value);const x=e.label!==void 0?F(u.default,[e.label]):C(u.default);return x!==void 0&&d.push(c("div",{class:`q-${t}__label q-anchor--skip`},x)),c("div",{ref:p,class:A.value,...Q.value,onClick:b,onKeydown:D,onKeyup:L},d)}}const se=y({name:"QToggle",props:{...Z,icon:String,iconColor:String},emits:ee,setup(t){function r(e,u){const s=a(()=>(e.value===!0?t.checkedIcon:u.value===!0?t.indeterminateIcon:t.uncheckedIcon)||t.icon),n=a(()=>e.value===!0?t.iconColor:null);return()=>[c("div",{class:"q-toggle__track"}),c("div",{class:"q-toggle__thumb absolute flex flex-center no-wrap"},s.value!==void 0?[c(M,{name:s.value,color:n.value})]:void 0)]}return te("toggle",r)}});export{se as Q,ne as a,oe as g,ue as s};
