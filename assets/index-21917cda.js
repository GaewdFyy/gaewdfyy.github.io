import{c as G,a as i,ag as I,ah as le,f as Ve,ai as mt,aj as pt,ak as gt,d as J,u as Ue,g as he,al as bt,b as yt,h as z,r as S,e as wt,am as Me,a1 as ye,an as xt,j as xe,k as kt,l as ke,m as C,V as $t,n as _t,ao as Ct,p as zt,T as Ae,t as St,z as re,ap as de,aq as ce,ar as Rt,as as Tt,at as Dt,au as It,av as Vt,aw as Mt,ax as Bt,a3 as Nt,A as Pt,O as Ut,X as Fe,B as O,C as Z,J as s,W as l,Y as p,D as u,N as ue,$ as x,ab as V,ac as P,U as At,_ as W,ay as Ft,I as jt,a9 as Et,az as Ht,P as X,aA as Ot,aB as je,Q as Lt,F as $e,Z as _e,aC as Gt,aD as Wt,aE as we,aF as Kt}from"./index-e5465b33.js";const Yt=G([i("slider",`
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
 box-sizing: content-box;
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
 `),G("&:hover",[i("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[le("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),i("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),I("active",[i("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[le("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),i("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),i("slider-marks",`
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
 `,[G("&:hover",`
 box-shadow: var(--n-handle-box-shadow-hover);
 `)]),G("&:focus",[i("slider-handle",`
 box-shadow: var(--n-handle-box-shadow-focus);
 `,[G("&:hover",`
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
 `,[Ve()]),i("slider-handle-indicator",`
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
 `),Ve()]),mt(i("slider",[i("slider-dot","background-color: var(--n-dot-color-modal);")])),pt(i("slider",[i("slider-dot","background-color: var(--n-dot-color-popover);")]))]);function Be(n){return window.TouchEvent&&n instanceof window.TouchEvent}function Ne(){const n=new Map,o=m=>r=>{n.set(m,r)};return gt(()=>{n.clear()}),[n,o]}const Xt=0,Jt=Object.assign(Object.assign({},he.props),{to:ke.propTo,defaultValue:{type:[Number,Array],default:0},marks:Object,disabled:{type:Boolean,default:void 0},formatTooltip:Function,keyboard:{type:Boolean,default:!0},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:[Number,String],default:1},range:Boolean,value:[Number,Array],placement:String,showTooltip:{type:Boolean,default:void 0},tooltip:{type:Boolean,default:!0},vertical:Boolean,reverse:Boolean,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onDragstart:[Function],onDragend:[Function]}),Pe=J({name:"Slider",props:Jt,slots:Object,setup(n){const{mergedClsPrefixRef:o,namespaceRef:m,inlineThemeDisabled:r}=Ue(n),d=he("Slider","-slider",Yt,bt,n,o),f=S(null),[b,$]=Ne(),[c,h]=Ne(),k=S(new Set),j=yt(n),{mergedDisabledRef:U}=j,A=z(()=>{const{step:e}=n;if(Number(e)<=0||e==="mark")return 0;const t=e.toString();let a=0;return t.includes(".")&&(a=t.length-t.indexOf(".")-1),a}),L=S(n.defaultValue),ve=St(n,"value"),q=wt(ve,L),M=z(()=>{const{value:e}=q;return(n.range?e:[e]).map(Re)}),Q=z(()=>M.value.length>2),y=z(()=>n.placement===void 0?n.vertical?"right":"top":n.placement),_=z(()=>{const{marks:e}=n;return e?Object.keys(e).map(Number.parseFloat):null}),g=S(-1),E=S(-1),N=S(-1),B=S(!1),ee=S(!1),fe=z(()=>{const{vertical:e,reverse:t}=n;return e?t?"top":"bottom":t?"right":"left"}),Ee=z(()=>{if(Q.value)return;const e=M.value,t=te(n.range?Math.min(...e):n.min),a=te(n.range?Math.max(...e):e[0]),{value:v}=fe;return n.vertical?{[v]:`${t}%`,height:`${a-t}%`}:{[v]:`${t}%`,width:`${a-t}%`}}),He=z(()=>{const e=[],{marks:t}=n;if(t){const a=M.value.slice();a.sort((D,T)=>D-T);const{value:v}=fe,{value:w}=Q,{range:R}=n,F=w?()=>!1:D=>R?D>=a[0]&&D<=a[a.length-1]:D<=a[0];for(const D of Object.keys(t)){const T=Number(D);e.push({active:F(T),key:T,label:t[D],style:{[v]:`${te(T)}%`}})}}return e});function Oe(e,t){const a=te(e),{value:v}=fe;return{[v]:`${a}%`,zIndex:t===g.value?1:0}}function Ce(e){return n.showTooltip||N.value===e||g.value===e&&B.value}function Le(e){return B.value?!(g.value===e&&E.value===e):!0}function Ge(e){var t;~e&&(g.value=e,(t=b.get(e))===null||t===void 0||t.focus())}function We(){c.forEach((e,t)=>{Ce(t)&&e.syncPosition()})}function ze(e){const{"onUpdate:value":t,onUpdateValue:a}=n,{nTriggerFormInput:v,nTriggerFormChange:w}=j;a&&re(a,e),t&&re(t,e),L.value=e,v(),w()}function Se(e){const{range:t}=n;if(t){if(Array.isArray(e)){const{value:a}=M;e.join()!==a.join()&&ze(e)}}else Array.isArray(e)||M.value[0]!==e&&ze(e)}function me(e,t){if(n.range){const a=M.value.slice();a.splice(t,1,e),Se(a)}else Se(e)}function pe(e,t,a){const v=a!==void 0;a||(a=e-t>0?1:-1);const w=_.value||[],{step:R}=n;if(R==="mark"){const T=ne(e,w.concat(t),v?a:void 0);return T?T.value:t}if(R<=0)return t;const{value:F}=A;let D;if(v){const T=Number((t/R).toFixed(F)),H=Math.floor(T),ge=T>H?H:H-1,be=T<H?H:H+1;D=ne(t,[Number((ge*R).toFixed(F)),Number((be*R).toFixed(F)),...w],a)}else{const T=Ye(e);D=ne(e,[...w,T])}return D?Re(D.value):t}function Re(e){return Math.min(n.max,Math.max(n.min,e))}function te(e){const{max:t,min:a}=n;return(e-a)/(t-a)*100}function Ke(e){const{max:t,min:a}=n;return a+(t-a)*e}function Ye(e){const{step:t,min:a}=n;if(Number(t)<=0||t==="mark")return e;const v=Math.round((e-a)/t)*t+a;return Number(v.toFixed(A.value))}function ne(e,t=_.value,a){if(!(t!=null&&t.length))return null;let v=null,w=-1;for(;++w<t.length;){const R=t[w]-e,F=Math.abs(R);(a===void 0||R*a>0)&&(v===null||F<v.distance)&&(v={index:w,distance:F,value:t[w]})}return v}function Te(e){const t=f.value;if(!t)return;const a=Be(e)?e.touches[0]:e,v=t.getBoundingClientRect();let w;return n.vertical?w=(v.bottom-a.clientY)/v.height:w=(a.clientX-v.left)/v.width,n.reverse&&(w=1-w),Ke(w)}function Xe(e){if(U.value||!n.keyboard)return;const{vertical:t,reverse:a}=n;switch(e.key){case"ArrowUp":e.preventDefault(),ae(t&&a?-1:1);break;case"ArrowRight":e.preventDefault(),ae(!t&&a?-1:1);break;case"ArrowDown":e.preventDefault(),ae(t&&a?1:-1);break;case"ArrowLeft":e.preventDefault(),ae(!t&&a?1:-1);break}}function ae(e){const t=g.value;if(t===-1)return;const{step:a}=n,v=M.value[t],w=Number(a)<=0||a==="mark"?v:v+a*e;me(pe(w,v,e>0?1:-1),t)}function Je(e){var t,a;if(U.value||!Be(e)&&e.button!==Xt)return;const v=Te(e);if(v===void 0)return;const w=M.value.slice(),R=n.range?(a=(t=ne(v,w))===null||t===void 0?void 0:t.index)!==null&&a!==void 0?a:-1:0;R!==-1&&(e.preventDefault(),Ge(R),qe(),me(pe(v,M.value[R]),R))}function qe(){B.value||(B.value=!0,n.onDragstart&&re(n.onDragstart),de("touchend",document,ie),de("mouseup",document,ie),de("touchmove",document,oe),de("mousemove",document,oe))}function se(){B.value&&(B.value=!1,n.onDragend&&re(n.onDragend),ce("touchend",document,ie),ce("mouseup",document,ie),ce("touchmove",document,oe),ce("mousemove",document,oe))}function oe(e){const{value:t}=g;if(!B.value||t===-1){se();return}const a=Te(e);a!==void 0&&me(pe(a,M.value[t]),t)}function ie(){se()}function Ze(e){g.value=e,U.value||(N.value=e)}function Qe(e){g.value===e&&(g.value=-1,se()),N.value===e&&(N.value=-1)}function et(e){N.value=e}function tt(e){N.value===e&&(N.value=-1)}Me(g,(e,t)=>void ye(()=>E.value=t)),Me(q,()=>{if(n.marks){if(ee.value)return;ee.value=!0,ye(()=>{ee.value=!1})}ye(We)}),xt(()=>{se()});const De=z(()=>{const{self:{markFontSize:e,railColor:t,railColorHover:a,fillColor:v,fillColorHover:w,handleColor:R,opacityDisabled:F,dotColor:D,dotColorModal:T,handleBoxShadow:H,handleBoxShadowHover:ge,handleBoxShadowActive:be,handleBoxShadowFocus:nt,dotBorder:at,dotBoxShadow:st,railHeight:ot,railWidthVertical:it,handleSize:lt,dotHeight:rt,dotWidth:dt,dotBorderRadius:ct,fontSize:ut,dotBorderActive:ht,dotColorPopover:vt},common:{cubicBezierEaseInOut:ft}}=d.value;return{"--n-bezier":ft,"--n-dot-border":at,"--n-dot-border-active":ht,"--n-dot-border-radius":ct,"--n-dot-box-shadow":st,"--n-dot-color":D,"--n-dot-color-modal":T,"--n-dot-color-popover":vt,"--n-dot-height":rt,"--n-dot-width":dt,"--n-fill-color":v,"--n-fill-color-hover":w,"--n-font-size":ut,"--n-handle-box-shadow":H,"--n-handle-box-shadow-active":be,"--n-handle-box-shadow-focus":nt,"--n-handle-box-shadow-hover":ge,"--n-handle-color":R,"--n-handle-size":lt,"--n-opacity-disabled":F,"--n-rail-color":t,"--n-rail-color-hover":a,"--n-rail-height":ot,"--n-rail-width-vertical":it,"--n-mark-font-size":e}}),K=r?xe("slider",void 0,De,n):void 0,Ie=z(()=>{const{self:{fontSize:e,indicatorColor:t,indicatorBoxShadow:a,indicatorTextColor:v,indicatorBorderRadius:w}}=d.value;return{"--n-font-size":e,"--n-indicator-border-radius":w,"--n-indicator-box-shadow":a,"--n-indicator-color":t,"--n-indicator-text-color":v}}),Y=r?xe("slider-indicator",void 0,Ie,n):void 0;return{mergedClsPrefix:o,namespace:m,uncontrolledValue:L,mergedValue:q,mergedDisabled:U,mergedPlacement:y,isMounted:kt(),adjustedTo:ke(n),dotTransitionDisabled:ee,markInfos:He,isShowTooltip:Ce,shouldKeepTooltipTransition:Le,handleRailRef:f,setHandleRefs:$,setFollowerRefs:h,fillStyle:Ee,getHandleStyle:Oe,activeIndex:g,arrifiedValues:M,followerEnabledIndexSet:k,handleRailMouseDown:Je,handleHandleFocus:Ze,handleHandleBlur:Qe,handleHandleMouseEnter:et,handleHandleMouseLeave:tt,handleRailKeyDown:Xe,indicatorCssVars:r?void 0:Ie,indicatorThemeClass:Y==null?void 0:Y.themeClass,indicatorOnRender:Y==null?void 0:Y.onRender,cssVars:r?void 0:De,themeClass:K==null?void 0:K.themeClass,onRender:K==null?void 0:K.onRender}},render(){var n;const{mergedClsPrefix:o,themeClass:m,formatTooltip:r}=this;return(n=this.onRender)===null||n===void 0||n.call(this),C("div",{class:[`${o}-slider`,m,{[`${o}-slider--disabled`]:this.mergedDisabled,[`${o}-slider--active`]:this.activeIndex!==-1,[`${o}-slider--with-mark`]:this.marks,[`${o}-slider--vertical`]:this.vertical,[`${o}-slider--reverse`]:this.reverse}],style:this.cssVars,onKeydown:this.handleRailKeyDown,onMousedown:this.handleRailMouseDown,onTouchstart:this.handleRailMouseDown},C("div",{class:`${o}-slider-rail`},C("div",{class:`${o}-slider-rail__fill`,style:this.fillStyle}),this.marks?C("div",{class:[`${o}-slider-dots`,this.dotTransitionDisabled&&`${o}-slider-dots--transition-disabled`]},this.markInfos.map(d=>C("div",{key:d.key,class:[`${o}-slider-dot`,{[`${o}-slider-dot--active`]:d.active}],style:d.style}))):null,C("div",{ref:"handleRailRef",class:`${o}-slider-handles`},this.arrifiedValues.map((d,f)=>{const b=this.isShowTooltip(f);return C($t,null,{default:()=>[C(_t,null,{default:()=>C("div",{ref:this.setHandleRefs(f),class:`${o}-slider-handle-wrapper`,tabindex:this.mergedDisabled?-1:0,role:"slider","aria-valuenow":d,"aria-valuemin":this.min,"aria-valuemax":this.max,"aria-orientation":this.vertical?"vertical":"horizontal","aria-disabled":this.disabled,style:this.getHandleStyle(d,f),onFocus:()=>{this.handleHandleFocus(f)},onBlur:()=>{this.handleHandleBlur(f)},onMouseenter:()=>{this.handleHandleMouseEnter(f)},onMouseleave:()=>{this.handleHandleMouseLeave(f)}},Ct(this.$slots.thumb,()=>[C("div",{class:`${o}-slider-handle`})]))}),this.tooltip&&C(zt,{ref:this.setFollowerRefs(f),show:b,to:this.adjustedTo,enabled:this.showTooltip&&!this.range||this.followerEnabledIndexSet.has(f),teleportDisabled:this.adjustedTo===ke.tdkey,placement:this.mergedPlacement,containerClass:this.namespace},{default:()=>C(Ae,{name:"fade-in-scale-up-transition",appear:this.isMounted,css:this.shouldKeepTooltipTransition(f),onEnter:()=>{this.followerEnabledIndexSet.add(f)},onAfterLeave:()=>{this.followerEnabledIndexSet.delete(f)}},{default:()=>{var $;return b?(($=this.indicatorOnRender)===null||$===void 0||$.call(this),C("div",{class:[`${o}-slider-handle-indicator`,this.indicatorThemeClass,`${o}-slider-handle-indicator--${this.mergedPlacement}`],style:this.indicatorCssVars},typeof r=="function"?r(d):d)):null}})})]})})),this.marks?C("div",{class:`${o}-slider-marks`},this.markInfos.map(d=>C("div",{key:d.key,class:`${o}-slider-mark`,style:d.style},typeof d.label=="function"?d.label():d.label))):null))}}),qt=G([G("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),i("spin-container",`
 position: relative;
 `,[i("spin-body",`
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
 `)])]),Zt={small:20,medium:18,large:16},Qt=Object.assign(Object.assign({},he.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),en=J({name:"Spin",props:Qt,slots:Object,setup(n){const{mergedClsPrefixRef:o,inlineThemeDisabled:m}=Ue(n),r=he("Spin","-spin",qt,Tt,n,o),d=z(()=>{const{size:c}=n,{common:{cubicBezierEaseInOut:h},self:k}=r.value,{opacitySpinning:j,color:U,textColor:A}=k,L=typeof c=="number"?Dt(c):k[It("size",c)];return{"--n-bezier":h,"--n-opacity-spinning":j,"--n-size":L,"--n-color":U,"--n-text-color":A}}),f=m?xe("spin",z(()=>{const{size:c}=n;return typeof c=="number"?String(c):c[0]}),d,n):void 0,b=Vt(n,["spinning","show"]),$=S(!1);return Mt(c=>{let h;if(b.value){const{delay:k}=n;if(k){h=window.setTimeout(()=>{$.value=!0},k),c(()=>{clearTimeout(h)});return}}$.value=b.value}),{mergedClsPrefix:o,active:$,mergedStrokeWidth:z(()=>{const{strokeWidth:c}=n;if(c!==void 0)return c;const{size:h}=n;return Zt[typeof h=="number"?"medium":h]}),cssVars:m?void 0:d,themeClass:f==null?void 0:f.themeClass,onRender:f==null?void 0:f.onRender}},render(){var n,o;const{$slots:m,mergedClsPrefix:r,description:d}=this,f=m.icon&&this.rotate,b=(d||m.description)&&C("div",{class:`${r}-spin-description`},d||((n=m.description)===null||n===void 0?void 0:n.call(m))),$=m.icon?C("div",{class:[`${r}-spin-body`,this.themeClass]},C("div",{class:[`${r}-spin`,f&&`${r}-spin--rotate`],style:m.default?"":this.cssVars},m.icon()),b):C("div",{class:[`${r}-spin-body`,this.themeClass]},C(Bt,{clsPrefix:r,style:m.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${r}-spin`}),b);return(o=this.onRender)===null||o===void 0||o.call(this),m.default?C("div",{class:[`${r}-spin-container`,this.themeClass],style:this.cssVars},C("div",{class:[`${r}-spin-content`,this.active&&`${r}-spin-content--spinning`,this.contentClass],style:this.contentStyle},m),C(Ae,{name:"fade-in-transition"},{default:()=>this.active?$:null})):$}});function tn(){const n=new Date,o=n.getDate(),m=n.getMonth()+1;return`${n.getFullYear()}-${m}-${o}`}const nn={class:"p-4 space-y-5 min-h-[200px]"},an={class:"space-y-6"},sn={class:"flex items-center space-x-4"},on={class:"flex-shrink-0 w-[100px]"},ln={class:"flex-1"},rn={class:"flex items-center space-x-4"},dn={class:"flex-shrink-0 w-[100px]"},cn={class:"w-[200px]"},un={class:"flex items-center space-x-4"},hn={class:"flex-shrink-0 w-[100px]"},vn={class:"flex-1"},fn={class:"flex-shrink-0 w-[100px]"},mn={class:"flex flex-wrap items-center gap-4"},pn={class:"flex items-center space-x-4"},gn={class:"flex-shrink-0 w-[100px]"},bn={class:"flex flex-wrap items-center gap-4"},yn={class:"flex items-center space-x-4"},wn={class:"flex-shrink-0 w-[100px]"},xn={class:"flex flex-wrap items-center gap-4"},kn={class:"flex items-center space-x-4"},$n={class:"flex-shrink-0 w-[100px]"},_n=J({__name:"General",setup(n){const o=Nt(),m=Pt(),{isMobile:r}=Ut(),d=Fe(),f=z(()=>o.theme),b=z(()=>m.userInfo),$=S(b.value.avatar??""),c=S(b.value.name??""),h=S(b.value.description??""),k=z({get(){return o.language},set(y){o.setLanguage(y)}}),j=[{label:"Auto",key:"auto",icon:"ri:contrast-line"},{label:"Light",key:"light",icon:"ri:sun-foggy-line"},{label:"Dark",key:"dark",icon:"ri:moon-foggy-line"}],U=[{label:"简体中文",key:"zh-CN",value:"zh-CN"},{label:"繁體中文",key:"zh-TW",value:"zh-TW"},{label:"English",key:"en-US",value:"en-US"},{label:"한국어",key:"ko-KR",value:"ko-KR"},{label:"Русский язык",key:"ru-RU",value:"ru-RU"}];function A(y){m.updateUserInfo(y),d.success(X("common.success"))}function L(){m.resetUserInfo(),d.success(X("common.success")),window.location.reload()}function ve(){const y=tn(),_=localStorage.getItem("chatStorage")||"{}",g=JSON.stringify(JSON.parse(_),null,2),E=new Blob([g],{type:"application/json"}),N=URL.createObjectURL(E),B=document.createElement("a");B.href=N,B.download=`chat-store_${y}.json`,document.body.appendChild(B),B.click(),document.body.removeChild(B)}function q(y){const _=y.target;if(!_||!_.files)return;const g=_.files[0];if(!g)return;const E=new FileReader;E.onload=()=>{try{const N=JSON.parse(E.result);localStorage.setItem("chatStorage",JSON.stringify(N)),d.success(X("common.success")),location.reload()}catch{d.error(X("common.invalidFileFormat"))}},E.readAsText(g)}function M(){localStorage.removeItem("chatStorage"),location.reload()}function Q(){const y=document.getElementById("fileInput");y&&y.click()}return(y,_)=>(O(),Z("div",nn,[s("div",an,[s("div",sn,[s("span",on,l(y.$t("setting.avatarLink")),1),s("div",ln,[p(u(ue),{value:$.value,"onUpdate:value":_[0]||(_[0]=g=>$.value=g),placeholder:""},null,8,["value"])]),p(u(P),{size:"tiny",text:"",type:"primary",onClick:_[1]||(_[1]=g=>A({avatar:$.value}))},{default:x(()=>[V(l(y.$t("common.save")),1)]),_:1})]),s("div",rn,[s("span",dn,l(y.$t("setting.name")),1),s("div",cn,[p(u(ue),{value:c.value,"onUpdate:value":_[2]||(_[2]=g=>c.value=g),placeholder:""},null,8,["value"])]),p(u(P),{size:"tiny",text:"",type:"primary",onClick:_[3]||(_[3]=g=>A({name:c.value}))},{default:x(()=>[V(l(y.$t("common.save")),1)]),_:1})]),s("div",un,[s("span",hn,l(y.$t("setting.description")),1),s("div",vn,[p(u(ue),{value:h.value,"onUpdate:value":_[4]||(_[4]=g=>h.value=g),placeholder:""},null,8,["value"])]),p(u(P),{size:"tiny",text:"",type:"primary",onClick:_[5]||(_[5]=g=>A({description:h.value}))},{default:x(()=>[V(l(y.$t("common.save")),1)]),_:1})]),s("div",{class:At(["flex items-center space-x-4",u(r)&&"items-start"])},[s("span",fn,l(y.$t("setting.chatHistory")),1),s("div",mn,[p(u(P),{size:"small",onClick:ve},{icon:x(()=>[p(u(W),{icon:"ri:download-2-fill"})]),default:x(()=>[V(" "+l(y.$t("common.export")),1)]),_:1}),s("input",{id:"fileInput",type:"file",style:{display:"none"},onChange:q},null,32),p(u(P),{size:"small",onClick:Q},{icon:x(()=>[p(u(W),{icon:"ri:upload-2-fill"})]),default:x(()=>[V(" "+l(y.$t("common.import")),1)]),_:1}),p(u(Ft),{placement:"bottom",onPositiveClick:M},{trigger:x(()=>[p(u(P),{size:"small"},{icon:x(()=>[p(u(W),{icon:"ri:close-circle-line"})]),default:x(()=>[V(" "+l(y.$t("common.clear")),1)]),_:1})]),default:x(()=>[V(" "+l(y.$t("chat.clearHistoryConfirm")),1)]),_:1})])],2),s("div",pn,[s("span",gn,l(y.$t("setting.theme")),1),s("div",bn,[(O(),Z(jt,null,Et(j,g=>p(u(P),{key:g.key,size:"small",type:g.key===f.value?"primary":void 0,onClick:E=>u(o).setTheme(g.key)},{icon:x(()=>[p(u(W),{icon:g.icon},null,8,["icon"])]),_:2},1032,["type","onClick"])),64))])]),s("div",yn,[s("span",wn,l(y.$t("setting.language")),1),s("div",xn,[p(u(Ht),{style:{width:"140px"},value:k.value,options:U,onUpdateValue:_[6]||(_[6]=g=>u(o).setLanguage(g))},null,8,["value"])])]),s("div",kn,[s("span",$n,l(y.$t("setting.resetUserInfo")),1),p(u(P),{size:"small",onClick:L},{default:x(()=>[V(l(y.$t("common.reset")),1)]),_:1})])])]))}}),Cn={class:"p-4 space-y-5 min-h-[200px]"},zn={class:"space-y-6"},Sn={class:"flex items-center space-x-4"},Rn={class:"flex-shrink-0 w-[120px]"},Tn={class:"flex-1"},Dn={class:"flex items-center space-x-4"},In={class:"flex-shrink-0 w-[120px]"},Vn={class:"flex-1"},Mn={class:"flex items-center space-x-4"},Bn={class:"flex-shrink-0 w-[120px]"},Nn={class:"flex-1"},Pn={class:"flex items-center space-x-4"},Un=J({__name:"Advanced",setup(n){const o=Ot(),m=Fe(),r=S(o.systemMessage??""),d=S(o.temperature??.5),f=S(o.top_p??1);function b(c){o.updateSetting(c),m.success(X("common.success"))}function $(){o.resetSetting(),m.success(X("common.success")),window.location.reload()}return(c,h)=>(O(),Z("div",Cn,[s("div",zn,[s("div",Sn,[s("span",Rn,l(c.$t("setting.role")),1),s("div",Tn,[p(u(ue),{value:r.value,"onUpdate:value":h[0]||(h[0]=k=>r.value=k),type:"textarea",autosize:{minRows:1,maxRows:4}},null,8,["value"])]),p(u(P),{size:"tiny",text:"",type:"primary",onClick:h[1]||(h[1]=k=>b({systemMessage:r.value}))},{default:x(()=>[V(l(c.$t("common.save")),1)]),_:1})]),s("div",Dn,[s("span",In,l(c.$t("setting.temperature")),1),s("div",Vn,[p(u(Pe),{value:d.value,"onUpdate:value":h[2]||(h[2]=k=>d.value=k),max:2,min:0,step:.1},null,8,["value"])]),s("span",null,l(d.value),1),p(u(P),{size:"tiny",text:"",type:"primary",onClick:h[3]||(h[3]=k=>b({temperature:d.value}))},{default:x(()=>[V(l(c.$t("common.save")),1)]),_:1})]),s("div",Mn,[s("span",Bn,l(c.$t("setting.top_p")),1),s("div",Nn,[p(u(Pe),{value:f.value,"onUpdate:value":h[4]||(h[4]=k=>f.value=k),max:1,min:0,step:.1},null,8,["value"])]),s("span",null,l(f.value),1),p(u(P),{size:"tiny",text:"",type:"primary",onClick:h[5]||(h[5]=k=>b({top_p:f.value}))},{default:x(()=>[V(l(c.$t("common.save")),1)]),_:1})]),s("div",Pn,[h[6]||(h[6]=s("span",{class:"flex-shrink-0 w-[120px]"}," ",-1)),p(u(P),{size:"small",onClick:$},{default:x(()=>[V(l(c.$t("common.reset")),1)]),_:1})])])]))}}),An="chatgpt-web",Fn="2.11.1",jn="ChatGPT Web",En="ChenZhaoYu <chenzhaoyu1994@gmail.com>",Hn=["chatgpt-web","chatgpt","chatbot","vue"],On={dev:"vite",build:"vite build",preview:"vite preview","build-only":"vite build","type-check":"vue-tsc --noEmit",lint:"eslint .","lint:fix":"eslint . --fix",bootstrap:"pnpm install && pnpm run common:prepare","common:cleanup":"rimraf node_modules && rimraf pnpm-lock.yaml","common:prepare":"husky install"},Ln={"@traptitech/markdown-it-katex":"^3.6.0","@vueuse/core":"^9.13.0","highlight.js":"^11.7.0",html2canvas:"^1.4.1",katex:"^0.16.4","lottie-web":"^5.13.0","markdown-it":"^13.0.1","naive-ui":"^2.34.3",pinia:"^2.0.33",vue:"^3.2.47","vue-i18n":"^9.2.2","vue-router":"^4.1.6"},Gn={"@antfu/eslint-config":"^0.35.3","@commitlint/cli":"^17.4.4","@commitlint/config-conventional":"^17.4.4","@iconify/vue":"^4.1.0","@types/crypto-js":"^4.1.1","@types/katex":"^0.16.0","@types/markdown-it":"^12.2.3","@types/markdown-it-link-attributes":"^3.0.1","@types/node":"^18.14.6","@vitejs/plugin-vue":"^4.0.0",autoprefixer:"^10.4.13",axios:"^1.3.4","crypto-js":"^4.1.1",eslint:"^8.35.0",husky:"^8.0.3",less:"^4.1.3","lint-staged":"^13.1.2","markdown-it-link-attributes":"^4.0.1","npm-run-all":"^4.1.5",postcss:"^8.4.21",rimraf:"^4.2.0",tailwindcss:"^3.2.7",typescript:"~4.9.5",vite:"^4.2.0","vite-plugin-pwa":"^0.14.4","vue-tsc":"^1.2.0"},Wn={name:An,version:Fn,private:!1,description:jn,author:En,keywords:Hn,scripts:On,dependencies:Ln,devDependencies:Gn,"lint-staged":{"*.{ts,tsx,vue}":["pnpm lint:fix"]}},Kn={class:"p-4 space-y-4"},Yn={class:"text-xl font-bold"},Xn={key:0},Jn={key:1},qn=J({__name:"About",setup(n){const o=je(),m=S(!1),r=S(),d=z(()=>!!o.isChatGPTAPI);async function f(){try{m.value=!0;const{data:b}=await Gt();r.value=b}finally{m.value=!1}}return Lt(()=>{f()}),(b,$)=>(O(),$e(u(en),{show:m.value},{default:x(()=>{var c,h,k,j,U,A;return[s("div",Kn,[s("h2",Yn," Version - "+l(u(Wn).version),1),$[0]||($[0]=s("div",{class:"p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700"},[s("p",null,[V(" 此项目开源于 "),s("a",{class:"text-blue-600 dark:text-blue-500",href:"https://github.com/Chanzhaoyu/chatgpt-web",target:"_blank"}," GitHub "),V(" ，免费且基于 MIT 协议，没有任何形式的付费行为！ ")]),s("p",null," 如果你觉得此项目对你有帮助，请在 GitHub 帮我点个 Star 或者给予一点赞助，谢谢！ ")],-1)),s("p",null,l(b.$t("setting.api"))+"："+l(((c=r.value)==null?void 0:c.apiModel)??"-"),1),d.value?(O(),Z("p",Xn,l(b.$t("setting.monthlyUsage"))+"："+l(((h=r.value)==null?void 0:h.usage)??"-"),1)):_e("",!0),d.value?_e("",!0):(O(),Z("p",Jn,l(b.$t("setting.reverseProxy"))+"："+l(((k=r.value)==null?void 0:k.reverseProxy)??"-"),1)),s("p",null,l(b.$t("setting.timeout"))+"："+l(((j=r.value)==null?void 0:j.timeoutMs)??"-"),1),s("p",null,l(b.$t("setting.socks"))+"："+l(((U=r.value)==null?void 0:U.socksProxy)??"-"),1),s("p",null,l(b.$t("setting.httpsProxy"))+"："+l(((A=r.value)==null?void 0:A.httpsProxy)??"-"),1)])]}),_:1},8,["show"]))}}),Zn={class:"ml-2"},Qn={class:"min-h-[100px]"},ea={class:"ml-2"},ta={class:"min-h-[100px]"},na={class:"ml-2"},sa=J({__name:"index",props:{visible:{type:Boolean}},emits:["update:visible"],setup(n,{emit:o}){const m=n,r=o,d=je(),f=z(()=>!!d.isChatGPTAPI),b=S("General"),$=z({get(){return m.visible},set(c){r("update:visible",c)}});return(c,h)=>(O(),$e(u(Kt),{show:$.value,"onUpdate:show":h[1]||(h[1]=k=>$.value=k),"auto-focus":!1,preset:"card",style:{width:"95%","max-width":"640px"}},{default:x(()=>[s("div",null,[p(u(Wt),{value:b.value,"onUpdate:value":h[0]||(h[0]=k=>b.value=k),type:"line",animated:""},{default:x(()=>[p(u(we),{name:"General",tab:"General"},{tab:x(()=>[p(u(W),{class:"text-lg",icon:"ri:file-user-line"}),s("span",Zn,l(c.$t("setting.general")),1)]),default:x(()=>[s("div",Qn,[p(_n)])]),_:1}),f.value?(O(),$e(u(we),{key:0,name:"Advanced",tab:"Advanced"},{tab:x(()=>[p(u(W),{class:"text-lg",icon:"ri:equalizer-line"}),s("span",ea,l(c.$t("setting.advanced")),1)]),default:x(()=>[s("div",ta,[p(Un)])]),_:1})):_e("",!0),p(u(we),{name:"Config",tab:"Config"},{tab:x(()=>[p(u(W),{class:"text-lg",icon:"ri:list-settings-line"}),s("span",na,l(c.$t("setting.config")),1)]),default:x(()=>[p(qn)]),_:1})]),_:1},8,["value"])])]),_:1},8,["show"]))}});export{sa as default};
