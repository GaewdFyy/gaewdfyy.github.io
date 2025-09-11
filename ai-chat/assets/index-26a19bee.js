import{r as C,ao as pt,h as L,j as i,ap as I,aq as le,k as Ie,ar as mt,as as gt,l as X,u as Ue,o as ue,at as bt,m as yt,p as S,t as wt,n as xt,au as Me,a9 as be,av as kt,q as we,s as $t,v as xe,w as _,V as _t,x as St,aw as Ct,z as zt,T as Ae,ax as re,ay as de,H as De,az as Rt,aA as Tt,aB as Vt,aC as It,aD as Mt,aE as Dt,ab as Bt,I as Nt,X as Pt,a4 as Ee,J as O,K as Z,S as a,a2 as r,a5 as p,L as l,N as ce,a7 as k,aj as M,ak as P,a1 as Ut,a3 as G,aF as At,R as Et,ag as Ht,aG as Ft,Y,aH as jt,aI as He,Z as Ot,O as ke,a6 as $e,aJ as Lt,aK as Gt,aL as ye,aM as Kt,aN as Wt}from"./index-223035d1.js";function Be(n){return window.TouchEvent&&n instanceof window.TouchEvent}function Ne(){const n=C(new Map),o=f=>c=>{n.value.set(f,c)};return pt(()=>n.value.clear()),[n,o]}const Yt=L([i("slider",`
 display: block;
 padding: calc((var(--n-handle-size) - var(--n-rail-height)) / 2) 0;
 position: relative;
 z-index: 0;
 width: 100%;
 cursor: pointer;
 user-select: none;
 -webkit-user-select: none;
 `,[I("reverse",[i("slider-handles",[i("slider-handle-wrapper",`
 transform: translate(50%, -50%);
 `)]),i("slider-dots",[i("slider-dot",`
 transform: translateX(50%, -50%);
 `)]),I("vertical",[i("slider-handles",[i("slider-handle-wrapper",`
 transform: translate(-50%, -50%);
 `)]),i("slider-marks",[i("slider-mark",`
 transform: translateY(calc(-50% + var(--n-dot-height) / 2));
 `)]),i("slider-dots",[i("slider-dot",`
 transform: translateX(-50%) translateY(0);
 `)])])]),I("vertical",`
 padding: 0 calc((var(--n-handle-size) - var(--n-rail-height)) / 2);
 width: var(--n-rail-width-vertical);
 height: 100%;
 `,[i("slider-handles",`
 top: calc(var(--n-handle-size) / 2);
 right: 0;
 bottom: calc(var(--n-handle-size) / 2);
 left: 0;
 `,[i("slider-handle-wrapper",`
 top: unset;
 left: 50%;
 transform: translate(-50%, 50%);
 `)]),i("slider-rail",`
 height: 100%;
 `,[le("fill",`
 top: unset;
 right: 0;
 bottom: unset;
 left: 0;
 `)]),I("with-mark",`
 width: var(--n-rail-width-vertical);
 margin: 0 32px 0 8px;
 `),i("slider-marks",`
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 22px;
 font-size: var(--n-mark-font-size);
 `,[i("slider-mark",`
 transform: translateY(50%);
 white-space: nowrap;
 `)]),i("slider-dots",`
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 50%;
 `,[i("slider-dot",`
 transform: translateX(-50%) translateY(50%);
 `)])]),I("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `,[i("slider-handle",`
 cursor: not-allowed;
 `)]),I("with-mark",`
 width: 100%;
 margin: 8px 0 32px 0;
 `),L("&:hover",[i("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[le("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),i("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),I("active",[i("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[le("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),i("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),i("slider-marks",`
 position: absolute;
 top: 18px;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `,[i("slider-mark",`
 position: absolute;
 transform: translateX(-50%);
 white-space: nowrap;
 `)]),i("slider-rail",`
 width: 100%;
 position: relative;
 height: var(--n-rail-height);
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 border-radius: calc(var(--n-rail-height) / 2);
 `,[le("fill",`
 position: absolute;
 top: 0;
 bottom: 0;
 border-radius: calc(var(--n-rail-height) / 2);
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-fill-color);
 `)]),i("slider-handles",`
 position: absolute;
 top: 0;
 right: calc(var(--n-handle-size) / 2);
 bottom: 0;
 left: calc(var(--n-handle-size) / 2);
 `,[i("slider-handle-wrapper",`
 outline: none;
 position: absolute;
 top: 50%;
 transform: translate(-50%, -50%);
 cursor: pointer;
 display: flex;
 `,[i("slider-handle",`
 height: var(--n-handle-size);
 width: var(--n-handle-size);
 border-radius: 50%;
 overflow: hidden;
 transition: box-shadow .2s var(--n-bezier), background-color .3s var(--n-bezier);
 background-color: var(--n-handle-color);
 box-shadow: var(--n-handle-box-shadow);
 `,[L("&:hover",`
 box-shadow: var(--n-handle-box-shadow-hover);
 `)]),L("&:focus",[i("slider-handle",`
 box-shadow: var(--n-handle-box-shadow-focus);
 `,[L("&:hover",`
 box-shadow: var(--n-handle-box-shadow-active);
 `)])])])]),i("slider-dots",`
 position: absolute;
 top: 50%;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `,[I("transition-disabled",[i("slider-dot","transition: none;")]),i("slider-dot",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 transform: translate(-50%, -50%);
 height: var(--n-dot-height);
 width: var(--n-dot-width);
 border-radius: var(--n-dot-border-radius);
 overflow: hidden;
 box-sizing: border-box;
 border: var(--n-dot-border);
 background-color: var(--n-dot-color);
 `,[I("active","border: var(--n-dot-border-active);")])])]),i("slider-handle-indicator",`
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `,[Ie()]),i("slider-handle-indicator",`
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `,[I("top",`
 margin-bottom: 12px;
 `),I("right",`
 margin-left: 12px;
 `),I("bottom",`
 margin-top: 12px;
 `),I("left",`
 margin-right: 12px;
 `),Ie()]),mt(i("slider",[i("slider-dot","background-color: var(--n-dot-color-modal);")])),gt(i("slider",[i("slider-dot","background-color: var(--n-dot-color-popover);")]))]),Xt=0,Jt=Object.assign(Object.assign({},ue.props),{to:xe.propTo,defaultValue:{type:[Number,Array],default:0},marks:Object,disabled:{type:Boolean,default:void 0},formatTooltip:Function,keyboard:{type:Boolean,default:!0},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:[Number,String],default:1},range:Boolean,value:[Number,Array],placement:String,showTooltip:{type:Boolean,default:void 0},tooltip:{type:Boolean,default:!0},vertical:Boolean,reverse:Boolean,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),Pe=X({name:"Slider",props:Jt,setup(n){const{mergedClsPrefixRef:o,namespaceRef:f,inlineThemeDisabled:c}=Ue(n),v=ue("Slider","-slider",Yt,bt,n,o),u=C(null),[d,y]=Ne(),[w,b]=Ne(),z=C(new Set),E=yt(n),{mergedDisabledRef:U}=E,H=S(()=>{const{step:e}=n;if(e<=0||e==="mark")return 0;const t=e.toString();let s=0;return t.includes(".")&&(s=t.length-t.indexOf(".")-1),s}),J=C(n.defaultValue),he=wt(n,"value"),q=xt(he,J),D=S(()=>{const{value:e}=q;return(n.range?e:[e]).map(ze)}),Q=S(()=>D.value.length>2),g=S(()=>n.placement===void 0?n.vertical?"right":"top":n.placement),$=S(()=>{const{marks:e}=n;return e?Object.keys(e).map(parseFloat):null}),m=C(-1),F=C(-1),N=C(-1),B=C(!1),ee=C(!1),ve=S(()=>{const{vertical:e,reverse:t}=n;return e?t?"top":"bottom":t?"right":"left"}),Fe=S(()=>{if(Q.value)return;const e=D.value,t=te(n.range?Math.min(...e):n.min),s=te(n.range?Math.max(...e):e[0]),{value:h}=ve;return n.vertical?{[h]:`${t}%`,height:`${s-t}%`}:{[h]:`${t}%`,width:`${s-t}%`}}),je=S(()=>{const e=[],{marks:t}=n;if(t){const s=D.value.slice();s.sort((T,V)=>T-V);const{value:h}=ve,{value:x}=Q,{range:R}=n,A=x?()=>!1:T=>R?T>=s[0]&&T<=s[s.length-1]:T<=s[0];for(const T of Object.keys(t)){const V=Number(T);e.push({active:A(V),label:t[T],style:{[h]:`${te(V)}%`}})}}return e});function Oe(e,t){const s=te(e),{value:h}=ve;return{[h]:`${s}%`,zIndex:t===m.value?1:0}}function _e(e){return n.showTooltip||N.value===e||m.value===e&&B.value}function Le(e){return B.value?!(m.value===e&&F.value===e):!0}function Ge(e){var t;~e&&(m.value=e,(t=d.value.get(e))===null||t===void 0||t.focus())}function Ke(){w.value.forEach((e,t)=>{_e(t)&&e.syncPosition()})}function Se(e){const{"onUpdate:value":t,onUpdateValue:s}=n,{nTriggerFormInput:h,nTriggerFormChange:x}=E;s&&De(s,e),t&&De(t,e),J.value=e,h(),x()}function Ce(e){const{range:t}=n;if(t){if(Array.isArray(e)){const{value:s}=D;e.join()!==s.join()&&Se(e)}}else Array.isArray(e)||D.value[0]!==e&&Se(e)}function fe(e,t){if(n.range){const s=D.value.slice();s.splice(t,1,e),Ce(s)}else Ce(e)}function pe(e,t,s){const h=s!==void 0;s||(s=e-t>0?1:-1);const x=$.value||[],{step:R}=n;if(R==="mark"){const V=ne(e,x.concat(t),h?s:void 0);return V?V.value:t}if(R<=0)return t;const{value:A}=H;let T;if(h){const V=Number((t/R).toFixed(A)),j=Math.floor(V),me=V>j?j:j-1,ge=V<j?j:j+1;T=ne(t,[Number((me*R).toFixed(A)),Number((ge*R).toFixed(A)),...x],s)}else{const V=Ye(e);T=ne(e,[...x,V])}return T?ze(T.value):t}function ze(e){return Math.min(n.max,Math.max(n.min,e))}function te(e){const{max:t,min:s}=n;return(e-s)/(t-s)*100}function We(e){const{max:t,min:s}=n;return s+(t-s)*e}function Ye(e){const{step:t,min:s}=n;if(t<=0||t==="mark")return e;const h=Math.round((e-s)/t)*t+s;return Number(h.toFixed(H.value))}function ne(e,t=$.value,s){if(!(t!=null&&t.length))return null;let h=null,x=-1;for(;++x<t.length;){const R=t[x]-e,A=Math.abs(R);(s===void 0||R*s>0)&&(h===null||A<h.distance)&&(h={index:x,distance:A,value:t[x]})}return h}function Re(e){const t=u.value;if(!t)return;const s=Be(e)?e.touches[0]:e,h=t.getBoundingClientRect();let x;return n.vertical?x=(h.bottom-s.clientY)/h.height:x=(s.clientX-h.left)/h.width,n.reverse&&(x=1-x),We(x)}function Xe(e){if(U.value||!n.keyboard)return;const{vertical:t,reverse:s}=n;switch(e.key){case"ArrowUp":e.preventDefault(),se(t&&s?-1:1);break;case"ArrowRight":e.preventDefault(),se(!t&&s?-1:1);break;case"ArrowDown":e.preventDefault(),se(t&&s?1:-1);break;case"ArrowLeft":e.preventDefault(),se(!t&&s?1:-1);break}}function se(e){const t=m.value;if(t===-1)return;const{step:s}=n,h=D.value[t],x=s<=0||s==="mark"?h:h+s*e;fe(pe(x,h,e>0?1:-1),t)}function Je(e){var t,s;if(U.value||!Be(e)&&e.button!==Xt)return;const h=Re(e);if(h===void 0)return;const x=D.value.slice(),R=n.range?(s=(t=ne(h,x))===null||t===void 0?void 0:t.index)!==null&&s!==void 0?s:-1:0;R!==-1&&(e.preventDefault(),Ge(R),qe(),fe(pe(h,D.value[R]),R))}function qe(){B.value||(B.value=!0,re("touchend",document,ie),re("mouseup",document,ie),re("touchmove",document,oe),re("mousemove",document,oe))}function ae(){B.value&&(B.value=!1,de("touchend",document,ie),de("mouseup",document,ie),de("touchmove",document,oe),de("mousemove",document,oe))}function oe(e){const{value:t}=m;if(!B.value||t===-1){ae();return}const s=Re(e);fe(pe(s,D.value[t]),t)}function ie(){ae()}function Ze(e){m.value=e,U.value||(N.value=e)}function Qe(e){m.value===e&&(m.value=-1,ae()),N.value===e&&(N.value=-1)}function et(e){N.value=e}function tt(e){N.value===e&&(N.value=-1)}Me(m,(e,t)=>void be(()=>F.value=t)),Me(q,()=>{if(n.marks){if(ee.value)return;ee.value=!0,be(()=>{ee.value=!1})}be(Ke)}),kt(()=>{ae()});const Te=S(()=>{const{self:{markFontSize:e,railColor:t,railColorHover:s,fillColor:h,fillColorHover:x,handleColor:R,opacityDisabled:A,dotColor:T,dotColorModal:V,handleBoxShadow:j,handleBoxShadowHover:me,handleBoxShadowActive:ge,handleBoxShadowFocus:nt,dotBorder:st,dotBoxShadow:at,railHeight:ot,railWidthVertical:it,handleSize:lt,dotHeight:rt,dotWidth:dt,dotBorderRadius:ct,fontSize:ut,dotBorderActive:ht,dotColorPopover:vt},common:{cubicBezierEaseInOut:ft}}=v.value;return{"--n-bezier":ft,"--n-dot-border":st,"--n-dot-border-active":ht,"--n-dot-border-radius":ct,"--n-dot-box-shadow":at,"--n-dot-color":T,"--n-dot-color-modal":V,"--n-dot-color-popover":vt,"--n-dot-height":rt,"--n-dot-width":dt,"--n-fill-color":h,"--n-fill-color-hover":x,"--n-font-size":ut,"--n-handle-box-shadow":j,"--n-handle-box-shadow-active":ge,"--n-handle-box-shadow-focus":nt,"--n-handle-box-shadow-hover":me,"--n-handle-color":R,"--n-handle-size":lt,"--n-opacity-disabled":A,"--n-rail-color":t,"--n-rail-color-hover":s,"--n-rail-height":ot,"--n-rail-width-vertical":it,"--n-mark-font-size":e}}),K=c?we("slider",void 0,Te,n):void 0,Ve=S(()=>{const{self:{fontSize:e,indicatorColor:t,indicatorBoxShadow:s,indicatorTextColor:h,indicatorBorderRadius:x}}=v.value;return{"--n-font-size":e,"--n-indicator-border-radius":x,"--n-indicator-box-shadow":s,"--n-indicator-color":t,"--n-indicator-text-color":h}}),W=c?we("slider-indicator",void 0,Ve,n):void 0;return{mergedClsPrefix:o,namespace:f,uncontrolledValue:J,mergedValue:q,mergedDisabled:U,mergedPlacement:g,isMounted:$t(),adjustedTo:xe(n),dotTransitionDisabled:ee,markInfos:je,isShowTooltip:_e,shouldKeepTooltipTransition:Le,handleRailRef:u,setHandleRefs:y,setFollowerRefs:b,fillStyle:Fe,getHandleStyle:Oe,activeIndex:m,arrifiedValues:D,followerEnabledIndexSet:z,handleRailMouseDown:Je,handleHandleFocus:Ze,handleHandleBlur:Qe,handleHandleMouseEnter:et,handleHandleMouseLeave:tt,handleRailKeyDown:Xe,indicatorCssVars:c?void 0:Ve,indicatorThemeClass:W==null?void 0:W.themeClass,indicatorOnRender:W==null?void 0:W.onRender,cssVars:c?void 0:Te,themeClass:K==null?void 0:K.themeClass,onRender:K==null?void 0:K.onRender}},render(){var n;const{mergedClsPrefix:o,themeClass:f,formatTooltip:c}=this;return(n=this.onRender)===null||n===void 0||n.call(this),_("div",{class:[`${o}-slider`,f,{[`${o}-slider--disabled`]:this.mergedDisabled,[`${o}-slider--active`]:this.activeIndex!==-1,[`${o}-slider--with-mark`]:this.marks,[`${o}-slider--vertical`]:this.vertical,[`${o}-slider--reverse`]:this.reverse}],style:this.cssVars,onKeydown:this.handleRailKeyDown,onMousedown:this.handleRailMouseDown,onTouchstart:this.handleRailMouseDown},_("div",{class:`${o}-slider-rail`},_("div",{class:`${o}-slider-rail__fill`,style:this.fillStyle}),this.marks?_("div",{class:[`${o}-slider-dots`,this.dotTransitionDisabled&&`${o}-slider-dots--transition-disabled`]},this.markInfos.map(v=>_("div",{key:v.label,class:[`${o}-slider-dot`,{[`${o}-slider-dot--active`]:v.active}],style:v.style}))):null,_("div",{ref:"handleRailRef",class:`${o}-slider-handles`},this.arrifiedValues.map((v,u)=>{const d=this.isShowTooltip(u);return _(_t,null,{default:()=>[_(St,null,{default:()=>_("div",{ref:this.setHandleRefs(u),class:`${o}-slider-handle-wrapper`,tabindex:this.mergedDisabled?-1:0,style:this.getHandleStyle(v,u),onFocus:()=>this.handleHandleFocus(u),onBlur:()=>this.handleHandleBlur(u),onMouseenter:()=>this.handleHandleMouseEnter(u),onMouseleave:()=>this.handleHandleMouseLeave(u)},Ct(this.$slots.thumb,()=>[_("div",{class:`${o}-slider-handle`})]))}),this.tooltip&&_(zt,{ref:this.setFollowerRefs(u),show:d,to:this.adjustedTo,enabled:this.showTooltip&&!this.range||this.followerEnabledIndexSet.has(u),teleportDisabled:this.adjustedTo===xe.tdkey,placement:this.mergedPlacement,containerClass:this.namespace},{default:()=>_(Ae,{name:"fade-in-scale-up-transition",appear:this.isMounted,css:this.shouldKeepTooltipTransition(u),onEnter:()=>{this.followerEnabledIndexSet.add(u)},onAfterLeave:()=>{this.followerEnabledIndexSet.delete(u)}},{default:()=>{var y;return d?((y=this.indicatorOnRender)===null||y===void 0||y.call(this),_("div",{class:[`${o}-slider-handle-indicator`,this.indicatorThemeClass,`${o}-slider-handle-indicator--${this.mergedPlacement}`],style:this.indicatorCssVars},typeof c=="function"?c(v):v)):null}})})]})})),this.marks?_("div",{class:`${o}-slider-marks`},this.markInfos.map(v=>_("div",{key:v.label,class:`${o}-slider-mark`,style:v.style},v.label))):null))}}),qt=L([L("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),i("spin-container",{position:"relative"},[i("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[Rt()])]),i("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),i("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[I("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),i("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),i("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[I("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),Zt={small:20,medium:18,large:16},Qt=Object.assign(Object.assign({},ue.props),{description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0}}),en=X({name:"Spin",props:Qt,setup(n){const{mergedClsPrefixRef:o,inlineThemeDisabled:f}=Ue(n),c=ue("Spin","-spin",qt,Tt,n,o),v=S(()=>{const{size:d}=n,{common:{cubicBezierEaseInOut:y},self:w}=c.value,{opacitySpinning:b,color:z,textColor:E}=w,U=typeof d=="number"?Vt(d):w[It("size",d)];return{"--n-bezier":y,"--n-opacity-spinning":b,"--n-size":U,"--n-color":z,"--n-text-color":E}}),u=f?we("spin",S(()=>{const{size:d}=n;return typeof d=="number"?String(d):d[0]}),v,n):void 0;return{mergedClsPrefix:o,compitableShow:Mt(n,["spinning","show"]),mergedStrokeWidth:S(()=>{const{strokeWidth:d}=n;if(d!==void 0)return d;const{size:y}=n;return Zt[typeof y=="number"?"medium":y]}),cssVars:f?void 0:v,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var n,o;const{$slots:f,mergedClsPrefix:c,description:v}=this,u=f.icon&&this.rotate,d=(v||f.description)&&_("div",{class:`${c}-spin-description`},v||((n=f.description)===null||n===void 0?void 0:n.call(f))),y=f.icon?_("div",{class:[`${c}-spin-body`,this.themeClass]},_("div",{class:[`${c}-spin`,u&&`${c}-spin--rotate`],style:f.default?"":this.cssVars},f.icon()),d):_("div",{class:[`${c}-spin-body`,this.themeClass]},_(Dt,{clsPrefix:c,style:f.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${c}-spin`}),d);return(o=this.onRender)===null||o===void 0||o.call(this),f.default?_("div",{class:[`${c}-spin-container`,this.themeClass],style:this.cssVars},_("div",{class:[`${c}-spin-content`,this.compitableShow&&`${c}-spin-content--spinning`]},f),_(Ae,{name:"fade-in-transition"},{default:()=>this.compitableShow?y:null})):y}});function tn(){const n=new Date,o=n.getDate(),f=n.getMonth()+1;return`${n.getFullYear()}-${f}-${o}`}const nn={class:"p-4 space-y-5 min-h-[200px]"},sn={class:"space-y-6"},an={class:"flex items-center space-x-4"},on={class:"flex-shrink-0 w-[100px]"},ln={class:"flex-1"},rn={class:"flex items-center space-x-4"},dn={class:"flex-shrink-0 w-[100px]"},cn={class:"w-[200px]"},un={class:"flex items-center space-x-4"},hn={class:"flex-shrink-0 w-[100px]"},vn={class:"flex-1"},fn={class:"flex-shrink-0 w-[100px]"},pn={class:"flex flex-wrap items-center gap-4"},mn={class:"flex items-center space-x-4"},gn={class:"flex-shrink-0 w-[100px]"},bn={class:"flex flex-wrap items-center gap-4"},yn={class:"flex items-center space-x-4"},wn={class:"flex-shrink-0 w-[100px]"},xn={class:"flex flex-wrap items-center gap-4"},kn={class:"flex items-center space-x-4"},$n={class:"flex-shrink-0 w-[100px]"},_n=X({__name:"General",setup(n){const o=Bt(),f=Nt(),{isMobile:c}=Pt(),v=Ee(),u=S(()=>o.theme),d=S(()=>f.userInfo),y=C(d.value.avatar??""),w=C(d.value.name??""),b=C(d.value.description??""),z=S({get(){return o.language},set(g){o.setLanguage(g)}}),E=[{label:"Auto",key:"auto",icon:"ri:contrast-line"},{label:"Light",key:"light",icon:"ri:sun-foggy-line"},{label:"Dark",key:"dark",icon:"ri:moon-foggy-line"}],U=[{label:"English",key:"en-US",value:"en-US"},{label:"Español",key:"es-ES",value:"es-ES"},{label:"한국어",key:"ko-KR",value:"ko-KR"},{label:"Русский язык",key:"ru-RU",value:"ru-RU"},{label:"Tiếng Việt",key:"vi-VN",value:"vi-VN"},{label:"简体中文",key:"zh-CN",value:"zh-CN"},{label:"繁體中文",key:"zh-TW",value:"zh-TW"}];function H(g){f.updateUserInfo(g),v.success(Y("common.success"))}function J(){f.resetUserInfo(),v.success(Y("common.success")),window.location.reload()}function he(){const g=tn(),$=localStorage.getItem("chatStorage")||"{}",m=JSON.stringify(JSON.parse($),null,2),F=new Blob([m],{type:"application/json"}),N=URL.createObjectURL(F),B=document.createElement("a");B.href=N,B.download=`chat-store_${g}.json`,document.body.appendChild(B),B.click(),document.body.removeChild(B)}function q(g){const $=g.target;if(!$||!$.files)return;const m=$.files[0];if(!m)return;const F=new FileReader;F.onload=()=>{try{const N=JSON.parse(F.result);localStorage.setItem("chatStorage",JSON.stringify(N)),v.success(Y("common.success")),location.reload()}catch{v.error(Y("common.invalidFileFormat"))}},F.readAsText(m)}function D(){localStorage.removeItem("chatStorage"),location.reload()}function Q(){const g=document.getElementById("fileInput");g&&g.click()}return(g,$)=>(O(),Z("div",nn,[a("div",sn,[a("div",an,[a("span",on,r(g.$t("setting.avatarLink")),1),a("div",ln,[p(l(ce),{value:y.value,"onUpdate:value":$[0]||($[0]=m=>y.value=m),placeholder:""},null,8,["value"])]),p(l(P),{size:"tiny",text:"",type:"primary",onClick:$[1]||($[1]=m=>H({avatar:y.value}))},{default:k(()=>[M(r(g.$t("common.save")),1)]),_:1})]),a("div",rn,[a("span",dn,r(g.$t("setting.name")),1),a("div",cn,[p(l(ce),{value:w.value,"onUpdate:value":$[2]||($[2]=m=>w.value=m),placeholder:""},null,8,["value"])]),p(l(P),{size:"tiny",text:"",type:"primary",onClick:$[3]||($[3]=m=>H({name:w.value}))},{default:k(()=>[M(r(g.$t("common.save")),1)]),_:1})]),a("div",un,[a("span",hn,r(g.$t("setting.description")),1),a("div",vn,[p(l(ce),{value:b.value,"onUpdate:value":$[4]||($[4]=m=>b.value=m),placeholder:""},null,8,["value"])]),p(l(P),{size:"tiny",text:"",type:"primary",onClick:$[5]||($[5]=m=>H({description:b.value}))},{default:k(()=>[M(r(g.$t("common.save")),1)]),_:1})]),a("div",{class:Ut(["flex items-center space-x-4",l(c)&&"items-start"])},[a("span",fn,r(g.$t("setting.chatHistory")),1),a("div",pn,[p(l(P),{size:"small",onClick:he},{icon:k(()=>[p(l(G),{icon:"ri:download-2-fill"})]),default:k(()=>[M(" "+r(g.$t("common.export")),1)]),_:1}),a("input",{id:"fileInput",type:"file",style:{display:"none"},onChange:q},null,32),p(l(P),{size:"small",onClick:Q},{icon:k(()=>[p(l(G),{icon:"ri:upload-2-fill"})]),default:k(()=>[M(" "+r(g.$t("common.import")),1)]),_:1}),p(l(At),{placement:"bottom",onPositiveClick:D},{trigger:k(()=>[p(l(P),{size:"small"},{icon:k(()=>[p(l(G),{icon:"ri:close-circle-line"})]),default:k(()=>[M(" "+r(g.$t("common.clear")),1)]),_:1})]),default:k(()=>[M(" "+r(g.$t("chat.clearHistoryConfirm")),1)]),_:1})])],2),a("div",mn,[a("span",gn,r(g.$t("setting.theme")),1),a("div",bn,[(O(),Z(Et,null,Ht(E,m=>p(l(P),{key:m.key,size:"small",type:m.key===l(u)?"primary":void 0,onClick:F=>l(o).setTheme(m.key)},{icon:k(()=>[p(l(G),{icon:m.icon},null,8,["icon"])]),_:2},1032,["type","onClick"])),64))])]),a("div",yn,[a("span",wn,r(g.$t("setting.language")),1),a("div",xn,[p(l(Ft),{style:{width:"140px"},value:l(z),options:U,onUpdateValue:$[6]||($[6]=m=>l(o).setLanguage(m))},null,8,["value"])])]),a("div",kn,[a("span",$n,r(g.$t("setting.resetUserInfo")),1),p(l(P),{size:"small",onClick:J},{default:k(()=>[M(r(g.$t("common.reset")),1)]),_:1})])])]))}}),Sn={class:"p-4 space-y-5 min-h-[200px]"},Cn={class:"space-y-6"},zn={class:"flex items-center space-x-4"},Rn={class:"flex-shrink-0 w-[120px]"},Tn={class:"flex-1"},Vn={class:"flex items-center space-x-4"},In={class:"flex-shrink-0 w-[120px]"},Mn={class:"flex-1"},Dn={class:"flex items-center space-x-4"},Bn={class:"flex-shrink-0 w-[120px]"},Nn={class:"flex-1"},Pn={class:"flex items-center space-x-4"},Un=a("span",{class:"flex-shrink-0 w-[120px]"}," ",-1),An=X({__name:"Advanced",setup(n){const o=jt(),f=Ee(),c=C(o.systemMessage??""),v=C(o.temperature??.5),u=C(o.top_p??1);function d(w){o.updateSetting(w),f.success(Y("common.success"))}function y(){o.resetSetting(),f.success(Y("common.success")),window.location.reload()}return(w,b)=>(O(),Z("div",Sn,[a("div",Cn,[a("div",zn,[a("span",Rn,r(w.$t("setting.role")),1),a("div",Tn,[p(l(ce),{value:c.value,"onUpdate:value":b[0]||(b[0]=z=>c.value=z),type:"textarea",autosize:{minRows:1,maxRows:4}},null,8,["value"])]),p(l(P),{size:"tiny",text:"",type:"primary",onClick:b[1]||(b[1]=z=>d({systemMessage:c.value}))},{default:k(()=>[M(r(w.$t("common.save")),1)]),_:1})]),a("div",Vn,[a("span",In,r(w.$t("setting.temperature")),1),a("div",Mn,[p(l(Pe),{value:v.value,"onUpdate:value":b[2]||(b[2]=z=>v.value=z),max:2,min:0,step:.1},null,8,["value","step"])]),a("span",null,r(v.value),1),p(l(P),{size:"tiny",text:"",type:"primary",onClick:b[3]||(b[3]=z=>d({temperature:v.value}))},{default:k(()=>[M(r(w.$t("common.save")),1)]),_:1})]),a("div",Dn,[a("span",Bn,r(w.$t("setting.top_p")),1),a("div",Nn,[p(l(Pe),{value:u.value,"onUpdate:value":b[4]||(b[4]=z=>u.value=z),max:1,min:0,step:.1},null,8,["value","step"])]),a("span",null,r(u.value),1),p(l(P),{size:"tiny",text:"",type:"primary",onClick:b[5]||(b[5]=z=>d({top_p:u.value}))},{default:k(()=>[M(r(w.$t("common.save")),1)]),_:1})]),a("div",Pn,[Un,p(l(P),{size:"small",onClick:y},{default:k(()=>[M(r(w.$t("common.reset")),1)]),_:1})])])]))}}),En="chatgpt-web",Hn="2.11.1",Fn="ChatGPT Web",jn="ChenZhaoYu <chenzhaoyu1994@gmail.com>",On=["chatgpt-web","chatgpt","chatbot","vue"],Ln={dev:"vite",build:"run-p type-check build-only",preview:"vite preview","build-only":"vite build","type-check":"vue-tsc --noEmit",lint:"eslint .","lint:fix":"eslint . --fix",bootstrap:"pnpm install && pnpm run common:prepare","common:cleanup":"rimraf node_modules && rimraf pnpm-lock.yaml","common:prepare":"husky install"},Gn={"@vscode/markdown-it-katex":"^1.0.3","@vueuse/core":"^9.13.0","highlight.js":"^11.7.0","html-to-image":"^1.11.11",katex:"^0.16.4","markdown-it":"^13.0.1","mermaid-it-markdown":"^1.0.8","naive-ui":"^2.34.3",pinia:"^2.0.33",vue:"^3.2.47","vue-i18n":"^9.2.2","vue-router":"^4.1.6"},Kn={"@antfu/eslint-config":"^0.35.3","@commitlint/cli":"^17.4.4","@commitlint/config-conventional":"^17.4.4","@iconify/vue":"^4.1.0","@types/crypto-js":"^4.1.1","@types/katex":"^0.16.0","@types/markdown-it":"^12.2.3","@types/markdown-it-link-attributes":"^3.0.1","@types/node":"^18.14.6","@vitejs/plugin-vue":"^4.0.0",autoprefixer:"^10.4.13",axios:"^1.3.4","crypto-js":"^4.1.1",eslint:"^8.35.0",husky:"^8.0.3",less:"^4.1.3","lint-staged":"^13.1.2","markdown-it-link-attributes":"^4.0.1","npm-run-all":"^4.1.5",postcss:"^8.4.21",rimraf:"^4.3.0",tailwindcss:"^3.2.7",typescript:"~4.9.5",vite:"^4.2.0","vite-plugin-pwa":"^0.14.4","vue-tsc":"^1.2.0"},Wn={name:En,version:Hn,private:!1,description:Fn,author:jn,keywords:On,scripts:Ln,dependencies:Gn,devDependencies:Kn,"lint-staged":{"*.{ts,tsx,vue}":["pnpm lint:fix"]}},Yn={class:"p-4 space-y-4"},Xn={class:"text-xl font-bold"},Jn={class:"p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700"},qn=a("a",{class:"text-blue-600 dark:text-blue-500",href:"https://github.com/Chanzhaoyu/chatgpt-web",target:"_blank"}," GitHub ",-1),Zn={key:0},Qn={key:1},es=X({__name:"About",setup(n){const o=He(),f=C(!1),c=C(),v=S(()=>!!o.isChatGPTAPI);async function u(){try{f.value=!0;const{data:d}=await Lt();c.value=d}finally{f.value=!1}}return Ot(()=>{u()}),(d,y)=>(O(),ke(l(en),{show:f.value},{default:k(()=>{var w,b,z,E,U,H;return[a("div",Yn,[a("h2",Xn," Version - "+r(l(Wn).version),1),a("div",Jn,[a("p",null,[M(r(d.$t("setting.openSource"))+" ",1),qn,M(" "+r(d.$t("setting.freeMIT")),1)]),a("p",null,r(d.$t("setting.stars")),1)]),a("p",null,r(d.$t("setting.api"))+"："+r(((w=c.value)==null?void 0:w.apiModel)??"-"),1),l(v)?(O(),Z("p",Zn,r(d.$t("setting.monthlyUsage"))+"："+r(((b=c.value)==null?void 0:b.usage)??"-"),1)):$e("",!0),l(v)?$e("",!0):(O(),Z("p",Qn,r(d.$t("setting.reverseProxy"))+"："+r(((z=c.value)==null?void 0:z.reverseProxy)??"-"),1)),a("p",null,r(d.$t("setting.timeout"))+"："+r(((E=c.value)==null?void 0:E.timeoutMs)??"-"),1),a("p",null,r(d.$t("setting.socks"))+"："+r(((U=c.value)==null?void 0:U.socksProxy)??"-"),1),a("p",null,r(d.$t("setting.httpsProxy"))+"："+r(((H=c.value)==null?void 0:H.httpsProxy)??"-"),1)])]}),_:1},8,["show"]))}}),ts={class:"ml-2"},ns={class:"min-h-[100px]"},ss={class:"ml-2"},as={class:"min-h-[100px]"},os={class:"ml-2"},ls=X({__name:"index",props:{visible:{type:Boolean}},emits:["update:visible"],setup(n,{emit:o}){const f=n,c=He(),v=S(()=>!!c.isChatGPTAPI),u=C("General"),d=S({get(){return f.visible},set(y){o("update:visible",y)}});return(y,w)=>(O(),ke(l(Wt),{show:l(d),"onUpdate:show":w[1]||(w[1]=b=>Kt(d)?d.value=b:null),"auto-focus":!1,preset:"card",style:{width:"95%","max-width":"640px"}},{default:k(()=>[a("div",null,[p(l(Gt),{value:u.value,"onUpdate:value":w[0]||(w[0]=b=>u.value=b),type:"line",animated:""},{default:k(()=>[p(l(ye),{name:"General",tab:"General"},{tab:k(()=>[p(l(G),{class:"text-lg",icon:"ri:file-user-line"}),a("span",ts,r(y.$t("setting.general")),1)]),default:k(()=>[a("div",ns,[p(_n)])]),_:1}),l(v)?(O(),ke(l(ye),{key:0,name:"Advanced",tab:"Advanced"},{tab:k(()=>[p(l(G),{class:"text-lg",icon:"ri:equalizer-line"}),a("span",ss,r(y.$t("setting.advanced")),1)]),default:k(()=>[a("div",as,[p(An)])]),_:1})):$e("",!0),p(l(ye),{name:"Config",tab:"Config"},{tab:k(()=>[p(l(G),{class:"text-lg",icon:"ri:list-settings-line"}),a("span",os,r(y.$t("setting.config")),1)]),default:k(()=>[p(es)]),_:1})]),_:1},8,["value"])])]),_:1},8,["show"]))}});export{ls as default};
