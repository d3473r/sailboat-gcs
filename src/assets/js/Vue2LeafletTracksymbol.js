// eslint-disable-next-line
module.exports=function(o){var i={};function n(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return o[t].call(e.exports,e,e.exports,n),e.l=!0,e.exports}return n.m=o,n.c=i,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=2)}([function(t,e){t.exports=require("leaflet")},function(t,e){t.exports=require("vue2-leaflet")},function(t,e,o){t.exports=o(4)},function(t,e){t.exports=require("leaflet-tracksymbol")},function(t,e,o){"use strict";o.r(e);var i=o(0),n=o.n(i),r=o(1),s=(o(3),{latLng:{type:[Object,Array]},options:{type:Object},visible:{type:Boolean,custom:!0,default:!0}});var a=function(t,e,o,i,n,r,s,a){var l,p="function"==typeof t?t.options:t;if(e&&(p.render=e,p.staticRenderFns=o,p._compiled=!0),i&&(p.functional=!0),r&&(p._scopeId="data-v-"+r),s?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(s)},p._ssrRegister=l):n&&(l=a?function(){n.call(this,this.$root.$options.shadowRoot)}:n),l)if(p.functional){p._injectStyles=l;var u=p.render;p.render=function(t,e){return l.call(e),u(t,e)}}else{var c=p.beforeCreate;p.beforeCreate=c?[].concat(c,l):[l]}return{exports:t,options:p}}({props:s,data:function(){return{ready:!1}},mounted:function(){var t={};t.trackId=this.options.trackId||0,t.fill=this.options.fill||!0,t.fillColor=this.options.fillColor||"#0000ff",t.fillOpacity=this.options.fillOpacity||1,t.stroke=this.options.stroke||!0,t.color=this.options.color||"#000000",t.opacity=this.options.opacity||1,t.weight=this.options.weight||1,t.speed=this.options.speed||0,t.course=this.options.course||0,t.heading=this.options.heading||0,t.defaultSymbol=this.options.defaultSymbol||[.75,0,-.25,.3,-.25,-.3],t.noHeadingSymbol=t.noHeadingSymbol||[.3,0,0,.3,-.3,0,0,-.3],t.silouetteSymbol=t.silouetteSymbol||[1,.5,.75,1,0,1,0,0,.75,0],t.gpsRefPos=this.options.gpsRefPos||void 0,t.minSilouetteZoom=this.options.minSilouetteZoom||14,t.leaderTime=this.options.leaderTime||60,t.size=this.options.size||24,t.data=this.options.data||{},this.mapObject=n.a.trackSymbol(this.latLng,t),this.$store.commit("setBoatObject",this.mapObject),n.a.DomEvent.on(this.mapObject,this.$listeners),Object(r.propsBinder)(this,this.mapObject,s),this.ready=!0,this.parentContainer=Object(r.findRealParent)(this.$parent),this.parentContainer.addLayer(this,!this.visible)},beforeDestroy:function(){this.parentContainer.removeLayer(this)},methods:{setVisible:function(t,e){t!==e&&this.mapObject&&(t?this.mapObject.addTo(this.parent):this.parent.removeLayer(this.mapObject))}}},function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",[t.ready?t._t("default"):t._e()],2)},[],!1,null,null,null);e.default=a.exports}]);