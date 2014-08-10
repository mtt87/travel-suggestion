!function(a,b){if("object"==typeof exports&&exports)b(exports);else{var c={};b(c),"function"==typeof define&&define.amd?define(c):a.Mustache=c}}(this,function(a){function b(a,b){return n.call(a,b)}function c(a){return!b(o,a)}function d(a){return"function"==typeof a}function e(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function f(a){return String(a).replace(/[&<>"'\/]/g,function(a){return r[a]})}function g(a){if(!q(a)||2!==a.length)throw new Error("Invalid tags: "+a);return[new RegExp(e(a[0])+"\\s*"),new RegExp("\\s*"+e(a[1]))]}function h(b,d){function f(){if(A&&!B)for(;z.length;)delete y[z.pop()];else z=[];A=!1,B=!1}d=d||a.tags,b=b||"","string"==typeof d&&(d=d.split(t));for(var h,l,m,n,o,p,q=g(d),r=new k(b),x=[],y=[],z=[],A=!1,B=!1;!r.eos();){if(h=r.pos,m=r.scanUntil(q[0]))for(var C=0,D=m.length;D>C;++C)n=m.charAt(C),c(n)?z.push(y.length):B=!0,y.push(["text",n,h,h+1]),h+=1,"\n"===n&&f();if(!r.scan(q[0]))break;if(A=!0,l=r.scan(w)||"name",r.scan(s),"="===l?(m=r.scanUntil(u),r.scan(u),r.scanUntil(q[1])):"{"===l?(m=r.scanUntil(new RegExp("\\s*"+e("}"+d[1]))),r.scan(v),r.scanUntil(q[1]),l="&"):m=r.scanUntil(q[1]),!r.scan(q[1]))throw new Error("Unclosed tag at "+r.pos);if(o=[l,m,h,r.pos],y.push(o),"#"===l||"^"===l)x.push(o);else if("/"===l){if(p=x.pop(),!p)throw new Error('Unopened section "'+m+'" at '+h);if(p[1]!==m)throw new Error('Unclosed section "'+p[1]+'" at '+h)}else"name"===l||"{"===l||"&"===l?B=!0:"="===l&&(q=g(d=m.split(t)))}if(p=x.pop())throw new Error('Unclosed section "'+p[1]+'" at '+r.pos);return j(i(y))}function i(a){for(var b,c,d=[],e=0,f=a.length;f>e;++e)b=a[e],b&&("text"===b[0]&&c&&"text"===c[0]?(c[1]+=b[1],c[3]=b[3]):(d.push(b),c=b));return d}function j(a){for(var b,c,d=[],e=d,f=[],g=0,h=a.length;h>g;++g)switch(b=a[g],b[0]){case"#":case"^":e.push(b),f.push(b),e=b[4]=[];break;case"/":c=f.pop(),c[5]=b[2],e=f.length>0?f[f.length-1][4]:d;break;default:e.push(b)}return d}function k(a){this.string=a,this.tail=a,this.pos=0}function l(a,b){this.view=null==a?{}:a,this.cache={".":this.view},this.parent=b}function m(){this.cache={}}var n=RegExp.prototype.test,o=/\S/,p=Object.prototype.toString,q=Array.isArray||function(a){return"[object Array]"===p.call(a)},r={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},s=/\s*/,t=/\s+/,u=/\s*=/,v=/\s*\}/,w=/#|\^|\/|>|\{|&|=|!/;k.prototype.eos=function(){return""===this.tail},k.prototype.scan=function(a){var b=this.tail.match(a);if(b&&0===b.index){var c=b[0];return this.tail=this.tail.substring(c.length),this.pos+=c.length,c}return""},k.prototype.scanUntil=function(a){var b,c=this.tail.search(a);switch(c){case-1:b=this.tail,this.tail="";break;case 0:b="";break;default:b=this.tail.substring(0,c),this.tail=this.tail.substring(c)}return this.pos+=b.length,b},l.prototype.push=function(a){return new l(a,this)},l.prototype.lookup=function(a){var b;if(a in this.cache)b=this.cache[a];else{for(var c=this;c;){if(a.indexOf(".")>0){b=c.view;for(var e=a.split("."),f=0;null!=b&&f<e.length;)b=b[e[f++]]}else b=c.view[a];if(null!=b)break;c=c.parent}this.cache[a]=b}return d(b)&&(b=b.call(this.view)),b},m.prototype.clearCache=function(){this.cache={}},m.prototype.parse=function(a,b){var c=this.cache,d=c[a];return null==d&&(d=c[a]=h(a,b)),d},m.prototype.render=function(a,b,c){var d=this.parse(a),e=b instanceof l?b:new l(b);return this.renderTokens(d,e,c,a)},m.prototype.renderTokens=function(b,c,e,f){function g(a){return k.render(a,c,e)}for(var h,i,j="",k=this,l=0,m=b.length;m>l;++l)switch(h=b[l],h[0]){case"#":if(i=c.lookup(h[1]),!i)continue;if(q(i))for(var n=0,o=i.length;o>n;++n)j+=this.renderTokens(h[4],c.push(i[n]),e,f);else if("object"==typeof i||"string"==typeof i)j+=this.renderTokens(h[4],c.push(i),e,f);else if(d(i)){if("string"!=typeof f)throw new Error("Cannot use higher-order sections without the original template");i=i.call(c.view,f.slice(h[3],h[5]),g),null!=i&&(j+=i)}else j+=this.renderTokens(h[4],c,e,f);break;case"^":i=c.lookup(h[1]),(!i||q(i)&&0===i.length)&&(j+=this.renderTokens(h[4],c,e,f));break;case">":if(!e)continue;i=d(e)?e(h[1]):e[h[1]],null!=i&&(j+=this.renderTokens(this.parse(i),c,e,i));break;case"&":i=c.lookup(h[1]),null!=i&&(j+=i);break;case"name":i=c.lookup(h[1]),null!=i&&(j+=a.escape(i));break;case"text":j+=h[1]}return j},a.name="mustache.js",a.version="0.8.1",a.tags=["{{","}}"];var x=new m;a.clearCache=function(){return x.clearCache()},a.parse=function(a,b){return x.parse(a,b)},a.render=function(a,b,c){return x.render(a,b,c)},a.to_html=function(b,c,e,f){var g=a.render(b,c,e);return d(f)?void f(g):g},a.escape=f,a.Scanner=k,a.Context=l,a.Writer=m});