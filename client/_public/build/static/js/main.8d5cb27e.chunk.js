(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,a){var n=a(101),i=window.location.hostname.includes("heroku")||window.location.hostname.includes("montv10.net")?"https://montv10.net:9400":"http://localhost:9400";console.log("service-url: ".concat(i));e.exports={API_CALL:function(e,t,a){return new Promise(function(r,c){var s="".concat(i).concat(t);console.log(s),n("".concat(i).concat(t),{method:e,withCredentials:!0,data:a}).then(function(e){r(e.data)}).catch(function(e){c(e)})})},URI:i}},120:function(e,t,a){},122:function(e,t,a){},150:function(e,t){},153:function(e,t,a){},154:function(e,t,a){},155:function(e,t,a){},156:function(e,t,a){},157:function(e,t,a){},158:function(e,t,a){},159:function(e,t,a){},168:function(e,t,a){},169:function(e,t,a){},170:function(e,t,a){},171:function(e,t,a){},172:function(e,t,a){},173:function(e,t,a){},174:function(e,t,a){},175:function(e,t,a){},176:function(e,t,a){},177:function(e,t,a){},178:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(43),c=a.n(r);a(85),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var s=a(9),o=a(11),l=a(74),u=a.n(l),d=a(10),m="GOOGLE_LOGIN",p="FACEBOOK_LOGIN",f="VERIFY_AUTH",h="SET_USER",v="LOGOUT";function b(e){var t=Object(d.API_CALL)("POST","/user/login/google",e);return{type:m,payload:t}}function O(e){var t=Object(d.API_CALL)("POST","/user/login/facebook",e);return{type:p,payload:t}}function E(){var e=Object(d.API_CALL)("POST","/user/login/auth-test");return{type:f,payload:e}}function y(e){return{type:h,payload:e}}var j=a(32),g=a(17),N=a(18),k="FETCH_LISTS",_="INSERT_LIST",C="UPDATE_LIST",L="DELETE_LIST";function S(e){return{type:_,payload:e}}var I="UPDATE_LIST_PRODCT";var w=a(8),A=a.n(w);function T(e){var t=function(e,t){if("object"!==typeof e||null===e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,t||"default");if("object"!==typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===typeof t?t:String(t)}var P="FETCH_NOTIFICATIONS",M="MARK_UNNEW",R="MARK_READ",D="CONFIRM_NOTIFICATION",U="INSERT_NOTIFICATION",G="DELETE_NOTIFICATION";function F(){var e=Object(d.API_CALL)("POST","/notification/unNew");return{type:M,payload:e}}function x(e){var t=Object(d.API_CALL)("POST","/notification/".concat(e,"/markRead"));return{type:R,payload:t}}function B(e){var t=Object(d.API_CALL)("POST","/notification/".concat(e,"/confirm"));return{type:D,payload:t}}function z(e){var t=Object(d.API_CALL)("DELETE","/notification/".concat(e));return{type:G,payload:t}}function H(e){var t=function(e,t){if("object"!==typeof e||null===e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,t||"default");if("object"!==typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===typeof t?t:String(t)}var V="TOGGLE_MENU";function q(){return{type:V,payload:{}}}var K="SUBSCRIBE_SOCKET";var W=Object(o.c)({user:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case m:case p:case f:case h:return t.error?(console.log("login failed"),null):t.payload;case v:return null;default:return e}},lists:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case k:if(t.error)return console.log("fetch lists failed"),e;var a=A.a.keyBy(t.payload,"list_id");return A.a.forOwn(a,function(e,t){e.products=A.a.keyBy(e.products,"id")}),console.log(a),a;case _:var n=t.payload;return Object(N.a)({},e,Object(g.a)({},n.list_id,n));case C:var i=t.payload;return Object(N.a)({},e,Object(g.a)({},i.list_id,i));case L:var r=t.payload;return e[r],Object(j.a)(e,[r].map(T));case I:var c=t.payload;return Object(N.a)({},e,Object(g.a)({},c.list_id,Object(N.a)({},e[c.list_id],{products:Object(N.a)({},e[c.list_id].products,Object(g.a)({},c.id,c))})));default:return e}},notifications:function(){var e,t,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=arguments.length>1?arguments[1]:void 0;switch(n.type){case P:return n.error?(console.log("fetch lists failed"),a):A.a.keyBy(n.payload,"notification_id");case U:var i=n.payload;return Object(N.a)({},a,Object(g.a)({},i.notification_id,i));case G:return a[t=n.payload.notification_id],Object(j.a)(a,[t].map(H));case M:return A.a.keyBy(n.payload,"notification_id");case R:return t=n.payload.notification_id,Object(N.a)({},a,Object(g.a)({},t,Object(N.a)({},a[t],{isRead:1})));case D:return console.log("CONFIRM_NOTIFICATION"),e=n.payload,Object(N.a)({},a,Object(g.a)({},e.notification_id,e));default:return a}},isMenu:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];switch((arguments.length>1?arguments[1]:void 0).type){case V:return!e;case v:return!1;default:return e}},socket:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case K:return t.payload;case v:return e&&e.disconnect(),null;default:return e}}}),Y=a(3),J=a(4),$=a(7),Q=a(5),X=a(6),Z=a(181),ee=a(182),te=a(179),ae=a(2),ne=(a(120),a(180)),ie=a(75),re=a.n(ie),ce=a(76),se=a.n(ce),oe=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).responseGoogle=a.responseGoogle.bind(Object(ae.a)(Object(ae.a)(a))),a.responseFacebook=a.responseFacebook.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){}},{key:"responseGoogle",value:function(e){console.log(e);var t=e.profileObj;t.tokenId=e.tokenId,this.props.googleLogin(t)}},{key:"responseFacebook",value:function(e){console.log(e),this.props.facebookLogin(e)}},{key:"render",value:function(){return this.props.user?i.a.createElement(ne.a,{to:"/lists"}):i.a.createElement("div",{className:"Login"},i.a.createElement("div",{className:"logo-container"},"Login Page",i.a.createElement("div",{className:"types"},i.a.createElement(re.a,{clientId:"180978526897-8o5c4k9vakqt2eqfbgd2u9ng5jaobl4j.apps.googleusercontent.com",render:function(e){return i.a.createElement("button",{onClick:e.onClick},"This is my custom Google button")},buttonText:"Login",onSuccess:this.responseGoogle}),i.a.createElement(se.a,{appId:"567336290432352",autoLoad:!1,fields:"name,email,picture",callback:this.responseFacebook}))))}}]),t}(n.Component);var le=Object(s.b)(function(e){return{user:e.user}},function(e){return Object(o.b)({facebookLogin:O,googleLogin:b,verifyAuth:E},e)})(oe),ue=(a(122),a(24)),de=a(14),me=a(47);ue.b.add(de.c,de.m,de.h,de.g,de.k,de.j,de.o,de.f,de.i,de.a,me.b,de.b,de.n,de.d,de.e,me.a,de.l);ue.b;var pe=a(77),fe=a.n(pe),he=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).listen=a.listen.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){this.listen()}},{key:"componentDidUpdate",value:function(e){!e.user&&this.props.user&&this.listen()}},{key:"listen",value:function(){var e=this;if(!this.props.user)return!1;var t=this.props.subscribeSocket,a=fe()(d.URI);a.on("connect",function(){t(a,e.props.user),a.on("newList",function(t){return e.props.insertList(t)}),a.on("listUpdated",function(t){return e.props.updateList(t)}),a.on("listDeleted",function(t){return e.props.deleteList(t)}),a.on("updateListProduct",function(t){return e.props.updateListProduct(t)}),a.on("newNotification",function(t){return e.props.insertNotification(t)})})}},{key:"render",value:function(){return null}}]),t}(n.Component),ve=Object(s.b)(function(e){return{user:e.user,socket:e.socket}},{subscribeSocket:function(e,t){return console.log("socket: ".concat(e.id," connected")),e.emit("subscribe",t),{type:K,payload:e}},insertList:S,updateListProduct:function(e){return{type:I,payload:e}},updateList:function(e){return{type:C,payload:e}},deleteList:function(e){return{type:L,payload:e}},insertNotification:function(e){return{type:U,payload:e}}})(he),be=a(183),Oe=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).verifyAuth=a.verifyAuth.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){this.verifyAuth()}},{key:"verifyAuth",value:function(){var e=this;if(this.props.user)return!0;Object(d.API_CALL)("POST","/user/login/auth-test").then(function(t){e.props.setUser(t)}).catch(function(t){e.props.history.push("/login")})}},{key:"render",value:function(){return null}}]),t}(n.Component);var Ee=Object(be.a)(Object(s.b)(function(e){return{user:e.user}},function(e){return Object(o.b)({setUser:y},e)})(Oe)),ye=(a(153),a(154),a(155),a(79)),je=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).state={hover:!1},a.toggleHover=a.toggleHover.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"toggleHover",value:function(){this.setState({hover:!this.state.hover})}},{key:"render",value:function(){var e=this.props,t=e.className,a=e.icon,n=e.title,r=e.size,c=e.style,s=e.hoverStyle,o=e.onClick,l=e.faType,u=this.state.hover?this.props.hoverColor:this.props.color,d=this.state.hover?s:c;return i.a.createElement(ye.a,{className:"Icon ".concat(t," ").concat(a),onMouseEnter:this.toggleHover,onMouseLeave:this.toggleHover,icon:[l||"fas",a],color:u,size:r,title:n,onClick:o,style:d})}}]),t}(n.Component),ge=function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"toggleStatus",value:function(){this.props.toggleMenu()}},{key:"render",value:function(){var e=this,t=this.props.notifications,a=A.a.filter(t,function(e){return 0===e.isRead}).length;return i.a.createElement("div",{className:"MenuToggler"},a>0&&i.a.createElement("div",{className:"badger"},a),i.a.createElement(je,{icon:"bars",size:"2x",onClick:function(){return e.toggleStatus()}}))}}]),t}(n.Component);var Ne=Object(s.b)(function(e){return{notifications:e.notifications}},function(e){return Object(o.b)({toggleMenu:q},e)})(ge),ke=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).link=a.link.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"link",value:function(e){this.props.history.push(e),this.props.toggleMenu()}},{key:"render",value:function(){var e=this,t=this.props,a=t.isMenu,n=t.user,r=t.notifications,c=A.a.filter(r,function(e){return 0===e.isRead}).length;return i.a.createElement("div",{className:"SideMenu ".concat(!a&&"hidden")},i.a.createElement("div",{className:"overlay",onClick:function(){return e.props.toggleMenu()}}),i.a.createElement("main",null,i.a.createElement("div",{className:"toggler"},i.a.createElement(Ne,null)),i.a.createElement("div",{className:"profile"},i.a.createElement("div",{className:"pic"},i.a.createElement("img",{src:n.pic,alt:""})),i.a.createElement("div",{className:"username"},n.firstname," ",n.lastname),i.a.createElement("div",{className:"hr"})),i.a.createElement("menu",{className:"".concat(!a&&"hidden")},i.a.createElement("div",{className:"row",onClick:function(){return e.link("/lists")}},i.a.createElement("div",{className:"icon",style:{marginRight:"+3px"}},i.a.createElement(je,{icon:"clipboard-list"})),i.a.createElement("div",{className:"title"},"\u05d4\u05e8\u05e9\u05d9\u05de\u05d5\u05ea \u05e9\u05dc\u05d9")),i.a.createElement("div",{className:"row",onClick:function(){return e.link("/notifications")}},i.a.createElement("div",{className:"icon notifications"},i.a.createElement("span",{className:"counter"},c),i.a.createElement(je,{faType:"far",icon:"comment"})),i.a.createElement("div",{className:"title"},"\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea")),i.a.createElement("div",{className:"row",onClick:function(){return e.props.logout()}},i.a.createElement("div",{className:"icon"},i.a.createElement(je,{icon:"power-off"})),i.a.createElement("div",{className:"title"},"\u05d4\u05ea\u05e0\u05ea\u05e7\u05d5\u05ea"))),i.a.createElement("footer",null,i.a.createElement("div",null,"Gulo"))))}}]),t}(n.Component),_e=Object(be.a)(Object(s.b)(function(e){return{user:e.user,isMenu:e.isMenu,notifications:e.notifications}},{logout:function(){console.log("logout");var e=Object(d.API_CALL)("POST","/user/logout");return{type:v,payload:e}},toggleMenu:q})(ke)),Ce=(a(156),a(157),function(){return i.a.createElement("div",{className:"EmptyList"},i.a.createElement("div",{className:"icon"},i.a.createElement(je,{icon:"file",faType:"far"})),i.a.createElement("div",{className:"primary"},"\u05d0\u05d9\u05df \u05dc\u05da \u05e8\u05e9\u05d9\u05de\u05d5\u05ea \u05e2\u05d3\u05d9\u05d9\u05df"),i.a.createElement("div",{className:"secondary"},'\u05dc\u05d7\u05e5 \u05e2\u05dc \u05d4"+" \u05db\u05d3\u05d9 \u05dc\u05d4\u05ea\u05d7\u05d9\u05dc'))}),Le=(a(158),function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"render",value:function(){var e=this.props.list;return i.a.createElement("div",{className:"List"},i.a.createElement("div",{className:"icon",style:{background:e.list_type_color},onClick:this.props.showList},i.a.createElement(je,{icon:e.list_type_icon,size:"2x"})),i.a.createElement("div",{className:"title",onClick:this.props.showList},i.a.createElement("div",{className:"name"},e.list_name),i.a.createElement("div",{className:"mail"},e.creator.mail)),i.a.createElement("div",{className:"options",onClick:this.props.editList},i.a.createElement(je,{icon:"ellipsis-v",size:"2x"})))}}]),t}(n.Component)),Se=(a(159),a(48)),Ie=a.n(Se);Ie.a.defaultStyles.overlay.backgroundColor="rgba(0,0,0,0.4)";var we=function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"render",value:function(){return i.a.createElement(Ie.a,{isOpen:this.props.isOpen,ariaHideApp:!1,className:"Modal ".concat(this.props.className)},this.props.children)}}]),t}(n.Component),Ae=a(36),Te=(a(168),a(169),function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).state={options:[]},a.fetchAPI=a.fetchAPI.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){this.fetchAPI()}},{key:"fetchAPI",value:function(){var e=this,t=this.props.api;if(!t)return!1;Object(d.API_CALL)(t.verb,t.url).then(function(t){e.setState({options:t})}).catch(function(t){setTimeout(e.fetchAPI,1e3)})}},{key:"renderRadios",value:function(){var e=this,t=this.props,a=t.name,n=t.value,r=this.state.options;return A.a.map(r,function(t){var r={backgroundColor:t.id===n?t.color:""},c=e.props.readOnly?null:function(){return e.props.onClick({target:{name:a,value:t.id}})};return i.a.createElement("div",{key:t.id,style:r,onClick:c},t.name)})}},{key:"render",value:function(){return i.a.createElement("div",{className:"RadioTypes"},this.renderRadios())}}]),t}(n.Component)),Pe=(a(170),function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).state={status:!1,users:[],value:"",isValid:!0},a.handleChange=a.handleChange.bind(Object(ae.a)(Object(ae.a)(a))),a.toggleStatus=a.toggleStatus.bind(Object(ae.a)(Object(ae.a)(a))),a.fetchUsers=a.fetchUsers.bind(Object(ae.a)(Object(ae.a)(a))),a.validateInsert=a.validateInsert.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){this.fetchUsers()}},{key:"componentDidUpdate",value:function(e,t){e.shares!==this.props.shares&&this.setState({status:!1,value:""})}},{key:"fetchUsers",value:function(){var e=this;Object(d.API_CALL)("GET","/user/getAllUsersButMe").then(function(t){e.setState({users:t})}).catch(function(t){e.setState({redirectToLogin:!0})})}},{key:"toggleStatus",value:function(){var e=!this.state.status;this.setState({status:e})}},{key:"renderDataListOptions",value:function(){var e=this.state.users;return A.a.map(e,function(e){return i.a.createElement("option",{key:e.mail,value:e.mail},e.fullname)})}},{key:"renderSharesList",value:function(){var e=this,t=this.props.creator,a=A.a.map(this.props.shares,function(t){return i.a.createElement("div",{className:"share",key:t.mail,onClick:function(){return e.validateRemove(t)}},i.a.createElement("div",{className:"pic"},i.a.createElement("img",{src:t.pic,alt:""})),i.a.createElement("div",{className:"details"},i.a.createElement("div",{className:"name"},t.fullname),i.a.createElement("div",{className:"mail"},t.mail)))});if(t){var n=i.a.createElement("div",{className:"share manager",key:t.mail},i.a.createElement("div",{className:"pic"},i.a.createElement("img",{src:t.pic,alt:""})),i.a.createElement("div",{className:"details"},i.a.createElement("div",{className:"name"},"\u05de\u05e0\u05d4\u05dc: ",t.fullname),i.a.createElement("div",{className:"mail"},t.mail)));a.unshift(n)}return i.a.createElement("div",{className:"shares-list"},a)}},{key:"handleChange",value:function(e){var t=e.target.value;this.setState({value:t,isValid:!0})}},{key:"validateInsert",value:function(e){e.preventDefault();var t=this.state,a=t.value,n=t.users,i=A.a.filter(n,function(e){return e.mail===a}),r=A.a.find(this.props.shares,{mail:a});if(0===i.length||r)return this.setState({isValid:!1}),!1;this.props.onInsert(i[0])}},{key:"validateRemove",value:function(e){if(!this.props.isCreator)return!1;window.confirm("\u05d4\u05d0\u05dd \u05dc\u05d4\u05e1\u05d9\u05e8 \u05de\u05d4\u05e7\u05d1\u05d5\u05e6\u05d4 \u05d0\u05ea \u05d4\u05de\u05e9\u05ea\u05de\u05e9\n".concat(e.fullname,"?")),this.props.onRemove(e)}},{key:"render",value:function(){var e=this.state,t=e.status,a=e.value,n=e.isValid,r=this.props.isCreator;return i.a.createElement("div",{className:"ListShares"},r&&i.a.createElement("div",{className:"toggle-row"},i.a.createElement("div",{onClick:this.toggleStatus},i.a.createElement(je,{icon:t?"minus":"plus"})," \xa0",t?"\u05d1\u05d9\u05d8\u05d5\u05dc \u05d4\u05d5\u05e1\u05e4\u05ea \u05e9\u05d5\u05ea\u05e3":"\u05d4\u05d5\u05e1\u05e3 \u05e9\u05d5\u05ea\u05e3 \u05dc\u05e8\u05e9\u05d9\u05de\u05d4"),t&&i.a.createElement("div",null,i.a.createElement("button",{className:"btn-plus",onClick:this.validateInsert},i.a.createElement(je,{icon:"plus"})))),t&&i.a.createElement("input",{className:"ltr ".concat(n?"":"invalid"),type:"text",list:"users",value:a,onChange:this.handleChange,placeholder:"Search partner by Email or FullName..."}),!t&&this.renderSharesList(),i.a.createElement("datalist",{id:"users"},this.renderDataListOptions()))}}]),t}(n.Component)),Me=function(e){function t(e){var a;Object(Y.a)(this,t);var n=(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).props,i=n.list,r=n.user,c=i?i.creator:r,s=c.mail===r.mail;return a.state=i?{creator:c,isCreator:s,list_id:i.list_id,list_name:i.list_name,list_type:i.list_type_id,device_id:i.device.id||"",device_password:i.device.password||"",shares:i.shares,shares_deleted:[],shares_inserted:[]}:{creator:c,isCreator:s,list_name:"",list_type:1,device_id:"",device_password:"",shares:[],shares_deleted:[],shares_inserted:[]},a.handleChange=a.handleChange.bind(Object(ae.a)(Object(ae.a)(a))),a.submit=a.submit.bind(Object(ae.a)(Object(ae.a)(a))),a.insertShare=a.insertShare.bind(Object(ae.a)(Object(ae.a)(a))),a.removeShare=a.removeShare.bind(Object(ae.a)(Object(ae.a)(a))),a.delete=a.delete.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"handleChange",value:function(e){var t=e.target,a=t.name,n=t.value,i={};i[a]=n,this.setState(i)}},{key:"insertShare",value:function(e){var t=[e].concat(Object(Ae.a)(this.state.shares_inserted)),a=[e].concat(Object(Ae.a)(this.state.shares)),n=this.state.shares_deleted;A.a.find(n,{user_id:e.user_id})&&(n=A.a.filter(n,function(t){return t.user_id!==e.user_id}),t=A.a.filter(t,function(t){return t.user_id!==e.user_id})),this.setState({shares:a,shares_inserted:t,shares_deleted:n})}},{key:"removeShare",value:function(e){var t=[e].concat(Object(Ae.a)(this.state.shares_deleted)),a=this.state.shares_inserted,n=A.a.filter(this.state.shares,function(t){return t.user_id!==e.user_id});A.a.find(a,{user_id:e.user_id})&&(t=A.a.filter(t,function(t){return t.user_id!==e.user_id}),a=A.a.filter(a,function(t){return t.user_id!==e.user_id})),this.setState({shares:n,shares_deleted:t,shares_inserted:a})}},{key:"submit",value:function(e){var t=this;e.preventDefault();var a=this.props.list,n={verb:a?"PUT":"POST",url:a?"/list/".concat(a.list_id):"/list"};Object(d.API_CALL)(n.verb,n.url,this.state).then(function(e){t.props.close()}).catch(function(e){var t=e.response&&e.response.data;"device details invalid"===t?alert("\u05e4\u05e8\u05d8\u05d9 \u05d4\u05d4\u05ea\u05e7\u05df \u05d0\u05d9\u05e0\u05dd \u05e0\u05db\u05d5\u05e0\u05d9\u05dd"):"device already connected"===t&&alert("\u05d4\u05d4\u05ea\u05e7\u05df \u05db\u05d1\u05e8 \u05de\u05e9\u05d5\u05d9\u05d9\u05da \u05dc\u05e8\u05e9\u05d9\u05de\u05d4 \u05d0\u05d7\u05e8\u05ea")})}},{key:"delete",value:function(){var e=this,t=this.state,a=t.isCreator,n=t.list_id;if(!window.confirm(a?"\u05d4\u05d0\u05dd \u05d1\u05e8\u05e6\u05d5\u05e0\u05da \u05dc\u05de\u05d7\u05d5\u05e7 \u05e1\u05d5\u05e4\u05d9\u05ea \u05e8\u05e9\u05d9\u05de\u05d4 \u05d6\u05d5?":"\u05d4\u05d0\u05dd \u05d1\u05e8\u05e6\u05d5\u05e0\u05da \u05dc\u05d4\u05e1\u05d9\u05e8 \u05d4\u05e9\u05ea\u05ea\u05e4\u05d5\u05ea\u05da \u05de\u05e8\u05e9\u05d9\u05de\u05d4 \u05d6\u05d5?"))return!1;Object(d.API_CALL)("DELETE","/list/".concat(n),this.state).then(function(t){e.props.close()}).catch(function(e){console.log(e.message)})}},{key:"render",value:function(){var e=this,t=this.state,a=this.props.list,n=this.state,r=n.creator,c=n.isCreator;return i.a.createElement("div",{className:"ModalList"},i.a.createElement("header",{className:"modal-header"},i.a.createElement("div",{className:"title"},a?this.props.list.list_name:"\u05e8\u05e9\u05d9\u05de\u05d4 \u05d7\u05d3\u05e9\u05d4"),a&&i.a.createElement("div",{className:"left"},i.a.createElement(je,{icon:"trash",color:"#f95d49;",onClick:this.delete})," ")),i.a.createElement("form",{onSubmit:this.submit,onReset:function(){return e.props.close()}},i.a.createElement("header",null,"\u05e4\u05e8\u05d8\u05d9 \u05d4\u05e8\u05e9\u05d9\u05de\u05d4"),i.a.createElement("div",{className:"field"},i.a.createElement("div",null,"\u05e9\u05dd \u05d4\u05e8\u05e9\u05d9\u05de\u05d4"),i.a.createElement("div",null,i.a.createElement("input",{type:"text",name:"list_name",value:t.list_name,onChange:this.handleChange,placeholder:"\u05d4\u05db\u05e0\u05e1 \u05d0\u05ea \u05e9\u05dd \u05d4\u05e8\u05e9\u05d9\u05de\u05d4",required:!0}))),i.a.createElement("div",{className:"field radio"},i.a.createElement(Te,{name:"list_type",value:t.list_type,onClick:this.handleChange,api:{verb:"GET",url:"/list/types"},readOnly:!c})),i.a.createElement("header",null,"\u05d7\u05d1\u05e8\u05d9 \u05d4\u05e8\u05e9\u05d9\u05de\u05d4"),i.a.createElement("div",{className:"field"},i.a.createElement(Pe,{shares:t.shares,creator:r,isCreator:c,onInsert:this.insertShare,onRemove:this.removeShare})),i.a.createElement("header",null,"\u05e4\u05e8\u05d8\u05d9 \u05d4\u05d4\u05ea\u05e7\u05df"),c&&i.a.createElement("div",null,i.a.createElement("div",{className:"field"},i.a.createElement("div",null,"\u05de\u05e1\u05e4\u05e8 \u05e1\u05d9\u05d3\u05d5\u05e8\u05d9"),i.a.createElement("div",null,i.a.createElement("input",{type:"number",name:"device_id",value:t.device_id,onChange:this.handleChange,placeholder:"\u05d4\u05d6\u05df \u05d0\u05ea \u05de\u05e1\u05e4\u05e8 \u05d4\u05d4\u05ea\u05e7\u05df \u05e9\u05d1\u05e8\u05e9\u05d5\u05ea\u05da",readOnly:!c}))),i.a.createElement("div",{className:"field"},i.a.createElement("div",null,"\u05e1\u05d9\u05e1\u05de\u05d0"),i.a.createElement("div",null,i.a.createElement("input",{type:"text",name:"device_password",value:t.device_password,onChange:this.handleChange,placeholder:"\u05d4\u05d6\u05df \u05d0\u05ea \u05d4\u05e1\u05d9\u05e1\u05de\u05d0 \u05d4\u05e8\u05e9\u05d5\u05de\u05d4 \u05e2\u05dc \u05d2\u05d1 \u05d4\u05d4\u05ea\u05e7\u05df",readOnly:!c})))),i.a.createElement("footer",null,i.a.createElement("div",{className:"cancel"},i.a.createElement("button",{type:"reset"},"\u05d1\u05d9\u05d8\u05d5\u05dc")),i.a.createElement("div",{className:"confirm"},i.a.createElement("button",{type:"submit"},"\u05d0\u05d9\u05e9\u05d5\u05e8")))))}}]),t}(n.Component);var Re=Object(s.b)(function(e){return{user:e.user}},function(e){return Object(o.b)({insertList:S},e)})(Me),De=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).state={isModal:!1,editList:null},a.toggleIsModal=a.toggleIsModal.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){window.addEventListener("beforeunload",function(e){e.preventDefault()})}},{key:"toggleIsModal",value:function(){var e=this,t=!this.state.isModal;this.setState({isModal:t},function(){t||e.setState({editList:null})})}},{key:"renderLists",value:function(){var e=this,t=this.props.lists;return A.a.map(t,function(t){return i.a.createElement(Le,{key:t.list_id,list:t,showList:function(){return e.props.history.push("/list/".concat(t.list_id))},editList:function(){return e.setState({editList:t,isModal:!0})}})})}},{key:"renderEmpty",value:function(){return i.a.createElement(Ce,null)}},{key:"render",value:function(){var e=this.props.lists;return i.a.createElement("div",{className:"Page Lists"},i.a.createElement(we,{isOpen:this.state.isModal},i.a.createElement(Re,{list:this.state.editList,close:this.toggleIsModal})),i.a.createElement("header",null,i.a.createElement("div",{className:"right"},i.a.createElement(Ne,null)),i.a.createElement("div",{className:"title"},"\u05d4\u05e8\u05e9\u05d9\u05de\u05d5\u05ea \u05e9\u05dc\u05d9"),i.a.createElement("div",{className:"left"},i.a.createElement(je,{icon:"search",size:"2x"}))),i.a.createElement("main",{className:"lists"},A.a.size(e)>0&&this.renderLists(),0===A.a.size(e)&&this.renderEmpty()),i.a.createElement("footer",null,i.a.createElement("button",{onClick:this.toggleIsModal},i.a.createElement(je,{icon:"plus"}),"\u05e8\u05e9\u05d9\u05de\u05d4 \u05d7\u05d3\u05e9\u05d4 ")))}}]),t}(n.Component),Ue=Object(be.a)(Object(s.b)(function(e){return{lists:e.lists,socket:e.socket}})(De)),Ge=(a(171),a(172),function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"toggleCheck",value:function(){var e=this.props.product,t=e.list_id,a=e.id;Object(d.API_CALL)("POST","/list/".concat(t,"/product/").concat(a,"/toggleCheck"))}},{key:"render",value:function(){var e=this,t=this.props.product,a=t.quantity>1?i.a.createElement("span",{className:"quantity"},"(",t.quantity,")"):null;return i.a.createElement("div",{className:"Product ".concat(t.isChecked?"checked":null)},i.a.createElement("div",{className:"product",onClick:function(){return e.toggleCheck()}},i.a.createElement("div",{className:"name"},t.product_name,a)),i.a.createElement("div",{className:"options"},i.a.createElement(je,{icon:"ellipsis-v",size:"1x"})))}}]),t}(n.Component)),Fe=function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"renderListProducts",value:function(){var e=this.props.list;return A.a.map(e.products,function(e){return i.a.createElement(Ge,{key:e.id,product:e})})}},{key:"render",value:function(){var e=this,t=this.props.list;return t?i.a.createElement("div",{className:"Page ViewList"},i.a.createElement("header",null,i.a.createElement("div",{className:"right"},i.a.createElement(Ne,null)),i.a.createElement("div",{className:"title"},t.list_name),i.a.createElement("div",{className:"left"},i.a.createElement(je,{icon:"arrow-left",size:"2x",onClick:function(){return e.props.history.goBack()}}))),i.a.createElement("main",{className:"list-products"},this.renderListProducts()),i.a.createElement("footer",null,i.a.createElement("button",{onClick:this.toggleIsNew},i.a.createElement(je,{icon:"plus"}),"\u05e8\u05e9\u05d9\u05de\u05d4 \u05d7\u05d3\u05e9\u05d4 "))):i.a.createElement(ne.a,{to:"/"})}}]),t}(n.Component),xe=Object(be.a)(Object(s.b)(function(e,t){return{list:e.lists[t.match.params.list_id]}})(Fe)),Be=(a(173),a(174),a(27)),ze=a.n(Be),He=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).viewNotification=a.viewNotification.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"viewNotification",value:function(){var e=this.props.noti.notification_id;this.props.history.push("/notifications/".concat(e))}},{key:"render",value:function(){var e=this.props.noti,t=ze()(e.modifiedAt).isSame(ze()(),"date");return i.a.createElement("div",{className:"Notification ".concat(!e.isRead&&"unRead"),onClick:this.viewNotification},i.a.createElement("div",{className:"title"},i.a.createElement("div",{className:"topic"},e.title),i.a.createElement("div",{className:"status"},e.status_topic)),i.a.createElement("div",{className:"at"},i.a.createElement("div",{className:"time"},ze()(e.modifiedAt).format("HH:mm")),!t&&i.a.createElement("div",{className:"date"},ze()(e.modifiedAt).format("DD/MM/YY"))))}}]),t}(n.Component),Ve=Object(be.a)(He),qe=(a(175),function(){return i.a.createElement("div",{className:"EmptyNotifications"},i.a.createElement("div",{className:"icon"},i.a.createElement(je,{icon:"file",faType:"far"})),i.a.createElement("div",{className:"primary"},"\u05e8\u05e9\u05d9\u05de\u05ea \u05d4\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05e8\u05d9\u05e7\u05d4"))}),Ke=function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){A.a.filter(this.props.notifications,function(e){return 1===e.isNew}).length>0&&this.props.markUnNew()}},{key:"renderNotifications",value:function(){var e=A.a.values(this.props.notifications);return 0===e.length?i.a.createElement(qe,null):A.a.map(e.reverse(),function(e,t){return i.a.createElement(Ve,{key:t,noti:e})})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"Page Notifications"},i.a.createElement("header",null,i.a.createElement("div",{className:"right"},i.a.createElement(Ne,null)),i.a.createElement("div",{className:"title"},"\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea"),i.a.createElement("div",{className:"left"},i.a.createElement(je,{icon:"arrow-left",size:"2x",onClick:function(){return e.props.history.goBack()}}))),i.a.createElement("main",{className:"list-notifications"},this.renderNotifications()))}}]),t}(n.Component);var We=Object(s.b)(function(e){return{notifications:e.notifications}},function(e){return Object(o.b)({markUnNew:F},e)})(Ke),Ye=(a(176),a(177),function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"isConfirmation",value:function(){var e=this,t=this.props.noti;return 0===t.isConfirm?null:i.a.createElement("footer",{className:"confirmation"},i.a.createElement("button",{onClick:function(){return e.props.confirmNotification(t.notification_id)}},"\u05d0\u05d9\u05e9\u05d5\u05e8"))}},{key:"render",value:function(){var e=this.props.noti;return e?i.a.createElement("div",{className:"SharedList"},i.a.createElement("main",null,i.a.createElement("div",{className:"title"},e.title),i.a.createElement("div",{className:"status"},e.status_topic),this.isConfirmation())):null}}]),t}(n.Component));var Je=Object(s.b)(null,function(e){return Object(o.b)({confirmNotification:B},e)})(Ye),$e=function(e){function t(e){var a;return Object(Y.a)(this,t),(a=Object($.a)(this,Object(Q.a)(t).call(this,e))).renderNotification=a.renderNotification.bind(Object(ae.a)(Object(ae.a)(a))),a.deleteNotification=a.deleteNotification.bind(Object(ae.a)(Object(ae.a)(a))),a}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.noti;if(!e)return i.a.createElement(ne.a,{to:"/notifications"});0===e.isRead&&this.props.markRead(this.props.noti.notification_id)}},{key:"renderNotification",value:function(){var e=this.props.noti;if(1===e.notification_type_id)return i.a.createElement(Je,{noti:e})}},{key:"deleteNotification",value:function(){var e=this.props.noti;this.props.deleteNotification(e.notification_id),this.props.history.goBack()}},{key:"render",value:function(){var e=this,t=this.props.noti;return t?i.a.createElement("div",{className:"Page ViewNotification"},i.a.createElement("header",null,i.a.createElement("div",{className:"right"},i.a.createElement(je,{className:"trash",icon:"trash",hoverColor:"red",onClick:this.deleteNotification})),i.a.createElement("div",{className:"title"},t.topic),i.a.createElement("div",{className:"left"},i.a.createElement(je,{icon:"arrow-left",size:"2x",onClick:function(){return e.props.history.goBack()}}))),i.a.createElement("main",null,this.renderNotification())):i.a.createElement(ne.a,{to:"/notifications"})}}]),t}(n.Component);var Qe=Object(be.a)(Object(s.b)(function(e,t){return{noti:e.notifications[t.match.params.notification_id]}},function(e){return Object(o.b)({markRead:x,deleteNotification:z},e)})($e)),Xe=function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"componentDidMount",value:function(){this.props.fetchLists(),this.props.fetchNotifications()}},{key:"render",value:function(){return this.props.user?i.a.createElement("div",{className:"Gulo"},i.a.createElement(Ee,null),i.a.createElement(ve,null),i.a.createElement(_e,null),i.a.createElement(ee.a,null,i.a.createElement(te.a,{path:"/list/:list_id",component:xe}),i.a.createElement(te.a,{path:"/notifications/:notification_id",component:Qe}),i.a.createElement(te.a,{path:"/notifications",component:We}),i.a.createElement(te.a,{path:"/",component:Ue}))):i.a.createElement(Ee,null)}}]),t}(n.Component),Ze=Object(s.b)(function(e){return{user:e.user}},{fetchLists:function(){var e=Object(d.API_CALL)("GET","/list");return{type:k,payload:e}},fetchNotifications:function(){var e=Object(d.API_CALL)("GET","/notification");return{type:P,payload:e}}})(Xe),et=function(e){function t(){return Object(Y.a)(this,t),Object($.a)(this,Object(Q.a)(t).apply(this,arguments))}return Object(X.a)(t,e),Object(J.a)(t,[{key:"render",value:function(){return i.a.createElement(Z.a,null,i.a.createElement(ee.a,null,i.a.createElement(te.a,{path:"/Login",component:le}),i.a.createElement(te.a,{path:"/",component:Ze})))}}]),t}(n.Component),tt=Object(o.a)(u.a)(o.d);c.a.render(i.a.createElement(s.a,{store:tt(W)},i.a.createElement(et,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},80:function(e,t,a){e.exports=a(178)},85:function(e,t,a){}},[[80,1,2]]]);
//# sourceMappingURL=main.8d5cb27e.chunk.js.map