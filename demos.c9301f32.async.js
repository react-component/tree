"use strict";(self.webpackChunkrc_tree=self.webpackChunkrc_tree||[]).push([[433],{55927:function(z,j,e){e.r(j);var I=e(37205),K=e.n(I),x=e(82100),D=e.n(x),T=e(29186),C=e.n(T),O=e(13720),s=e.n(O),A=e(80619),U=e.n(A),L=e(47074),d=e.n(L),c=e(85573),o=e.n(c),p=e(21739),h=e(40677),a=e(81813),b=e(71647),E=e(27174),v=`
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
`,u={motionName:"node-motion",motionAppear:!1,onAppearStart:function(n){return console.log("Start Motion:",n),{height:0}},onAppearActive:function(n){return{height:n.scrollHeight}},onLeaveStart:function(n){return{height:n.offsetHeight}},onLeaveActive:function(){return{height:0}}},m=function(P){U()(r,P);var n=d()(r);function r(){var _;D()(this,r);for(var i=arguments.length,f=new Array(i),l=0;l<i;l++)f[l]=arguments[l];return _=n.call.apply(n,[this].concat(f)),o()(s()(_),"state",{gData:h.gData,autoExpandParent:!0,expandedKeys:["0-0-key","0-0-0-key","0-0-0-0-key"]}),o()(s()(_),"onDragEnter",function(t){var M=t.expandedKeys;console.log("enter",M),_.setState({expandedKeys:M})}),o()(s()(_),"onDrop",function(t){console.log("drop",t);var M=t.node.props.eventKey,y=t.dragNode.props.eventKey,W=t.node.props.pos.split("-"),H=t.dropPosition-Number(W[W.length-1]),k=function g(N,B,$){N.forEach(function(F,G,X){if(F.key===B){$(F,G,X);return}F.children&&g(F.children,B,$)})},R=K()(_.state.gData),S;if(k(R,y,function(g,N,B){B.splice(N,1),S=g}),!t.dropToGap)k(R,M,function(g){g.children=g.children||[],g.children.push(S)});else if((t.node.props.children||[]).length>0&&t.node.props.expanded&&H===1)k(R,M,function(g){g.children=g.children||[],g.children.unshift(S)});else{var V,Y;k(R,M,function(g,N,B){V=B,Y=N}),H===-1?V.splice(Y,0,S):V.splice(Y+1,0,S)}_.setState({gData:R})}),o()(s()(_),"onExpand",function(t){console.log("onExpand",t),_.setState({expandedKeys:t,autoExpandParent:!1})}),_}return C()(r,[{key:"render",value:function(){var i=this.state.expandedKeys;return(0,E.jsxs)("div",{className:"draggable-demo",children:[(0,E.jsx)("style",{dangerouslySetInnerHTML:{__html:v}}),(0,E.jsx)("h2",{children:"draggable"}),(0,E.jsx)("p",{children:"drag a node into another node"}),(0,E.jsx)(b.default,{expandedKeys:i,onExpand:this.onExpand,autoExpandParent:this.state.autoExpandParent,draggable:!0,onDragStart:this.onDragStart,onDragEnter:this.onDragEnter,onDrop:this.onDrop,treeData:this.state.gData,motion:u})]})}}]),r}(p.Component);j.default=m},60973:function(z,j,e){e.r(j);var I=e(79800),K=e.n(I),x=e(43167),D=e(71647),T=e(21739),C=e(81813),O=e(31224),s=e(27174),A=`
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
`,U=["0","0-2","0-9-2"],L={motionName:"node-motion",motionAppear:!1,onAppearStart:function(){return{height:0}},onAppearActive:function(p){return{height:p.scrollHeight}},onLeaveStart:function(p){return{height:p.offsetHeight}},onLeaveActive:function(){return{height:0}}};function d(){return[{key:"0",title:"node 0",children:[{key:"0-0",title:"node 0-0"},{key:"0-1",title:"node 0-1"},{key:"0-2",title:"node 0-2",children:[{key:"0-2-0",title:"node 0-2-0"},{key:"0-2-1",title:"node 0-2-1"},{key:"0-2-2",title:"node 0-2-2"}]},{key:"0-3",title:"node 0-3"},{key:"0-4",title:"node 0-4"},{key:"0-5",title:"node 0-5"},{key:"0-6",title:"node 0-6"},{key:"0-7",title:"node 0-7"},{key:"0-8",title:"node 0-8"},{key:"0-9",title:"node 0-9",children:[{key:"0-9-0",title:"node 0-9-0"},{key:"0-9-1",title:"node 0-9-1",children:[{key:"0-9-1-0",title:"node 0-9-1-0"},{key:"0-9-1-1",title:"node 0-9-1-1"},{key:"0-9-1-2",title:"node 0-9-1-2"},{key:"0-9-1-3",title:"node 0-9-1-3"},{key:"0-9-1-4",title:"node 0-9-1-4"}]},{key:"0-9-2",title:"node 0-9-2",children:[{key:"0-9-2-0",title:"node 0-9-2-0"},{key:"0-9-2-1",title:"node 0-9-2-1"}]}]}]},{key:"1",title:"node 1",children:[{key:"1-0",title:"node 1-0",children:[{key:"1-0-0",title:"node 1-0-0"},{key:"1-0-1",title:"node 1-0-1",children:[{key:"1-0-1-0",title:"node 1-0-1-0"},{key:"1-0-1-1",title:"node 1-0-1-1"}]},{key:"1-0-2",title:"node 1-0-2"}]}]}]}var c=function(){var p=T.useRef(),h=T.useState(!0),a=K()(h,2),b=a[0],E=a[1];return setTimeout(function(){p.current.scrollTo({key:"0-9-2"})},100),(0,s.jsxs)(x.Provider,{motion:b,children:[(0,s.jsxs)("button",{onClick:function(){E(function(u){return!u})},children:["Motion: ",String(b)]}),(0,s.jsx)(T.StrictMode,{children:(0,s.jsxs)("div",{className:"animation",children:[(0,s.jsx)("h2",{children:"expanded"}),(0,s.jsx)("style",{dangerouslySetInnerHTML:{__html:A}}),(0,s.jsxs)("div",{style:{display:"flex"},children:[(0,s.jsxs)("div",{style:{flex:"1 1 50%"},children:[(0,s.jsx)("h3",{children:"With Virtual"}),(0,s.jsx)(D.default,{ref:p,defaultExpandAll:!0,defaultExpandedKeys:U,motion:L,height:200,itemHeight:20,style:{border:"1px solid #000"},treeData:d()})]}),(0,s.jsxs)("div",{style:{flex:"1 1 50%"},children:[(0,s.jsx)("h3",{children:"Without Virtual"}),(0,s.jsx)(D.default,{defaultExpandAll:!1,defaultExpandedKeys:U,motion:L,style:{border:"1px solid #000"},treeData:d()})]})]})]})})]})};j.default=c},95135:function(z,j,e){e.r(j);var I=e(37205),K=e.n(I),x=e(82100),D=e.n(x),T=e(29186),C=e.n(T),O=e(13720),s=e.n(O),A=e(80619),U=e.n(A),L=e(47074),d=e.n(L),c=e(85573),o=e.n(c),p=e(81813),h=e(21739),a=e(18634),b=e(60667),E=e(71647),v=e(40677),u=e(27174),m=function(P){U()(r,P);var n=d()(r);function r(){var _;D()(this,r);for(var i=arguments.length,f=new Array(i),l=0;l<i;l++)f[l]=arguments[l];return _=n.call.apply(n,[this].concat(f)),o()(s()(_),"state",{expandedKeys:["0-0-0-key"],autoExpandParent:!0,checkedKeys:["0-0-0-key"],checkStrictlyKeys:{checked:["0-0-1-key"],halfChecked:[]},selectedKeys:[],treeData:[]}),o()(s()(_),"onExpand",function(t){console.log("onExpand",t),_.setState({expandedKeys:t,autoExpandParent:!1})}),o()(s()(_),"onCheck",function(t){_.setState({checkedKeys:t})}),o()(s()(_),"onCheckStrictly",function(t){console.log(t);var M={checked:t.checked||t,halfChecked:["0-0-".concat(parseInt(Math.random()*3,10),"-key")]};_.setState({checkStrictlyKeys:M})}),o()(s()(_),"onSelect",function(t,M){console.log("onSelect",t,M),_.setState({selectedKeys:t})}),o()(s()(_),"onRbSelect",function(t,M){var y=t;M.selected&&(y=(0,v.getRadioSelectKeys)(v.gData,t,M.node.props.eventKey)),_.setState({selectedKeys:y})}),o()(s()(_),"onClose",function(){_.setState({visible:!1})}),o()(s()(_),"handleOk",function(){_.setState({visible:!1})}),o()(s()(_),"showModal",function(){_.setState({expandedKeys:["0-0-0-key","0-0-1-key"],checkedKeys:["0-0-0-key"],visible:!0}),setTimeout(function(){_.setState({treeData:K()(v.gData)})},2e3)}),o()(s()(_),"triggerChecked",function(){_.setState({checkedKeys:["0-0-".concat(parseInt(Math.random()*3,10),"-key")]})}),_}return C()(r,[{key:"render",value:function(){var i=function f(l){return l.map(function(t){return t.children?(0,u.jsx)(E.TreeNode,{title:t.title,disableCheckbox:t.key==="0-0-0-key",children:f(t.children)},t.key):(0,u.jsx)(E.TreeNode,{title:t.title},t.key)})};return(0,u.jsxs)("div",{style:{padding:"0 20px"},children:[(0,u.jsx)("h2",{children:"dialog"}),(0,u.jsx)("button",{type:"button",className:"btn btn-primary",onClick:this.showModal,children:"show dialog"}),(0,u.jsx)(b.default,{title:"TestDemo",visible:this.state.visible,onOk:this.handleOk,onClose:this.onClose,children:this.state.treeData.length?(0,u.jsx)(E.default,{checkable:!0,className:"dialog-tree",onExpand:this.onExpand,expandedKeys:this.state.expandedKeys,autoExpandParent:this.state.autoExpandParent,onCheck:this.onCheck,checkedKeys:this.state.checkedKeys,children:i(this.state.treeData)}):"loading..."}),(0,u.jsx)("h2",{children:"controlled"}),(0,u.jsx)(E.default,{checkable:!0,onExpand:this.onExpand,expandedKeys:this.state.expandedKeys,autoExpandParent:this.state.autoExpandParent,onCheck:this.onCheck,checkedKeys:this.state.checkedKeys,onSelect:this.onSelect,selectedKeys:this.state.selectedKeys,children:i(v.gData)}),(0,u.jsx)("button",{type:"button",onClick:this.triggerChecked,children:"trigger checked"}),(0,u.jsx)("h2",{children:"checkStrictly"}),(0,u.jsx)(E.default,{checkable:!0,multiple:this.props.multiple,defaultExpandAll:!0,onExpand:this.onExpand,expandedKeys:this.state.expandedKeys,onCheck:this.onCheckStrictly,checkedKeys:this.state.checkStrictlyKeys,checkStrictly:!0,children:i(v.gData)}),(0,u.jsx)("h2",{children:"radio's behavior select (in the same level)"}),(0,u.jsx)(E.default,{multiple:!0,defaultExpandAll:!0,onSelect:this.onRbSelect,selectedKeys:(0,v.getRadioSelectKeys)(v.gData,this.state.selectedKeys),children:i(v.gData)})]})}}]),r}(h.Component);o()(m,"defaultProps",{multiple:!0}),j.default=m},6672:function(z,j,e){e.r(j);var I=e(82100),K=e.n(I),x=e(29186),D=e.n(x),T=e(13720),C=e.n(T),O=e(80619),s=e.n(O),A=e(47074),U=e.n(A),L=e(85573),d=e.n(L),c=e(21739),o=e(81813),p=e(84824),h=e(71647),a=e(27174),b=[{key:"0-0",title:"parent 1",children:[{key:"0-0-0",title:"parent 1-1",children:[{key:"0-0-0-0",title:"parent 1-1-0"}]},{key:"0-0-1",title:"parent 1-2",children:[{key:"0-0-1-0",title:"parent 1-2-0",disableCheckbox:!0},{key:"0-0-1-1",title:"parent 1-2-1"},{key:"0-0-1-2",title:"parent 1-2-2"},{key:"0-0-1-3",title:"parent 1-2-3"},{key:"0-0-1-4",title:"parent 1-2-4"},{key:"0-0-1-5",title:"parent 1-2-5"},{key:"0-0-1-6",title:"parent 1-2-6"},{key:"0-0-1-7",title:"parent 1-2-7"},{key:"0-0-1-8",title:"parent 1-2-8"},{key:"0-0-1-9",title:"parent 1-2-9"},{key:1128,title:1128}]}]}],E=function(v){s()(m,v);var u=U()(m);function m(P){var n;K()(this,m),n=u.call(this,P),d()(C()(n),"onExpand",function(_){console.log("onExpand",_)}),d()(C()(n),"onSelect",function(_,i){console.log("selected",_,i),n.selKey=i.node.props.eventKey}),d()(C()(n),"onCheck",function(_,i){console.log("onCheck",_,i)}),d()(C()(n),"onEdit",function(){setTimeout(function(){console.log("current key: ",n.selKey)},0)}),d()(C()(n),"onDel",function(_){window.confirm("sure to delete?")&&_.stopPropagation()}),d()(C()(n),"setTreeRef",function(_){n.tree=_});var r=P.keys;return n.state={defaultExpandedKeys:r,defaultSelectedKeys:r,defaultCheckedKeys:r},n.treeRef=c.createRef(),n}return D()(m,[{key:"render",value:function(){var n=this,r=(0,a.jsxs)("span",{className:"cus-label",children:[(0,a.jsx)("span",{children:"operations: "}),(0,a.jsx)("span",{style:{color:"blue"},onClick:this.onEdit,children:"Edit"}),"\xA0",(0,a.jsxs)("label",{onClick:function(i){return i.stopPropagation()},children:[(0,a.jsx)("input",{type:"checkbox"})," checked"]}),"\xA0",(0,a.jsx)("span",{style:{color:"#EB0000"},onClick:this.onDel,children:"Delete"})]});return(0,a.jsxs)("div",{style:{margin:"0 20px"},children:[(0,a.jsx)("h2",{children:"simple"}),(0,a.jsx)("input",{"aria-label":"good"}),(0,a.jsx)(h.default,{ref:this.setTreeRef,className:"myCls",showLine:!0,checkable:!0,defaultExpandAll:!0,defaultExpandedKeys:this.state.defaultExpandedKeys,onExpand:this.onExpand,defaultSelectedKeys:this.state.defaultSelectedKeys,defaultCheckedKeys:this.state.defaultCheckedKeys,onSelect:this.onSelect,onCheck:this.onCheck,onActiveChange:function(i){return console.log("Active:",i)},children:(0,a.jsxs)(h.TreeNode,{title:"parent 1",children:[(0,a.jsxs)(h.TreeNode,{title:r,children:[(0,a.jsx)(h.TreeNode,{title:"leaf",style:{background:"rgba(255, 0, 0, 0.1)"}},"0-0-0-0"),(0,a.jsx)(h.TreeNode,{title:"leaf"},"0-0-0-1")]},"0-0-0"),(0,a.jsxs)(h.TreeNode,{title:"parent 1-1",children:[(0,a.jsx)(h.TreeNode,{title:"parent 1-1-0",disableCheckbox:!0},"0-0-1-0"),(0,a.jsx)(h.TreeNode,{title:"parent 1-1-1"},"0-0-1-1")]},"0-0-1"),(0,a.jsxs)(h.TreeNode,{title:"parent 1-2",disabled:!0,children:[(0,a.jsx)(h.TreeNode,{title:"parent 1-2-0",checkable:!1},"0-0-2-0"),(0,a.jsx)(h.TreeNode,{title:"parent 1-2-1"},"0-0-2-1")]},"0-0-2")]},"0-0")}),(0,a.jsx)("h2",{children:"Check on Click TreeNode"}),(0,a.jsx)(h.default,{className:"myCls",showLine:!0,checkable:!0,selectable:!1,defaultExpandAll:!0,onExpand:this.onExpand,defaultSelectedKeys:this.state.defaultSelectedKeys,defaultCheckedKeys:this.state.defaultCheckedKeys,onSelect:this.onSelect,onCheck:this.onCheck,treeData:b}),(0,a.jsx)("h2",{children:"Select"}),(0,a.jsx)(h.default,{ref:this.treeRef,className:"myCls",defaultExpandAll:!0,treeData:b,onSelect:this.onSelect,height:150}),(0,a.jsx)("button",{type:"button",onClick:function(){setTimeout(function(){console.log("scroll!!!"),n.treeRef.current.scrollTo({key:"0-0-1-9"})},100)},children:"Scroll Last"})]})}}]),m}(c.Component);d()(E,"defaultProps",{keys:["0-0-0-0"]}),j.default=E},88418:function(z,j,e){e.r(j);var I=e(82100),K=e.n(I),x=e(29186),D=e.n(x),T=e(13720),C=e.n(T),O=e(80619),s=e.n(O),A=e(47074),U=e.n(A),L=e(85573),d=e.n(L),c=e(21739),o=e(79666),p=e(81813),h=e(71647),a=e(27174),b=function(E){s()(u,E);var v=U()(u);function u(){var m;K()(this,u);for(var P=arguments.length,n=new Array(P),r=0;r<P;r++)n[r]=arguments[r];return m=v.call.apply(v,[this].concat(n)),d()(C()(m),"state",{gData:[],expandedKeys:[],checkedKeys:[],checkedKeys1:[],selectedKeys:[]}),d()(C()(m),"onCheck",function(_){m.setState({checkedKeys:_})}),d()(C()(m),"onCheckStrictly",function(_){console.log(_),m.setState({checkedKeys1:_})}),d()(C()(m),"onSelect",function(_,i){console.log("onSelect",_,i),m.setState({selectedKeys:_})}),d()(C()(m),"onGen",function(_){m.setState({gData:_,expandedKeys:["0-0-0-key"],checkedKeys:["0-0-0-key"],checkedKeys1:["0-0-0-key"],selectedKeys:[]})}),m}return D()(u,[{key:"componentDidUpdate",value:function(P,n){n.gData===this.state.gData?this.notReRender=!0:this.notReRender=!1}},{key:"render",value:function(){var P=function r(_){return _.map(function(i){return i.children?(0,a.jsx)(h.TreeNode,{title:i.title,children:r(i.children)},i.key):(0,a.jsx)(h.TreeNode,{title:i.title},i.key)})},n;return this.treeNodes&&this.notReRender?n=this.treeNodes:(n=P(this.state.gData),this.treeNodes=n),(0,a.jsxs)("div",{style:{padding:"0 20px"},children:[(0,a.jsx)(o.default,{onGen:this.onGen}),(0,a.jsxs)("div",{style:{border:"1px solid red",width:700,padding:10},children:[(0,a.jsx)("h5",{style:{margin:10},children:"\u5927\u6570\u636E\u91CF\u4E0B\u4F18\u5316\u5EFA\u8BAE\uFF1A"}),"\u521D\u59CB\u5C55\u5F00\u7684\u8282\u70B9\u5C11\uFF0C\u5411dom\u4E2D\u63D2\u5165\u8282\u70B9\u5C31\u4F1A\u5C11\uFF0C\u901F\u5EA6\u66F4\u5FEB\u3002 ",(0,a.jsx)("br",{}),"treeNodes \u603B\u6570\u636E\u91CF\u5C3D\u91CF\u5C11\u53D8\u5316\uFF0C\u7F13\u5B58\u5E76\u590D\u7528\u8BA1\u7B97\u51FA\u7684 treeNodes\uFF0C\u53EF\u5728 componentWillUpdate \u7B49\u65F6\u673A\u505A\u5224\u65AD\u3002 ",(0,a.jsx)("br",{})]}),this.state.gData.length?(0,a.jsxs)("div",{style:{display:"flex"},children:[(0,a.jsxs)("div",{style:{marginRight:20},children:[(0,a.jsx)("h3",{children:"normal check"}),(0,a.jsx)(h.default,{checkable:!0,multiple:this.props.multiple,defaultExpandedKeys:this.state.expandedKeys,onCheck:this.onCheck,checkedKeys:this.state.checkedKeys,onSelect:this.onSelect,selectedKeys:this.state.selectedKeys,children:n})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{children:"checkStrictly"}),(0,a.jsx)(h.default,{checkable:!0,checkStrictly:!0,multiple:this.props.multiple,defaultExpandedKeys:this.state.expandedKeys,onCheck:this.onCheckStrictly,checkedKeys:this.state.checkedKeys1,onSelect:this.onSelect,selectedKeys:this.state.selectedKeys,children:n})]})]}):null]})}}]),u}(c.Component);j.default=b},70629:function(z,j,e){e.r(j);var I=e(82100),K=e.n(I),x=e(29186),D=e.n(x),T=e(13720),C=e.n(T),O=e(80619),s=e.n(O),A=e(47074),U=e.n(A),L=e(85573),d=e.n(L),c=e(21739),o=e(67820),p=e(47135),h=e(54320),a=e(81813),b=e(71647),E=e(27174);function v(m,P){for(var n=P;n;){if(n===m)return!0;n=n.parentNode}return!1}var u=function(m){s()(n,m);var P=U()(n);function n(){var r;K()(this,n);for(var _=arguments.length,i=new Array(_),f=0;f<_;f++)i[f]=arguments[f];return r=P.call.apply(P,[this].concat(i)),d()(C()(r),"state",{selectedKeys:["0-1","0-1-1"]}),d()(C()(r),"onSelect",function(l){r.setState({selectedKeys:l})}),d()(C()(r),"onRightClick",function(l){console.log("right click",l),r.setState({selectedKeys:[l.node.props.eventKey]}),r.renderCm(l)}),d()(C()(r),"onMouseEnter",function(l){console.log("enter",l),r.renderCm(l)}),d()(C()(r),"onMouseLeave",function(l){console.log("leave",l)}),r}return D()(n,[{key:"componentDidMount",value:function(){this.getContainer(),console.log(v(o.findDOMNode(this),this.cmContainer))}},{key:"componentWillUnmount",value:function(){this.cmContainer&&(o.unmountComponentAtNode(this.cmContainer),document.body.removeChild(this.cmContainer),this.cmContainer=null)}},{key:"getContainer",value:function(){return this.cmContainer||(this.cmContainer=document.createElement("div"),document.body.appendChild(this.cmContainer)),this.cmContainer}},{key:"renderCm",value:function(_){this.toolTip&&(o.unmountComponentAtNode(this.cmContainer),this.toolTip=null),this.toolTip=(0,E.jsx)(p.default,{trigger:"click",placement:"bottomRight",prefixCls:"rc-tree-contextmenu",defaultVisible:!0,overlay:(0,E.jsx)("h4",{children:_.node.props.title}),children:(0,E.jsx)("span",{})});var i=this.getContainer();Object.assign(this.cmContainer.style,{position:"absolute",left:"".concat(_.event.pageX,"px"),top:"".concat(_.event.pageY,"px")}),o.render(this.toolTip,i)}},{key:"render",value:function(){return(0,E.jsxs)("div",{children:[(0,E.jsx)("h2",{children:"right click contextmenu"}),(0,E.jsx)(b.default,{onRightClick:this.onRightClick,onSelect:this.onSelect,selectedKeys:this.state.selectedKeys,multiple:!0,defaultExpandAll:!0,showLine:!0,showIcon:!1,children:(0,E.jsxs)(b.TreeNode,{title:"parent 1",children:[(0,E.jsxs)(b.TreeNode,{title:"parent 1-0",children:[(0,E.jsx)(b.TreeNode,{title:"leaf0",isLeaf:!0},"l0"),(0,E.jsx)(b.TreeNode,{title:"leaf1",isLeaf:!0},"l1"),(0,E.jsx)(b.TreeNode,{title:"leaf2",isLeaf:!0},"l2")]},"0-1-1"),(0,E.jsx)(b.TreeNode,{title:"parent 1-1",children:(0,E.jsx)(b.TreeNode,{title:"leaf",isLeaf:!0},"l11")},"1-1")]},"0-1")}),(0,E.jsx)("h2",{children:"hover popup contextmenu"}),(0,E.jsx)(b.default,{onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,onSelect:this.onSelect,multiple:!0,defaultExpandAll:!0,showLine:!0,children:(0,E.jsxs)(b.TreeNode,{title:"parent 1",children:[(0,E.jsxs)(b.TreeNode,{title:"parent 1-0",children:[(0,E.jsx)(b.TreeNode,{title:"leaf",isLeaf:!0},"100"),(0,E.jsx)(b.TreeNode,{title:"leaf"},"101")]},"0-1-1"),(0,E.jsx)(b.TreeNode,{title:"parent 1-1",children:(0,E.jsx)(b.TreeNode,{title:"leaf"},"110")},"11")]},"0-1")})]})}}]),n}(c.Component);j.default=u},34755:function(z,j,e){e.r(j);var I=e(82100),K=e.n(I),x=e(29186),D=e.n(x),T=e(80619),C=e.n(T),O=e(47074),s=e.n(O),A=e(85573),U=e.n(A),L=e(82242),d=e.n(L),c=e(21739),o=e(81813),p=e(71647),h=e(27174),a="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z",b=function(u){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},P=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return(0,h.jsx)("i",{style:m,children:(0,h.jsx)("svg",{viewBox:"0 0 1024 1024",width:"1em",height:"1em",fill:"currentColor",style:d()({verticalAlign:"-.125em"},P),children:(0,h.jsx)("path",{d:u})})})},E=function(v){C()(m,v);var u=s()(m);function m(P){var n;K()(this,m),n=u.call(this,P);var r=P.keys;return n.state={defaultExpandedKeys:r,defaultSelectedKeys:r,defaultCheckedKeys:r},n}return D()(m,[{key:"render",value:function(){var n=function(i){var f;return(f=i.data.key)!==null&&f!==void 0&&f.startsWith("0-0-3")?!1:i.isLeaf?b(a,{cursor:"pointer",backgroundColor:"white"},{transform:"rotate(270deg)"}):b(a,{cursor:"pointer",backgroundColor:"white"},{transform:"rotate(".concat(i.expanded?90:0,"deg)")})},r="myCls".concat(this.state.useIcon&&" customIcon"||"");return(0,h.jsxs)("div",{id:"demo",style:{margin:"0 20px"},children:[(0,h.jsx)("h2",{children:"custom switch icon"}),(0,h.jsx)(p.default,{className:r,showLine:!0,checkable:!0,defaultExpandAll:!0,defaultExpandedKeys:this.state.defaultExpandedKeys,defaultSelectedKeys:this.state.defaultSelectedKeys,defaultCheckedKeys:this.state.defaultCheckedKeys,switcherIcon:n,children:(0,h.jsxs)(p.TreeNode,{title:"parent 1",children:[(0,h.jsxs)(p.TreeNode,{title:"leaf",children:[(0,h.jsx)(p.TreeNode,{title:"leaf"},"0-0-0-0"),(0,h.jsx)(p.TreeNode,{title:"leaf"},"0-0-0-1")]},"0-0-0"),(0,h.jsxs)(p.TreeNode,{title:"parent 1-1",children:[(0,h.jsx)(p.TreeNode,{title:"parent 1-1-0",disableCheckbox:!0},"0-0-1-0"),(0,h.jsx)(p.TreeNode,{title:"parent 1-1-1"},"0-0-1-1")]},"0-0-1"),(0,h.jsxs)(p.TreeNode,{title:"parent 1-2",disabled:!0,children:[(0,h.jsx)(p.TreeNode,{title:"parent 1-2-0",disabled:!0},"0-0-2-0"),(0,h.jsx)(p.TreeNode,{title:"parent 1-2-1"},"0-0-2-1")]},"0-0-2"),(0,h.jsxs)(p.TreeNode,{title:"parent 1-3",children:[(0,h.jsx)(p.TreeNode,{title:"parent 1-3-0"},"0-0-3-0"),(0,h.jsx)(p.TreeNode,{title:"parent 1-3-1"},"0-0-3-1")]},"0-0-3")]},"0-0")})]})}}]),m}(c.Component);U()(E,"defaultProps",{keys:["0-0-0-0"]}),j.default=E},76193:function(z,j,e){e.r(j);var I=e(37205),K=e.n(I),x=e(82100),D=e.n(x),T=e(29186),C=e.n(T),O=e(13720),s=e.n(O),A=e(80619),U=e.n(A),L=e(47074),d=e.n(L),c=e(85573),o=e.n(c),p=e(21739),h=e(40677),a=e(37360),b=e(81813),E=e(71647),v=e(27174);function u(P){var n=P.dropNode,r=P.dropPosition;return!(!n.children&&r===0)}var m=function(P){U()(r,P);var n=d()(r);function r(){var _;D()(this,r);for(var i=arguments.length,f=new Array(i),l=0;l<i;l++)f[l]=arguments[l];return _=n.call.apply(n,[this].concat(f)),o()(s()(_),"state",{gData:h.gData,autoExpandParent:!0,expandedKeys:["0-0-key","0-0-0-key","0-0-0-0-key"]}),o()(s()(_),"onDragStart",function(t){console.log("start",t)}),o()(s()(_),"onDragEnter",function(){console.log("enter")}),o()(s()(_),"onDrop",function(t){console.log("drop",t);var M=t.node.key,y=t.dragNode.key,W=t.node.pos.split("-"),H=t.dropPosition-Number(W[W.length-1]),k=function g(N,B,$){N.forEach(function(F,G,X){if(F.key===B){$(F,G,X);return}F.children&&g(F.children,B,$)})},R=K()(_.state.gData),S;if(k(R,y,function(g,N,B){B.splice(N,1),S=g}),H===0)k(R,M,function(g){g.children=g.children||[],g.children.unshift(S)});else{var V,Y;k(R,M,function(g,N,B){V=B,Y=N}),H===-1?V.splice(Y,0,S):V.splice(Y+1,0,S)}_.setState({gData:R})}),o()(s()(_),"onExpand",function(t){console.log("onExpand",t),_.setState({expandedKeys:t,autoExpandParent:!1})}),_}return C()(r,[{key:"render",value:function(){return(0,v.jsxs)("div",{className:"draggable-demo",children:[(0,v.jsx)("h2",{children:"draggable with allow drop"}),(0,v.jsx)("p",{children:"node can not be dropped inside a leaf node"}),(0,v.jsx)("div",{className:"draggable-container",children:(0,v.jsx)(E.default,{allowDrop:u,expandedKeys:this.state.expandedKeys,onExpand:this.onExpand,autoExpandParent:this.state.autoExpandParent,draggable:!0,onDragStart:this.onDragStart,onDrop:this.onDrop,treeData:this.state.gData})})]})}}]),r}(p.Component);j.default=m},2869:function(z,j,e){e.r(j);var I=e(37205),K=e.n(I),x=e(82100),D=e.n(x),T=e(29186),C=e.n(T),O=e(13720),s=e.n(O),A=e(80619),U=e.n(A),L=e(47074),d=e.n(L),c=e(85573),o=e.n(c),p=e(21739),h=e(81813),a=e(71647),b=e(37360),E=e(40677),v=e(27174),u=(0,E.generateData)(2,2,2),m=function(P){U()(r,P);var n=d()(r);function r(){var _;D()(this,r);for(var i=arguments.length,f=new Array(i),l=0;l<i;l++)f[l]=arguments[l];return _=n.call.apply(n,[this].concat(f)),o()(s()(_),"state",{gData:u,autoExpandParent:!0,expandedKeys:["0-0-key","0-0-0-key","0-0-0-0-key","0-0-0-1-key","0-0-1-key","0-0-1-0-key","0-0-1-1-key","0-1-key","0-1-0-key","0-1-0-0-key","0-1-0-1-key","0-1-1-key","0-1-1-0-key","0-1-1-1-key"]}),o()(s()(_),"onDragStart",function(t){console.log("start",t)}),o()(s()(_),"onDragEnter",function(){console.log("enter")}),o()(s()(_),"onDrop",function(t){console.log("drop",t);var M=t.node.key,y=t.dragNode.key,W=t.node.pos.split("-"),H=t.dropPosition-Number(W[W.length-1]),k=function g(N,B,$){N.forEach(function(F,G,X){if(F.key===B){$(F,G,X);return}F.children&&g(F.children,B,$)})},R=K()(_.state.gData),S;if(k(R,y,function(g,N,B){B.splice(N,1),S=g}),H===0)k(R,M,function(g){g.children=g.children||[],g.children.unshift(S)});else{var V,Y;k(R,M,function(g,N,B){V=B,Y=N}),H===-1?V.splice(Y,0,S):V.splice(Y+1,0,S)}_.setState({gData:R})}),o()(s()(_),"onExpand",function(t){console.log("onExpand",t),_.setState({expandedKeys:t,autoExpandParent:!1})}),_}return C()(r,[{key:"render",value:function(){return(0,v.jsxs)("div",{className:"draggable-demo",children:[(0,v.jsx)("h2",{children:"draggable"}),(0,v.jsx)("p",{children:"drag a node into another node"}),(0,v.jsxs)("div",{style:{border:"1px solid red"},children:[(0,v.jsx)(a.default,{expandedKeys:this.state.expandedKeys,onExpand:this.onExpand,autoExpandParent:this.state.autoExpandParent,draggable:{icon:"\u2195\uFE0F"},onDragStart:this.onDragStart,onDragEnter:this.onDragEnter,onDrop:this.onDrop,treeData:this.state.gData,height:200,itemHeight:20,virtual:!1}),(0,v.jsx)("div",{draggable:!0,children:"This element is draggable, but it cannot be dragged into tree."})]})]})}}]),r}(p.Component);j.default=m},70990:function(z,j,e){e.r(j);var I=e(82100),K=e.n(I),x=e(29186),D=e.n(x),T=e(34456),C=e.n(T),O=e(13720),s=e.n(O),A=e(80619),U=e.n(A),L=e(47074),d=e.n(L),c=e(85573),o=e.n(c),p=e(21739),h=e(1502),a=e(40677),b=e(99742),E=e(81813),v=e(71647),u=e(27174),m={topLeft:{points:["bl","tl"],overflow:{adjustX:1,adjustY:1},offset:[0,-3],targetOffset:[0,0]},bottomLeft:{points:["tl","bl"],overflow:{adjustX:1,adjustY:1},offset:[0,3],targetOffset:[0,0]}},P=function(r){U()(i,r);var _=d()(i);function i(f){var l;return K()(this,i),l=_.call(this,f),o()(s()(l),"onChange",function(t){console.log("change",t)}),o()(s()(l),"onSelect",function(t){console.log("select ",t)}),o()(s()(l),"onClick",function(t){var M=s()(l),y=M.props,W=y.overlay.props;"visible"in y||l.setState({visible:!1}),W.onClick&&W.onClick(t)}),o()(s()(l),"onVisibleChange",function(t){var M=s()(l),y=M.props;"visible"in y||l.setState({visible:t}),y.onVisibleChange(t)}),o()(s()(l),"getPopupElement",function(){var t=s()(l),M=t.props;return p.cloneElement(M.overlay,{onClick:l.onClick})}),"visible"in f?(l.state={visible:f.visible},C()(l)):(l.state={visible:f.defaultVisible},l)}return D()(i,[{key:"render",value:function(){var l=this.props,t=l.prefixCls,M=l.children,y=l.transitionName,W=l.animation,H=l.align,k=l.placement,R=l.overlayClassName,S=l.overlayStyle,V=l.trigger;return(0,u.jsx)(h.default,{prefixCls:t,ref:"trigger",popupClassName:R,popupStyle:S,builtinPlacements:m,action:V,popupPlacement:k,popupAlign:H,popupTransitionName:y,popupAnimation:W,popupVisible:this.state.visible,popup:this.getPopupElement(),onPopupVisibleChange:this.onVisibleChange,children:M})}}],[{key:"getDerivedStateFromProps",value:function(l){return"visible"in l?{visible:l.visible}:null}}]),i}(p.Component);o()(P,"defaultProps",{prefixCls:"demo-dropdown-tree",trigger:["hover"],overlayClassName:"",overlayStyle:{},defaultVisible:!1,onVisibleChange:function(){},placement:"bottomLeft"});var n=function(r){U()(i,r);var _=d()(i);function i(){var f;K()(this,i);for(var l=arguments.length,t=new Array(l),M=0;M<l;M++)t[M]=arguments[M];return f=_.call.apply(_,[this].concat(t)),o()(s()(f),"state",{visible:!1,inputValue:"",sel:"",expandedKeys:[],autoExpandParent:!0}),o()(s()(f),"onChange",function(y){f.filterKeys=[],f.setState({inputValue:y.target.value})}),o()(s()(f),"onVisibleChange",function(y){f.setState({visible:y})}),o()(s()(f),"onSelect",function(y,W){console.log("selected: ",W),f.setState({visible:!1,sel:W.node.props.title})}),o()(s()(f),"onExpand",function(y){f.filterKeys=void 0,console.log("onExpand",y),f.setState({expandedKeys:y,autoExpandParent:!1})}),o()(s()(f),"filterTreeNode",function(y){return console.log(y),f.filterFn(y.props.eventKey)}),o()(s()(f),"filterFn",function(y){return!!(f.state.inputValue&&y.indexOf(f.state.inputValue)>-1)}),f}return D()(i,[{key:"render",value:function(){var l=this,t=function H(k){return k.map(function(R){return l.filterKeys&&l.filterFn(R.key)&&l.filterKeys.push(R.key),R.children?(0,u.jsx)(v.TreeNode,{title:R.key,children:H(R.children)},R.key):(0,u.jsx)(v.TreeNode,{title:R.key},R.key)})},M=this.state.expandedKeys,y=this.state.autoExpandParent;this.filterKeys&&(M=this.filterKeys,y=!0);var W=(0,u.jsxs)("div",{children:[(0,u.jsx)("input",{placeholder:"\u8BF7\u7B5B\u9009",value:this.state.inputValue,onChange:this.onChange}),(0,u.jsx)(v.default,{onExpand:this.onExpand,expandedKeys:M,autoExpandParent:y,onSelect:this.onSelect,filterTreeNode:this.filterTreeNode,children:t(a.gData)})]});return(0,u.jsxs)("div",{style:{padding:"10px 30px"},children:[(0,u.jsx)("h3",{children:"tree in dropdown"}),(0,u.jsx)(P,{trigger:["click"],onVisibleChange:this.onVisibleChange,visible:this.state.visible,closeOnSelect:!1,overlay:W,animation:"slide-up",children:(0,u.jsx)("div",{className:"demo-dropdown-trigger",children:this.state.sel})})]})}}]),i}(p.Component);j.default=n},52819:function(z,j,e){e.r(j);var I=e(37205),K=e.n(I),x=e(82100),D=e.n(x),T=e(29186),C=e.n(T),O=e(13720),s=e.n(O),A=e(80619),U=e.n(A),L=e(47074),d=e.n(L),c=e(85573),o=e.n(c),p=e(81813),h=e(21739),a=e(71647),b=e(27174);function E(P){for(var n=[],r=P.props.eventKey,_=0;_<3;_+=1)n.push({title:"leaf ".concat(r,"-").concat(_),key:"".concat(r,"-").concat(_)});return n}function v(P,n,r){var _=function i(f,l){var t=l-1;f.forEach(function(M){(M.key.length>n.length?M.key.indexOf(n)!==0:n.indexOf(M.key)!==0)||(M.children?i(M.children,t):t<1&&(M.isLeaf=!0))})};_(P,r+1)}function u(P,n,r,_){var i=function f(l){_<1||n.length-3>_*2||l.forEach(function(t){n.indexOf(t.key)===0&&(t.children?f(t.children):t.children=r)})};i(P),v(P,n,_)}var m=function(P){U()(r,P);var n=d()(r);function r(){var _;D()(this,r);for(var i=arguments.length,f=new Array(i),l=0;l<i;l++)f[l]=arguments[l];return _=n.call.apply(n,[this].concat(f)),o()(s()(_),"state",{treeData:[],checkedKeys:[]}),o()(s()(_),"onSelect",function(t){console.log("selected",t)}),o()(s()(_),"onCheck",function(t){console.log(t),_.setState({checkedKeys:t})}),o()(s()(_),"onLoadData",function(t){return console.log("load data..."),new Promise(function(M){setTimeout(function(){var y=K()(_.state.treeData);u(y,t.props.eventKey,E(t),2),_.setState({treeData:y}),M()},500)})}),_}return C()(r,[{key:"componentDidMount",value:function(){var i=this;setTimeout(function(){i.setState({treeData:[{title:"pNode 01",key:"0-0"},{title:"pNode 02",key:"0-1"},{title:"pNode 03",key:"0-2",isLeaf:!0}],checkedKeys:["0-0"]})},100)}},{key:"render",value:function(){var i=this.state.treeData;return(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{children:"dynamic render"}),(0,b.jsx)(a.default,{onSelect:this.onSelect,checkable:!0,onCheck:this.onCheck,checkedKeys:this.state.checkedKeys,loadData:this.onLoadData,treeData:i})]})}}]),r}(h.Component);j.default=m},63053:function(z,j,e){e.r(j);var I=e(21739),K=e(81813),x=e(71647),D=e(27174),T=function(){return(0,D.jsxs)("div",{className:"expandAction-demo",children:[(0,D.jsx)("h2",{children:"expandAction"}),(0,D.jsx)("p",{children:"normal"}),(0,D.jsx)(x.default,{defaultExpandedKeys:["0-0"],expandAction:"click",selectable:!1,children:(0,D.jsx)(x.TreeNode,{title:"parent 1",children:(0,D.jsx)(x.TreeNode,{title:"click title can trigger expand even selectable is false because expandAction is 'click'",children:(0,D.jsx)(x.TreeNode,{title:"leaf-1"},"0-0-0-0")},"0-0-0")},"0-0")})]})};j.default=T},33701:function(z,j,e){e.r(j);var I=e(21739),K=e(81813),x=e(84824),D=e(71647),T=e(27174),C=[{name:"parent 1",test:"0-0",child:[{name:"\u5F20\u6668\u6210",test:"0-0-0",disabled:!0,child:[{name:"leaf",test:"0-0-0-0",disableCheckbox:!0},{name:"leaf",test:"0-0-0-1"}]},{name:"parent 1-1",test:"0-0-1",child:[{test:"0-0-1-0",name:"zcvc"}]}]}],O=function(){var A=function(c,o){console.log("selected",c,o)},U=function(c,o){console.log("onCheck",c,o)},L={children:"child",title:"name",key:"test"};return(0,T.jsx)(D.default,{checkable:!0,fieldNames:L,defaultExpandedKeys:["0-0-0","0-0-1"],defaultSelectedKeys:["0-0-0","0-0-1"],defaultCheckedKeys:["0-0-0","0-0-1"],onSelect:A,onCheck:U,treeData:C})};j.default=O},71842:function(z,j,e){e.r(j);var I=e(79800),K=e.n(I),x=e(82242),D=e.n(x),T=e(81813),C=e(31224),O=e(21739),s=e(71647),A=e(59086),U=e(27174),L=`
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
`,d={motionName:"node-motion",motionAppear:!1,onAppearStart:function(){return{height:0}},onAppearActive:function(b){return{height:b.scrollHeight}},onLeaveStart:function(b){return{height:b.offsetHeight}},onLeaveActive:function(){return{height:0}}},c=function(b){return b},o=function(b,E){var v={};return b.forEach(function(u){v[u.fieldType]||(v[u.fieldType]=[]);var m=u.is_key===1||u.ti===E;v[u.fieldType].push(D()(D()({},u),{},{disabled:m}))}),Object.keys(v).map(function(u){return{title:u,key:u,children:v[u]}}).filter(function(u){var m=u.children;return m.length})||[]};function p(){return o(A.map(function(a){return D()({title:function(){return c(a.fieldName)},key:a.fieldName,checkable:!0},a)}),"id",[])}var h=function(){var b=(0,O.useState)(A.map(function(m){return m.fieldName})),E=K()(b,2),v=E[0],u=E[1];return(0,U.jsxs)("div",{className:"animation",children:[(0,U.jsx)("h2",{children:"expanded"}),(0,U.jsx)("style",{dangerouslySetInnerHTML:{__html:L}}),(0,U.jsx)("div",{style:{display:"flex"},children:(0,U.jsxs)("div",{style:{flex:"1 1 50%"},children:[(0,U.jsx)("h3",{children:"With Virtual"}),(0,U.jsx)(s.default,{checkable:!0,defaultExpandAll:!1,motion:d,height:200,checkedKeys:v,itemHeight:20,onCheck:function(P){console.log("onCheck:",P),u(P)},style:{border:"1px solid #000"},treeData:p()})]})})]})};j.default=h},16204:function(z,j,e){e.r(j);var I=e(21739),K=e(92310),x=e.n(K),D=e(71647),T=e(81813),C=e(92863),O=e(27174),s=function(L){var d=L.selected;return(0,O.jsx)("span",{className:x()("customize-icon",d&&"selected-icon")})},A=function(){return(0,O.jsxs)("div",{children:[(0,O.jsx)("h2",{children:"Customize icon with element"}),(0,O.jsx)(D.default,{defaultExpandAll:!0,children:(0,O.jsx)(D.TreeNode,{icon:(0,O.jsx)("span",{className:"customize-icon"}),title:"Parent",children:(0,O.jsx)(D.TreeNode,{icon:(0,O.jsx)("span",{className:"customize-icon sub-icon"}),title:"Child"})})}),(0,O.jsx)("h2",{children:"Customize icon with component"}),(0,O.jsx)(D.default,{defaultExpandAll:!0,children:(0,O.jsx)(D.TreeNode,{icon:s,title:"Parent",children:(0,O.jsx)(D.TreeNode,{icon:s,title:"Child"})})}),(0,O.jsx)("h2",{children:"Customize icon with Tree prop"}),(0,O.jsx)(D.default,{defaultExpandAll:!0,icon:s,children:(0,O.jsx)(D.TreeNode,{title:"Parent",children:(0,O.jsx)(D.TreeNode,{title:"Child"})})})]})};j.default=A},28850:function(z,j,e){e.r(j);var I=e(82100),K=e.n(I),x=e(29186),D=e.n(x),T=e(80619),C=e.n(T),O=e(47074),s=e.n(O),A=e(21739),U=e(5018),L=e(81813),d=e(71647),c=e(27174),o=function(p){C()(a,p);var h=s()(a);function a(){return K()(this,a),h.apply(this,arguments)}return D()(a,[{key:"render",value:function(){return(0,c.jsxs)("div",{className:"selectable-demo",children:[(0,c.jsx)("h2",{children:"selectable"}),(0,c.jsx)("p",{children:"normal"}),(0,c.jsx)("div",{children:(0,c.jsx)(d.default,{defaultExpandAll:!0,showLine:!0,children:(0,c.jsxs)(d.TreeNode,{title:"root node",children:[(0,c.jsxs)(d.TreeNode,{title:"parent 1 default value(true)",children:[(0,c.jsx)(d.TreeNode,{title:"use parent 1 value if dont set selectable obviously"},"0-0-0-0"),(0,c.jsx)(d.TreeNode,{selectable:!0,title:"set selectable is true"},"0-0-0-1")]},"0-0-0"),(0,c.jsxs)(d.TreeNode,{title:"parent 2 selectable is false",selectable:!1,children:[(0,c.jsx)(d.TreeNode,{selectable:!1,title:"use parent 2 value if dont set selectable obviously"},"0-0-1-0"),(0,c.jsx)(d.TreeNode,{selectable:!0,title:"if set selectable obviously, it does't affect by parent"},"0-0-1-1")]},"0-0-1"),(0,c.jsxs)(d.TreeNode,{title:"parent 3 disabled",disabled:!0,children:[(0,c.jsx)(d.TreeNode,{selectable:!1,title:"parent is disable ,and selectable is false"},"0-0-2-0"),(0,c.jsx)(d.TreeNode,{selectable:!0,title:"parent is disable ,and selectable is true"},"0-0-2-1")]},"0-0-2")]},"0-0")})}),(0,c.jsx)("p",{children:"customized tree node style if unselectable"}),(0,c.jsx)("div",{className:"selectable-container",children:(0,c.jsx)(d.default,{prefixCls:"rc-tree",defaultExpandAll:!0,showLine:!0,children:(0,c.jsxs)(d.TreeNode,{title:"root node",children:[(0,c.jsxs)(d.TreeNode,{title:"parent 1 default value(true)",children:[(0,c.jsx)(d.TreeNode,{title:"use parent 1 value if dont set selectable obviously"},"0-0-0-0"),(0,c.jsx)(d.TreeNode,{selectable:!0,title:"set selectable is true"},"0-0-0-1")]},"0-0-0"),(0,c.jsxs)(d.TreeNode,{title:"parent 2 selectable is false",selectable:!1,children:[(0,c.jsx)(d.TreeNode,{selectable:!1,title:"use parent 2 value if dont set selectable obviously"},"0-0-1-0"),(0,c.jsx)(d.TreeNode,{selectable:!0,title:"if set selectable obviously, it does't affect by parent"},"0-0-1-1")]},"0-0-1"),(0,c.jsxs)(d.TreeNode,{title:"parent 3 disabled",disabled:!0,children:[(0,c.jsx)(d.TreeNode,{selectable:!1,title:"parent is disable ,and selectable is false"},"0-0-2-0"),(0,c.jsx)(d.TreeNode,{selectable:!0,title:"parent is disable ,and selectable is true"},"0-0-2-1")]},"0-0-2")]},"0-0")})})]})}}]),a}(A.Component);j.default=o}}]);
