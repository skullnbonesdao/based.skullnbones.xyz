import{u as P,g as He,a as we,h as Me,b as j,c as Fe,p as Dt,s as bt,P as St,d as xt,Q as wt,e as je}from"./ToSigner-Dr05baq-.js";import{Q as Le}from"./QSeparator-D76G7Eb4.js";import{M as Mt,O as re,K as _t,Q as It,R as he,S as Ae,V as Ze,Y as Pe,X as Ve,D as C,w as I,E as te,H as Ke,x,aw as at,az as Tt,y as ue,aA as kt,v as ce,a3 as Yt,F as rt,aB as Ct,aC as ot,I as W,aD as $t,af as ie,aE as st,aF as it,aG as At,a9 as U,ai as Q,aj as $,ab as b,ac as Y,ad as m,ae as d,ao as H,as as de,at as ne,ag as _e,an as D,aH as Vt,aI as qt,aq as Ie,ah as q,aJ as Te,aK as B,aL as E,aM as le,P as ke,aN as De,aO as be,aP as Et,aQ as Re,aR as Ot,aS as Ht,aT as oe,J as Ft}from"./index-1xDO4cLM.js";import{g as Xe,s as Ge,Q as J}from"./QToggle-D59Ujn7I.js";import{c as Lt,u as Nt,h as Qt,q as Ut,i as Kt,r as Bt,n as ee,m as z,Q as N,t as M,v as zt,o as lt,p as qe,w as jt,x as Zt}from"./SquadsStore-Xi2gkjCY.js";import{b as Rt,u as ut,a as ct}from"./use-dark-DDGI9PiR.js";import{a as A,Q as ae}from"./QCard-1K78PbiN.js";import{a as dt}from"./use-checkbox-CtQ9Dp2k.js";import{Q as Ne}from"./QInput-oewmZTca.js";import"./index-DVKssMzM.js";function Xt(e){const t=[.06,6,50];return typeof e=="string"&&e.length&&e.split(":").forEach((r,a)=>{const o=parseFloat(r);o&&(t[a]=o)}),t}const Gt=Mt({name:"touch-swipe",beforeMount(e,{value:t,arg:r,modifiers:a}){if(a.mouse!==!0&&re.has.touch!==!0)return;const o=a.mouseCapture===!0?"Capture":"",n={handler:t,sensitivity:Xt(r),direction:Xe(a),noop:_t,mouseStart(l){Ge(l,n)&&It(l)&&(he(n,"temp",[[document,"mousemove","move",`notPassive${o}`],[document,"mouseup","end","notPassiveCapture"]]),n.start(l,!0))},touchStart(l){if(Ge(l,n)){const s=l.target;he(n,"temp",[[s,"touchmove","move","notPassiveCapture"],[s,"touchcancel","end","notPassiveCapture"],[s,"touchend","end","notPassiveCapture"]]),n.start(l)}},start(l,s){re.is.firefox===!0&&Ae(e,!0);const i=Ze(l);n.event={x:i.left,y:i.top,time:Date.now(),mouse:s===!0,dir:!1}},move(l){if(n.event===void 0)return;if(n.event.dir!==!1){Pe(l);return}const s=Date.now()-n.event.time;if(s===0)return;const i=Ze(l),_=i.left-n.event.x,u=Math.abs(_),f=i.top-n.event.y,h=Math.abs(f);if(n.event.mouse!==!0){if(u<n.sensitivity[1]&&h<n.sensitivity[1]){n.end(l);return}}else if(window.getSelection().toString()!==""){n.end(l);return}else if(u<n.sensitivity[2]&&h<n.sensitivity[2])return;const c=u/s,g=h/s;n.direction.vertical===!0&&u<h&&u<100&&g>n.sensitivity[0]&&(n.event.dir=f<0?"up":"down"),n.direction.horizontal===!0&&u>h&&h<100&&c>n.sensitivity[0]&&(n.event.dir=_<0?"left":"right"),n.direction.up===!0&&u<h&&f<0&&u<100&&g>n.sensitivity[0]&&(n.event.dir="up"),n.direction.down===!0&&u<h&&f>0&&u<100&&g>n.sensitivity[0]&&(n.event.dir="down"),n.direction.left===!0&&u>h&&_<0&&h<100&&c>n.sensitivity[0]&&(n.event.dir="left"),n.direction.right===!0&&u>h&&_>0&&h<100&&c>n.sensitivity[0]&&(n.event.dir="right"),n.event.dir!==!1?(Pe(l),n.event.mouse===!0&&(document.body.classList.add("no-pointer-events--children"),document.body.classList.add("non-selectable"),Lt(),n.styleCleanup=p=>{n.styleCleanup=void 0,document.body.classList.remove("non-selectable");const S=()=>{document.body.classList.remove("no-pointer-events--children")};p===!0?setTimeout(S,50):S()}),n.handler({evt:l,touch:n.event.mouse!==!0,mouse:n.event.mouse,direction:n.event.dir,duration:s,distance:{x:u,y:h}})):n.end(l)},end(l){n.event!==void 0&&(Ve(n,"temp"),re.is.firefox===!0&&Ae(e,!1),n.styleCleanup!==void 0&&n.styleCleanup(!0),l!==void 0&&n.event.dir!==!1&&Pe(l),n.event=void 0)}};if(e.__qtouchswipe=n,a.mouse===!0){const l=a.mouseCapture===!0||a.mousecapture===!0?"Capture":"";he(n,"main",[[e,"mousedown","mouseStart",`passive${l}`]])}re.has.touch===!0&&he(n,"main",[[e,"touchstart","touchStart",`passive${a.capture===!0?"Capture":""}`],[e,"touchmove","noop","notPassiveCapture"]])},updated(e,t){const r=e.__qtouchswipe;r!==void 0&&(t.oldValue!==t.value&&(typeof t.value!="function"&&r.end(),r.handler=t.value),r.direction=Xe(t.modifiers))},beforeUnmount(e){const t=e.__qtouchswipe;t!==void 0&&(Ve(t,"main"),Ve(t,"temp"),re.is.firefox===!0&&Ae(e,!1),t.styleCleanup!==void 0&&t.styleCleanup(),delete e.__qtouchswipe)}});function Wt(){let e=Object.create(null);return{getCache:(t,r)=>e[t]===void 0?e[t]=typeof r=="function"?r():r:e[t],setCache(t,r){e[t]=r},hasCache(t){return Object.hasOwnProperty.call(e,t)},clearCache(t){t!==void 0?delete e[t]:e=Object.create(null)}}}const Jt={name:{required:!0},disable:Boolean},We={setup(e,{slots:t}){return()=>x("div",{class:"q-panel scroll",role:"tabpanel"},ue(t.default))}},en={modelValue:{required:!0},animated:Boolean,infinite:Boolean,swipeable:Boolean,vertical:Boolean,transitionPrev:String,transitionNext:String,transitionDuration:{type:[String,Number],default:300},keepAlive:Boolean,keepAliveInclude:[String,Array,RegExp],keepAliveExclude:[String,Array,RegExp],keepAliveMax:Number},tn=["update:modelValue","beforeTransition","transition"];function nn(){const{props:e,emit:t,proxy:r}=Ke(),{getCache:a}=Wt(),{registerTimeout:o}=Rt();let n,l;const s=C(null),i={value:null};function _(y){const w=e.vertical===!0?"up":"left";L((r.$q.lang.rtl===!0?-1:1)*(y.direction===w?1:-1))}const u=I(()=>[[Gt,_,void 0,{horizontal:e.vertical!==!0,vertical:e.vertical,mouse:!0}]]),f=I(()=>e.transitionPrev||`slide-${e.vertical===!0?"down":"right"}`),h=I(()=>e.transitionNext||`slide-${e.vertical===!0?"up":"left"}`),c=I(()=>`--q-transition-duration: ${e.transitionDuration}ms`),g=I(()=>typeof e.modelValue=="string"||typeof e.modelValue=="number"?e.modelValue:String(e.modelValue)),p=I(()=>({include:e.keepAliveInclude,exclude:e.keepAliveExclude,max:e.keepAliveMax})),S=I(()=>e.keepAliveInclude!==void 0||e.keepAliveExclude!==void 0);te(()=>e.modelValue,(y,w)=>{const V=R(y)===!0?X(y):-1;l!==!0&&fe(V===-1?0:V<X(w)?-1:1),i.value!==V&&(i.value=V,t("beforeTransition",y,w),o(()=>{t("transition",y,w)},e.transitionDuration))});function T(){L(1)}function k(){L(-1)}function Z(y){t("update:modelValue",y)}function R(y){return y!=null&&y!==""}function X(y){return n.findIndex(w=>w.props.name===y&&w.props.disable!==""&&w.props.disable!==!0)}function Ye(){return n.filter(y=>y.props.disable!==""&&y.props.disable!==!0)}function fe(y){const w=y!==0&&e.animated===!0&&i.value!==-1?"q-transition--"+(y===-1?f.value:h.value):null;s.value!==w&&(s.value=w)}function L(y,w=i.value){let V=w+y;for(;V!==-1&&V<n.length;){const v=n[V];if(v!==void 0&&v.props.disable!==""&&v.props.disable!==!0){fe(y),l=!0,t("update:modelValue",v.props.name),setTimeout(()=>{l=!1});return}V+=y}e.infinite===!0&&n.length!==0&&w!==-1&&w!==n.length&&L(y,y===-1?n.length:-1)}function me(){const y=X(e.modelValue);return i.value!==y&&(i.value=y),!0}function pe(){const y=R(e.modelValue)===!0&&me()&&n[i.value];return e.keepAlive===!0?[x(kt,p.value,[x(S.value===!0?a(g.value,()=>({...We,name:g.value})):We,{key:g.value,style:c.value},()=>y)])]:[x("div",{class:"q-panel scroll",style:c.value,key:g.value,role:"tabpanel"},[y])]}function ge(){if(n.length!==0)return e.animated===!0?[x(at,{name:s.value},pe)]:pe()}function Ce(y){return n=Tt(ue(y.default,[])).filter(w=>w.props!==null&&w.props.slot===void 0&&R(w.props.name)===!0),n.length}function $e(){return n}return Object.assign(r,{next:T,previous:k,goTo:Z}),{panelIndex:i,panelDirectives:u,updatePanelsList:Ce,updatePanelIndex:me,getPanelContent:ge,getEnabledPanels:Ye,getPanels:$e,isValidPanelName:R,keepAliveProps:p,needsUniqueKeepAliveWrapper:S,goToPanelByOffset:L,goToPanel:Z,nextPanel:T,previousPanel:k}}const Je=ce({name:"QTabPanel",props:Jt,setup(e,{slots:t}){return()=>x("div",{class:"q-tab-panel",role:"tabpanel"},ue(t.default))}}),an=ce({name:"QTabPanels",props:{...en,...ut},emits:tn,setup(e,{slots:t}){const r=Ke(),a=ct(e,r.proxy.$q),{updatePanelsList:o,getPanelContent:n,panelDirectives:l}=nn(),s=I(()=>"q-tab-panels q-panel-parent"+(a.value===!0?" q-tab-panels--dark q-dark":""));return()=>(o(t),Yt("div",{class:s.value},n(),"pan",e.swipeable,()=>l.value))}}),rn=ce({name:"QSlideTransition",props:{appear:Boolean,duration:{type:Number,default:300}},emits:["show","hide"],setup(e,{slots:t,emit:r}){let a=!1,o,n,l=null,s=null,i,_;function u(){o&&o(),o=null,a=!1,l!==null&&(clearTimeout(l),l=null),s!==null&&(clearTimeout(s),s=null),n!==void 0&&n.removeEventListener("transitionend",i),i=null}function f(p,S,T){S!==void 0&&(p.style.height=`${S}px`),p.style.transition=`height ${e.duration}ms cubic-bezier(.25, .8, .50, 1)`,a=!0,o=T}function h(p,S){p.style.overflowY=null,p.style.height=null,p.style.transition=null,u(),S!==_&&r(S)}function c(p,S){let T=0;n=p,a===!0?(u(),T=p.offsetHeight===p.scrollHeight?0:void 0):(_="hide",p.style.overflowY="hidden"),f(p,T,S),l=setTimeout(()=>{l=null,p.style.height=`${p.scrollHeight}px`,i=k=>{s=null,(Object(k)!==k||k.target===p)&&h(p,"show")},p.addEventListener("transitionend",i),s=setTimeout(i,e.duration*1.1)},100)}function g(p,S){let T;n=p,a===!0?u():(_="show",p.style.overflowY="hidden",T=p.scrollHeight),f(p,T,S),l=setTimeout(()=>{l=null,p.style.height=0,i=k=>{s=null,(Object(k)!==k||k.target===p)&&h(p,"hide")},p.addEventListener("transitionend",i),s=setTimeout(i,e.duration*1.1)},100)}return rt(()=>{a===!0&&u()}),()=>x(at,{css:!1,appear:e.appear,onEnter:c,onLeave:g},t.default)}}),K=Ct({}),on=Object.keys(ot),ft=ce({name:"QExpansionItem",props:{...ot,...Nt,...ut,icon:String,label:String,labelLines:[Number,String],caption:String,captionLines:[Number,String],dense:Boolean,toggleAriaLabel:String,expandIcon:String,expandedIcon:String,expandIconClass:[Array,String,Object],duration:{},headerInsetLevel:Number,contentInsetLevel:Number,expandSeparator:Boolean,defaultOpened:Boolean,hideExpandIcon:Boolean,expandIconToggle:Boolean,switchToggleSide:Boolean,denseToggle:Boolean,group:String,popup:Boolean,headerStyle:[Array,String,Object],headerClass:[Array,String,Object]},emits:[...Qt,"click","afterShow","afterHide"],setup(e,{slots:t,emit:r}){const{proxy:{$q:a}}=Ke(),o=ct(e,a),n=C(e.modelValue!==null?e.modelValue:e.defaultOpened),l=C(null),s=Ut(),{show:i,hide:_,toggle:u}=Kt({showing:n});let f,h;const c=I(()=>`q-expansion-item q-item-type q-expansion-item--${n.value===!0?"expanded":"collapsed"} q-expansion-item--${e.popup===!0?"popup":"standard"}`),g=I(()=>e.contentInsetLevel===void 0?null:{["padding"+(a.lang.rtl===!0?"Right":"Left")]:e.contentInsetLevel*56+"px"}),p=I(()=>e.disable!==!0&&(e.href!==void 0||e.to!==void 0&&e.to!==null&&e.to!=="")),S=I(()=>{const v={};return on.forEach(F=>{v[F]=e[F]}),v}),T=I(()=>p.value===!0||e.expandIconToggle!==!0),k=I(()=>e.expandedIcon!==void 0&&n.value===!0?e.expandedIcon:e.expandIcon||a.iconSet.expansionItem[e.denseToggle===!0?"denseIcon":"icon"]),Z=I(()=>e.disable!==!0&&(p.value===!0||e.expandIconToggle===!0)),R=I(()=>({expanded:n.value===!0,detailsId:s.value,toggle:u,show:i,hide:_})),X=I(()=>{const v=e.toggleAriaLabel!==void 0?e.toggleAriaLabel:a.lang.label[n.value===!0?"collapse":"expand"](e.label);return{role:"button","aria-expanded":n.value===!0?"true":"false","aria-controls":s.value,"aria-label":v}});te(()=>e.group,v=>{h!==void 0&&h(),v!==void 0&&ge()});function Ye(v){p.value!==!0&&u(v),r("click",v)}function fe(v){v.keyCode===13&&L(v,!0)}function L(v,F){F!==!0&&l.value!==null&&l.value.focus(),u(v),Pe(v)}function me(){r("afterShow")}function pe(){r("afterHide")}function ge(){f===void 0&&(f=Bt()),n.value===!0&&(K[e.group]=f);const v=te(n,ve=>{ve===!0?K[e.group]=f:K[e.group]===f&&delete K[e.group]}),F=te(()=>K[e.group],(ve,Pt)=>{Pt===f&&ve!==void 0&&ve!==f&&_()});h=()=>{v(),F(),K[e.group]===f&&delete K[e.group],h=void 0}}function Ce(){const v={class:[`q-focusable relative-position cursor-pointer${e.denseToggle===!0&&e.switchToggleSide===!0?" items-end":""}`,e.expandIconClass],side:e.switchToggleSide!==!0,avatar:e.switchToggleSide},F=[x(ie,{class:"q-expansion-item__toggle-icon"+(e.expandedIcon===void 0&&n.value===!0?" q-expansion-item__toggle-icon--rotated":""),name:k.value})];return Z.value===!0&&(Object.assign(v,{tabindex:0,...X.value,onClick:L,onKeyup:fe}),F.unshift(x("div",{ref:l,class:"q-expansion-item__toggle-focus q-icon q-focus-helper q-focus-helper--rounded",tabindex:-1}))),x(N,v,()=>F)}function $e(){let v;return t.header!==void 0?v=[].concat(t.header(R.value)):(v=[x(N,()=>[x(z,{lines:e.labelLines},()=>e.label||""),e.caption?x(z,{lines:e.captionLines,caption:!0},()=>e.caption):null])],e.icon&&v[e.switchToggleSide===!0?"push":"unshift"](x(N,{side:e.switchToggleSide===!0,avatar:e.switchToggleSide!==!0},()=>x(ie,{name:e.icon})))),e.disable!==!0&&e.hideExpandIcon!==!0&&v[e.switchToggleSide===!0?"unshift":"push"](Ce()),v}function y(){const v={ref:"item",style:e.headerStyle,class:e.headerClass,dark:o.value,disable:e.disable,dense:e.dense,insetLevel:e.headerInsetLevel};return T.value===!0&&(v.clickable=!0,v.onClick=Ye,Object.assign(v,p.value===!0?S.value:X.value)),x(ee,v,$e)}function w(){return W(x("div",{key:"e-content",class:"q-expansion-item__content relative-position",style:g.value,id:s.value},ue(t.default)),[[$t,n.value]])}function V(){const v=[y(),x(rn,{duration:e.duration,onShow:me,onHide:pe},w)];return e.expandSeparator===!0&&v.push(x(Le,{class:"q-expansion-item__border q-expansion-item__border--top absolute-top",dark:o.value}),x(Le,{class:"q-expansion-item__border q-expansion-item__border--bottom absolute-bottom",dark:o.value})),v}return e.group!==void 0&&ge(),rt(()=>{h!==void 0&&h()}),()=>x("div",{class:c.value},[x("div",{class:"q-expansion-item__container relative-position"},V())])}}),mt=864e5,sn=36e5,Qe=6e4,pt="YYYY-MM-DDTHH:mm:ss.SSSZ",ln=/\[((?:[^\]\\]|\\]|\\)*)\]|do|d{1,4}|Mo|M{1,4}|m{1,2}|wo|w{1,2}|Qo|Do|DDDo|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]/g,un=/(\[[^\]]*\])|do|d{1,4}|Mo|M{1,4}|m{1,2}|wo|w{1,2}|Qo|Do|DDDo|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]|([.*+:?^,\s${}()|\\]+)/g,Ee={};function cn(e,t){const r="("+t.days.join("|")+")",a=e+r;if(Ee[a]!==void 0)return Ee[a];const o="("+t.daysShort.join("|")+")",n="("+t.months.join("|")+")",l="("+t.monthsShort.join("|")+")",s={};let i=0;const _=e.replace(un,f=>{switch(i++,f){case"YY":return s.YY=i,"(-?\\d{1,2})";case"YYYY":return s.YYYY=i,"(-?\\d{1,4})";case"M":return s.M=i,"(\\d{1,2})";case"Mo":return s.M=i++,"(\\d{1,2}(st|nd|rd|th))";case"MM":return s.M=i,"(\\d{2})";case"MMM":return s.MMM=i,l;case"MMMM":return s.MMMM=i,n;case"D":return s.D=i,"(\\d{1,2})";case"Do":return s.D=i++,"(\\d{1,2}(st|nd|rd|th))";case"DD":return s.D=i,"(\\d{2})";case"H":return s.H=i,"(\\d{1,2})";case"HH":return s.H=i,"(\\d{2})";case"h":return s.h=i,"(\\d{1,2})";case"hh":return s.h=i,"(\\d{2})";case"m":return s.m=i,"(\\d{1,2})";case"mm":return s.m=i,"(\\d{2})";case"s":return s.s=i,"(\\d{1,2})";case"ss":return s.s=i,"(\\d{2})";case"S":return s.S=i,"(\\d{1})";case"SS":return s.S=i,"(\\d{2})";case"SSS":return s.S=i,"(\\d{3})";case"A":return s.A=i,"(AM|PM)";case"a":return s.a=i,"(am|pm)";case"aa":return s.aa=i,"(a\\.m\\.|p\\.m\\.)";case"ddd":return o;case"dddd":return r;case"Q":case"d":case"E":return"(\\d{1})";case"do":return i++,"(\\d{1}(st|nd|rd|th))";case"Qo":return"(1st|2nd|3rd|4th)";case"DDD":case"DDDD":return"(\\d{1,3})";case"DDDo":return i++,"(\\d{1,3}(st|nd|rd|th))";case"w":return"(\\d{1,2})";case"wo":return i++,"(\\d{1,2}(st|nd|rd|th))";case"ww":return"(\\d{2})";case"Z":return s.Z=i,"(Z|[+-]\\d{2}:\\d{2})";case"ZZ":return s.ZZ=i,"(Z|[+-]\\d{2}\\d{2})";case"X":return s.X=i,"(-?\\d+)";case"x":return s.x=i,"(-?\\d{4,})";default:return i--,f[0]==="["&&(f=f.substring(1,f.length-1)),f.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}}),u={map:s,regex:new RegExp("^"+_)};return Ee[a]=u,u}function gt(e,t){return e!==void 0?e:t!==void 0?t.date:At.date}function et(e,t=""){const r=e>0?"-":"+",a=Math.abs(e),o=Math.floor(a/60),n=a%60;return r+M(o)+t+M(n)}function dn(e,t,r){let a=e.getFullYear(),o=e.getMonth();const n=e.getDate();return t.year!==void 0&&(a+=r*t.year,delete t.year),t.month!==void 0&&(o+=r*t.month,delete t.month),e.setDate(1),e.setMonth(2),e.setFullYear(a),e.setMonth(o),e.setDate(Math.min(n,ze(e))),t.date!==void 0&&(e.setDate(e.getDate()+r*t.date),delete t.date),e}function fn(e,t,r){const a=t.year!==void 0?t.year:e[`get${r}FullYear`](),o=t.month!==void 0?t.month-1:e[`get${r}Month`](),n=new Date(a,o+1,0).getDate(),l=Math.min(n,t.date!==void 0?t.date:e[`get${r}Date`]());return e[`set${r}Date`](1),e[`set${r}Month`](2),e[`set${r}FullYear`](a),e[`set${r}Month`](o),e[`set${r}Date`](l),delete t.year,delete t.month,delete t.date,e}function Be(e,t,r){const a=vt(t),o=new Date(e),n=a.year!==void 0||a.month!==void 0||a.date!==void 0?dn(o,a,r):o;for(const l in a){const s=zt(l);n[`set${s}`](n[`get${s}`]()+r*a[l])}return n}function vt(e){const t={...e};return e.years!==void 0&&(t.year=e.years,delete t.years),e.months!==void 0&&(t.month=e.months,delete t.months),e.days!==void 0&&(t.date=e.days,delete t.days),e.day!==void 0&&(t.date=e.day,delete t.day),e.hour!==void 0&&(t.hours=e.hour,delete t.hour),e.minute!==void 0&&(t.minutes=e.minute,delete t.minute),e.second!==void 0&&(t.seconds=e.second,delete t.second),e.millisecond!==void 0&&(t.milliseconds=e.millisecond,delete t.millisecond),t}function ht(e,t,r){const a=vt(t),o=r===!0?"UTC":"",n=new Date(e),l=a.year!==void 0||a.month!==void 0||a.date!==void 0?fn(n,a,o):n;for(const s in a){const i=s.charAt(0).toUpperCase()+s.slice(1);l[`set${o}${i}`](a[s])}return l}function mn(e,t,r){const a=pn(e,t,r),o=new Date(a.year,a.month===null?null:a.month-1,a.day===null?1:a.day,a.hour,a.minute,a.second,a.millisecond),n=o.getTimezoneOffset();return a.timezoneOffset===null||a.timezoneOffset===n?o:Be(o,{minutes:a.timezoneOffset-n},1)}function pn(e,t,r,a,o){const n={year:null,month:null,day:null,hour:null,minute:null,second:null,millisecond:null,timezoneOffset:null,dateHash:null,timeHash:null};if(e==null||e===""||typeof e!="string")return n;t===void 0&&(t=pt);const l=gt(r,st.props),s=l.months,i=l.monthsShort,{regex:_,map:u}=cn(t,l),f=e.match(_);if(f===null)return n;let h="";if(u.X!==void 0||u.x!==void 0){const c=parseInt(f[u.X!==void 0?u.X:u.x],10);if(isNaN(c)===!0||c<0)return n;const g=new Date(c*(u.X!==void 0?1e3:1));n.year=g.getFullYear(),n.month=g.getMonth()+1,n.day=g.getDate(),n.hour=g.getHours(),n.minute=g.getMinutes(),n.second=g.getSeconds(),n.millisecond=g.getMilliseconds()}else{if(u.YYYY!==void 0)n.year=parseInt(f[u.YYYY],10);else if(u.YY!==void 0){const c=parseInt(f[u.YY],10);n.year=c<0?c:2e3+c}if(u.M!==void 0){if(n.month=parseInt(f[u.M],10),n.month<1||n.month>12)return n}else u.MMM!==void 0?n.month=i.indexOf(f[u.MMM])+1:u.MMMM!==void 0&&(n.month=s.indexOf(f[u.MMMM])+1);if(u.D!==void 0){if(n.day=parseInt(f[u.D],10),n.year===null||n.month===null||n.day<1)return n;const c=new Date(n.year,n.month,0).getDate();if(n.day>c)return n}u.H!==void 0?n.hour=parseInt(f[u.H],10)%24:u.h!==void 0&&(n.hour=parseInt(f[u.h],10)%12,(u.A&&f[u.A]==="PM"||u.a&&f[u.a]==="pm"||u.aa&&f[u.aa]==="p.m.")&&(n.hour+=12),n.hour=n.hour%24),u.m!==void 0&&(n.minute=parseInt(f[u.m],10)%60),u.s!==void 0&&(n.second=parseInt(f[u.s],10)%60),u.S!==void 0&&(n.millisecond=parseInt(f[u.S],10)*10**(3-f[u.S].length)),(u.Z!==void 0||u.ZZ!==void 0)&&(h=u.Z!==void 0?f[u.Z].replace(":",""):f[u.ZZ],n.timezoneOffset=(h[0]==="+"?-1:1)*(60*h.slice(1,3)+1*h.slice(3,5)))}return n.dateHash=M(n.year,6)+"/"+M(n.month)+"/"+M(n.day),n.timeHash=M(n.hour)+":"+M(n.minute)+":"+M(n.second)+h,n}function gn(e){return typeof e=="number"?!0:isNaN(Date.parse(e))===!1}function vn(e,t){return ht(new Date,e,t)}function hn(e){const t=new Date(e).getDay();return t===0?7:t}function Se(e){const t=new Date(e.getFullYear(),e.getMonth(),e.getDate());t.setDate(t.getDate()-(t.getDay()+6)%7+3);const r=new Date(t.getFullYear(),0,4);r.setDate(r.getDate()-(r.getDay()+6)%7+3);const a=t.getTimezoneOffset()-r.getTimezoneOffset();t.setHours(t.getHours()-a);const o=(t-r)/(mt*7);return 1+Math.floor(o)}function yn(e){return e.getFullYear()*1e4+e.getMonth()*100+e.getDate()}function Oe(e,t){const r=new Date(e);return t===!0?yn(r):r.getTime()}function Pn(e,t,r,a={}){const o=Oe(t,a.onlyDate),n=Oe(r,a.onlyDate),l=Oe(e,a.onlyDate);return(l>o||a.inclusiveFrom===!0&&l===o)&&(l<n||a.inclusiveTo===!0&&l===n)}function Dn(e,t){return Be(e,t,1)}function bn(e,t){return Be(e,t,-1)}function O(e,t,r){const a=new Date(e),o=`set${r===!0?"UTC":""}`;switch(t){case"year":case"years":a[`${o}Month`](0);case"month":case"months":a[`${o}Date`](1);case"day":case"days":case"date":a[`${o}Hours`](0);case"hour":case"hours":a[`${o}Minutes`](0);case"minute":case"minutes":a[`${o}Seconds`](0);case"second":case"seconds":a[`${o}Milliseconds`](0)}return a}function Sn(e,t,r){const a=new Date(e),o=`set${r===!0?"UTC":""}`;switch(t){case"year":case"years":a[`${o}Month`](11);case"month":case"months":a[`${o}Date`](ze(a));case"day":case"days":case"date":a[`${o}Hours`](23);case"hour":case"hours":a[`${o}Minutes`](59);case"minute":case"minutes":a[`${o}Seconds`](59);case"second":case"seconds":a[`${o}Milliseconds`](999)}return a}function xn(e){let t=new Date(e);return Array.prototype.slice.call(arguments,1).forEach(r=>{t=Math.max(t,new Date(r))}),t}function wn(e){let t=new Date(e);return Array.prototype.slice.call(arguments,1).forEach(r=>{t=Math.min(t,new Date(r))}),t}function ye(e,t,r){return(e.getTime()-e.getTimezoneOffset()*Qe-(t.getTime()-t.getTimezoneOffset()*Qe))/r}function yt(e,t,r="days"){const a=new Date(e),o=new Date(t);switch(r){case"years":case"year":return a.getFullYear()-o.getFullYear();case"months":case"month":return(a.getFullYear()-o.getFullYear())*12+a.getMonth()-o.getMonth();case"days":case"day":case"date":return ye(O(a,"day"),O(o,"day"),mt);case"hours":case"hour":return ye(O(a,"hour"),O(o,"hour"),sn);case"minutes":case"minute":return ye(O(a,"minute"),O(o,"minute"),Qe);case"seconds":case"second":return ye(O(a,"second"),O(o,"second"),1e3)}}function xe(e){return yt(e,O(e,"year"),"days")+1}function Mn(e){return it(e)===!0?"date":typeof e=="number"?"number":"string"}function _n(e,t,r){const a=new Date(e);if(t){const o=new Date(t);if(a<o)return o}if(r){const o=new Date(r);if(a>o)return o}return a}function In(e,t,r){const a=new Date(e),o=new Date(t);if(r===void 0)return a.getTime()===o.getTime();switch(r){case"second":case"seconds":if(a.getSeconds()!==o.getSeconds())return!1;case"minute":case"minutes":if(a.getMinutes()!==o.getMinutes())return!1;case"hour":case"hours":if(a.getHours()!==o.getHours())return!1;case"day":case"days":case"date":if(a.getDate()!==o.getDate())return!1;case"month":case"months":if(a.getMonth()!==o.getMonth())return!1;case"year":case"years":if(a.getFullYear()!==o.getFullYear())return!1;break;default:throw new Error(`date isSameDate unknown unit ${r}`)}return!0}function ze(e){return new Date(e.getFullYear(),e.getMonth()+1,0).getDate()}function G(e){if(e>=11&&e<=13)return`${e}th`;switch(e%10){case 1:return`${e}st`;case 2:return`${e}nd`;case 3:return`${e}rd`}return`${e}th`}const tt={YY(e,t,r){const a=this.YYYY(e,t,r)%100;return a>=0?M(a):"-"+M(Math.abs(a))},YYYY(e,t,r){return r??e.getFullYear()},M(e){return e.getMonth()+1},Mo(e){return G(e.getMonth()+1)},MM(e){return M(e.getMonth()+1)},MMM(e,t){return t.monthsShort[e.getMonth()]},MMMM(e,t){return t.months[e.getMonth()]},Q(e){return Math.ceil((e.getMonth()+1)/3)},Qo(e){return G(this.Q(e))},D(e){return e.getDate()},Do(e){return G(e.getDate())},DD(e){return M(e.getDate())},DDD(e){return xe(e)},DDDo(e){return G(xe(e))},DDDD(e){return M(xe(e),3)},d(e){return e.getDay()},do(e){return G(e.getDay())},dd(e,t){return t.days[e.getDay()].slice(0,2)},ddd(e,t){return t.daysShort[e.getDay()]},dddd(e,t){return t.days[e.getDay()]},E(e){return e.getDay()||7},w(e){return Se(e)},wo(e){return G(Se(e))},ww(e){return M(Se(e))},H(e){return e.getHours()},HH(e){return M(e.getHours())},h(e){const t=e.getHours();return t===0?12:t>12?t%12:t},hh(e){return M(this.h(e))},m(e){return e.getMinutes()},mm(e){return M(e.getMinutes())},s(e){return e.getSeconds()},ss(e){return M(e.getSeconds())},S(e){return Math.floor(e.getMilliseconds()/100)},SS(e){return M(Math.floor(e.getMilliseconds()/10))},SSS(e){return M(e.getMilliseconds(),3)},A(e){return e.getHours()<12?"AM":"PM"},a(e){return e.getHours()<12?"am":"pm"},aa(e){return e.getHours()<12?"a.m.":"p.m."},Z(e,t,r,a){const o=a??e.getTimezoneOffset();return et(o,":")},ZZ(e,t,r,a){const o=a??e.getTimezoneOffset();return et(o)},X(e){return Math.floor(e.getTime()/1e3)},x(e){return e.getTime()}};function Tn(e,t,r,a,o){if(e!==0&&!e||e===1/0||e===-1/0)return;const n=new Date(e);if(isNaN(n))return;t===void 0&&(t=pt);const l=gt(r,st.props);return t.replace(ln,(s,i)=>s in tt?tt[s](n,l,a,o):i===void 0?s:i.split("\\]").join("]"))}function kn(e){return it(e)===!0?new Date(e.getTime()):e}const Yn={isValid:gn,extractDate:mn,buildDate:vn,getDayOfWeek:hn,getWeekOfYear:Se,isBetweenDates:Pn,addToDate:Dn,subtractFromDate:bn,adjustDate:ht,startOfDate:O,endOfDate:Sn,getMaxDate:xn,getMinDate:wn,getDateDiff:yt,getDayOfYear:xe,inferDateFormat:Mn,getDateBetween:_n,isSameDate:In,daysInMonth:ze,formatDate:Tn,clone:kn},Cn=U({__name:"TimestampFormatter",props:["unixTimestamp"],setup(e){return(t,r)=>Q($(Yn).formatDate(e.unixTimestamp*1e3,"YYYY-MM-DD HH:mm"))}}),$n={class:"col"},An={key:1},se=U({__name:"AccountExpansionItem",props:["label","account"],setup(e){return(t,r)=>(b(),Y(ft,{caption:e.account?.key.toString()??"not-found",label:e.label,icon:"perm_identity"},{default:m(()=>[d(ae,null,{default:m(()=>[e.account?.data?(b(),Y(A,{key:0},{default:m(()=>[(b(!0),H(ne,null,de(Object.entries(e.account.data),a=>(b(),H("div",{key:a[0],class:"row"},[D("div",$n,Q(a[0]),1),a[0]=="createdAt"?(b(),Y(Cn,{key:0,"unix-timestamp":a[1]},null,8,["unix-timestamp"])):(b(),H("div",An,Q(a[1]),1))]))),128))]),_:1})):_e("",!0)]),_:1})]),_:1},8,["caption","label"]))}}),Vn=U({__name:"PlayerProfileOverview",setup(e){return(t,r)=>(b(),Y(ae,{bordered:"",flat:""},{default:m(()=>[d(A,{class:"row items-center q-gutter-md"},{default:m(()=>[d(ie,{name:"visibility",size:"md"}),r[0]||(r[0]=D("div",{class:"text-h6"},"View Accounts",-1))]),_:1}),d(A,{class:"row"},{default:m(()=>[d(dt,{bordered:"",class:"rounded-borders full-width",separator:""},{default:m(()=>[d(ft,{caption:$(P)().wallet?.toString()??"none","hide-expand-icon":"",icon:"perm_identity",label:"Wallet"},null,8,["caption"]),d(se,{account:$(P)().playerProfile,label:"Player Profile"},null,8,["account"]),d(se,{account:$(P)().nameProfile,label:"Name Profile"},null,8,["account"]),d(se,{account:$(P)().factionProfile,label:"Faction Profile"},null,8,["account"]),d(se,{account:$(P)().sageProfile,label:"Faction Profile"},null,8,["account"]),(b(!0),H(ne,null,de($(P)().points,(a,o)=>(b(),Y(se,{key:o,account:a.points,label:$(He)(a.category)+" Points"},null,8,["account","label"]))),128))]),_:1})]),_:1})]),_:1}))}}),nt=ce({name:"QCardActions",props:{...Vt,vertical:Boolean},setup(e,{slots:t}){const r=qt(e),a=I(()=>`q-card__actions ${r.value} q-card__actions--${e.vertical===!0?"vert column":"horiz row"}`);return()=>x("div",{class:a.value},ue(t.default))}}),qn=U({__name:"PermissionsAddAccount",setup(e){const t=[Te],r=C("3q9HnMCZTVnLwgHzzTcu9ALi6kJFvnpFcq1TW7gxPeyL"),a=C(t[0]),o=C(0);C();async function n(){const l=we(),s=[];s.push(B.PlayerProfile.addKeys(E().playerProfileProgram.value,l,P().playerProfile,le.SagePermissions,Te,[{key:new ke(r.value),permissions:le.SagePermissions.all(),expireTime:o.value==0?null:o.value}])),await Me("Add permission account",s,l),await P().updateStore(j()),console.log("Sending TX")}return(l,s)=>(b(),Y(ae,{bordered:"",flat:""},{default:m(()=>[d(nt,null,{default:m(()=>s[3]||(s[3]=[D("div",{class:"text-weight-thin text-center col"},"Add a new wallet to the permission list",-1)])),_:1}),d(A,null,{default:m(()=>[d(Ne,{modelValue:r.value,"onUpdate:modelValue":s[0]||(s[0]=i=>r.value=i),label:"Key",square:""},null,8,["modelValue"]),d(lt,{modelValue:a.value,"onUpdate:modelValue":s[1]||(s[1]=i=>a.value=i),options:t,label:"Scope",square:""},null,8,["modelValue"]),d(Ne,{modelValue:o.value,"onUpdate:modelValue":s[2]||(s[2]=i=>o.value=i),label:"Expire Time",square:"",type:"number"},null,8,["modelValue"])]),_:1}),d(nt,null,{default:m(()=>[d(Ie,{class:"full-width",color:"primary",onClick:n},{default:m(()=>s[4]||(s[4]=[q("ADD")])),_:1})]),_:1})]),_:1}))}});class Ue{signer;constructor(t){this.signer=t}createPlayerProfileIx(t,r){return B.PlayerProfile.createProfile(E().playerProfileProgram.value,r,[{key:t,expireTime:null,scope:De,permissions:B.ProfilePermissions.all()}],1)}createPlayerProfileNameIx(t){const{instructions:r}=B.PlayerProfile.setName(E().playerProfileProgram.value,{profile:P().playerProfile,key:this.signer,playerProfileProgram:E().playerProfileProgram.value},t);return r}createChooseFactionIx(t){const{instructions:r}=be.ProfileFactionAccount.chooseFaction(E().profileFactionProgram.value,{profile:P().playerProfile,key:this.signer,playerProfileProgram:E().playerProfileProgram.value},t);return r}createSagePlayerProfileIx(){return le.SagePlayerProfile.registerSagePlayerProfile(E().sageProgram.value,P().playerProfileAddress,Fe().game.key,Fe().game.data.gameState)}createPointsIx(t){const{instructions:r}=Et.UserPoints.createUserPointAccount(E().pointsProgram.value,P().playerProfile.key,t);return r}addSageKeyToProfileIx(t,r,a=null){return B.PlayerProfile.addKeys(E().playerProfileProgram.value,this.signer,P().playerProfile,le.SagePermissions,Te,[{key:t,permissions:r,expireTime:a}])}removeKeyFromProfileIx(t){return B.PlayerProfile.removeKeys(E().playerProfileProgram.value,{profileKey:P().playerProfile?.key,key:this.signer,keyIndex:0,playerProfileProgram:E().playerProfileProgram.value},this.signer.publicKey(),t)}}const En={class:"col"},On=U({__name:"PermissionEditable",props:["publicKey","scope","inputPermissions","expireTime"],setup(e){const t=e,r=C();t.scope.toString()==De.toString()&&(r.value=B.ProfilePermissions.fromPermissions(t.inputPermissions)),t.scope.toString()==Te.toString()&&(r.value=le.SagePermissions.fromPermissions(t.inputPermissions));async function a(){const n=we(),l=[],s=new Ue(n);l.push(s.removeKeyFromProfileIx([1,2])),await Me("Update profile permissions",l,n),await P().updateStore(j())}async function o(){const n=we(),l=[],s=new Ue(n);l.push(s.removeKeyFromProfileIx([1,2])),l.push(s.addSageKeyToProfileIx(new ke(t.publicKey.toString()),r.value,t.expireTime>=0?null:new Ot(t.expireTime))),await Me("Update profile permissions",l,n),await P().updateStore(j())}return(n,l)=>(b(),H(ne,null,[r.value?(b(),Y(A,{key:0},{default:m(()=>[(b(!0),H(ne,null,de(Object.keys(r.value),s=>(b(),H("div",{key:s,class:"row"},[D("div",En,Q(s),1),D("div",null,[d(J,{modelValue:r.value[s],"onUpdate:modelValue":i=>r.value[s]=i,disable:e.scope.toString()==$(De).toString(),"checked-icon":"check",dense:"",label:"","unchecked-icon":"clear"},null,8,["modelValue","onUpdate:modelValue","disable"])])]))),128))]),_:1})):_e("",!0),e.scope.toString()!=$(De).toString()?(b(),Y(A,{key:1,class:"q-gutter-x-sm row"},{default:m(()=>[d(Ie,{class:"col",color:"primary",label:"Delete",onClick:Re(a,["prevent"])}),d(Ie,{disable:r.value?.getPermissions().toString()==e.inputPermissions.toString(),class:"col",color:"primary",label:"Update",onClick:Re(o,["prevent"])},null,8,["disable"])]),_:1})):_e("",!0)],64))}}),Hn={class:"row"},Fn={class:"row"},Ln={class:"row"},Nn=U({__name:"PlayerProfilePermissions",setup(e){return(t,r)=>(b(),Y(ae,{bordered:"",flat:""},{default:m(()=>[d(A,{class:"row items-center q-gutter-md"},{default:m(()=>[d(ie,{name:"vpn_key",size:"md"}),r[0]||(r[0]=D("div",{class:"text-h6"},"Permissions",-1))]),_:1}),$(P)().playerProfile?(b(),Y(A,{key:0,class:"q-gutter-y-md"},{default:m(()=>[(b(!0),H(ne,null,de($(P)().playerProfile.profileKeys,(a,o)=>(b(),Y(ae,{key:o,bordered:"",class:"col",flat:""},{default:m(()=>[d(A,null,{default:m(()=>[D("div",Hn,[r[1]||(r[1]=D("div",{class:"col"},"Key",-1)),D("div",null,Q(a.key),1)]),D("div",Fn,[r[2]||(r[2]=D("div",{class:"col"},"Scope",-1)),D("div",null,Q(a.scope),1)]),D("div",Ln,[r[3]||(r[3]=D("div",{class:"col"},"ExpireTime",-1)),D("div",null,Q(a.expireTime),1)])]),_:2},1024),d(A,null,{default:m(()=>[d(On,{"expire-time":a.expireTime,"input-permissions":a.permissions,publicKey:a.key,scope:a.scope},null,8,["expire-time","input-permissions","publicKey","scope"])]),_:2},1024)]),_:2},1024))),128))]),_:1})):_e("",!0),d(A,null,{default:m(()=>[d(qn)]),_:1})]),_:1}))}}),Qn={class:"col row q-gutter-sm"},Un={class:"col row"},Kn={class:"col row q-gutter-sm"},Bn={class:"col row"},zn={class:"col row q-gutter-sm"},jn={class:"col row"},Zn={class:"col row q-gutter-sm"},Rn={class:"col row"},Xn=U({__name:"CreateAccounts",setup(e){const t=C(!1),r=C(!1),a=C(!1),o=C(!1),n=C([]),l=[be.Faction.MUD,be.Faction.ONI,be.Faction.Ustur],s=C("test"),i=C(l[0]);u();const _=I(()=>({playerProfile:P().playerProfile,faction:P().factionProfile,sagePlayerProfile:P().sageProfile,pointsCategories:P().points.flatMap(h=>h.points?.key)}));te(()=>_,()=>u(),{deep:!0});function u(){t.value=!1,r.value=!1,a.value=!1,o.value=!1,n.value=P().points.map(()=>!1),P().playerProfileAddress||(t.value=!0),P().playerProfileAddress&&(P().nameProfile||(r.value=!0),P().factionProfile||(a.value=!0),P().sageProfile||(o.value=!0),n.value=P().points.map(h=>!h.points?.key))}async function f(){const h=we(),c=[],g=new Ue(h);let p=0;const S=[];if(t.value){let T;if(qe().useSquads){const[k]=jt({multisigPda:new ke(qe().multisigPDA.toString()),index:qe().getNewTransactionIndex});T=Dt(Zt({transactionPda:k,ephemeralSignerIndex:0})[0]),p+=1}else T=bt.keypairToAsyncSigner(Ht.generate());c.push(g.createPlayerProfileIx(j(),T)),S.push("playerProfile")}if(r.value){if(!s.value)throw Error("Player name can not be empty!");c.push(g.createPlayerProfileNameIx(s.value)),S.push("nameProfile")}if(a.value){if(!i.value)throw Error("Please select a faction!");c.push(g.createChooseFactionIx(i.value)),S.push("factionProfile")}o.value&&(c.push(g.createSagePlayerProfileIx()),S.push("sageProfile")),n.value.forEach((T,k)=>{T&&(c.push(g.createPointsIx(St.find(Z=>Z.kind==P().points[k].category)?.key??new ke(""))),S.push(`points-${He(P().points[k].category)}`))}),await Me(`Instructions create: ${S.join(", ")}`,c,h,p),await P().updateStore(j())}return(h,c)=>(b(),Y(ae,{bordered:"",flat:""},{default:m(()=>[d(A,{class:"row items-center q-gutter-md"},{default:m(()=>[d(ie,{name:"create",size:"md"}),c[6]||(c[6]=D("div",{class:"text-h6"},"Create Accounts",-1))]),_:1}),d(A,null,{default:m(()=>[d(dt,{bordered:"",class:"rounded-borders",separator:""},{default:m(()=>[W((b(),Y(ee,{clickable:""},{default:m(()=>[d(J,{modelValue:t.value,"onUpdate:modelValue":c[0]||(c[0]=g=>t.value=g),"checked-icon":"check",color:"secondary","unchecked-icon":"clear"},null,8,["modelValue"]),D("div",null,[d(N,null,{default:m(()=>c[7]||(c[7]=[q("Profile")])),_:1}),d(z,{caption:""},{default:m(()=>c[8]||(c[8]=[q("Create player profile")])),_:1})])]),_:1})),[[oe]]),W((b(),Y(ee,{clickable:""},{default:m(()=>[D("div",Qn,[D("div",Un,[d(J,{modelValue:r.value,"onUpdate:modelValue":c[1]||(c[1]=g=>r.value=g),"checked-icon":"check",color:"secondary","unchecked-icon":"clear"},null,8,["modelValue"]),D("div",null,[d(N,null,{default:m(()=>c[9]||(c[9]=[q("Name")])),_:1}),d(z,{caption:""},{default:m(()=>c[10]||(c[10]=[q("Create player name")])),_:1})])]),d(Ne,{modelValue:s.value,"onUpdate:modelValue":c[2]||(c[2]=g=>s.value=g),class:"col",dense:"",label:"Player name"},null,8,["modelValue"])])]),_:1})),[[oe]]),W((b(),Y(ee,{clickable:""},{default:m(()=>[D("div",Kn,[D("div",Bn,[d(J,{modelValue:a.value,"onUpdate:modelValue":c[3]||(c[3]=g=>a.value=g),"checked-icon":"check",color:"secondary","unchecked-icon":"clear"},null,8,["modelValue"]),D("div",null,[d(N,null,{default:m(()=>c[11]||(c[11]=[q("Faction")])),_:1}),d(z,{caption:""},{default:m(()=>c[12]||(c[12]=[q("Choose faction")])),_:1})])]),d(lt,{modelValue:i.value,"onUpdate:modelValue":c[4]||(c[4]=g=>i.value=g),"option-label":g=>$(xt)(g),options:l,class:"col",dense:""},null,8,["modelValue","option-label"])])]),_:1})),[[oe]]),W((b(),Y(ee,{clickable:""},{default:m(()=>[D("div",zn,[D("div",jn,[d(J,{modelValue:o.value,"onUpdate:modelValue":c[5]||(c[5]=g=>o.value=g),"checked-icon":"check",color:"secondary","unchecked-icon":"clear"},null,8,["modelValue"]),D("div",null,[d(N,null,{default:m(()=>c[13]||(c[13]=[q("Sage Profile")])),_:1}),d(z,{caption:""},{default:m(()=>c[14]||(c[14]=[q("Create sage profile")])),_:1})])])])]),_:1})),[[oe]]),(b(!0),H(ne,null,de($(P)().points,(g,p)=>W((b(),Y(ee,{key:p,clickable:""},{default:m(()=>[D("div",Zn,[D("div",Rn,[d(J,{modelValue:n.value[p],"onUpdate:modelValue":S=>n.value[p]=S,"checked-icon":"check",color:"secondary","unchecked-icon":"clear"},null,8,["modelValue","onUpdate:modelValue"]),D("div",null,[d(N,null,{default:m(()=>[q("Points "+Q($(He)(g.category)),1)]),_:2},1024),d(z,{caption:""},{default:m(()=>c[15]||(c[15]=[q("Create point")])),_:1})])])])]),_:2},1024)),[[oe]])),128))]),_:1})]),_:1}),d(A,null,{default:m(()=>[d(Ie,{class:"full-width",color:"primary",label:"Send",onClick:f})]),_:1})]),_:1}))}}),Gn={class:"col"},la=U({__name:"PlayerProfile",setup(e){Ft(async()=>{await t()}),te(()=>j(),async()=>{await t()});async function t(){await P().updateStore(j()),await Fe().updateStore()}const r=C("overview");return(a,o)=>(b(),H("div",Gn,[d(wt,{modelValue:r.value,"onUpdate:modelValue":o[0]||(o[0]=n=>r.value=n),"active-bg-color":"primary",align:"justify","inline-label":""},{default:m(()=>[d(je,{icon:"dashboard",label:"Overview",name:"overview"}),d(je,{icon:"settings",label:"Permissions",name:"permissions"})]),_:1},8,["modelValue"]),d(Le),d(an,{modelValue:r.value,"onUpdate:modelValue":o[1]||(o[1]=n=>r.value=n)},{default:m(()=>[d(Je,{class:"q-gutter-md",name:"overview"},{default:m(()=>[d(Vn),d(Xn)]),_:1}),d(Je,{name:"permissions"},{default:m(()=>[d(Nn)]),_:1})]),_:1},8,["modelValue"])]))}});export{la as default};
