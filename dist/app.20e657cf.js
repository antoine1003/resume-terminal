// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"YalK":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"D69l":[function(require,module,exports) {
var define;
var process = require("process");
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Typewriter",[],t):"object"==typeof exports?exports.Typewriter=t():e.Typewriter=t()}("undefined"!=typeof self?self:this,(function(){return(()=>{var e={75:function(e){(function(){var t,n,r,o,a,s;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:"undefined"!=typeof process&&null!==process&&process.hrtime?(e.exports=function(){return(t()-a)/1e6},n=process.hrtime,o=(t=function(){var e;return 1e9*(e=n())[0]+e[1]})(),s=1e9*process.uptime(),a=o-s):Date.now?(e.exports=function(){return Date.now()-r},r=Date.now()):(e.exports=function(){return(new Date).getTime()-r},r=(new Date).getTime())}).call(this)},4087:(e,t,n)=>{for(var r=n(75),o="undefined"==typeof window?n.g:window,a=["moz","webkit"],s="AnimationFrame",i=o["request"+s],u=o["cancel"+s]||o["cancelRequest"+s],l=0;!i&&l<a.length;l++)i=o[a[l]+"Request"+s],u=o[a[l]+"Cancel"+s]||o[a[l]+"CancelRequest"+s];if(!i||!u){var c=0,p=0,d=[];i=function(e){if(0===d.length){var t=r(),n=Math.max(0,16.666666666666668-(t-c));c=n+t,setTimeout((function(){var e=d.slice(0);d.length=0;for(var t=0;t<e.length;t++)if(!e[t].cancelled)try{e[t].callback(c)}catch(e){setTimeout((function(){throw e}),0)}}),Math.round(n))}return d.push({handle:++p,callback:e,cancelled:!1}),p},u=function(e){for(var t=0;t<d.length;t++)d[t].handle===e&&(d[t].cancelled=!0)}}e.exports=function(e){return i.call(o,e)},e.exports.cancel=function(){u.apply(o,arguments)},e.exports.polyfill=function(e){e||(e=o),e.requestAnimationFrame=i,e.cancelAnimationFrame=u}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var r={};return(()=>{"use strict";n.d(r,{default:()=>S});var e=n(4087),t=n.n(e);const o=function(e){return new RegExp(/<[a-z][\s\S]*>/i).test(e)},a=function(e){var t=document.createElement("div");return t.innerHTML=e,t.childNodes},s=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};var i="TYPE_CHARACTER",u="REMOVE_CHARACTER",l="REMOVE_ALL",c="REMOVE_LAST_VISIBLE_NODE",p="PAUSE_FOR",d="CALL_FUNCTION",f="ADD_HTML_TAG_ELEMENT",v="CHANGE_DELETE_SPEED",h="CHANGE_DELAY",m="CHANGE_CURSOR",y="PASTE_STRING",g="HTML_TAG";function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function w(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?E(Object(n),!0).forEach((function(t){N(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function T(e){return function(e){if(Array.isArray(e))return b(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return b(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function A(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function N(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const S=function(){function n(r,E){var b=this;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),N(this,"state",{cursorAnimation:null,lastFrameTime:null,pauseUntil:null,eventQueue:[],eventLoop:null,eventLoopPaused:!1,reverseCalledEvents:[],calledEvents:[],visibleNodes:[],initialOptions:null,elements:{container:null,wrapper:document.createElement("span"),cursor:document.createElement("span")}}),N(this,"options",{strings:null,cursor:"|",delay:"natural",pauseFor:1500,deleteSpeed:"natural",loop:!1,autoStart:!1,devMode:!1,skipAddStyles:!1,wrapperClassName:"Typewriter__wrapper",cursorClassName:"Typewriter__cursor",stringSplitter:null,onCreateTextNode:null,onRemoveNode:null}),N(this,"setupWrapperElement",(function(){b.state.elements.container&&(b.state.elements.wrapper.className=b.options.wrapperClassName,b.state.elements.cursor.className=b.options.cursorClassName,b.state.elements.cursor.innerHTML=b.options.cursor,b.state.elements.container.innerHTML="",b.state.elements.container.appendChild(b.state.elements.wrapper),b.state.elements.container.appendChild(b.state.elements.cursor))})),N(this,"start",(function(){return b.state.eventLoopPaused=!1,b.runEventLoop(),b})),N(this,"pause",(function(){return b.state.eventLoopPaused=!0,b})),N(this,"stop",(function(){return b.state.eventLoop&&((0,e.cancel)(b.state.eventLoop),b.state.eventLoop=null),b})),N(this,"pauseFor",(function(e){return b.addEventToQueue(p,{ms:e}),b})),N(this,"typeOutAllStrings",(function(){return"string"==typeof b.options.strings?(b.typeString(b.options.strings).pauseFor(b.options.pauseFor),b):(b.options.strings.forEach((function(e){b.typeString(e).pauseFor(b.options.pauseFor).deleteAll(b.options.deleteSpeed)})),b)})),N(this,"typeString",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(o(e))return b.typeOutHTMLString(e,t);if(e){var n=b.options||{},r=n.stringSplitter,a="function"==typeof r?r(e):e.split("");b.typeCharacters(a,t)}return b})),N(this,"pasteString",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return o(e)?b.typeOutHTMLString(e,t,!0):(e&&b.addEventToQueue(y,{character:e,node:t}),b)})),N(this,"typeOutHTMLString",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2?arguments[2]:void 0,r=a(e);if(r.length>0)for(var o=0;o<r.length;o++){var s=r[o],i=s.innerHTML;s&&3!==s.nodeType?(s.innerHTML="",b.addEventToQueue(f,{node:s,parentNode:t}),n?b.pasteString(i,s):b.typeString(i,s)):s.textContent&&(n?b.pasteString(s.textContent,t):b.typeString(s.textContent,t))}return b})),N(this,"deleteAll",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"natural";return b.addEventToQueue(l,{speed:e}),b})),N(this,"changeDeleteSpeed",(function(e){if(!e)throw new Error("Must provide new delete speed");return b.addEventToQueue(v,{speed:e}),b})),N(this,"changeDelay",(function(e){if(!e)throw new Error("Must provide new delay");return b.addEventToQueue(h,{delay:e}),b})),N(this,"changeCursor",(function(e){if(!e)throw new Error("Must provide new cursor");return b.addEventToQueue(m,{cursor:e}),b})),N(this,"deleteChars",(function(e){if(!e)throw new Error("Must provide amount of characters to delete");for(var t=0;t<e;t++)b.addEventToQueue(u);return b})),N(this,"callFunction",(function(e,t){if(!e||"function"!=typeof e)throw new Error("Callbak must be a function");return b.addEventToQueue(d,{cb:e,thisArg:t}),b})),N(this,"typeCharacters",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(!e||!Array.isArray(e))throw new Error("Characters must be an array");return e.forEach((function(e){b.addEventToQueue(i,{character:e,node:t})})),b})),N(this,"removeCharacters",(function(e){if(!e||!Array.isArray(e))throw new Error("Characters must be an array");return e.forEach((function(){b.addEventToQueue(u)})),b})),N(this,"addEventToQueue",(function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return b.addEventToStateProperty(e,t,n,"eventQueue")})),N(this,"addReverseCalledEvent",(function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=b.options.loop;return r?b.addEventToStateProperty(e,t,n,"reverseCalledEvents"):b})),N(this,"addEventToStateProperty",(function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3?arguments[3]:void 0,o={eventName:e,eventArgs:t||{}};return b.state[r]=n?[o].concat(T(b.state[r])):[].concat(T(b.state[r]),[o]),b})),N(this,"runEventLoop",(function(){b.state.lastFrameTime||(b.state.lastFrameTime=Date.now());var e=Date.now(),n=e-b.state.lastFrameTime;if(!b.state.eventQueue.length){if(!b.options.loop)return;b.state.eventQueue=T(b.state.calledEvents),b.state.calledEvents=[],b.options=w({},b.state.initialOptions)}if(b.state.eventLoop=t()(b.runEventLoop),!b.state.eventLoopPaused){if(b.state.pauseUntil){if(e<b.state.pauseUntil)return;b.state.pauseUntil=null}var r,o=T(b.state.eventQueue),a=o.shift();if(!(n<=(r=a.eventName===c||a.eventName===u?"natural"===b.options.deleteSpeed?s(40,80):b.options.deleteSpeed:"natural"===b.options.delay?s(120,160):b.options.delay))){var E=a.eventName,A=a.eventArgs;switch(b.logInDevMode({currentEvent:a,state:b.state,delay:r}),E){case y:case i:var N=A.character,S=A.node,C=document.createTextNode(N),_=C;b.options.onCreateTextNode&&"function"==typeof b.options.onCreateTextNode&&(_=b.options.onCreateTextNode(N,C)),_&&(S?S.appendChild(_):b.state.elements.wrapper.appendChild(_)),b.state.visibleNodes=[].concat(T(b.state.visibleNodes),[{type:"TEXT_NODE",character:N,node:_}]);break;case u:o.unshift({eventName:c,eventArgs:{removingCharacterNode:!0}});break;case p:var O=a.eventArgs.ms;b.state.pauseUntil=Date.now()+parseInt(O);break;case d:var L=a.eventArgs,D=L.cb,M=L.thisArg;D.call(M,{elements:b.state.elements});break;case f:var x=a.eventArgs,P=x.node,R=x.parentNode;R?R.appendChild(P):b.state.elements.wrapper.appendChild(P),b.state.visibleNodes=[].concat(T(b.state.visibleNodes),[{type:g,node:P,parentNode:R||b.state.elements.wrapper}]);break;case l:var j=b.state.visibleNodes,k=A.speed,Q=[];k&&Q.push({eventName:v,eventArgs:{speed:k,temp:!0}});for(var F=0,H=j.length;F<H;F++)Q.push({eventName:c,eventArgs:{removingCharacterNode:!1}});k&&Q.push({eventName:v,eventArgs:{speed:b.options.deleteSpeed,temp:!0}}),o.unshift.apply(o,Q);break;case c:var I=a.eventArgs.removingCharacterNode;if(b.state.visibleNodes.length){var U=b.state.visibleNodes.pop(),q=U.type,G=U.node,Y=U.character;b.options.onRemoveNode&&"function"==typeof b.options.onRemoveNode&&b.options.onRemoveNode({node:G,character:Y}),G&&G.parentNode.removeChild(G),q===g&&I&&o.unshift({eventName:c,eventArgs:{}})}break;case v:b.options.deleteSpeed=a.eventArgs.speed;break;case h:b.options.delay=a.eventArgs.delay;break;case m:b.options.cursor=a.eventArgs.cursor,b.state.elements.cursor.innerHTML=a.eventArgs.cursor}b.options.loop&&(a.eventName===c||a.eventArgs&&a.eventArgs.temp||(b.state.calledEvents=[].concat(T(b.state.calledEvents),[a]))),b.state.eventQueue=o,b.state.lastFrameTime=e}}})),r)if("string"==typeof r){var A=document.querySelector(r);if(!A)throw new Error("Could not find container element");this.state.elements.container=A}else this.state.elements.container=r;E&&(this.options=w(w({},this.options),E)),this.state.initialOptions=w({},this.options),this.init()}var r,E;return r=n,(E=[{key:"init",value:function(){var e,t;this.setupWrapperElement(),this.addEventToQueue(m,{cursor:this.options.cursor},!0),this.addEventToQueue(l,null,!0),!window||window.___TYPEWRITER_JS_STYLES_ADDED___||this.options.skipAddStyles||(e=".Typewriter__cursor{-webkit-animation:Typewriter-cursor 1s infinite;animation:Typewriter-cursor 1s infinite;margin-left:1px}@-webkit-keyframes Typewriter-cursor{0%{opacity:0}50%{opacity:1}100%{opacity:0}}@keyframes Typewriter-cursor{0%{opacity:0}50%{opacity:1}100%{opacity:0}}",(t=document.createElement("style")).appendChild(document.createTextNode(e)),document.head.appendChild(t),window.___TYPEWRITER_JS_STYLES_ADDED___=!0),!0===this.options.autoStart&&this.options.strings&&this.typeOutAllStrings().start()}},{key:"logInDevMode",value:function(e){this.options.devMode&&console.log(e)}}])&&A(r.prototype,E),n}()})(),r.default})()}));
},{"process":"YalK"}],"eR26":[function(require,module,exports) {
module.exports = [{
  "id": 1,
  "line": "whois adautry",
  "responseType": "list",
  "value": ["A 27 years old full stack developer", "3 years of experiences", "Living in Nantes"]
}, {
  "id": 2,
  "line": "whereis experiences",
  "responseType": "table",
  "headers": ["Date", "Client", "Description", "Tech"],
  "rows": [["2021", "La Poste", "Internal tool to schedule techniciens on interventions.", "Angular 11, Spring Boot/Batch, Genetic algorithm"], ["2020", "DSI", "Maintenance of a timesheet internal tool. Development of plugins for our ProjeQtor instance.", "Symfony, Angular 8"]]
}, {
  "id": 4,
  "line": "find . -type f -print | xargs grep \"hobby\"",
  "responseType": "list",
  "value": ["Music: Piano, Guitar", "Programming: JS, Angular, PHP"]
}];
},{}],"BrLT":[function(require,module,exports) {
module.exports = {
  "delayBetweenSteps": 2000,
  "enterDelay": 3500
};
},{}],"4HcS":[function(require,module,exports) {
/**
 * (c) 2013 Beau Sorensen
 * MIT Licensed
 * For all details and documentation:
 * https://github.com/sorensen/ascii-table
 */

;(function() {
'use strict';

/*!
 * Module dependencies
 */

var slice = Array.prototype.slice
  , toString = Object.prototype.toString

/**
 * AsciiTable constructor
 *
 * @param {String|Object} title or JSON table
 * @param {Object} table options
 *  - `prefix` - string prefix added to each line on render
 * @constructor
 * @api public
 */

function AsciiTable(name, options) {
  this.options = options || {}
  this.reset(name)
}

/*!
 * Current library version, should match `package.json`
 */

AsciiTable.VERSION = '0.0.8'

/*!
 * Alignment constants
 */

AsciiTable.LEFT = 0
AsciiTable.CENTER = 1
AsciiTable.RIGHT = 2

/*!
 * Static methods
 */

/**
 * Create a new table instance
 *
 * @param {String|Object} title or JSON table
 * @param {Object} table options
 * @api public
 */

AsciiTable.factory = function(name, options) {
  return new AsciiTable(name, options)
}

/**
 * Align the a string at the given length
 *
 * @param {Number} direction
 * @param {String} string input
 * @param {Number} string length
 * @param {Number} padding character
 * @api public
 */

AsciiTable.align = function(dir, str, len, pad) {
  if (dir === AsciiTable.LEFT) return AsciiTable.alignLeft(str, len, pad)
  if (dir === AsciiTable.RIGHT) return AsciiTable.alignRight(str, len, pad)
  if (dir === AsciiTable.CENTER) return AsciiTable.alignCenter(str, len, pad)
  return AsciiTable.alignAuto(str, len, pad)
}

/**
 * Left align a string by padding it at a given length
 *
 * @param {String} str
 * @param {Number} string length
 * @param {String} padding character (optional, default '')
 * @api public
 */

AsciiTable.alignLeft = function(str, len, pad) {
  if (!len || len < 0) return ''
  if (str === undefined || str === null) str = ''
  if (typeof pad === 'undefined') pad = ' '
  if (typeof str !== 'string') str = str.toString()
  var alen = len + 1 - str.length
  if (alen <= 0) return str
  return str + Array(len + 1 - str.length).join(pad)
}

/**
 * Center align a string by padding it at a given length
 *
 * @param {String} str
 * @param {Number} string length
 * @param {String} padding character (optional, default '')
 * @api public
 */

AsciiTable.alignCenter = function(str, len, pad) {
  if (!len || len < 0) return ''
  if (str === undefined || str === null) str = ''
  if (typeof pad === 'undefined') pad = ' '
  if (typeof str !== 'string') str = str.toString()
  var nLen = str.length
    , half = Math.floor(len / 2 - nLen / 2)
    , odds = Math.abs((nLen % 2) - (len % 2))
    , len = str.length

  return AsciiTable.alignRight('', half, pad) 
    + str
    + AsciiTable.alignLeft('', half + odds, pad)
}

/**
 * Right align a string by padding it at a given length
 *
 * @param {String} str
 * @param {Number} string length
 * @param {String} padding character (optional, default '')
 * @api public
 */

AsciiTable.alignRight = function(str, len, pad) {
  if (!len || len < 0) return ''
  if (str === undefined || str === null) str = ''
  if (typeof pad === 'undefined') pad = ' '
  if (typeof str !== 'string') str = str.toString()
  var alen = len + 1 - str.length
  if (alen <= 0) return str
  return Array(len + 1 - str.length).join(pad) + str
}

/**
 * Auto align string value based on object type
 *
 * @param {Any} object to string
 * @param {Number} string length
 * @param {String} padding character (optional, default '')
 * @api public
 */

AsciiTable.alignAuto = function(str, len, pad) {
  if (str === undefined || str === null) str = ''
  var type = toString.call(str)
  pad || (pad = ' ')
  len = +len
  if (type !== '[object String]') {
    str = str.toString()
  }
  if (str.length < len) {
    switch(type) {
      case '[object Number]': return AsciiTable.alignRight(str, len, pad)
      default: return AsciiTable.alignLeft(str, len, pad)
    }
  }
  return str
}

/**
 * Fill an array at a given size with the given value
 *
 * @param {Number} array size
 * @param {Any} fill value
 * @return {Array} filled array
 * @api public
 */

AsciiTable.arrayFill = function(len, fill) {
  var arr = new Array(len)
  for (var i = 0; i !== len; i++) {
    arr[i] = fill;
  }
  return arr
}

/*!
 * Instance methods
 */

/**
 * Reset the table state back to defaults
 *
 * @param {String|Object} title or JSON table
 * @api public
 */

AsciiTable.prototype.reset = 
AsciiTable.prototype.clear = function(name) {
  this.__name = ''
  this.__nameAlign = AsciiTable.CENTER
  this.__rows = []
  this.__maxCells = 0
  this.__aligns = []
  this.__colMaxes = []
  this.__spacing = 1
  this.__heading = null
  this.__headingAlign = AsciiTable.CENTER
  this.setBorder()

  if (toString.call(name) === '[object String]') {
    this.__name = name
  } else if (toString.call(name) === '[object Object]') {
    this.fromJSON(name)
  }
  return this
}

/**
 * Set the table border
 *
 * @param {String} horizontal edges (optional, default `|`)
 * @param {String} vertical edges (optional, default `-`)
 * @param {String} top corners (optional, default `.`)
 * @param {String} bottom corners (optional, default `'`)
 * @api public
 */

AsciiTable.prototype.setBorder = function(edge, fill, top, bottom) {
  this.__border = true
  if (arguments.length === 1) {
    fill = top = bottom = edge
  }
  this.__edge = edge || '|'
  this.__fill = fill || '-'
  this.__top = top || '.'
  this.__bottom = bottom || "'"
  return this
}

/**
 * Remove all table borders
 *
 * @api public
 */

AsciiTable.prototype.removeBorder = function() {
  this.__border = false
  this.__edge = ' '
  this.__fill = ' '
  return this
}

/**
 * Set the column alignment at a given index
 *
 * @param {Number} column index
 * @param {Number} alignment direction
 * @api public
 */

AsciiTable.prototype.setAlign = function(idx, dir) {
  this.__aligns[idx] = dir
  return this
}

/**
 * Set the title of the table
 *
 * @param {String} title
 * @api public
 */

AsciiTable.prototype.setTitle = function(name) {
  this.__name = name
  return this
}

/**
 * Get the title of the table
 *
 * @return {String} title
 * @api public
 */

AsciiTable.prototype.getTitle = function() {
  return this.__name
}

/**
 * Set table title alignment
 *
 * @param {Number} direction
 * @api public
 */

AsciiTable.prototype.setTitleAlign = function(dir) {
  this.__nameAlign = dir
  return this
}

/**
 * AsciiTable sorting shortcut to sort rows
 *
 * @param {Function} sorting method
 * @api public
 */

AsciiTable.prototype.sort = function(method) {
  this.__rows.sort(method)
  return this
}

/**
 * Sort rows based on sort method for given column
 *
 * @param {Number} column index
 * @param {Function} sorting method
 * @api public
 */

AsciiTable.prototype.sortColumn = function(idx, method) {
  this.__rows.sort(function(a, b) {
    return method(a[idx], b[idx])
  })
  return this
}

/**
 * Set table heading for columns
 *
 * @api public
 */

AsciiTable.prototype.setHeading = function(row) {
  if (arguments.length > 1 || toString.call(row) !== '[object Array]') {
    row = slice.call(arguments)
  }
  this.__heading = row
  return this
}

/**
 * Get table heading for columns
 *
 * @return {Array} copy of headings
 * @api public
 */

AsciiTable.prototype.getHeading = function() {
  return this.__heading.slice()
}

/**
 * Set heading alignment
 *
 * @param {Number} direction
 * @api public
 */

AsciiTable.prototype.setHeadingAlign = function(dir) {
  this.__headingAlign = dir
  return this
}

/**
 * Add a row of information to the table
 * 
 * @param {...|Array} argument values in order of columns
 * @api public
 */

AsciiTable.prototype.addRow = function(row) {
  if (arguments.length > 1 || toString.call(row) !== '[object Array]') {
    row = slice.call(arguments)
  }
  this.__maxCells = Math.max(this.__maxCells, row.length)
  this.__rows.push(row)
  return this
}

/**
 * Get a copy of all rows of the table
 *
 * @return {Array} copy of rows
 * @api public
 */

AsciiTable.prototype.getRows = function() {
  return this.__rows.slice().map(function(row) {
    return row.slice()
  })
}

/**
 * Add rows in the format of a row matrix
 *
 * @param {Array} row matrix
 * @api public
 */

AsciiTable.prototype.addRowMatrix = function(rows) {
  for (var i = 0; i < rows.length; i++) {
    this.addRow(rows[i])
  }
  return this
}

/**
 * Add rows from the given data array, processed by the callback function rowCallback.
 *
 * @param {Array} data
 * @param (Function) rowCallback
 * @param (Boolean) asMatrix - controls if the row created by rowCallback should be assigned as row matrix
 * @api public
 */

AsciiTable.prototype.addData = function(data, rowCallback, asMatrix) {
  if (toString.call(data) !== '[object Array]') {
    return this;
  }
  for (var index = 0, limit = data.length; index < limit; index++) {
    var row = rowCallback(data[index]);
    if(asMatrix) {
      this.addRowMatrix(row);
    } else {
      this.addRow(row);
    }
  }
  return this
}

  /**
 * Reset the current row state
 *
 * @api public
 */

AsciiTable.prototype.clearRows = function() {
  this.__rows = []
  this.__maxCells = 0
  this.__colMaxes = []
  return this
}

/**
 * Apply an even spaced column justification
 *
 * @param {Boolean} on / off
 * @api public
 */

AsciiTable.prototype.setJustify = function(val) {
  arguments.length === 0 && (val = true)
  this.__justify = !!val
  return this
}

/**
 * Convert the current instance to a JSON structure
 *
 * @return {Object} json representation
 * @api public
 */

AsciiTable.prototype.toJSON = function() {
  return {
    title: this.getTitle()
  , heading: this.getHeading()
  , rows: this.getRows()
  }
}

/**
 * Populate the table from a JSON object
 *
 * @param {Object} json representation
 * @api public
 */

AsciiTable.prototype.parse = 
AsciiTable.prototype.fromJSON = function(obj) {
  return this
    .clear()
    .setTitle(obj.title)
    .setHeading(obj.heading)
    .addRowMatrix(obj.rows)
}

/**
 * Render the table with the current information
 *
 * @return {String} formatted table
 * @api public
 */

AsciiTable.prototype.render =
AsciiTable.prototype.valueOf =
AsciiTable.prototype.toString = function() {
  var self = this
    , body = []
    , mLen = this.__maxCells
    , max = AsciiTable.arrayFill(mLen, 0)
    , total = mLen * 3
    , rows = this.__rows
    , justify
    , border = this.__border
    , all = this.__heading 
        ? [this.__heading].concat(rows)
        : rows

  // Calculate max table cell lengths across all rows
  for (var i = 0; i < all.length; i++) {
    var row = all[i]
    for (var k = 0; k < mLen; k++) {
      var cell = row[k]
      max[k] = Math.max(max[k], cell ? cell.toString().length : 0)
    }
  }
  this.__colMaxes = max
  justify = this.__justify ? Math.max.apply(null, max) : 0

  // Get 
  max.forEach(function(x) {
    total += justify ? justify : x + self.__spacing
  })
  justify && (total += max.length)
  total -= this.__spacing

  // Heading
  border && body.push(this._seperator(total - mLen + 1, this.__top))
  if (this.__name) {
    body.push(this._renderTitle(total - mLen + 1))
    border && body.push(this._seperator(total - mLen + 1))
  }
  if (this.__heading) {
    body.push(this._renderRow(this.__heading, ' ', this.__headingAlign))
    body.push(this._rowSeperator(mLen, this.__fill))
  }
  for (var i = 0; i < this.__rows.length; i++) {
    body.push(this._renderRow(this.__rows[i], ' '))
  }
  border && body.push(this._seperator(total - mLen + 1, this.__bottom))

  var prefix = this.options.prefix || ''
  return prefix + body.join('\n' + prefix)
}

/**
 * Create a line seperator
 *
 * @param {Number} string size
 * @param {String} side values (default '|')
 * @api private
 */

AsciiTable.prototype._seperator = function(len, sep) {
  sep || (sep = this.__edge)
  return sep + AsciiTable.alignRight(sep, len, this.__fill)
}

/**
 * Create a row seperator
 *
 * @return {String} seperator
 * @api private
 */

AsciiTable.prototype._rowSeperator = function() {
  var blanks = AsciiTable.arrayFill(this.__maxCells, this.__fill)
  return this._renderRow(blanks, this.__fill)
}

/**
 * Render the table title in a centered box
 *
 * @param {Number} string size
 * @return {String} formatted title
 * @api private
 */

AsciiTable.prototype._renderTitle = function(len) {
  var name = ' ' + this.__name + ' '
    , str = AsciiTable.align(this.__nameAlign, name, len - 1, ' ')
  return this.__edge + str + this.__edge
}

/**
 * Render an invdividual row
 *
 * @param {Array} row
 * @param {String} column seperator
 * @param {Number} total row alignment (optional, default `auto`)
 * @return {String} formatted row
 * @api private
 */

AsciiTable.prototype._renderRow = function(row, str, align) {
  var tmp = ['']
    , max = this.__colMaxes

  for (var k = 0; k < this.__maxCells; k++) {
    var cell = row[k]
      , just = this.__justify ? Math.max.apply(null, max) : max[k]
      // , pad = k === this.__maxCells - 1 ? just : just + this.__spacing
      , pad = just
      , cAlign = this.__aligns[k]
      , use = align
      , method = 'alignAuto'
  
    if (typeof align === 'undefined') use = cAlign

    if (use === AsciiTable.LEFT) method = 'alignLeft'
    if (use === AsciiTable.CENTER) method = 'alignCenter'
    if (use === AsciiTable.RIGHT) method = 'alignRight'

    tmp.push(AsciiTable[method](cell, pad, str))
  }
  var front = tmp.join(str + this.__edge + str)
  front = front.substr(1, front.length)
  return front + str + this.__edge
}

/*!
 * Aliases
 */

// Create method shortcuts to all alignment methods for each direction
;['Left', 'Right', 'Center'].forEach(function(dir) {
  var constant = AsciiTable[dir.toUpperCase()]

  ;['setAlign', 'setTitleAlign', 'setHeadingAlign'].forEach(function(method) {
    // Call the base method with the direction constant as the last argument
    AsciiTable.prototype[method + dir] = function() {
      var args = slice.call(arguments).concat(constant)
      return this[method].apply(this, args)
    }
  })
})

/*!
 * Module exports.
 */

if (typeof exports !== 'undefined') {
  module.exports = AsciiTable
} else {
  this.AsciiTable = AsciiTable
}

}).call(this);

},{}],"m2gV":[function(require,module,exports) {
module.exports = require('./ascii-table')
},{"./ascii-table":"4HcS"}],"A2T1":[function(require,module,exports) {
"use strict";

var _core = _interopRequireDefault(require("typewriter-effect/dist/core"));

var _resume = _interopRequireDefault(require("./resume.json"));

var _config = _interopRequireDefault(require("./config.json"));

var AsciiTable = _interopRequireWildcard(require("ascii-table"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef Config
 * @property {number} delayBetweenSteps Temps entre chaque étape
 * @property {number} enterDelay Temps que met le code à "exécuter" la commande
 */

/**
 * @typedef Step
 * @property {number} id
 * @property {string} line
 * @property {string} responseType
 * @property {string?} value
 * @property {string[]?} headers
 * @property {string[]?} rows
 */

/**
 * @type Step[]
 */

/**
 * @type Config
 */
var typewriterConfig = {}; // On construit le dom de l'ensemble des éléments

_resume.default.forEach(function (step) {
  document.getElementById('terminal').append(getDom(step));
}); // Construction de la première ligne


if (_resume.default.length > 0) {
  var step1 = _resume.default[0];
  play(0);
}
/**
 * Démarre le typewriter pour le step en cour
 * @param {number} stepIndex Index du step dans le tableau stepsJson
 */


function play(stepIndex) {
  var step = _resume.default[stepIndex];
  document.getElementById("terminal-line".concat(step.id)).style.display = 'block';
  var betweenStepDelay = stepIndex === 0 ? 10 : _config.default.delayBetweenSteps ?? 5000;
  var typewriter = new _core.default("#line".concat(step.id), typewriterConfig).changeDelay(betweenStepDelay).typeString('').changeDelay('natural').typeString(step.line).changeDelay(_config.default.enterDelay ?? 2000).callFunction(function () {
    document.querySelector("#line".concat(step.id, " > .Typewriter__cursor")).style.display = 'none';
    document.getElementById("line".concat(step.id, "-response")).style.display = 'block';

    if (stepIndex + 1 < _resume.default.length) {
      // Il y a un element suivant
      play(stepIndex + 1);
    }
  }).start();
}
/**
 * Contruit le DOM pour une étape donnée
 * @param {Step} step Step pour lequel il faut construire le DOM
 */


function getDom(step) {
  var html = '';

  if (step.responseType === 'list' && Array.isArray(step.value)) {
    html = '<ul>';
    html += step.value.map(function (s) {
      return "<li>".concat(s, "</li>");
    }).join('');
    html += '</ul>';
  } else if (step.responseType === 'text') {
    html = step.value;
  } else if (step.responseType === 'table') {
    var headers = step.headers;
    var rows = step.rows;
    var thsHtml = headers.map(function (h) {
      return "<th>".concat(h, "</th>");
    }).join('');
    var tdsHtml = rows.map(function (r) {
      return "<tr>".concat(r.map(function (rtd) {
        return "<td>".concat(rtd, "</td>");
      }).join(''), "</tr>");
    }).join('');
    html = "<table><thead><tr>".concat(thsHtml, "</tr></thead><tbody>").concat(tdsHtml, "</tbody></table>");
  }

  return stringToDom(" <div id=\"terminal-line".concat(step.id, "\" class=\"terminal__line\" style=\"display: none;\">\n            <span id=\"line").concat(step.id, "\" class=\"line\"></span>\n            <div id=\"line").concat(step.id, "-response\" class=\"response\">\n                ").concat(html, "\n            </div>\n        </div>"));
}
/**
 * Converti le html en objet DOM
 * @param html
 * @returns {DocumentFragment}
 */


function stringToDom(html) {
  return document.createRange().createContextualFragment(html);
}
},{"typewriter-effect/dist/core":"D69l","./resume.json":"eR26","./config.json":"BrLT","ascii-table":"m2gV"}]},{},["A2T1"], null)
//# sourceMappingURL=/app.20e657cf.js.map