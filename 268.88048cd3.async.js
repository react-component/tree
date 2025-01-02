"use strict";(self.webpackChunkrc_tree=self.webpackChunkrc_tree||[]).push([[268],{48092:function(gn,ft,T){T.d(ft,{OF:function(){return Le},ZP:function(){return hn}});var ut=T(31468),We=T.n(ut),vt=T(82242),M=T.n(vt),ht=T(37205),ie=T.n(ht),gt=T(82100),yt=T.n(gt),pt=T(29186),Kt=T.n(pt),xt=T(13720),P=T.n(xt),mt=T(80619),Nt=T.n(mt),kt=T(47074),Ct=T.n(kt),Et=T(85573),m=T.n(Et),Dt=T(92310),Y=T.n(Dt),ue=T(63773),Xe=T(79782),Q=T(48586),S=T(71062),Ze=S.createContext(null),bt=S.createContext({}),L=T(99678),St=function(t){var v=t.dropPosition,e=t.dropLevelOffset,d=t.indent,u={pointerEvents:"none",position:"absolute",right:0,backgroundColor:"red",height:2};switch(v){case-1:u.top=0,u.left=-e*d;break;case 1:u.bottom=0,u.left=-e*d;break;case 0:u.bottom=0,u.left=d;break}return(0,L.jsx)("div",{style:u})},Pt=St,Tt=T(70236),Je=T.n(Tt),Ot=T(79800),q=T.n(Ot),Mt=T(39647),Te=T.n(Mt),Oe=T(59882),Lt=T(31277),wt=T(44516),Rt=function(t){for(var v=t.prefixCls,e=t.level,d=t.isStart,u=t.isEnd,g="".concat(v,"-indent-unit"),n=[],o=0;o<e;o+=1)n.push((0,L.jsx)("span",{className:Y()(g,m()(m()({},"".concat(g,"-start"),d[o]),"".concat(g,"-end"),u[o]))},o));return(0,L.jsx)("span",{"aria-hidden":"true",className:"".concat(v,"-indent"),children:n})},At=S.memo(Rt);function V(a,t){return a[t]}var It=T(42661),$t=T(54907),jt=["children"];function Qe(a,t){return"".concat(a,"-").concat(t)}function Wt(a){return a&&a.type&&a.type.isTreeNode}function me(a,t){return a!=null?a:t}function Me(a){var t=a||{},v=t.title,e=t._title,d=t.key,u=t.children,g=v||"title";return{title:g,_title:e||[g],key:d||"key",children:u||"children"}}function yn(a,t){var v=new Map;function e(d){var u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";(d||[]).forEach(function(g){var n=g[t.key],o=g[t.children];warning(n!=null,"Tree node must have a certain key: [".concat(u).concat(n,"]"));var r=String(n);warning(!v.has(r)||n===null||n===void 0,"Same 'key' exist in the Tree: ".concat(r)),v.set(r,!0),e(o,"".concat(u).concat(r," > "))})}e(a)}function Zt(a){function t(v){var e=(0,It.Z)(v);return e.map(function(d){if(!Wt(d))return(0,Q.ZP)(!d,"Tree/TreeNode can only accept TreeNode as children."),null;var u=d.key,g=d.props,n=g.children,o=Te()(g,jt),r=M()({key:u},o),l=t(n);return l.length&&(r.children=l),r}).filter(function(d){return d})}return t(a)}function Fe(a,t,v){var e=Me(v),d=e._title,u=e.key,g=e.children,n=new Set(t===!0?[]:t),o=[];function r(l){var c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;return l.map(function(f,h){for(var p=Qe(c?c.pos:"0",h),x=me(f[u],p),s,y=0;y<d.length;y+=1){var C=d[y];if(f[C]!==void 0){s=f[C];break}}var K=Object.assign((0,$t.Z)(f,[].concat(ie()(d),[u,g])),{title:s,key:x,parent:c,pos:p,children:null,data:f,isStart:[].concat(ie()(c?c.isStart:[]),[h===0]),isEnd:[].concat(ie()(c?c.isEnd:[]),[h===l.length-1])});return o.push(K),t===!0||n.has(x)?K.children=r(f[g]||[],K):K.children=[],K})}return r(a),o}function Ft(a,t,v){var e={};We()(v)==="object"?e=v:e={externalGetKey:v},e=e||{};var d=e,u=d.childrenPropName,g=d.externalGetKey,n=d.fieldNames,o=Me(n),r=o.key,l=o.children,c=u||l,f;g?typeof g=="string"?f=function(x){return x[g]}:typeof g=="function"&&(f=function(x){return g(x)}):f=function(x,s){return me(x[r],s)};function h(p,x,s,y){var C=p?p[c]:a,K=p?Qe(s.pos,x):"0",N=p?[].concat(ie()(y),[p]):[];if(p){var E=f(p,K),D={node:p,index:x,pos:K,key:E,parentPos:s.node?s.pos:null,level:s.level+1,nodes:N};t(D)}C&&C.forEach(function(O,i){h(O,i,{node:p,pos:K,level:s?s.level+1:-1},N)})}h(null)}function Ut(a){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},v=t.initWrapper,e=t.processEntity,d=t.onProcessFinished,u=t.externalGetKey,g=t.childrenPropName,n=t.fieldNames,o=arguments.length>2?arguments[2]:void 0,r=u||o,l={},c={},f={posEntities:l,keyEntities:c};return v&&(f=v(f)||f),Ft(a,function(h){var p=h.node,x=h.index,s=h.pos,y=h.key,C=h.parentPos,K=h.level,N=h.nodes,E={node:p,nodes:N,index:x,key:y,pos:s,level:K},D=me(y,s);l[s]=E,c[D]=E,E.parent=l[C],E.parent&&(E.parent.children=E.parent.children||[],E.parent.children.push(E)),e&&e(E,f)},{externalGetKey:r,childrenPropName:g,fieldNames:n}),d&&d(f),f}function Ne(a,t){var v=t.expandedKeys,e=t.selectedKeys,d=t.loadedKeys,u=t.loadingKeys,g=t.checkedKeys,n=t.halfCheckedKeys,o=t.dragOverNodeKey,r=t.dropPosition,l=t.keyEntities,c=V(l,a),f={eventKey:a,expanded:v.indexOf(a)!==-1,selected:e.indexOf(a)!==-1,loaded:d.indexOf(a)!==-1,loading:u.indexOf(a)!==-1,checked:g.indexOf(a)!==-1,halfChecked:n.indexOf(a)!==-1,pos:String(c?c.pos:""),dragOver:o===a&&r===0,dragOverGapTop:o===a&&r===-1,dragOverGapBottom:o===a&&r===1};return f}function W(a){var t=a.data,v=a.expanded,e=a.selected,d=a.checked,u=a.loaded,g=a.loading,n=a.halfChecked,o=a.dragOver,r=a.dragOverGapTop,l=a.dragOverGapBottom,c=a.pos,f=a.active,h=a.eventKey,p=M()(M()({},t),{},{expanded:v,selected:e,checked:d,loaded:u,loading:g,halfChecked:n,dragOver:o,dragOverGapTop:r,dragOverGapBottom:l,pos:c,active:f,key:h});return"props"in p||Object.defineProperty(p,"props",{get:function(){return(0,Q.ZP)(!1,"Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`."),a}}),p}var Bt=["eventKey","className","style","dragOver","dragOverGapTop","dragOverGapBottom","isLeaf","isStart","isEnd","expanded","selected","checked","halfChecked","loading","domRef","active","data","onMouseMove","selectable"],qe="open",_e="close",Gt="---",et=function(t){var v,e,d=t.eventKey,u=t.className,g=t.style,n=t.dragOver,o=t.dragOverGapTop,r=t.dragOverGapBottom,l=t.isLeaf,c=t.isStart,f=t.isEnd,h=t.expanded,p=t.selected,x=t.checked,s=t.halfChecked,y=t.loading,C=t.domRef,K=t.active,N=t.data,E=t.onMouseMove,D=t.selectable,O=Te()(t,Bt),i=S.useContext(Ze),w=S.useContext(bt),R=S.useRef(null),Z=S.useState(!1),A=q()(Z,2),j=A[0],$=A[1],I=S.useMemo(function(){var b;return!!(i.disabled||t.disabled||(b=w.nodeDisabled)!==null&&b!==void 0&&b.call(w,N))},[i.disabled,t.disabled,w.nodeDisabled,N]),U=S.useMemo(function(){return!i.checkable||t.checkable===!1?!1:i.checkable},[i.checkable,t.checkable]),B=function(k){I||i.onNodeSelect(k,W(t))},J=function(k){I||!U||t.disableCheckbox||i.onNodeCheck(k,W(t),!x)},ke=S.useMemo(function(){return typeof D=="boolean"?D:i.selectable},[D,i.selectable]),se=function(k){i.onNodeClick(k,W(t)),ke?B(k):J(k)},ve=function(k){i.onNodeDoubleClick(k,W(t))},he=function(k){i.onNodeMouseEnter(k,W(t))},ge=function(k){i.onNodeMouseLeave(k,W(t))},ce=function(k){i.onNodeContextMenu(k,W(t))},G=S.useMemo(function(){return!!(i.draggable&&(!i.draggable.nodeDraggable||i.draggable.nodeDraggable(N)))},[i.draggable,N]),ye=function(k){k.stopPropagation(),$(!0),i.onNodeDragStart(k,t);try{k.dataTransfer.setData("text/plain","")}catch(de){}},Ce=function(k){k.preventDefault(),k.stopPropagation(),i.onNodeDragEnter(k,t)},pe=function(k){k.preventDefault(),k.stopPropagation(),i.onNodeDragOver(k,t)},Ee=function(k){k.stopPropagation(),i.onNodeDragLeave(k,t)},ee=function(k){k.stopPropagation(),$(!1),i.onNodeDragEnd(k,t)},te=function(k){k.preventDefault(),k.stopPropagation(),$(!1),i.onNodeDrop(k,t)},Ke=function(k){y||i.onNodeExpand(k,W(t))},De=S.useMemo(function(){var b=V(i.keyEntities,d)||{},k=b.children;return!!(k||[]).length},[i.keyEntities,d]),z=S.useMemo(function(){return l===!1?!1:l||!i.loadData&&!De||i.loadData&&t.loaded&&!De},[l,i.loadData,De,t.loaded]),Ye=function(){y||i.loadData&&h&&!z&&!t.loaded&&i.onNodeLoad(W(t))};S.useEffect(function(){Ye()},[y,i.loadData,i.onNodeLoad,h,z,t]);var we=S.useMemo(function(){var b;return(b=i.draggable)!==null&&b!==void 0&&b.icon?(0,L.jsx)("span",{className:"".concat(i.prefixCls,"-draggable-icon"),children:i.draggable.icon}):null},[i.draggable]),Re=function(k){var de=t.switcherIcon||i.switcherIcon;return typeof de=="function"?de(M()(M()({},t),{},{isLeaf:k})):de},be=S.useMemo(function(){if(z){var b=Re(!0);return b!==!1?(0,L.jsx)("span",{className:Y()("".concat(i.prefixCls,"-switcher"),"".concat(i.prefixCls,"-switcher-noop")),children:b}):null}var k=Re(!1);return k!==!1?(0,L.jsx)("span",{onClick:Ke,className:Y()("".concat(i.prefixCls,"-switcher"),"".concat(i.prefixCls,"-switcher_").concat(h?qe:_e)),children:k}):null},[i.prefixCls,h,z,t.switcherIcon,i.switcherIcon]),Ae=S.useMemo(function(){if(!U)return null;var b=typeof U!="boolean"?U:null;return(0,L.jsx)("span",{className:Y()("".concat(i.prefixCls,"-checkbox"),m()(m()(m()({},"".concat(i.prefixCls,"-checkbox-checked"),x),"".concat(i.prefixCls,"-checkbox-indeterminate"),!x&&s),"".concat(i.prefixCls,"-checkbox-disabled"),I||t.disableCheckbox)),onClick:J,role:"checkbox","aria-checked":s?"mixed":x,"aria-disabled":I||t.disableCheckbox,"aria-label":"Select ".concat(typeof t.title=="string"?t.title:"tree node"),children:b})},[U,x,s,I,t.disableCheckbox,t.title]),ne=S.useMemo(function(){return z?null:h?qe:_e},[z,h]),Se=S.useMemo(function(){return(0,L.jsx)("span",{className:Y()("".concat(i.prefixCls,"-iconEle"),"".concat(i.prefixCls,"-icon__").concat(ne||"docu"),m()({},"".concat(i.prefixCls,"-icon_loading"),y))})},[i.prefixCls,ne,y]),Ie=S.useMemo(function(){var b=!!i.draggable,k=!t.disabled&&b&&i.dragOverNodeKey===d;return k?i.dropIndicatorRender({dropPosition:i.dropPosition,dropLevelOffset:i.dropLevelOffset,indent:i.indent,prefixCls:i.prefixCls,direction:i.direction}):null},[i.dropPosition,i.dropLevelOffset,i.indent,i.prefixCls,i.direction,i.draggable,i.dragOverNodeKey,i.dropIndicatorRender]),H=S.useMemo(function(){var b=t.title,k=b===void 0?Gt:b,de="".concat(i.prefixCls,"-node-content-wrapper"),ze;if(i.showIcon){var $e=t.icon||i.icon;ze=$e?(0,L.jsx)("span",{className:Y()("".concat(i.prefixCls,"-iconEle"),"".concat(i.prefixCls,"-icon__customize")),children:typeof $e=="function"?$e(t):$e}):Se}else i.loadData&&y&&(ze=Se);var je;return typeof k=="function"?je=k(N):i.titleRender?je=i.titleRender(N):je=k,(0,L.jsxs)("span",{ref:R,title:typeof k=="string"?k:"",className:Y()(de,"".concat(de,"-").concat(ne||"normal"),m()({},"".concat(i.prefixCls,"-node-selected"),!I&&(p||j))),onMouseEnter:he,onMouseLeave:ge,onContextMenu:ce,onClick:se,onDoubleClick:ve,children:[ze,(0,L.jsx)("span",{className:"".concat(i.prefixCls,"-title"),children:je}),Ie]})},[i.prefixCls,i.showIcon,t,i.icon,Se,i.titleRender,N,ne,he,ge,ce,se,ve]),F=(0,Xe.Z)(O,{aria:!0,data:!0}),ae=V(i.keyEntities,d)||{},re=ae.level,Pe=f[f.length-1],oe=!I&&G,xe=i.draggingNodeKey===d,fe=D!==void 0?{"aria-selected":!!D}:void 0;return(0,L.jsxs)("div",M()(M()(M()({ref:C,role:"treeitem","aria-expanded":l?void 0:h,className:Y()(u,"".concat(i.prefixCls,"-treenode"),(e={},m()(m()(m()(m()(m()(m()(m()(m()(m()(m()(e,"".concat(i.prefixCls,"-treenode-disabled"),I),"".concat(i.prefixCls,"-treenode-switcher-").concat(h?"open":"close"),!l),"".concat(i.prefixCls,"-treenode-checkbox-checked"),x),"".concat(i.prefixCls,"-treenode-checkbox-indeterminate"),s),"".concat(i.prefixCls,"-treenode-selected"),p),"".concat(i.prefixCls,"-treenode-loading"),y),"".concat(i.prefixCls,"-treenode-active"),K),"".concat(i.prefixCls,"-treenode-leaf-last"),Pe),"".concat(i.prefixCls,"-treenode-draggable"),G),"dragging",xe),m()(m()(m()(m()(m()(m()(e,"drop-target",i.dropTargetKey===d),"drop-container",i.dropContainerKey===d),"drag-over",!I&&n),"drag-over-gap-top",!I&&o),"drag-over-gap-bottom",!I&&r),"filter-node",(v=i.filterTreeNode)===null||v===void 0?void 0:v.call(i,W(t))))),style:g,draggable:oe,onDragStart:oe?ye:void 0,onDragEnter:G?Ce:void 0,onDragOver:G?pe:void 0,onDragLeave:G?Ee:void 0,onDrop:G?te:void 0,onDragEnd:G?ee:void 0,onMouseMove:E},fe),F),{},{children:[(0,L.jsx)(At,{prefixCls:i.prefixCls,level:re,isStart:c,isEnd:f}),we,be,Ae,H]}))};et.isTreeNode=1;var Le=et;function Ht(a,t){var v=S.useState(!1),e=q()(v,2),d=e[0],u=e[1];(0,Oe.ZP)(function(){if(d)return a(),function(){t()}},[d]),(0,Oe.ZP)(function(){return u(!0),function(){u(!1)}},[])}var Vt=Ht,Yt=["className","style","motion","motionNodes","motionType","onMotionStart","onMotionEnd","active","treeNodeRequiredProps"],zt=S.forwardRef(function(a,t){var v=a.className,e=a.style,d=a.motion,u=a.motionNodes,g=a.motionType,n=a.onMotionStart,o=a.onMotionEnd,r=a.active,l=a.treeNodeRequiredProps,c=Te()(a,Yt),f=S.useState(!0),h=q()(f,2),p=h[0],x=h[1],s=S.useContext(Ze),y=s.prefixCls,C=u&&g!=="hide";(0,Oe.ZP)(function(){u&&C!==p&&x(C)},[u]);var K=function(){u&&n()},N=S.useRef(!1),E=function(){u&&!N.current&&(N.current=!0,o())};Vt(K,E);var D=function(i){C===i&&E()};return u?(0,L.jsx)(wt.ZP,M()(M()({ref:t,visible:p},d),{},{motionAppear:g==="show",onVisibleChanged:D,children:function(i,w){var R=i.className,Z=i.style;return(0,L.jsx)("div",{ref:w,className:Y()("".concat(y,"-treenode-motion"),R),style:Z,children:u.map(function(A){var j=Object.assign({},(Je()(A.data),A.data)),$=A.title,I=A.key,U=A.isStart,B=A.isEnd;delete j.children;var J=Ne(I,l);return(0,S.createElement)(Le,M()(M()(M()({},j),J),{},{title:$,active:r,data:A.data,key:I,isStart:U,isEnd:B}))})})}})):(0,L.jsx)(Le,M()(M()({domRef:t,className:v,style:e},c),{},{active:r}))}),Xt=zt;function Jt(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],v=a.length,e=t.length;if(Math.abs(v-e)!==1)return{add:!1,key:null};function d(u,g){var n=new Map;u.forEach(function(r){n.set(r,!0)});var o=g.filter(function(r){return!n.has(r)});return o.length===1?o[0]:null}return v<e?{add:!0,key:d(a,t)}:{add:!1,key:d(t,a)}}function tt(a,t,v){var e=a.findIndex(function(n){return n.key===v}),d=a[e+1],u=t.findIndex(function(n){return n.key===v});if(d){var g=t.findIndex(function(n){return n.key===d.key});return t.slice(u+1,g)}return t.slice(u+1)}var Qt=["prefixCls","data","selectable","checkable","expandedKeys","selectedKeys","checkedKeys","loadedKeys","loadingKeys","halfCheckedKeys","keyEntities","disabled","dragging","dragOverNodeKey","dropPosition","motion","height","itemHeight","virtual","scrollWidth","focusable","activeItem","focused","tabIndex","onKeyDown","onFocus","onBlur","onActiveChange","onListChangeStart","onListChangeEnd"],nt={width:0,height:0,display:"flex",overflow:"hidden",opacity:0,border:0,padding:0,margin:0},qt=function(){},le="RC_TREE_MOTION_".concat(Math.random()),Ue={key:le},at={key:le,level:0,index:0,pos:"0",node:Ue,nodes:[Ue]},rt={parent:null,children:[],pos:at.pos,data:Ue,title:null,key:le,isStart:[],isEnd:[]};function ot(a,t,v,e){return t===!1||!v?a:a.slice(0,Math.ceil(v/e)+1)}function dt(a){var t=a.key,v=a.pos;return me(t,v)}function _t(a){for(var t=String(a.data.key),v=a;v.parent;)v=v.parent,t="".concat(v.data.key," > ").concat(t);return t}var en=S.forwardRef(function(a,t){var v=a.prefixCls,e=a.data,d=a.selectable,u=a.checkable,g=a.expandedKeys,n=a.selectedKeys,o=a.checkedKeys,r=a.loadedKeys,l=a.loadingKeys,c=a.halfCheckedKeys,f=a.keyEntities,h=a.disabled,p=a.dragging,x=a.dragOverNodeKey,s=a.dropPosition,y=a.motion,C=a.height,K=a.itemHeight,N=a.virtual,E=a.scrollWidth,D=a.focusable,O=a.activeItem,i=a.focused,w=a.tabIndex,R=a.onKeyDown,Z=a.onFocus,A=a.onBlur,j=a.onActiveChange,$=a.onListChangeStart,I=a.onListChangeEnd,U=Te()(a,Qt),B=S.useRef(null),J=S.useRef(null);S.useImperativeHandle(t,function(){return{scrollTo:function(F){B.current.scrollTo(F)},getIndentWidth:function(){return J.current.offsetWidth}}});var ke=S.useState(g),se=q()(ke,2),ve=se[0],he=se[1],ge=S.useState(e),ce=q()(ge,2),G=ce[0],ye=ce[1],Ce=S.useState(e),pe=q()(Ce,2),Ee=pe[0],ee=pe[1],te=S.useState([]),Ke=q()(te,2),De=Ke[0],z=Ke[1],Ye=S.useState(null),we=q()(Ye,2),Re=we[0],be=we[1],Ae=S.useRef(e);Ae.current=e;function ne(){var H=Ae.current;ye(H),ee(H),z([]),be(null),I()}(0,Oe.ZP)(function(){he(g);var H=Jt(ve,g);if(H.key!==null)if(H.add){var F=G.findIndex(function(fe){var b=fe.key;return b===H.key}),ae=ot(tt(G,e,H.key),N,C,K),re=G.slice();re.splice(F+1,0,rt),ee(re),z(ae),be("show")}else{var Pe=e.findIndex(function(fe){var b=fe.key;return b===H.key}),oe=ot(tt(e,G,H.key),N,C,K),xe=e.slice();xe.splice(Pe+1,0,rt),ee(xe),z(oe),be("hide")}else G!==e&&(ye(e),ee(e))},[g,e]),S.useEffect(function(){p||ne()},[p]);var Se=y?Ee:e,Ie={expandedKeys:g,selectedKeys:n,loadedKeys:r,loadingKeys:l,checkedKeys:o,halfCheckedKeys:c,dragOverNodeKey:x,dropPosition:s,keyEntities:f};return(0,L.jsxs)(L.Fragment,{children:[i&&O&&(0,L.jsx)("span",{style:nt,"aria-live":"assertive",children:_t(O)}),(0,L.jsx)("div",{children:(0,L.jsx)("input",{style:nt,disabled:D===!1||h,tabIndex:D!==!1?w:null,onKeyDown:R,onFocus:Z,onBlur:A,value:"",onChange:qt,"aria-label":"for screen reader"})}),(0,L.jsx)("div",{className:"".concat(v,"-treenode"),"aria-hidden":!0,style:{position:"absolute",pointerEvents:"none",visibility:"hidden",height:0,overflow:"hidden",border:0,padding:0},children:(0,L.jsx)("div",{className:"".concat(v,"-indent"),children:(0,L.jsx)("div",{ref:J,className:"".concat(v,"-indent-unit")})})}),(0,L.jsx)(Lt.Z,M()(M()({},U),{},{data:Se,itemKey:dt,height:C,fullHeight:!1,virtual:N,itemHeight:K,scrollWidth:E,prefixCls:"".concat(v,"-list"),ref:B,role:"tree",onVisibleChange:function(F){F.every(function(ae){return dt(ae)!==le})&&ne()},children:function(F){var ae=F.pos,re=Object.assign({},(Je()(F.data),F.data)),Pe=F.title,oe=F.key,xe=F.isStart,fe=F.isEnd,b=me(oe,ae);delete re.key,delete re.children;var k=Ne(b,Ie);return(0,L.jsx)(Xt,M()(M()(M()({},re),k),{},{title:Pe,active:!!O&&oe===O.key,pos:ae,data:F.data,isStart:xe,isEnd:fe,motion:y,motionNodes:oe===le?De:null,motionType:Re,onMotionStart:$,onMotionEnd:ne,treeNodeRequiredProps:Ie,onMouseMove:function(){j(null)}}))}}))]})}),tn=en,nn=null;function X(a,t){if(!a)return[];var v=a.slice(),e=v.indexOf(t);return e>=0&&v.splice(e,1),v}function _(a,t){var v=(a||[]).slice();return v.indexOf(t)===-1&&v.push(t),v}function Be(a){return a.split("-")}function an(a,t){var v=[],e=V(t,a);function d(){var u=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[];u.forEach(function(g){var n=g.key,o=g.children;v.push(n),d(o)})}return d(e.children),v}function rn(a){if(a.parent){var t=Be(a.pos);return Number(t[t.length-1])===a.parent.children.length-1}return!1}function on(a){var t=Be(a.pos);return Number(t[t.length-1])===0}function it(a,t,v,e,d,u,g,n,o,r){var l,c=a.clientX,f=a.clientY,h=a.target.getBoundingClientRect(),p=h.top,x=h.height,s=(r==="rtl"?-1:1)*(((d==null?void 0:d.x)||0)-c),y=(s-12)/e,C=o.filter(function(U){var B;return(B=n[U])===null||B===void 0||(B=B.children)===null||B===void 0?void 0:B.length}),K=V(n,v.eventKey);if(f<p+x/2){var N=g.findIndex(function(U){return U.key===K.key}),E=N<=0?0:N-1,D=g[E].key;K=V(n,D)}var O=K.key,i=K,w=K.key,R=0,Z=0;if(!C.includes(O))for(var A=0;A<y&&rn(K);A+=1)K=K.parent,Z+=1;var j=t.data,$=K.node,I=!0;return on(K)&&K.level===0&&f<p+x/2&&u({dragNode:j,dropNode:$,dropPosition:-1})&&K.key===v.eventKey?R=-1:(i.children||[]).length&&C.includes(w)?u({dragNode:j,dropNode:$,dropPosition:0})?R=0:I=!1:Z===0?y>-1.5?u({dragNode:j,dropNode:$,dropPosition:1})?R=1:I=!1:u({dragNode:j,dropNode:$,dropPosition:0})?R=0:u({dragNode:j,dropNode:$,dropPosition:1})?R=1:I=!1:u({dragNode:j,dropNode:$,dropPosition:1})?R=1:I=!1,{dropPosition:R,dropLevelOffset:Z,dropTargetKey:K.key,dropTargetPos:K.pos,dragOverNodeKey:w,dropContainerKey:R===0?null:((l=K.parent)===null||l===void 0?void 0:l.key)||null,dropAllowed:I}}function lt(a,t){if(a){var v=t.multiple;return v?a.slice():a.length?[a[0]]:a}}var dn=function(t){return t};function ln(a,t){if(!a)return[];var v=t||{},e=v.processProps,d=e===void 0?dn:e,u=Array.isArray(a)?a:[a];return u.map(function(g){var n=g.children,o=_objectWithoutProperties(g,nn),r=ln(n,t);return _jsx(TreeNode,_objectSpread(_objectSpread({},d(o)),{},{children:r}),o.key)})}function Ge(a){if(!a)return null;var t;if(Array.isArray(a))t={checkedKeys:a,halfCheckedKeys:void 0};else if(We()(a)==="object")t={checkedKeys:a.checked||void 0,halfCheckedKeys:a.halfChecked||void 0};else return(0,Q.ZP)(!1,"`checkedKeys` is not an array or an object"),null;return t}function st(a,t){var v=new Set;function e(d){if(!v.has(d)){var u=V(t,d);if(u){v.add(d);var g=u.parent,n=u.node;n.disabled||g&&e(g.key)}}}return(a||[]).forEach(function(d){e(d)}),ie()(v)}function ct(a,t){var v=new Set;return a.forEach(function(e){t.has(e)||v.add(e)}),v}function sn(a){var t=a||{},v=t.disabled,e=t.disableCheckbox,d=t.checkable;return!!(v||e)||d===!1}function cn(a,t,v,e){for(var d=new Set(a),u=new Set,g=0;g<=v;g+=1){var n=t.get(g)||new Set;n.forEach(function(c){var f=c.key,h=c.node,p=c.children,x=p===void 0?[]:p;d.has(f)&&!e(h)&&x.filter(function(s){return!e(s.node)}).forEach(function(s){d.add(s.key)})})}for(var o=new Set,r=v;r>=0;r-=1){var l=t.get(r)||new Set;l.forEach(function(c){var f=c.parent,h=c.node;if(!(e(h)||!c.parent||o.has(c.parent.key))){if(e(c.parent.node)){o.add(f.key);return}var p=!0,x=!1;(f.children||[]).filter(function(s){return!e(s.node)}).forEach(function(s){var y=s.key,C=d.has(y);p&&!C&&(p=!1),!x&&(C||u.has(y))&&(x=!0)}),p&&d.add(f.key),x&&u.add(f.key),o.add(f.key)}})}return{checkedKeys:Array.from(d),halfCheckedKeys:Array.from(ct(u,d))}}function fn(a,t,v,e,d){for(var u=new Set(a),g=new Set(t),n=0;n<=e;n+=1){var o=v.get(n)||new Set;o.forEach(function(f){var h=f.key,p=f.node,x=f.children,s=x===void 0?[]:x;!u.has(h)&&!g.has(h)&&!d(p)&&s.filter(function(y){return!d(y.node)}).forEach(function(y){u.delete(y.key)})})}g=new Set;for(var r=new Set,l=e;l>=0;l-=1){var c=v.get(l)||new Set;c.forEach(function(f){var h=f.parent,p=f.node;if(!(d(p)||!f.parent||r.has(f.parent.key))){if(d(f.parent.node)){r.add(h.key);return}var x=!0,s=!1;(h.children||[]).filter(function(y){return!d(y.node)}).forEach(function(y){var C=y.key,K=u.has(C);x&&!K&&(x=!1),!s&&(K||g.has(C))&&(s=!0)}),x||u.delete(h.key),s&&g.add(h.key),r.add(h.key)}})}return{checkedKeys:Array.from(u),halfCheckedKeys:Array.from(ct(g,u))}}function He(a,t,v,e){var d=[],u;e?u=e:u=sn;var g=new Set(a.filter(function(l){var c=!!V(v,l);return c||d.push(l),c})),n=new Map,o=0;Object.keys(v).forEach(function(l){var c=v[l],f=c.level,h=n.get(f);h||(h=new Set,n.set(f,h)),h.add(c),o=Math.max(o,f)}),(0,Q.ZP)(!d.length,"Tree missing follow keys: ".concat(d.slice(0,100).map(function(l){return"'".concat(l,"'")}).join(", ")));var r;return t===!0?r=cn(g,n,o,u):r=fn(g,t.halfCheckedKeys,n,o,u),r}var un=10,Ve=function(a){Nt()(v,a);var t=Ct()(v);function v(){var e;yt()(this,v);for(var d=arguments.length,u=new Array(d),g=0;g<d;g++)u[g]=arguments[g];return e=t.call.apply(t,[this].concat(u)),m()(P()(e),"destroyed",!1),m()(P()(e),"delayedDragEnterLogic",void 0),m()(P()(e),"loadingRetryTimes",{}),m()(P()(e),"state",{keyEntities:{},indent:null,selectedKeys:[],checkedKeys:[],halfCheckedKeys:[],loadedKeys:[],loadingKeys:[],expandedKeys:[],draggingNodeKey:null,dragChildrenKeys:[],dropTargetKey:null,dropPosition:null,dropContainerKey:null,dropLevelOffset:null,dropTargetPos:null,dropAllowed:!0,dragOverNodeKey:null,treeData:[],flattenNodes:[],focused:!1,activeKey:null,listChanging:!1,prevProps:null,fieldNames:Me()}),m()(P()(e),"dragStartMousePosition",null),m()(P()(e),"dragNodeProps",null),m()(P()(e),"currentMouseOverDroppableNodeKey",null),m()(P()(e),"listRef",S.createRef()),m()(P()(e),"onNodeDragStart",function(n,o){var r=e.state,l=r.expandedKeys,c=r.keyEntities,f=e.props.onDragStart,h=o.eventKey;e.dragNodeProps=o,e.dragStartMousePosition={x:n.clientX,y:n.clientY};var p=X(l,h);e.setState({draggingNodeKey:h,dragChildrenKeys:an(h,c),indent:e.listRef.current.getIndentWidth()}),e.setExpandedKeys(p),window.addEventListener("dragend",e.onWindowDragEnd),f==null||f({event:n,node:W(o)})}),m()(P()(e),"onNodeDragEnter",function(n,o){var r=e.state,l=r.expandedKeys,c=r.keyEntities,f=r.dragChildrenKeys,h=r.flattenNodes,p=r.indent,x=e.props,s=x.onDragEnter,y=x.onExpand,C=x.allowDrop,K=x.direction,N=o.pos,E=o.eventKey;if(e.currentMouseOverDroppableNodeKey!==E&&(e.currentMouseOverDroppableNodeKey=E),!e.dragNodeProps){e.resetDragState();return}var D=it(n,e.dragNodeProps,o,p,e.dragStartMousePosition,C,h,c,l,K),O=D.dropPosition,i=D.dropLevelOffset,w=D.dropTargetKey,R=D.dropContainerKey,Z=D.dropTargetPos,A=D.dropAllowed,j=D.dragOverNodeKey;if(f.includes(w)||!A){e.resetDragState();return}if(e.delayedDragEnterLogic||(e.delayedDragEnterLogic={}),Object.keys(e.delayedDragEnterLogic).forEach(function($){clearTimeout(e.delayedDragEnterLogic[$])}),e.dragNodeProps.eventKey!==o.eventKey&&(n.persist(),e.delayedDragEnterLogic[N]=window.setTimeout(function(){if(e.state.draggingNodeKey!==null){var $=ie()(l),I=V(c,o.eventKey);I&&(I.children||[]).length&&($=_(l,o.eventKey)),e.props.hasOwnProperty("expandedKeys")||e.setExpandedKeys($),y==null||y($,{node:W(o),expanded:!0,nativeEvent:n.nativeEvent})}},800)),e.dragNodeProps.eventKey===w&&i===0){e.resetDragState();return}e.setState({dragOverNodeKey:j,dropPosition:O,dropLevelOffset:i,dropTargetKey:w,dropContainerKey:R,dropTargetPos:Z,dropAllowed:A}),s==null||s({event:n,node:W(o),expandedKeys:l})}),m()(P()(e),"onNodeDragOver",function(n,o){var r=e.state,l=r.dragChildrenKeys,c=r.flattenNodes,f=r.keyEntities,h=r.expandedKeys,p=r.indent,x=e.props,s=x.onDragOver,y=x.allowDrop,C=x.direction;if(e.dragNodeProps){var K=it(n,e.dragNodeProps,o,p,e.dragStartMousePosition,y,c,f,h,C),N=K.dropPosition,E=K.dropLevelOffset,D=K.dropTargetKey,O=K.dropContainerKey,i=K.dropTargetPos,w=K.dropAllowed,R=K.dragOverNodeKey;l.includes(D)||!w||(e.dragNodeProps.eventKey===D&&E===0?e.state.dropPosition===null&&e.state.dropLevelOffset===null&&e.state.dropTargetKey===null&&e.state.dropContainerKey===null&&e.state.dropTargetPos===null&&e.state.dropAllowed===!1&&e.state.dragOverNodeKey===null||e.resetDragState():N===e.state.dropPosition&&E===e.state.dropLevelOffset&&D===e.state.dropTargetKey&&O===e.state.dropContainerKey&&i===e.state.dropTargetPos&&w===e.state.dropAllowed&&R===e.state.dragOverNodeKey||e.setState({dropPosition:N,dropLevelOffset:E,dropTargetKey:D,dropContainerKey:O,dropTargetPos:i,dropAllowed:w,dragOverNodeKey:R}),s==null||s({event:n,node:W(o)}))}}),m()(P()(e),"onNodeDragLeave",function(n,o){e.currentMouseOverDroppableNodeKey===o.eventKey&&!n.currentTarget.contains(n.relatedTarget)&&(e.resetDragState(),e.currentMouseOverDroppableNodeKey=null);var r=e.props.onDragLeave;r==null||r({event:n,node:W(o)})}),m()(P()(e),"onWindowDragEnd",function(n){e.onNodeDragEnd(n,null,!0),window.removeEventListener("dragend",e.onWindowDragEnd)}),m()(P()(e),"onNodeDragEnd",function(n,o){var r=e.props.onDragEnd;e.setState({dragOverNodeKey:null}),e.cleanDragState(),r==null||r({event:n,node:W(o)}),e.dragNodeProps=null,window.removeEventListener("dragend",e.onWindowDragEnd)}),m()(P()(e),"onNodeDrop",function(n,o){var r,l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,c=e.state,f=c.dragChildrenKeys,h=c.dropPosition,p=c.dropTargetKey,x=c.dropTargetPos,s=c.dropAllowed;if(s){var y=e.props.onDrop;if(e.setState({dragOverNodeKey:null}),e.cleanDragState(),p!==null){var C=M()(M()({},Ne(p,e.getTreeNodeRequiredProps())),{},{active:((r=e.getActiveItem())===null||r===void 0?void 0:r.key)===p,data:V(e.state.keyEntities,p).node}),K=f.includes(p);(0,Q.ZP)(!K,"Can not drop to dragNode's children node. This is a bug of rc-tree. Please report an issue.");var N=Be(x),E={event:n,node:W(C),dragNode:e.dragNodeProps?W(e.dragNodeProps):null,dragNodesKeys:[e.dragNodeProps.eventKey].concat(f),dropToGap:h!==0,dropPosition:h+Number(N[N.length-1])};l||y==null||y(E),e.dragNodeProps=null}}}),m()(P()(e),"cleanDragState",function(){var n=e.state.draggingNodeKey;n!==null&&e.setState({draggingNodeKey:null,dropPosition:null,dropContainerKey:null,dropTargetKey:null,dropLevelOffset:null,dropAllowed:!0,dragOverNodeKey:null}),e.dragStartMousePosition=null,e.currentMouseOverDroppableNodeKey=null}),m()(P()(e),"triggerExpandActionExpand",function(n,o){var r=e.state,l=r.expandedKeys,c=r.flattenNodes,f=o.expanded,h=o.key,p=o.isLeaf;if(!(p||n.shiftKey||n.metaKey||n.ctrlKey)){var x=c.filter(function(y){return y.key===h})[0],s=W(M()(M()({},Ne(h,e.getTreeNodeRequiredProps())),{},{data:x.data}));e.setExpandedKeys(f?X(l,h):_(l,h)),e.onNodeExpand(n,s)}}),m()(P()(e),"onNodeClick",function(n,o){var r=e.props,l=r.onClick,c=r.expandAction;c==="click"&&e.triggerExpandActionExpand(n,o),l==null||l(n,o)}),m()(P()(e),"onNodeDoubleClick",function(n,o){var r=e.props,l=r.onDoubleClick,c=r.expandAction;c==="doubleClick"&&e.triggerExpandActionExpand(n,o),l==null||l(n,o)}),m()(P()(e),"onNodeSelect",function(n,o){var r=e.state.selectedKeys,l=e.state,c=l.keyEntities,f=l.fieldNames,h=e.props,p=h.onSelect,x=h.multiple,s=o.selected,y=o[f.key],C=!s;C?x?r=_(r,y):r=[y]:r=X(r,y);var K=r.map(function(N){var E=V(c,N);return E?E.node:null}).filter(Boolean);e.setUncontrolledState({selectedKeys:r}),p==null||p(r,{event:"select",selected:C,node:o,selectedNodes:K,nativeEvent:n.nativeEvent})}),m()(P()(e),"onNodeCheck",function(n,o,r){var l=e.state,c=l.keyEntities,f=l.checkedKeys,h=l.halfCheckedKeys,p=e.props,x=p.checkStrictly,s=p.onCheck,y=o.key,C,K={event:"check",node:o,checked:r,nativeEvent:n.nativeEvent};if(x){var N=r?_(f,y):X(f,y),E=X(h,y);C={checked:N,halfChecked:E},K.checkedNodes=N.map(function(Z){return V(c,Z)}).filter(Boolean).map(function(Z){return Z.node}),e.setUncontrolledState({checkedKeys:N})}else{var D=He([].concat(ie()(f),[y]),!0,c),O=D.checkedKeys,i=D.halfCheckedKeys;if(!r){var w=new Set(O);w.delete(y);var R=He(Array.from(w),{checked:!1,halfCheckedKeys:i},c);O=R.checkedKeys,i=R.halfCheckedKeys}C=O,K.checkedNodes=[],K.checkedNodesPositions=[],K.halfCheckedKeys=i,O.forEach(function(Z){var A=V(c,Z);if(A){var j=A.node,$=A.pos;K.checkedNodes.push(j),K.checkedNodesPositions.push({node:j,pos:$})}}),e.setUncontrolledState({checkedKeys:O},!1,{halfCheckedKeys:i})}s==null||s(C,K)}),m()(P()(e),"onNodeLoad",function(n){var o,r=n.key,l=e.state.keyEntities,c=V(l,r);if(!(c!=null&&(o=c.children)!==null&&o!==void 0&&o.length)){var f=new Promise(function(h,p){e.setState(function(x){var s=x.loadedKeys,y=s===void 0?[]:s,C=x.loadingKeys,K=C===void 0?[]:C,N=e.props,E=N.loadData,D=N.onLoad;if(!E||y.includes(r)||K.includes(r))return null;var O=E(n);return O.then(function(){var i=e.state.loadedKeys,w=_(i,r);D==null||D(w,{event:"load",node:n}),e.setUncontrolledState({loadedKeys:w}),e.setState(function(R){return{loadingKeys:X(R.loadingKeys,r)}}),h()}).catch(function(i){if(e.setState(function(R){return{loadingKeys:X(R.loadingKeys,r)}}),e.loadingRetryTimes[r]=(e.loadingRetryTimes[r]||0)+1,e.loadingRetryTimes[r]>=un){var w=e.state.loadedKeys;(0,Q.ZP)(!1,"Retry for `loadData` many times but still failed. No more retry."),e.setUncontrolledState({loadedKeys:_(w,r)}),h()}p(i)}),{loadingKeys:_(K,r)}})});return f.catch(function(){}),f}}),m()(P()(e),"onNodeMouseEnter",function(n,o){var r=e.props.onMouseEnter;r==null||r({event:n,node:o})}),m()(P()(e),"onNodeMouseLeave",function(n,o){var r=e.props.onMouseLeave;r==null||r({event:n,node:o})}),m()(P()(e),"onNodeContextMenu",function(n,o){var r=e.props.onRightClick;r&&(n.preventDefault(),r({event:n,node:o}))}),m()(P()(e),"onFocus",function(){var n=e.props.onFocus;e.setState({focused:!0});for(var o=arguments.length,r=new Array(o),l=0;l<o;l++)r[l]=arguments[l];n==null||n.apply(void 0,r)}),m()(P()(e),"onBlur",function(){var n=e.props.onBlur;e.setState({focused:!1}),e.onActiveChange(null);for(var o=arguments.length,r=new Array(o),l=0;l<o;l++)r[l]=arguments[l];n==null||n.apply(void 0,r)}),m()(P()(e),"getTreeNodeRequiredProps",function(){var n=e.state,o=n.expandedKeys,r=n.selectedKeys,l=n.loadedKeys,c=n.loadingKeys,f=n.checkedKeys,h=n.halfCheckedKeys,p=n.dragOverNodeKey,x=n.dropPosition,s=n.keyEntities;return{expandedKeys:o||[],selectedKeys:r||[],loadedKeys:l||[],loadingKeys:c||[],checkedKeys:f||[],halfCheckedKeys:h||[],dragOverNodeKey:p,dropPosition:x,keyEntities:s}}),m()(P()(e),"setExpandedKeys",function(n){var o=e.state,r=o.treeData,l=o.fieldNames,c=Fe(r,n,l);e.setUncontrolledState({expandedKeys:n,flattenNodes:c},!0)}),m()(P()(e),"onNodeExpand",function(n,o){var r=e.state.expandedKeys,l=e.state,c=l.listChanging,f=l.fieldNames,h=e.props,p=h.onExpand,x=h.loadData,s=o.expanded,y=o[f.key];if(!c){var C=r.includes(y),K=!s;if((0,Q.ZP)(s&&C||!s&&!C,"Expand state not sync with index check"),r=K?_(r,y):X(r,y),e.setExpandedKeys(r),p==null||p(r,{node:o,expanded:K,nativeEvent:n.nativeEvent}),K&&x){var N=e.onNodeLoad(o);N&&N.then(function(){var E=Fe(e.state.treeData,r,f);e.setUncontrolledState({flattenNodes:E})}).catch(function(){var E=e.state.expandedKeys,D=X(E,y);e.setExpandedKeys(D)})}}}),m()(P()(e),"onListChangeStart",function(){e.setUncontrolledState({listChanging:!0})}),m()(P()(e),"onListChangeEnd",function(){setTimeout(function(){e.setUncontrolledState({listChanging:!1})})}),m()(P()(e),"onActiveChange",function(n){var o=e.state.activeKey,r=e.props,l=r.onActiveChange,c=r.itemScrollOffset,f=c===void 0?0:c;o!==n&&(e.setState({activeKey:n}),n!==null&&e.scrollTo({key:n,offset:f}),l==null||l(n))}),m()(P()(e),"getActiveItem",function(){var n=e.state,o=n.activeKey,r=n.flattenNodes;return o===null?null:r.find(function(l){var c=l.key;return c===o})||null}),m()(P()(e),"offsetActiveKey",function(n){var o=e.state,r=o.flattenNodes,l=o.activeKey,c=r.findIndex(function(p){var x=p.key;return x===l});c===-1&&n<0&&(c=r.length),c=(c+n+r.length)%r.length;var f=r[c];if(f){var h=f.key;e.onActiveChange(h)}else e.onActiveChange(null)}),m()(P()(e),"onKeyDown",function(n){var o=e.state,r=o.activeKey,l=o.expandedKeys,c=o.checkedKeys,f=o.fieldNames,h=e.props,p=h.onKeyDown,x=h.checkable,s=h.selectable;switch(n.which){case ue.Z.UP:{e.offsetActiveKey(-1),n.preventDefault();break}case ue.Z.DOWN:{e.offsetActiveKey(1),n.preventDefault();break}}var y=e.getActiveItem();if(y&&y.data){var C=e.getTreeNodeRequiredProps(),K=y.data.isLeaf===!1||!!(y.data[f.children]||[]).length,N=W(M()(M()({},Ne(r,C)),{},{data:y.data,active:!0}));switch(n.which){case ue.Z.LEFT:{K&&l.includes(r)?e.onNodeExpand({},N):y.parent&&e.onActiveChange(y.parent.key),n.preventDefault();break}case ue.Z.RIGHT:{K&&!l.includes(r)?e.onNodeExpand({},N):y.children&&y.children.length&&e.onActiveChange(y.children[0].key),n.preventDefault();break}case ue.Z.ENTER:case ue.Z.SPACE:{x&&!N.disabled&&N.checkable!==!1&&!N.disableCheckbox?e.onNodeCheck({},N,!c.includes(r)):!x&&s&&!N.disabled&&N.selectable!==!1&&e.onNodeSelect({},N);break}}}p==null||p(n)}),m()(P()(e),"setUncontrolledState",function(n){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null;if(!e.destroyed){var l=!1,c=!0,f={};Object.keys(n).forEach(function(h){if(e.props.hasOwnProperty(h)){c=!1;return}l=!0,f[h]=n[h]}),l&&(!o||c)&&e.setState(M()(M()({},f),r))}}),m()(P()(e),"scrollTo",function(n){e.listRef.current.scrollTo(n)}),e}return Kt()(v,[{key:"componentDidMount",value:function(){this.destroyed=!1,this.onUpdated()}},{key:"componentDidUpdate",value:function(){this.onUpdated()}},{key:"onUpdated",value:function(){var d=this.props,u=d.activeKey,g=d.itemScrollOffset,n=g===void 0?0:g;u!==void 0&&u!==this.state.activeKey&&(this.setState({activeKey:u}),u!==null&&this.scrollTo({key:u,offset:n}))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("dragend",this.onWindowDragEnd),this.destroyed=!0}},{key:"resetDragState",value:function(){this.setState({dragOverNodeKey:null,dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1})}},{key:"render",value:function(){var d=this.state,u=d.focused,g=d.flattenNodes,n=d.keyEntities,o=d.draggingNodeKey,r=d.activeKey,l=d.dropLevelOffset,c=d.dropContainerKey,f=d.dropTargetKey,h=d.dropPosition,p=d.dragOverNodeKey,x=d.indent,s=this.props,y=s.prefixCls,C=s.className,K=s.style,N=s.showLine,E=s.focusable,D=s.tabIndex,O=D===void 0?0:D,i=s.selectable,w=s.showIcon,R=s.icon,Z=s.switcherIcon,A=s.draggable,j=s.checkable,$=s.checkStrictly,I=s.disabled,U=s.motion,B=s.loadData,J=s.filterTreeNode,ke=s.height,se=s.itemHeight,ve=s.scrollWidth,he=s.virtual,ge=s.titleRender,ce=s.dropIndicatorRender,G=s.onContextMenu,ye=s.onScroll,Ce=s.direction,pe=s.rootClassName,Ee=s.rootStyle,ee=(0,Xe.Z)(this.props,{aria:!0,data:!0}),te;A&&(We()(A)==="object"?te=A:typeof A=="function"?te={nodeDraggable:A}:te={});var Ke={prefixCls:y,selectable:i,showIcon:w,icon:R,switcherIcon:Z,draggable:te,draggingNodeKey:o,checkable:j,checkStrictly:$,disabled:I,keyEntities:n,dropLevelOffset:l,dropContainerKey:c,dropTargetKey:f,dropPosition:h,dragOverNodeKey:p,indent:x,direction:Ce,dropIndicatorRender:ce,loadData:B,filterTreeNode:J,titleRender:ge,onNodeClick:this.onNodeClick,onNodeDoubleClick:this.onNodeDoubleClick,onNodeExpand:this.onNodeExpand,onNodeSelect:this.onNodeSelect,onNodeCheck:this.onNodeCheck,onNodeLoad:this.onNodeLoad,onNodeMouseEnter:this.onNodeMouseEnter,onNodeMouseLeave:this.onNodeMouseLeave,onNodeContextMenu:this.onNodeContextMenu,onNodeDragStart:this.onNodeDragStart,onNodeDragEnter:this.onNodeDragEnter,onNodeDragOver:this.onNodeDragOver,onNodeDragLeave:this.onNodeDragLeave,onNodeDragEnd:this.onNodeDragEnd,onNodeDrop:this.onNodeDrop};return(0,L.jsx)(Ze.Provider,{value:Ke,children:(0,L.jsx)("div",{className:Y()(y,C,pe,m()(m()(m()({},"".concat(y,"-show-line"),N),"".concat(y,"-focused"),u),"".concat(y,"-active-focused"),r!==null)),style:Ee,children:(0,L.jsx)(tn,M()(M()({ref:this.listRef,prefixCls:y,style:K,data:g,disabled:I,selectable:i,checkable:!!j,motion:U,dragging:o!==null,height:ke,itemHeight:se,virtual:he,focusable:E,focused:u,tabIndex:O,activeItem:this.getActiveItem(),onFocus:this.onFocus,onBlur:this.onBlur,onKeyDown:this.onKeyDown,onActiveChange:this.onActiveChange,onListChangeStart:this.onListChangeStart,onListChangeEnd:this.onListChangeEnd,onContextMenu:G,onScroll:ye,scrollWidth:ve},this.getTreeNodeRequiredProps()),ee))})})}}],[{key:"getDerivedStateFromProps",value:function(d,u){var g=u.prevProps,n={prevProps:d};function o(O){return!g&&d.hasOwnProperty(O)||g&&g[O]!==d[O]}var r,l=u.fieldNames;if(o("fieldNames")&&(l=Me(d.fieldNames),n.fieldNames=l),o("treeData")?r=d.treeData:o("children")&&((0,Q.ZP)(!1,"`children` of Tree is deprecated. Please use `treeData` instead."),r=Zt(d.children)),r){n.treeData=r;var c=Ut(r,{fieldNames:l});n.keyEntities=M()(m()({},le,at),c.keyEntities)}var f=n.keyEntities||u.keyEntities;if(o("expandedKeys")||g&&o("autoExpandParent"))n.expandedKeys=d.autoExpandParent||!g&&d.defaultExpandParent?st(d.expandedKeys,f):d.expandedKeys;else if(!g&&d.defaultExpandAll){var h=M()({},f);delete h[le];var p=[];Object.keys(h).forEach(function(O){var i=h[O];i.children&&i.children.length&&p.push(i.key)}),n.expandedKeys=p}else!g&&d.defaultExpandedKeys&&(n.expandedKeys=d.autoExpandParent||d.defaultExpandParent?st(d.defaultExpandedKeys,f):d.defaultExpandedKeys);if(n.expandedKeys||delete n.expandedKeys,r||n.expandedKeys){var x=Fe(r||u.treeData,n.expandedKeys||u.expandedKeys,l);n.flattenNodes=x}if(d.selectable&&(o("selectedKeys")?n.selectedKeys=lt(d.selectedKeys,d):!g&&d.defaultSelectedKeys&&(n.selectedKeys=lt(d.defaultSelectedKeys,d))),d.checkable){var s;if(o("checkedKeys")?s=Ge(d.checkedKeys)||{}:!g&&d.defaultCheckedKeys?s=Ge(d.defaultCheckedKeys)||{}:r&&(s=Ge(d.checkedKeys)||{checkedKeys:u.checkedKeys,halfCheckedKeys:u.halfCheckedKeys}),s){var y=s,C=y.checkedKeys,K=C===void 0?[]:C,N=y.halfCheckedKeys,E=N===void 0?[]:N;if(!d.checkStrictly){var D=He(K,!0,f);K=D.checkedKeys,E=D.halfCheckedKeys}n.checkedKeys=K,n.halfCheckedKeys=E}}return o("loadedKeys")&&(n.loadedKeys=d.loadedKeys),n}}]),v}(S.Component);m()(Ve,"defaultProps",{prefixCls:"rc-tree",showLine:!1,showIcon:!0,selectable:!0,multiple:!1,checkable:!1,disabled:!1,checkStrictly:!1,draggable:!1,defaultExpandParent:!0,autoExpandParent:!1,defaultExpandAll:!1,defaultExpandedKeys:[],defaultCheckedKeys:[],defaultSelectedKeys:[],dropIndicatorRender:Pt,allowDrop:function(){return!0},expandAction:!1}),m()(Ve,"TreeNode",Le);var vn=Ve,hn=vn}}]);
