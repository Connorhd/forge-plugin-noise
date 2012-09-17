/*! Copyright 2011 Trigger Corp. All rights reserved. */
(function(){var j={};var g={};j.config={modules:{logging:{level:"DEBUG"}}};j.config.uuid="UUID_HERE";g.listeners={};var c={};var f=[];var e=null;var i=false;var l=function(){if(f.length>0){if(!g.debug||window.catalystConnected){i=true;while(f.length>0){var m=f.shift();if(m[0]=="logging.log"){console.log(m[1].message)}g.priv.call.apply(g.priv,m)}i=false}else{e=setTimeout(l,500)}}};g.priv={call:function(t,s,r,n){if((!g.debug||window.catalystConnected||t==="internal.showDebugWarning")&&(f.length==0||i)){var m=j.tools.UUID();var p=true;if(t==="button.onClicked.addListener"||t==="message.toFocussed"){p=false}if(r||n){c[m]={success:r,error:n,onetime:p}}var o={callid:m,method:t,params:s};g.priv.send(o);if(window._forgeDebug){try{o.start=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiRequest(o)}catch(q){}}}else{f.push(arguments);if(!e){e=setTimeout(l,500)}}},send:function(m){throw new Error("Forge error: missing bridge to privileged code")},receive:function(m){if(m.callid){if(typeof c[m.callid]===undefined){j.log("Nothing stored for call ID: "+m.callid)}var o=c[m.callid];var n=(typeof m.content==="undefined"?null:m.content);if(o&&o[m.status]){o[m.status](m.content)}if(o&&o.onetime){delete c[m.callid]}if(window._forgeDebug){try{m.end=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiResponse(m)}catch(p){}}}else{if(m.event){if(g.listeners[m.event]){g.listeners[m.event].forEach(function(q){if(m.params){q(m.params)}else{q()}})}if(window._forgeDebug){try{m.start=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiEvent(m)}catch(p){}}}}}};g.addEventListener=function(m,n){if(g.listeners[m]){g.listeners[m].push(n)}else{g.listeners[m]=[n]}};g.generateQueryString=function(n){if(!n){return""}if(!(n instanceof Object)){return new String(n).toString()}var o=[];var m=function(t,s){if(t instanceof Array){var q=0;for(var p in t){var r=(s?s:"")+"["+q+"]";q+=1;if(!t.hasOwnProperty(p)){continue}m(t[p],r)}}else{if(t instanceof Object){for(var p in t){if(!t.hasOwnProperty(p)){continue}var r=p;if(s){r=s+"["+p+"]"}m(t[p],r)}}else{o.push(encodeURIComponent(s)+"="+encodeURIComponent(t))}}};m(n);return o.join("&").replace("%20","+")};g.generateMultipartString=function(n,p){if(typeof n==="string"){return""}var o="";for(var m in n){if(!n.hasOwnProperty(m)){continue}o+="--"+p+"\r\n";o+='Content-Disposition: form-data; name="'+m.replace('"','\\"')+'"\r\n\r\n';o+=n[m].toString()+"\r\n"}return o},g.generateURI=function(n,m){var o="";if(n.indexOf("?")!==-1){o+=n.split("?")[1]+"&";n=n.split("?")[0]}o+=this.generateQueryString(m)+"&";o=o.substring(0,o.length-1);return n+(o?"?"+o:"")};g.disabledModule=function(m,n){var o="The '"+n+"' module is disabled for this app, enable it in your app config and rebuild in order to use this function";j.logging.error(o);m&&m({message:o,type:"UNAVAILABLE",subtype:"DISABLED_MODULE"})};j.enableDebug=function(){g.debug=true;g.priv.call("internal.showDebugWarning",{},null,null);g.priv.call("internal.hideDebugWarning",{},null,null)};setTimeout(function(){if(window.forge&&window.forge.debug){alert("Warning!\n\n'forge.debug = true;' is no longer supported\n\nUse 'forge.enableDebug();' instead.")}},3000);j.barcode={scan:function(n,m){g.disabledModule(m,"barcode")}};j.button={setIcon:function(n,o,m){g.priv.call("button.setIcon",n,o,m)},setURL:function(n,o,m){g.priv.call("button.setURL",n,o,m)},onClicked:{addListener:function(m){g.priv.call("button.onClicked.addListener",null,m)}},setBadge:function(n,o,m){g.priv.call("button.setBadge",n,o,m)},setBadgeBackgroundColor:function(n,o,m){g.priv.call("button.setBadgeBackgroundColor",n,o,m)},setTitle:function(o,n,m){g.priv.call("button.setTitle",o,n,m)}};j.contact={select:function(n,m){g.disabledModule(m,"contact")}};j.display={orientation:{forcePortrait:function(n,m){g.priv.call("display.orientation.forcePortrait",{},n,m)},forceLandscape:function(n,m){g.priv.call("display.orientation.forceLandscape",{},n,m)},allowAny:function(n,m){g.priv.call("display.orientation.allowAny",{},n,m)}}};j.document={reload:function(){return document.location.reload()},location:function(n,m){n(document.location)}};j.event={menuPressed:{addListener:function(n,m){g.addEventListener("menuPressed",n)}},messagePushed:{addListener:function(n,m){g.addEventListener("event.messagePushed",n)}},orientationChange:{addListener:function(n,m){g.addEventListener("event.orientationChange",n);if(nullObj&&g.currentOrientation!==nullObj){g.priv.receive({event:"event.orientationChange"})}}},connectionStateChange:{addListener:function(n,m){g.addEventListener("event.connectionStateChange",n);if(nullObj&&g.currentConnectionState!==nullObj){g.priv.receive({event:"event.connectionStateChange"})}}},appPaused:{addListener:function(n,m){g.addEventListener("event.appPaused",n)}},appResumed:{addListener:function(n,m){g.addEventListener("event.appResumed",n)}}};j.facebook={authorize:function(n,o,m){if(typeof n=="function"){m=o;o=n;n=[]}g.priv.call("facebook.authorize",{permissions:n},o,m)},logout:function(n,m){g.priv.call("facebook.logout",{},n,m)},api:function(o,r,q,p,m){if(typeof r=="function"||arguments.length==1){m=q;p=r;r="GET";q={}}else{if(typeof q=="function"||arguments.length==2){m=p;p=q;q=r;r="GET"}}if(q){for(var n in q){q[n]=String(q[n])}}g.priv.call("facebook.api",{path:o,method:r,params:q},p,m)},ui:function(o,n,m){g.priv.call("facebook.ui",o,n,m)}};j.file={getImage:function(n,o,m){if(typeof n==="function"){m=o;o=n;n={}}if(!n){n={}}g.priv.call("file.getImage",n,o&&function(q){var p={uri:q,name:"Image",type:"image"};if(n.width){p.width=n.width}if(n.height){p.height=n.height}o(p)},m)},getVideo:function(n,o,m){if(typeof n==="function"){m=o;o=n;n={}}if(!n){n={}}g.priv.call("file.getVideo",n,o&&function(q){var p={uri:q,name:"Video",type:"video"};o(p)},m)},getLocal:function(n,o,m){j.tools.getURL(n,function(p){o({uri:p,name:n})},m)},base64:function(n,o,m){g.priv.call("file.base64",n,o,m)},string:function(n,o,m){j.request.ajax({url:n.uri,success:o,error:m})},URL:function(o,p,q,n){if(typeof p==="function"){n=q;q=p}var m={};for(prop in o){m[prop]=o[prop]}m.height=p.height||o.height||undefined;m.width=p.width||o.width||undefined;g.priv.call("file.URL",m,q,n)},isFile:function(n,o,m){if(!n||!("uri" in n)){o(false)}else{g.priv.call("file.isFile",n,o,m)}},cacheURL:function(n,o,m){g.priv.call("file.cacheURL",{url:n},o&&function(p){o({uri:p})},m)},remove:function(n,o,m){g.priv.call("file.remove",n,o,m)},clearCache:function(n,m){g.priv.call("file.clearCache",{},n,m)}};j.geolocation={getCurrentPosition:function(p,o,q){if(typeof(p)==="object"){var n=p,r=o,m=q}else{var r=p,m=o,n=q}g.disabledModule(m,"geolocation")}};j.internal={ping:function(n,o,m){g.priv.call("internal.ping",{data:[n]},o,m)},call:g.priv.call};j.is={mobile:function(){return false},desktop:function(){return false},android:function(){return false},ios:function(){return false},chrome:function(){return false},firefox:function(){return false},safari:function(){return false},ie:function(){return false},web:function(){return false},orientation:{portrait:function(){return false},landscape:function(){return false}},connection:{connected:function(){return true},wifi:function(){return true}}};var d=function(s,q,t){var o=[];stylize=function(v,u){return v};function m(u){return u instanceof RegExp||(typeof u==="object"&&Object.prototype.toString.call(u)==="[object RegExp]")}function n(u){return u instanceof Array||Array.isArray(u)||(u&&u!==Object.prototype&&n(u.__proto__))}function p(w){if(w instanceof Date){return true}if(typeof w!=="object"){return false}var u=Date.prototype&&Object.getOwnPropertyNames(Date.prototype);var v=w.__proto__&&Object.getOwnPropertyNames(w.__proto__);return JSON.stringify(v)===JSON.stringify(u)}function r(G,D){try{if(G&&typeof G.inspect==="function"&&!(G.constructor&&G.constructor.prototype===G)){return G.inspect(D)}switch(typeof G){case"undefined":return stylize("undefined","undefined");case"string":var u="'"+JSON.stringify(G).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return stylize(u,"string");case"number":return stylize(""+G,"number");case"boolean":return stylize(""+G,"boolean")}if(G===null){return stylize("null","null")}if(G instanceof Document){return(new XMLSerializer()).serializeToString(G)}var A=Object.keys(G);var H=q?Object.getOwnPropertyNames(G):A;if(typeof G==="function"&&H.length===0){var v=G.name?": "+G.name:"";return stylize("[Function"+v+"]","special")}if(m(G)&&H.length===0){return stylize(""+G,"regexp")}if(p(G)&&H.length===0){return stylize(G.toUTCString(),"date")}var w,E,B;if(n(G)){E="Array";B=["[","]"]}else{E="Object";B=["{","}"]}if(typeof G==="function"){var z=G.name?": "+G.name:"";w=" [Function"+z+"]"}else{w=""}if(m(G)){w=" "+G}if(p(G)){w=" "+G.toUTCString()}if(H.length===0){return B[0]+w+B[1]}if(D<0){if(m(G)){return stylize(""+G,"regexp")}else{return stylize("[Object]","special")}}o.push(G);var y=H.map(function(J){var I,K;if(G.__lookupGetter__){if(G.__lookupGetter__(J)){if(G.__lookupSetter__(J)){K=stylize("[Getter/Setter]","special")}else{K=stylize("[Getter]","special")}}else{if(G.__lookupSetter__(J)){K=stylize("[Setter]","special")}}}if(A.indexOf(J)<0){I="["+J+"]"}if(!K){if(o.indexOf(G[J])<0){if(D===null){K=r(G[J])}else{K=r(G[J],D-1)}if(K.indexOf("\n")>-1){if(n(G)){K=K.split("\n").map(function(L){return"  "+L}).join("\n").substr(2)}else{K="\n"+K.split("\n").map(function(L){return"   "+L}).join("\n")}}}else{K=stylize("[Circular]","special")}}if(typeof I==="undefined"){if(E==="Array"&&J.match(/^\d+$/)){return K}I=JSON.stringify(""+J);if(I.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){I=I.substr(1,I.length-2);I=stylize(I,"name")}else{I=I.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");I=stylize(I,"string")}}return I+": "+K});o.pop();var F=0;var x=y.reduce(function(I,J){F++;if(J.indexOf("\n")>=0){F++}return I+J.length+1},0);if(x>50){y=B[0]+(w===""?"":w+"\n ")+" "+y.join(",\n  ")+" "+B[1]}else{y=B[0]+w+" "+y.join(", ")+" "+B[1]}return y}catch(C){return"[No string representation]"}}return r(s,(typeof t==="undefined"?2:t))};var h=function(n,o){if("logging" in j.config){var m=j.config.logging.marker||"FORGE"}else{var m="FORGE"}n="["+m+"] "+(n.indexOf("\n")===-1?"":"\n")+n;g.priv.call("logging.log",{message:n,level:o});if(typeof console!=="undefined"){switch(o){case 10:if(console.debug!==undefined&&!(console.debug.toString&&console.debug.toString().match("alert"))){console.debug(n)}break;case 30:if(console.warn!==undefined&&!(console.warn.toString&&console.warn.toString().match("alert"))){console.warn(n)}break;case 40:case 50:if(console.error!==undefined&&!(console.error.toString&&console.error.toString().match("alert"))){console.error(n)}break;default:case 20:if(console.info!==undefined&&!(console.info.toString&&console.info.toString().match("alert"))){console.info(n)}break}}};var a=function(m,n){if(m in j.logging.LEVELS){return j.logging.LEVELS[m]}else{j.logging.__logMessage("Unknown configured logging level: "+m);return n}};var b=function(n){var q=function(r){if(r.message){return r.message}else{if(r.description){return r.description}else{return""+r}}};if(n){var p="\nError: "+q(n);try{if(n.lineNumber){p+=" on line number "+n.lineNumber}if(n.fileName){var m=n.fileName;p+=" in file "+m.substr(m.lastIndexOf("/")+1)}}catch(o){}if(n.stack){p+="\r\nStack trace:\r\n"+n.stack}return p}return""};j.logging={LEVELS:{ALL:0,DEBUG:10,INFO:20,WARNING:30,ERROR:40,CRITICAL:50},debug:function(n,m){j.logging.log(n,m,j.logging.LEVELS.DEBUG)},info:function(n,m){j.logging.log(n,m,j.logging.LEVELS.INFO)},warning:function(n,m){j.logging.log(n,m,j.logging.LEVELS.WARNING)},error:function(n,m){j.logging.log(n,m,j.logging.LEVELS.ERROR)},critical:function(n,m){j.logging.log(n,m,j.logging.LEVELS.CRITICAL)},log:function(n,m,q){if(typeof(q)==="undefined"){var q=j.logging.LEVELS.INFO}try{var o=a(j.config.logging.level,j.logging.LEVELS.ALL)}catch(p){var o=j.logging.LEVELS.ALL}if(q>=o){h(d(n,false,10)+b(m),q)}}};j.media={videoPlay:function(n,o,m){g.disabledModule(m,"media")}};j.message={listen:function(n,o,m){m&&m({message:"Forge Error: message.listen must be overridden by platform specific code",type:"UNAVAILABLE"})},broadcast:function(n,o,p,m){m&&m({message:"Forge Error: message.broadcast must be overridden by platform specific code",type:"UNAVAILABLE"})},broadcastBackground:function(n,o,p,m){m&&m({message:"Forge Error: message.broadcastBackground must be overridden by platform specific code",type:"UNAVAILABLE"})},toFocussed:function(n,o,p,m){g.priv.call("message.toFocussed",{type:n,content:o},p,m)}};j.notification={create:function(p,o,n,m){g.disabledModule(m,"notification")}};j.payments={purchaseProduct:function(n,o,m){g.priv.call("payments.purchaseProduct",{product:n},o,m)},restoreTransactions:function(n,m){g.priv.call("payments.restoreTransactions",{},n,m)},transactionReceived:{addListener:function(n,m){g.addEventListener("payments.transactionReceived",function(p){var o=function(){if(p.notificationId){g.priv.call("payments.confirmNotification",{id:p.notificationId})}};n(p,o)})}}};setTimeout(function(){if(!g.listeners["payments.transactionReceived"]){j.logging.warning("Payments module enabled but no 'forge.payments.transactionReceived' listener, see the 'payments' module documentation for more details.")}},5000);j.prefs={get:function(n,o,m){g.priv.call("prefs.get",{key:n.toString()},o&&function(p){if(p==="undefined"){p=undefined}else{try{p=JSON.parse(p)}catch(q){m({message:q.toString()});return}}o(p)},m)},set:function(n,o,p,m){if(o===undefined){o="undefined"}else{o=JSON.stringify(o)}g.priv.call("prefs.set",{key:n.toString(),value:o},p,m)},keys:function(n,m){g.priv.call("prefs.keys",{},n,m)},all:function(n,m){var n=n&&function(o){for(key in o){if(o[key]==="undefined"){o[key]=undefined}else{o[key]=JSON.parse(o[key])}}n(o)};g.priv.call("prefs.all",{},n,m)},clear:function(n,o,m){g.priv.call("prefs.clear",{key:n.toString()},o,m)},clearAll:function(n,m){g.priv.call("prefs.clearAll",{},n,m)}};j.reload={updateAvailable:function(n,m){g.priv.call("reload.updateAvailable",{},n,m)},update:function(n,m){g.priv.call("reload.update",{},n,m)},applyNow:function(n,m){g.priv.call("reload.applyNow",{},n,m)},switchStream:function(n,o,m){g.priv.call("reload.switchStream",{streamid:n},o,m)},updateReady:{addListener:function(n,m){g.addEventListener("reload.updateReady",n)}}};j.request={get:function(n,o,m){j.request.ajax({url:n,dataType:"text",success:o&&function(){try{arguments[0]=JSON.parse(arguments[0])}catch(p){}o.apply(this,arguments)},error:m})}};j.sms={send:function(o,n,m){g.disabledModule(m,"sms")}};j.tabbar={show:function(n,m){g.priv.call("tabbar.show",{},n,m)},hide:function(n,m){g.priv.call("tabbar.hide",{},n,m)},addButton:function(o,n,m){if(o.icon&&o.icon[0]==="/"){o.icon=o.icon.substr(1)}g.priv.call("tabbar.addButton",o,function(p){n&&n({remove:function(r,q){g.priv.call("tabbar.removeButton",{id:p},r,q)},setActive:function(r,q){g.priv.call("tabbar.setActive",{id:p},r,q)},onPressed:{addListener:function(r,q){g.addEventListener("tabbar.buttonPressed."+p,r)}}})},m)},removeButtons:function(n,m){g.priv.call("tabbar.removeButtons",{},n,m)},setTint:function(m,o,n){g.priv.call("tabbar.setTint",{color:m},o,n)},setActiveTint:function(m,o,n){g.priv.call("tabbar.setActiveTint",{color:m},o,n)},setInactive:function(n,m){g.priv.call("tabbar.setInactive",{},n,m)}};var k=function(q){if(q=="<all_urls>"){q="*://*"}q=q.split("://");var m=q[0];var o,p;if(q[1].indexOf("/")===-1){o=q[1];p=""}else{o=q[1].substring(0,q[1].indexOf("/"));p=q[1].substring(q[1].indexOf("/"))}var n="";if(m=="*"){n+=".*://"}else{n+=m+"://"}if(o=="*"){n+=".*"}else{if(o.indexOf("*.")===0){n+="(.+.)?"+o.substring(2)}else{n+=o}}n+=p.replace(/\*/g,".*");return"^"+n+"$"};j.tabs={open:function(n,o,p,m){if(typeof o==="function"){m=p;p=o;o=false}g.priv.call("tabs.open",{url:n,keepFocus:o},p,m)},openWithOptions:function(n,p,m){var o=undefined;if(n.pattern){n.pattern=k(n.pattern)}g.priv.call("tabs.open",n,p,m)},closeCurrent:function(m){m=arguments[1]||m;var n=j.tools.UUID();location.hash=n;g.priv.call("tabs.closeCurrent",{hash:n},null,m)}};j.tools={UUID:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(o){var n=Math.random()*16|0;var m=o=="x"?n:(n&3|8);return m.toString(16)}).toUpperCase()},getURL:function(n,o,m){g.priv.call("tools.getURL",{name:n.toString()},o,m)}};j.topbar={show:function(n,m){g.priv.call("topbar.show",{},n,m)},hide:function(n,m){g.priv.call("topbar.hide",{},n,m)},setTitle:function(o,n,m){g.priv.call("topbar.setTitle",{title:o},n,m)},setTitleImage:function(n,o,m){if(n&&n[0]==="/"){n=n.substr(1)}g.priv.call("topbar.setTitleImage",{icon:n},o,m)},setTint:function(m,o,n){g.priv.call("topbar.setTint",{color:m},o,n)},addButton:function(n,o,m){if(n.icon&&n.icon[0]==="/"){n.icon=n.icon.substr(1)}g.priv.call("topbar.addButton",n,function(p){o&&g.addEventListener("topbar.buttonPressed."+p,o)},m)},removeButtons:function(n,m){g.priv.call("topbar.removeButtons",{},n,m)},homePressed:{addListener:function(n,m){g.addEventListener("topbar.homePressed",n)}}};g.priv.send=function(n){if(window.__forge["callJavaFromJavaScript"]===undefined){return}var m=((n.params!==undefined)?JSON.stringify(n.params):"");window.__forge["callJavaFromJavaScript"](n.callid,n.method,m)};g.priv.get=function(){var m=JSON.parse(window.__forge["getObjects"]());m.forEach(function(n){g.priv.receive(n)})};g.priv.get();window.addEventListener("load",function(){g.priv.call("internal.hideLaunchImage",{},function(){},function(){})},false);j._get=g.priv.get;window.forge=j;window.forge["reload"]={updateAvailable:j.reload.updateAvailable,update:j.reload.update,applyNow:j.reload.applyNow,switchStream:j.reload.switchStream,updateReady:{addListener:j.reload.updateReady.addListener}};window.forge["ajax"]=j.request.ajax;window.forge["getPage"]=j.request.get;window.forge["createNotification"]=j.notification.create;window.forge["UUID"]=j.tools.UUID;window.forge["getURL"]=j.tools.getURL;window.forge["log"]=j.logging.log;window.forge["button"]["setUrl"]=j.button.setURL;window.forge["button"]["setBadgeText"]=j.button.setBadge;window.forge["file"]["delete"]=j.file.remove;window.forge["file"]["imageURL"]=j.file.URL})();