/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Rx = __webpack_require__(1);

	var ws$ = Rx.DOM.fromWebSocket('ws://aparticka.com:4000')
	  .map(function(e) {
	    return JSON.parse(e.data);
	  });

	var id$ = ws$
	  .map(function(message) {
	    return message.id;
	  });
	var name$ = ws$
	  .map(function(message) {
	    return message.name;
	  });

	Rx.Observable.combineLatest(
	  id$, name$, function(id, name) {
	    return {
	      id: id,
	      name: name
	    };
	  }
	).subscribe(function(next) {
	  console.log(next);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

	;(function (factory) {
	  var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	  };

	  var root = (objectTypes[typeof window] && window) || this,
	    freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
	    freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
	    moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
	    freeGlobal = objectTypes[typeof global] && global;

	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Because of build optimizers
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3), exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (Rx, exports) {
	      root.Rx = factory(root, exports, Rx);
	      return root.Rx;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module === 'object' && module && module.exports === freeExports) {
	    module.exports = factory(root, module.exports, require('rx'));
	  } else {
	    root.Rx = factory(root, {}, root.Rx);
	  }
	}.call(this, function (root, exp, Rx, undefined) {

	  var Observable = Rx.Observable,
	    observableProto = Observable.prototype,
	    AnonymousObservable = Rx.AnonymousObservable,
	    observerCreate = Rx.Observer.create,
	    disposableCreate = Rx.Disposable.create,
	    CompositeDisposable = Rx.CompositeDisposable,
	    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
	    AsyncSubject = Rx.AsyncSubject,
	    Subject = Rx.Subject,
	    Scheduler = Rx.Scheduler,
	    defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }()),
	    dom = Rx.DOM = {},
	    hasOwnProperty = {}.hasOwnProperty,
	    noop = Rx.helpers.noop,
	    isFunction = Rx.helpers.isFunction;

	  function createListener (element, name, handler, useCapture) {
	    if (element.addEventListener) {
	      element.addEventListener(name, handler, useCapture);
	      return disposableCreate(function () {
	        element.removeEventListener(name, handler, useCapture);
	      });
	    }
	    throw new Error('No listener found');
	  }

	  function createEventListener (el, eventName, handler, useCapture) {
	    var disposables = new CompositeDisposable();

	    // Asume NodeList or HTMLCollection
	    var toStr = Object.prototype.toString;
	    if (toStr.call(el) === '[object NodeList]' || toStr.call(el) === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler, useCapture));
	      }
	    } else if (el) {
	      disposables.add(createListener(el, eventName, handler, useCapture));
	    }
	    return disposables;
	  }

	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @param {Boolean} [useCapture] If true, useCapture indicates that the user wishes to initiate capture. After initiating capture, all events of the specified type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. Events which are bubbling upward through the tree will not trigger a listener designated to use capture
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  var fromEvent = dom.fromEvent = function (element, eventName, selector, useCapture) {
	    var selectorFn = isFunction(selector) ? selector : null;
	    typeof selector === 'boolean' && (useCapture = selector);
	    typeof useCapture === 'undefined' && (useCapture = false);
	    return new AnonymousObservable(function (observer) {
	      return createEventListener(
	        element,
	        eventName,
	        function handler () {
	          var results = arguments[0];

	          if (selectorFn) {
	            var results = tryCatch(selectorFn).apply(null, arguments);
	            if (results === errorObj) { return observer.onError(results.e); }
	          }

	          observer.onNext(results);
	        },
	        useCapture);
	    }).publish().refCount();
	  };

	  (function () {
	    var events = "blur focus focusin focusout load resize scroll unload click dblclick " +
	      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	      "change select submit keydown keypress keyup error contextmenu";

	    if (root.PointerEvent) {
	      events += " pointerdown pointerup pointermove pointerover pointerout pointerenter pointerleave";
	    }

	    if (root.TouchEvent) {
	      events += " touchstart touchend touchmove touchcancel";
	    }

	    events = events.split(' ');

	    for(var i = 0, len = events.length; i < len; i++) {
	      (function (e) {
	        dom[e] = function (element, selector, useCapture) {
	          return fromEvent(element, e, selector, useCapture);
	        };
	      }(events[i]))
	    }
	  }());

	  /**
	   * Creates an observable sequence when the DOM is loaded
	   * @returns {Observable} An observable sequence fired when the DOM is loaded
	   */
	  dom.ready = function () {
	    return new AnonymousObservable(function (observer) {
	      var addedHandlers = false;

	      function handler () {
	        observer.onNext();
	        observer.onCompleted();
	      }

	      if (document.readyState === 'complete') {
	        setTimeout(handler, 0);
	      } else {
	        addedHandlers = true;
	        document.addEventListener( 'DOMContentLoaded', handler, false );
	        root.addEventListener( 'load', handler, false );
	      }

	      return function () {
	        if (!addedHandlers) { return; }
	        document.removeEventListener( 'DOMContentLoaded', handler, false );
	        root.removeEventListener( 'load', handler, false );
	      };
	    });
	  };


	  // Gets the proper XMLHttpRequest for support for older IE
	  function getXMLHttpRequest() {
	    if (root.XMLHttpRequest) {
	      return new root.XMLHttpRequest();
	    } else {
	      var progId;
	      try {
	        var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
	        for(var i = 0; i < 3; i++) {
	          try {
	            progId = progIds[i];
	            if (new root.ActiveXObject(progId)) {
	              break;
	            }
	          } catch(e) { }
	        }
	        return new root.ActiveXObject(progId);
	      } catch (e) {
	        throw new Error('XMLHttpRequest is not supported by your browser');
	      }
	    }
	  }

	  // Get CORS support even for older IE
	  function getCORSRequest() {
	    var xhr = new root.XMLHttpRequest();
	    if ('withCredentials' in xhr) {
	      return xhr;
	    } else if (!!root.XDomainRequest) {
	      return new XDomainRequest();
	    } else {
	      throw new Error('CORS is not supported by your browser');
	    }
	  }

	function normalizeAjaxLoadEvent(e, xhr, settings) {
	    var response = ('response' in xhr) ? xhr.response : xhr.responseText;
	    response = settings.responseType === 'json' ? JSON.parse(response) : response;
	    return {
	      response: response,
	      status: xhr.status,
	      responseType: xhr.responseType,
	      xhr: xhr,
	      originalEvent: e
	    };
	  }

	  function normalizeAjaxErrorEvent(e, xhr, type) {
	    return {
	      type: type,
	      status: xhr.status,
	      xhr: xhr,
	      originalEvent: e
	    };
	  }

	  /**
	   * Creates an observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
	   *
	   * @example
	   *   source = Rx.DOM.ajax('/products');
	   *   source = Rx.DOM.ajax( url: 'products', method: 'GET' });
	   *
	   * @param {Object} settings Can be one of the following:
	   *
	   *  A string of the URL to make the Ajax call.
	   *  An object with the following properties
	   *   - url: URL of the request
	   *   - body: The body of the request
	   *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
	   *   - async: Whether the request is async
	   *   - headers: Optional headers
	   *   - crossDomain: true if a cross domain request, else false
	   *
	   * @returns {Observable} An observable sequence containing the XMLHttpRequest.
	  */
	  var ajaxRequest = dom.ajax = function (options) {
	    var settings = {
	      method: 'GET',
	      crossDomain: false,
	      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	      async: true,
	      headers: {},
	      responseType: 'text'
	    };

	    if(typeof options === 'string') {
	      settings.url = options;
	    } else {
	      for(var prop in options) {
	        if(hasOwnProperty.call(options, prop)) {
	          settings[prop] = options[prop];
	        }
	      }
	    }

	    if (!settings.crossDomain && !settings.headers['X-Requested-With']) {
	      settings.headers['X-Requested-With'] = 'XMLHttpRequest';
	    }
	    settings.hasContent = settings.body !== undefined;

	    return new AnonymousObservable(function (observer) {
	      var isDone = false;

	      try {
	        var xhr = settings.crossDomain ? getCORSRequest() : getXMLHttpRequest();
	      } catch (err) {
	        observer.onError(err);
	      }

	      try {
	        if (settings.user) {
	          xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
	        } else {
	          xhr.open(settings.method, settings.url, settings.async);
	        }

	        var headers = settings.headers;
	        for (var header in headers) {
	          if (hasOwnProperty.call(headers, header)) {
	            xhr.setRequestHeader(header, headers[header]);
	          }
	        }

	        if(!!xhr.upload || (!('withCredentials' in xhr) && !!root.XDomainRequest)) {
	          xhr.onload = function(e) {
	            if(settings.progressObserver) {
	              settings.progressObserver.onNext(e);
	              settings.progressObserver.onCompleted();
	            }
	            observer.onNext(normalizeAjaxLoadEvent(e, xhr, settings));
	            observer.onCompleted();
	            isDone = true;
	          };

	          if(settings.progressObserver) {
	            xhr.onprogress = function(e) {
	              settings.progressObserver.onNext(e);
	            };
	          }

	          xhr.onerror = function(e) {
	            settings.progressObserver && settings.progressObserver.onError(e);
	            observer.onError(normalizeAjaxErrorEvent(e, xhr, 'error'));
	            isDone = true;
	          };

	          xhr.onabort = function(e) {
	            settings.progressObserver && settings.progressObserver.onError(e);
	            observer.onError(normalizeAjaxErrorEvent(e, xhr, 'abort'));
	            isDone = true;
	          };
	        } else {

	          xhr.onreadystatechange = function (e) {
	            if (xhr.readyState === 4) {
	              var status = xhr.status == 1223 ? 204 : xhr.status;
	              if ((status >= 200 && status <= 300) || status === 0 || status === '') {
	                observer.onNext(normalizeAjaxLoadEvent(e, xhr, settings));
	                observer.onCompleted();
	              } else {
	                observer.onError(normalizeAjaxErrorEvent(e, xhr, 'error'));
	              }
	              isDone = true;
	            }
	          };
	        }

	        xhr.send(settings.hasContent && settings.body || null);
	      } catch (e) {
	        observer.onError(e);
	      }

	      return function () {
	        if (!isDone && xhr.readyState !== 4) { xhr.abort(); }
	      };
	    });
	  };

	  /**
	   * Creates an observable sequence from an Ajax POST Request with the body.
	   *
	   * @param {String} url The URL to POST
	   * @param {Object} body The body to POST
	   * @returns {Observable} The observable sequence which contains the response from the Ajax POST.
	   */
	  dom.post = function (url, body) {
	    return ajaxRequest({ url: url, body: body, method: 'POST' });
	  };

	  /**
	   * Creates an observable sequence from an Ajax GET Request with the body.
	   *
	   * @param {String} url The URL to GET
	   * @returns {Observable} The observable sequence which contains the response from the Ajax GET.
	   */
	  var observableGet = dom.get = function (url) {
	    return ajaxRequest({ url: url });
	  };

	  /**
	   * Creates an observable sequence from JSON from an Ajax request
	   *
	   * @param {String} url The URL to GET
	   * @returns {Observable} The observable sequence which contains the parsed JSON.
	   */
	  dom.getJSON = function (url) {
	    if (!root.JSON && typeof root.JSON.parse !== 'function') { throw new TypeError('JSON is not supported in your runtime.'); }
	    return ajaxRequest({url: url, responseType: 'json'}).map(function (x) {
	      return x.response;
	    });
	  };

	  /** @private
	   * Destroys the current element
	   */
	  var destroy = (function () {
	    var trash = document.createElement('div');
	    return function (element) {
	      trash.appendChild(element);
	      trash.innerHTML = '';
	    };
	  })();

	  /**
	   * Creates an observable JSONP Request with the specified settings.
	   * @param {Object} settings Can be one of the following:
	   *
	   *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
	   *  An object with the following properties
	   *   - url: URL of the request
	   *   - jsonp: The named callback parameter for the JSONP call
	   *   - jsonpCallback: Callback to execute. For when the JSONP callback can't be changed
	   *
	   * @returns {Observable} A cold observable containing the results from the JSONP call.
	   */
	   dom.jsonpRequest = (function() {
	     var id = 0;

	     return function(options) {
	       return new AnonymousObservable(function(observer) {

	         var callbackId = 'callback_' + (id++).toString(36);

	         var settings = {
	           jsonp: 'JSONPCallback',
	           async: true,
	           jsonpCallback: 'rxjsjsonpCallbacks' + callbackId
	         };

	         if(typeof options === 'string') {
	           settings.url = options;
	         } else {
	           for(var prop in options) {
	             if(hasOwnProperty.call(options, prop)) {
	               settings[prop] = options[prop];
	             }
	           }
	         }

	         var script = document.createElement('script');
	         script.type = 'text/javascript';
	         script.async = settings.async;
	         script.src = settings.url.replace(settings.jsonp, settings.jsonpCallback);

	         root[settings.jsonpCallback] = function(data) {
	           root[settings.jsonpCallback].called = true;
	           root[settings.jsonpCallback].data = data;
	         };

	         var handler = function(e) {
	           if(e.type === 'load' && !root[settings.jsonpCallback].called) {
	             e = { type: 'error' };
	           }
	           var status = e.type === 'error' ? 400 : 200;
	           var data = root[settings.jsonpCallback].data;

	           if(status === 200) {
	             observer.onNext({
	               status: status,
	               responseType: 'jsonp',
	               response: data,
	               originalEvent: e
	             });

	             observer.onCompleted();
	           }
	           else {
	             observer.onError({
	               type: 'error',
	               status: status,
	               originalEvent: e
	             });
	           }
	         };

	         script.onload = script.onreadystatechanged = script.onerror = handler;

	         var head = document.getElementsByTagName('head')[0] || document.documentElement;
	         head.insertBefore(script, head.firstChild);

	         return function() {
	           script.onload = script.onreadystatechanged = script.onerror = null;
	           destroy(script);
	           script = null;
	         };
	       });
	     }
	   }());

	   /**
	   * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
	   *
	   * @example
	   *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', openObserver, closingObserver);
	   *
	   * @param {String} url The URL of the WebSocket.
	   * @param {String} protocol The protocol of the WebSocket.
	   * @param {Observer} [openObserver] An optional Observer to capture the open event.
	   * @param {Observer} [closingObserver] An optional Observer to capture the moment before the underlying socket is closed.
	   * @returns {Subject} An observable sequence wrapping a WebSocket.
	   */
	  dom.fromWebSocket = function (url, protocol, openObserver, closingObserver) {
	    if (!WebSocket) { throw new TypeError('WebSocket not implemented in your runtime.'); }

	    var socket;

	    function socketClose(code, reason) {
	      if (socket) {
	        if (closingObserver) {
	          closingObserver.onNext();
	          closingObserver.onCompleted();
	        }
	        if (!code) {
	          socket.close();
	        } else {
	          socket.close(code, reason);
	        }
	      }
	    }

	    var observable = new AnonymousObservable(function (obs) {
	      socket = protocol ? new WebSocket(url, protocol) : new WebSocket(url);

	      function openHandler(e) {
	        openObserver.onNext(e);
	        openObserver.onCompleted();
	        socket.removeEventListener('open', openHandler, false);
	      }
	      function messageHandler(e) { obs.onNext(e); }
	      function errHandler(e) { obs.onError(e); }
	      function closeHandler(e) {
	        if (e.code !== 1000 || !e.wasClean) { return obs.onError(e); }
	        obs.onCompleted();
	      }

	      openObserver && socket.addEventListener('open', openHandler, false);
	      socket.addEventListener('message', messageHandler, false);
	      socket.addEventListener('error', errHandler, false);
	      socket.addEventListener('close', closeHandler, false);

	      return function () {
	        socketClose();

	        socket.removeEventListener('message', messageHandler, false);
	        socket.removeEventListener('error', errHandler, false);
	        socket.removeEventListener('close', closeHandler, false);
	      };
	    });

	    var observer = observerCreate(
	      function (data) {
	        socket && socket.readyState === WebSocket.OPEN && socket.send(data);
	      },
	      function(e) {
	        if (!e.code) {
	          throw new Error('no code specified. be sure to pass { code: ###, reason: "" } to onError()');
	        }
	        socketClose(e.code, e.reason || '');
	      },
	      function() {
	        socketClose(1000, '');
	      }
	    );

	    return Subject.create(observer, observable);
	  };

	  /**
	   * Creates a Web Worker with a given URL as a Subject.
	   *
	   * @example
	   * var worker = Rx.DOM.fromWebWorker('worker.js');
	   *
	   * @param {String} url The URL of the Web Worker.
	   * @returns {Subject} A Subject wrapping the Web Worker.
	   */
	  dom.fromWebWorker = function (url) {
	    if (!root.Worker) { throw new TypeError('Worker not implemented in your runtime.'); }
	    var worker = new root.Worker(url);

	    var observable = new AnonymousObservable(function (obs) {

	      function messageHandler(data) { obs.onNext(data); }
	      function errHandler(err) { obs.onError(err); }

	      worker.addEventListener('message', messageHandler, false);
	      worker.addEventListener('error', errHandler, false);

	      return function () {
	        worker.close();
	        worker.removeEventListener('message', messageHandler, false);
	        worker.removeEventListener('error', errHandler, false);
	      };
	    });

	    var observer = observerCreate(function (data) {
	      worker.postMessage(data);
	    });

	    return Subject.create(observer, observable);
	  };

	  /**
	   * This method wraps an EventSource as an observable sequence.
	   * @param {String} url The url of the server-side script.
	   * @param {Observer} [openObserver] An optional observer for the 'open' event for the server side event.
	   * @returns {Observable} An observable sequence which represents the data from a server-side event.
	   */
	  dom.fromEventSource = function (url, openObserver) {
	    if (!root.EventSource) { throw new TypeError('EventSource not implemented in your runtime.'); }
	    return new AnonymousObservable(function (observer) {
	      var source = new root.EventSource(url);

	      function onOpen(e) {
	        openObserver.onNext(e);
	        openObserver.onCompleted();
	        source.removeEventListener('open', onOpen, false);
	      }

	      function onError(e) {
	        if (e.readyState === EventSource.CLOSED) {
	          observer.onCompleted();
	        } else {
	          observer.onError(e);
	        }
	      }

	      function onMessage(e) {
	        observer.onNext(e);
	      }

	      openObserver && source.addEventListener('open', onOpen, false);
	      source.addEventListener('error', onError, false);
	      source.addEventListener('message', onMessage, false);

	      return function () {
	        source.removeEventListener('error', onError, false);
	        source.removeEventListener('message', onMessage, false);
	        source.close();
	      };
	    });
	  };

	  /**
	   * Creates an observable sequence from a Mutation Observer.
	   * MutationObserver provides developers a way to react to changes in a DOM.
	   * @example
	   *  Rx.DOM.fromMutationObserver(document.getElementById('foo'), { attributes: true, childList: true, characterData: true });
	   *
	   * @param {Object} target The Node on which to obserave DOM mutations.
	   * @param {Object} options A MutationObserverInit object, specifies which DOM mutations should be reported.
	   * @returns {Observable} An observable sequence which contains mutations on the given DOM target.
	   */
	  dom.fromMutationObserver = function (target, options) {
	    var BrowserMutationObserver = root.MutationObserver || root.WebKitMutationObserver;
	    if (!BrowserMutationObserver) { throw new TypeError('MutationObserver not implemented in your runtime.'); }
	    return observableCreate(function (observer) {
	      var mutationObserver = new BrowserMutationObserver(observer.onNext.bind(observer));
	      mutationObserver.observe(target, options);

	      return mutationObserver.disconnect.bind(mutationObserver);
	    });
	  };

	  // Get the right animation frame method
	  var requestAnimFrame, cancelAnimFrame;
	  if (root.requestAnimationFrame) {
	    requestAnimFrame = root.requestAnimationFrame;
	    cancelAnimFrame = root.cancelAnimationFrame;
	  } else if (root.mozRequestAnimationFrame) {
	    requestAnimFrame = root.mozRequestAnimationFrame;
	    cancelAnimFrame = root.mozCancelAnimationFrame;
	  } else if (root.webkitRequestAnimationFrame) {
	    requestAnimFrame = root.webkitRequestAnimationFrame;
	    cancelAnimFrame = root.webkitCancelAnimationFrame;
	  } else if (root.msRequestAnimationFrame) {
	    requestAnimFrame = root.msRequestAnimationFrame;
	    cancelAnimFrame = root.msCancelAnimationFrame;
	  } else if (root.oRequestAnimationFrame) {
	    requestAnimFrame = root.oRequestAnimationFrame;
	    cancelAnimFrame = root.oCancelAnimationFrame;
	  } else {
	    requestAnimFrame = function(cb) { root.setTimeout(cb, 1000 / 60); };
	    cancelAnimFrame = root.clearTimeout;
	  }

	  /**
	   * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
	   */
	  Scheduler.requestAnimationFrame = (function () {

	    function scheduleNow(state, action) {
	      var scheduler = this,
	        disposable = new SingleAssignmentDisposable();
	      var id = requestAnimFrame(function () {
	        !disposable.isDisposed && (disposable.setDisposable(action(scheduler, state)));
	      });
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        cancelAnimFrame(id);
	      }));
	    }

	    function scheduleRelative(state, dueTime, action) {
	      var scheduler = this, dt = Scheduler.normalize(dueTime);
	      if (dt === 0) { return scheduler.scheduleWithState(state, action); }
	      var disposable = new SingleAssignmentDisposable();
	      var id = root.setTimeout(function () {
	        if (!disposable.isDisposed) {
	          disposable.setDisposable(action(scheduler, state));
	        }
	      }, dt);
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        root.clearTimeout(id);
	      }));
	    }

	    function scheduleAbsolute(state, dueTime, action) {
	      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
	    }

	    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);

	  }());

	  /**
	   * Scheduler that uses a MutationObserver changes as the scheduling mechanism
	   */
	  Scheduler.microtask = (function () {

	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false, scheduleMethod;

	    function clearMethod(handle) {
	      delete tasksByHandle[handle];
	    }

	    function runTask(handle) {
	      if (currentlyRunning) {
	        root.setTimeout(function () { runTask(handle) }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          try {
	            task();
	          } catch (e) {
	            throw e;
	          } finally {
	            clearMethod(handle);
	            currentlyRunning = false;
	          }
	        }
	      }
	    }

	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;

	      return isAsync;
	    }

	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    var BrowserMutationObserver = root.MutationObserver || root.WebKitMutationObserver;
	    if (!!BrowserMutationObserver) {

	      var PREFIX = 'drainqueue_';

	      var observer = new BrowserMutationObserver(function(mutations) {
	        mutations.forEach(function (mutation) {
	          runTask(mutation.attributeName.substring(PREFIX.length));
	        })
	      });

	      var element = document.createElement('div');
	      observer.observe(element, { attributes: true });

	      // Prevent leaks
	      root.addEventListener('unload', function () {
	        observer.disconnect();
	        observer = null;
	      }, false);

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        element.setAttribute(PREFIX + id, 'drainQueue');
	        return id;
	      };
	    } else if (typeof root.setImmediate === 'function') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.setImmediate(function () {
	          runTask(id);
	        });

	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

	      function onGlobalPostMessage(event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      }

	      if (root.addEventListener) {
	        root.addEventListener('message', onGlobalPostMessage, false);
	      } else if (root.attachEvent){
	        root.attachEvent('onmessage', onGlobalPostMessage);
	      }

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[currentId] = action;
	        root.postMessage(MSG_PREFIX + currentId, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();

	      channel.port1.onmessage = function (event) {
	        runTask(event.data);
	      };

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;

	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);

	        return id;
	      };

	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.setTimeout(function () {
	          runTask(id);
	        }, 0);

	        return id;
	      };
	    }

	    function scheduleNow(state, action) {

	      var scheduler = this,
	        disposable = new SingleAssignmentDisposable();

	      var id = scheduleMethod(function () {
	        !disposable.isDisposed && (disposable.setDisposable(action(scheduler, state)));
	      });

	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        clearMethod(id);
	      }));
	    }

	    function scheduleRelative(state, dueTime, action) {
	      var scheduler = this, dt = Scheduler.normalize(dueTime);
	      if (dt === 0) { return scheduler.scheduleWithState(state, action); }
	      var disposable = new SingleAssignmentDisposable();
	      var id = root.setTimeout(function () {
	        if (!disposable.isDisposed) {
	          disposable.setDisposable(action(scheduler, state));
	        }
	      }, dt);
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        root.clearTimeout(id);
	      }));
	    }

	    function scheduleAbsolute(state, dueTime, action) {
	      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
	    }

	    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
	  }());

	  Rx.DOM.geolocation = {
	    /**
	    * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
	    * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
	    *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
	    *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
	    *              If timeout is Infinity, (the default value) the location request will not time out.
	    *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
	    *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
	    *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
	    *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
	    *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
	    * @returns {Observable} An observable sequence with the geographical location of the device running the client.
	    */
	    getCurrentPosition: function (geolocationOptions) {
	      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }

	      return new AnonymousObservable(function (observer) {
	        root.navigator.geolocation.getCurrentPosition(
	          function (data) {
	            observer.onNext(data);
	            observer.onCompleted();
	          },
	          observer.onError.bind(observer),
	          geolocationOptions);
	      });
	    },

	    /**
	    * Begins listening for updates to the current geographical location of the device running the client.
	    * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
	    *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
	    *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
	    *              If timeout is Infinity, (the default value) the location request will not time out.
	    *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
	    *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
	    *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
	    *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
	    *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
	    * @returns {Observable} An observable sequence with the current geographical location of the device running the client.
	    */
	    watchPosition: function (geolocationOptions) {
	      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }

	      return new AnonymousObservable(function (observer) {
	        var watchId = root.navigator.geolocation.watchPosition(
	          observer.onNext.bind(observer),
	          observer.onError.bind(observer),
	          geolocationOptions);

	        return function () {
	          root.navigator.geolocation.clearWatch(watchId);
	        };
	      }).publish().refCount();
	    }
	  };

	  /**
	   * The FileReader object lets web applications asynchronously read the contents of
	   * files (or raw data buffers) stored on the user's computer, using File or Blob objects
	   * to specify the file or data to read as an observable sequence.
	   * @param {String} file The file to read.
	   * @param {Observer} An observer to watch for progress.
	   * @returns {Object} An object which contains methods for reading the data.
	   */
	  dom.fromReader = function(file, progressObserver) {
	    if (!root.FileReader) { throw new TypeError('FileReader not implemented in your runtime.'); }

	    function _fromReader(readerFn, file, encoding) {
	      return new AnonymousObservable(function(observer) {
	        var reader = new root.FileReader();
	        var subject = new AsyncSubject();

	        function loadHandler(e) {
	          progressObserver && progressObserver.onCompleted();
	          subject.onNext(e.target.result);
	          subject.onCompleted();
	        }

	        function errorHandler(e) { subject.onError(e.target.error); }
	        function progressHandler(e) { progressObserver.onNext(e); }

	        reader.addEventListener('load', loadHandler, false);
	        reader.addEventListener('error', errorHandler, false);
	        progressObserver && reader.addEventListener('progress', progressHandler, false);

	        reader[readerFn](file, encoding);

	        return new CompositeDisposable(subject.subscribe(observer), disposableCreate(function () {
	          reader.readyState == root.FileReader.LOADING && reader.abort();
	          reader.removeEventListener('load', loadHandler, false);
	          reader.removeEventListener('error', errorHandler, false);
	          progressObserver && reader.removeEventListener('progress', progressHandler, false);
	        }));
	      });
	    }

	    return {
	      /**
	       * This method is used to read the file as an ArrayBuffer as an Observable stream.
	       * @returns {Observable} An observable stream of an ArrayBuffer
	       */
	      asArrayBuffer : function() {
	        return _fromReader('readAsArrayBuffer', file);
	      },
	      /**
	       * This method is used to read the file as a binary data string as an Observable stream.
	       * @returns {Observable} An observable stream of a binary data string.
	       */
	      asBinaryString : function() {
	        return _fromReader('readAsBinaryString', file);
	      },
	      /**
	       * This method is used to read the file as a URL of the file's data as an Observable stream.
	       * @returns {Observable} An observable stream of a URL representing the file's data.
	       */
	      asDataURL : function() {
	        return _fromReader('readAsDataURL', file);
	      },
	      /**
	       * This method is used to read the file as a string as an Observable stream.
	       * @returns {Observable} An observable stream of the string contents of the file.
	       */
	      asText : function(encoding) {
	        return _fromReader('readAsText', file, encoding);
	      }
	    };
	  };

	  return Rx;
	}));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global, process) {// Copyright (c) Microsoft, All rights reserved. See License.txt in the project root for license information.

	;(function (undefined) {

	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  function checkGlobal(value) {
	    return (value && value.Object === Object) ? value : null;
	  }

	  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
	  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
	  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

	  var Rx = {
	    internals: {},
	    config: {
	      Promise: root.Promise
	    },
	    helpers: { }
	  };

	  // Defaults
	  var noop = Rx.helpers.noop = function () { },
	    identity = Rx.helpers.identity = function (x) { return x; },
	    defaultNow = Rx.helpers.defaultNow = Date.now,
	    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
	    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
	    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
	    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
	    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
	    isFunction = Rx.helpers.isFunction = (function () {

	      var isFn = function (value) {
	        return typeof value == 'function' || false;
	      }

	      // fallback for older versions of Chrome and Safari
	      if (isFn(/x/)) {
	        isFn = function(value) {
	          return typeof value == 'function' && toString.call(value) == '[object Function]';
	        };
	      }

	      return isFn;
	    }());

	  function cloneArray(arr) { for(var a = [], i = 0, len = arr.length; i < len; i++) { a.push(arr[i]); } return a;}

	  var errorObj = {e: {}};
	  
	  function tryCatcherGen(tryCatchTarget) {
	    return function tryCatcher() {
	      try {
	        return tryCatchTarget.apply(this, arguments);
	      } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	      }
	    };
	  }

	  var tryCatch = Rx.internals.tryCatch = function tryCatch(fn) {
	    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
	    return tryCatcherGen(fn);
	  };

	  function thrower(e) {
	    throw e;
	  }

	  Rx.config.longStackSupport = false;
	  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
	  hasStacks = !!stacks.e && !!stacks.e.stack;

	  // All code after this point will be filtered from stack traces reported by RxJS
	  var rStartingLine = captureLine(), rFileName;

	  var STACK_JUMP_SEPARATOR = 'From previous event:';

	  function makeStackTraceLong(error, observable) {
	    // If possible, transform the error stack trace by removing Node and RxJS
	    // cruft, then concatenating with the stack trace of `observable`.
	    if (hasStacks &&
	        observable.stack &&
	        typeof error === 'object' &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	      var stacks = [];
	      for (var o = observable; !!o; o = o.source) {
	        if (o.stack) {
	          stacks.unshift(o.stack);
	        }
	      }
	      stacks.unshift(error.stack);

	      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
	      error.stack = filterStackString(concatedStacks);
	    }
	  }

	  function filterStackString(stackString) {
	    var lines = stackString.split('\n'), desiredLines = [];
	    for (var i = 0, len = lines.length; i < len; i++) {
	      var line = lines[i];

	      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	        desiredLines.push(line);
	      }
	    }
	    return desiredLines.join('\n');
	  }

	  function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	    if (!fileNameAndLineNumber) {
	      return false;
	    }
	    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];

	    return fileName === rFileName &&
	      lineNumber >= rStartingLine &&
	      lineNumber <= rEndingLine;
	  }

	  function isNodeFrame(stackLine) {
	    return stackLine.indexOf('(module.js:') !== -1 ||
	      stackLine.indexOf('(node.js:') !== -1;
	  }

	  function captureLine() {
	    if (!hasStacks) { return; }

	    try {
	      throw new Error();
	    } catch (e) {
	      var lines = e.stack.split('\n');
	      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
	      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	      if (!fileNameAndLineNumber) { return; }

	      rFileName = fileNameAndLineNumber[0];
	      return fileNameAndLineNumber[1];
	    }
	  }

	  function getFileNameAndLineNumber(stackLine) {
	    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }

	    // Anonymous functions: 'at filename:lineNumber:columnNumber'
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }

	    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
	  }

	  var EmptyError = Rx.EmptyError = function() {
	    this.message = 'Sequence contains no elements.';
	    Error.call(this);
	  };
	  EmptyError.prototype = Object.create(Error.prototype);
	  EmptyError.prototype.name = 'EmptyError';

	  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
	    this.message = 'Object has been disposed';
	    Error.call(this);
	  };
	  ObjectDisposedError.prototype = Object.create(Error.prototype);
	  ObjectDisposedError.prototype.name = 'ObjectDisposedError';

	  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
	    this.message = 'Argument out of range';
	    Error.call(this);
	  };
	  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
	  ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

	  var NotSupportedError = Rx.NotSupportedError = function (message) {
	    this.message = message || 'This operation is not supported';
	    Error.call(this);
	  };
	  NotSupportedError.prototype = Object.create(Error.prototype);
	  NotSupportedError.prototype.name = 'NotSupportedError';

	  var NotImplementedError = Rx.NotImplementedError = function (message) {
	    this.message = message || 'This operation is not implemented';
	    Error.call(this);
	  };
	  NotImplementedError.prototype = Object.create(Error.prototype);
	  NotImplementedError.prototype.name = 'NotImplementedError';

	  var notImplemented = Rx.helpers.notImplemented = function () {
	    throw new NotImplementedError();
	  };

	  var notSupported = Rx.helpers.notSupported = function () {
	    throw new NotSupportedError();
	  };

	  // Shim in iterator support
	  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
	    '_es6shim_iterator_';
	  // Bug for mozilla version
	  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
	    $iterator$ = '@@iterator';
	  }

	  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };

	  var isIterable = Rx.helpers.isIterable = function (o) {
	    return o[$iterator$] !== undefined;
	  }

	  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
	    return o && o.length !== undefined;
	  }

	  Rx.helpers.iterator = $iterator$;

	  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
	    if (typeof thisArg === 'undefined') { return func; }
	    switch(argCount) {
	      case 0:
	        return function() {
	          return func.call(thisArg)
	        };
	      case 1:
	        return function(arg) {
	          return func.call(thisArg, arg);
	        }
	      case 2:
	        return function(value, index) {
	          return func.call(thisArg, value, index);
	        };
	      case 3:
	        return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	    }

	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  };

	  /** Used to determine if values are of the language type Object */
	  var dontEnums = ['toString',
	    'toLocaleString',
	    'valueOf',
	    'hasOwnProperty',
	    'isPrototypeOf',
	    'propertyIsEnumerable',
	    'constructor'],
	  dontEnumsLength = dontEnums.length;

	  /** `Object#toString` result shortcuts */
	  var argsClass = '[object Arguments]',
	    arrayClass = '[object Array]',
	    boolClass = '[object Boolean]',
	    dateClass = '[object Date]',
	    errorClass = '[object Error]',
	    funcClass = '[object Function]',
	    numberClass = '[object Number]',
	    objectClass = '[object Object]',
	    regexpClass = '[object RegExp]',
	    stringClass = '[object String]';

	  var toString = Object.prototype.toString,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    supportsArgsClass = toString.call(arguments) == argsClass, // For less <IE9 && FF<4
	    supportNodeClass,
	    errorProto = Error.prototype,
	    objectProto = Object.prototype,
	    stringProto = String.prototype,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable;

	  try {
	    supportNodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
	  } catch (e) {
	    supportNodeClass = true;
	  }

	  var nonEnumProps = {};
	  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
	  nonEnumProps[objectClass] = { 'constructor': true };

	  var support = {};
	  (function () {
	    var ctor = function() { this.x = 1; },
	      props = [];

	    ctor.prototype = { 'valueOf': 1, 'y': 1 };
	    for (var key in new ctor) { props.push(key); }
	    for (key in arguments) { }

	    // Detect if `name` or `message` properties of `Error.prototype` are enumerable by default.
	    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

	    // Detect if `prototype` properties are enumerable by default.
	    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

	    // Detect if `arguments` object indexes are non-enumerable
	    support.nonEnumArgs = key != 0;

	    // Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	    support.nonEnumShadows = !/valueOf/.test(props);
	  }(1));

	  var isObject = Rx.internals.isObject = function(value) {
	    var type = typeof value;
	    return value && (type == 'function' || type == 'object') || false;
	  };

	  function keysIn(object) {
	    var result = [];
	    if (!isObject(object)) {
	      return result;
	    }
	    if (support.nonEnumArgs && object.length && isArguments(object)) {
	      object = slice.call(object);
	    }
	    var skipProto = support.enumPrototypes && typeof object == 'function',
	        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);

	    for (var key in object) {
	      if (!(skipProto && key == 'prototype') &&
	          !(skipErrorProps && (key == 'message' || key == 'name'))) {
	        result.push(key);
	      }
	    }

	    if (support.nonEnumShadows && object !== objectProto) {
	      var ctor = object.constructor,
	          index = -1,
	          length = dontEnumsLength;

	      if (object === (ctor && ctor.prototype)) {
	        var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object),
	            nonEnum = nonEnumProps[className];
	      }
	      while (++index < length) {
	        key = dontEnums[index];
	        if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
	          result.push(key);
	        }
	      }
	    }
	    return result;
	  }

	  function internalFor(object, callback, keysFunc) {
	    var index = -1,
	      props = keysFunc(object),
	      length = props.length;

	    while (++index < length) {
	      var key = props[index];
	      if (callback(object[key], key, object) === false) {
	        break;
	      }
	    }
	    return object;
	  }

	  function internalForIn(object, callback) {
	    return internalFor(object, callback, keysIn);
	  }

	  function isNode(value) {
	    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
	    // methods that are `typeof` "string" and still can coerce nodes to strings
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  }

	  var isArguments = function(value) {
	    return (value && typeof value == 'object') ? toString.call(value) == argsClass : false;
	  }

	  // fallback for browsers that can't detect `arguments` objects by [[Class]]
	  if (!supportsArgsClass) {
	    isArguments = function(value) {
	      return (value && typeof value == 'object') ? hasOwnProperty.call(value, 'callee') : false;
	    };
	  }

	  var isEqual = Rx.internals.isEqual = function (x, y) {
	    return deepEquals(x, y, [], []);
	  };

	  /** @private
	   * Used for deep comparison
	   **/
	  function deepEquals(a, b, stackA, stackB) {
	    // exit early for identical values
	    if (a === b) {
	      // treat `+0` vs. `-0` as not equal
	      return a !== 0 || (1 / a == 1 / b);
	    }

	    var type = typeof a,
	        otherType = typeof b;

	    // exit early for unlike primitive values
	    if (a === a && (a == null || b == null ||
	        (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
	      return false;
	    }

	    // compare [[Class]] names
	    var className = toString.call(a),
	        otherClass = toString.call(b);

	    if (className == argsClass) {
	      className = objectClass;
	    }
	    if (otherClass == argsClass) {
	      otherClass = objectClass;
	    }
	    if (className != otherClass) {
	      return false;
	    }
	    switch (className) {
	      case boolClass:
	      case dateClass:
	        // coerce dates and booleans to numbers, dates to milliseconds and booleans
	        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
	        return +a == +b;

	      case numberClass:
	        // treat `NaN` vs. `NaN` as equal
	        return (a != +a) ?
	          b != +b :
	          // but treat `-0` vs. `+0` as not equal
	          (a == 0 ? (1 / a == 1 / b) : a == +b);

	      case regexpClass:
	      case stringClass:
	        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
	        // treat string primitives and their corresponding object instances as equal
	        return a == String(b);
	    }
	    var isArr = className == arrayClass;
	    if (!isArr) {

	      // exit for functions and DOM nodes
	      if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
	        return false;
	      }
	      // in older versions of Opera, `arguments` objects have `Array` constructors
	      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
	          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

	      // non `Object` object instances with different constructors are not equal
	      if (ctorA != ctorB &&
	            !(hasOwnProperty.call(a, 'constructor') && hasOwnProperty.call(b, 'constructor')) &&
	            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
	            ('constructor' in a && 'constructor' in b)
	          ) {
	        return false;
	      }
	    }
	    // assume cyclic structures are equal
	    // the algorithm for detecting cyclic structures is adapted from ES 5.1
	    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
	    var initedStack = !stackA;
	    stackA || (stackA = []);
	    stackB || (stackB = []);

	    var length = stackA.length;
	    while (length--) {
	      if (stackA[length] == a) {
	        return stackB[length] == b;
	      }
	    }
	    var size = 0;
	    var result = true;

	    // add `a` and `b` to the stack of traversed objects
	    stackA.push(a);
	    stackB.push(b);

	    // recursively compare objects and arrays (susceptible to call stack limits)
	    if (isArr) {
	      // compare lengths to determine if a deep comparison is necessary
	      length = a.length;
	      size = b.length;
	      result = size == length;

	      if (result) {
	        // deep compare the contents, ignoring non-numeric properties
	        while (size--) {
	          var index = length,
	              value = b[size];

	          if (!(result = deepEquals(a[size], value, stackA, stackB))) {
	            break;
	          }
	        }
	      }
	    }
	    else {
	      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
	      // which, in this case, is more costly
	      internalForIn(b, function(value, key, b) {
	        if (hasOwnProperty.call(b, key)) {
	          // count the number of properties.
	          size++;
	          // deep compare each property value.
	          return (result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB));
	        }
	      });

	      if (result) {
	        // ensure both objects have the same number of properties
	        internalForIn(a, function(value, key, a) {
	          if (hasOwnProperty.call(a, key)) {
	            // `size` will be `-1` if `a` has more properties than `b`
	            return (result = --size > -1);
	          }
	        });
	      }
	    }
	    stackA.pop();
	    stackB.pop();

	    return result;
	  }

	  var hasProp = {}.hasOwnProperty,
	      slice = Array.prototype.slice;

	  var inherits = Rx.internals.inherits = function (child, parent) {
	    function __() { this.constructor = child; }
	    __.prototype = parent.prototype;
	    child.prototype = new __();
	  };

	  var addProperties = Rx.internals.addProperties = function (obj) {
	    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
	      var source = sources[idx];
	      for (var prop in source) {
	        obj[prop] = source[prop];
	      }
	    }
	  };

	  // Rx Utils
	  var addRef = Rx.internals.addRef = function (xs, r) {
	    return new AnonymousObservable(function (observer) {
	      return new BinaryDisposable(r.getDisposable(), xs.subscribe(observer));
	    });
	  };

	  function arrayInitialize(count, factory) {
	    var a = new Array(count);
	    for (var i = 0; i < count; i++) {
	      a[i] = factory();
	    }
	    return a;
	  }

	  function IndexedItem(id, value) {
	    this.id = id;
	    this.value = value;
	  }

	  IndexedItem.prototype.compareTo = function (other) {
	    var c = this.value.compareTo(other.value);
	    c === 0 && (c = this.id - other.id);
	    return c;
	  };

	  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
	    this.items = new Array(capacity);
	    this.length = 0;
	  };

	  var priorityProto = PriorityQueue.prototype;
	  priorityProto.isHigherPriority = function (left, right) {
	    return this.items[left].compareTo(this.items[right]) < 0;
	  };

	  priorityProto.percolate = function (index) {
	    if (index >= this.length || index < 0) { return; }
	    var parent = index - 1 >> 1;
	    if (parent < 0 || parent === index) { return; }
	    if (this.isHigherPriority(index, parent)) {
	      var temp = this.items[index];
	      this.items[index] = this.items[parent];
	      this.items[parent] = temp;
	      this.percolate(parent);
	    }
	  };

	  priorityProto.heapify = function (index) {
	    +index || (index = 0);
	    if (index >= this.length || index < 0) { return; }
	    var left = 2 * index + 1,
	        right = 2 * index + 2,
	        first = index;
	    if (left < this.length && this.isHigherPriority(left, first)) {
	      first = left;
	    }
	    if (right < this.length && this.isHigherPriority(right, first)) {
	      first = right;
	    }
	    if (first !== index) {
	      var temp = this.items[index];
	      this.items[index] = this.items[first];
	      this.items[first] = temp;
	      this.heapify(first);
	    }
	  };

	  priorityProto.peek = function () { return this.items[0].value; };

	  priorityProto.removeAt = function (index) {
	    this.items[index] = this.items[--this.length];
	    this.items[this.length] = undefined;
	    this.heapify();
	  };

	  priorityProto.dequeue = function () {
	    var result = this.peek();
	    this.removeAt(0);
	    return result;
	  };

	  priorityProto.enqueue = function (item) {
	    var index = this.length++;
	    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
	    this.percolate(index);
	  };

	  priorityProto.remove = function (item) {
	    for (var i = 0; i < this.length; i++) {
	      if (this.items[i].value === item) {
	        this.removeAt(i);
	        return true;
	      }
	    }
	    return false;
	  };
	  PriorityQueue.count = 0;

	  /**
	   * Represents a group of disposable resources that are disposed together.
	   * @constructor
	   */
	  var CompositeDisposable = Rx.CompositeDisposable = function () {
	    var args = [], i, len;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	      len = args.length;
	    } else {
	      len = arguments.length;
	      args = new Array(len);
	      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    this.disposables = args;
	    this.isDisposed = false;
	    this.length = args.length;
	  };

	  var CompositeDisposablePrototype = CompositeDisposable.prototype;

	  /**
	   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	   * @param {Mixed} item Disposable to add.
	   */
	  CompositeDisposablePrototype.add = function (item) {
	    if (this.isDisposed) {
	      item.dispose();
	    } else {
	      this.disposables.push(item);
	      this.length++;
	    }
	  };

	  /**
	   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	   * @param {Mixed} item Disposable to remove.
	   * @returns {Boolean} true if found; false otherwise.
	   */
	  CompositeDisposablePrototype.remove = function (item) {
	    var shouldDispose = false;
	    if (!this.isDisposed) {
	      var idx = this.disposables.indexOf(item);
	      if (idx !== -1) {
	        shouldDispose = true;
	        this.disposables.splice(idx, 1);
	        this.length--;
	        item.dispose();
	      }
	    }
	    return shouldDispose;
	  };

	  /**
	   *  Disposes all disposables in the group and removes them from the group.
	   */
	  CompositeDisposablePrototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var len = this.disposables.length, currentDisposables = new Array(len);
	      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
	      this.disposables = [];
	      this.length = 0;

	      for (i = 0; i < len; i++) {
	        currentDisposables[i].dispose();
	      }
	    }
	  };

	  /**
	   * Provides a set of static methods for creating Disposables.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   */
	  var Disposable = Rx.Disposable = function (action) {
	    this.isDisposed = false;
	    this.action = action || noop;
	  };

	  /** Performs the task of cleaning up resources. */
	  Disposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.action();
	      this.isDisposed = true;
	    }
	  };

	  /**
	   * Creates a disposable object that invokes the specified action when disposed.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   * @return {Disposable} The disposable object that runs the given action upon disposal.
	   */
	  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

	  /**
	   * Gets the disposable that does nothing when disposed.
	   */
	  var disposableEmpty = Disposable.empty = { dispose: noop };

	  /**
	   * Validates whether the given object is a disposable
	   * @param {Object} Object to test whether it has a dispose method
	   * @returns {Boolean} true if a disposable object, else false.
	   */
	  var isDisposable = Disposable.isDisposable = function (d) {
	    return d && isFunction(d.dispose);
	  };

	  var checkDisposed = Disposable.checkDisposed = function (disposable) {
	    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
	  };

	  var disposableFixup = Disposable._fixup = function (result) {
	    return isDisposable(result) ? result : disposableEmpty;
	  };

	  // Single assignment
	  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SingleAssignmentDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
	    if (this.current) { throw new Error('Disposable has already been assigned'); }
	    var shouldDispose = this.isDisposed;
	    !shouldDispose && (this.current = value);
	    shouldDispose && value && value.dispose();
	  };
	  SingleAssignmentDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	      old && old.dispose();
	    }
	  };

	  // Multiple assignment disposable
	  var SerialDisposable = Rx.SerialDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SerialDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SerialDisposable.prototype.setDisposable = function (value) {
	    var shouldDispose = this.isDisposed;
	    if (!shouldDispose) {
	      var old = this.current;
	      this.current = value;
	    }
	    old && old.dispose();
	    shouldDispose && value && value.dispose();
	  };
	  SerialDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };

	  var BinaryDisposable = Rx.BinaryDisposable = function (first, second) {
	    this._first = first;
	    this._second = second;
	    this.isDisposed = false;
	  };

	  BinaryDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old1 = this._first;
	      this._first = null;
	      old1 && old1.dispose();
	      var old2 = this._second;
	      this._second = null;
	      old2 && old2.dispose();
	    }
	  };

	  var NAryDisposable = Rx.NAryDisposable = function (disposables) {
	    this._disposables = disposables;
	    this.isDisposed = false;
	  };

	  NAryDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      for (var i = 0, len = this._disposables.length; i < len; i++) {
	        this._disposables[i].dispose();
	      }
	      this._disposables.length = 0;
	    }
	  };

	  /**
	   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	   */
	  var RefCountDisposable = Rx.RefCountDisposable = (function () {

	    function InnerDisposable(disposable) {
	      this.disposable = disposable;
	      this.disposable.count++;
	      this.isInnerDisposed = false;
	    }

	    InnerDisposable.prototype.dispose = function () {
	      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
	        this.isInnerDisposed = true;
	        this.disposable.count--;
	        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
	          this.disposable.isDisposed = true;
	          this.disposable.underlyingDisposable.dispose();
	        }
	      }
	    };

	    /**
	     * Initializes a new instance of the RefCountDisposable with the specified disposable.
	     * @constructor
	     * @param {Disposable} disposable Underlying disposable.
	      */
	    function RefCountDisposable(disposable) {
	      this.underlyingDisposable = disposable;
	      this.isDisposed = false;
	      this.isPrimaryDisposed = false;
	      this.count = 0;
	    }

	    /**
	     * Disposes the underlying disposable only when all dependent disposables have been disposed
	     */
	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed && !this.isPrimaryDisposed) {
	        this.isPrimaryDisposed = true;
	        if (this.count === 0) {
	          this.isDisposed = true;
	          this.underlyingDisposable.dispose();
	        }
	      }
	    };

	    /**
	     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	     */
	    RefCountDisposable.prototype.getDisposable = function () {
	      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
	    };

	    return RefCountDisposable;
	  })();

	  function ScheduledDisposable(scheduler, disposable) {
	    this.scheduler = scheduler;
	    this.disposable = disposable;
	    this.isDisposed = false;
	  }

	  function scheduleItem(s, self) {
	    if (!self.isDisposed) {
	      self.isDisposed = true;
	      self.disposable.dispose();
	    }
	  }

	  ScheduledDisposable.prototype.dispose = function () {
	    this.scheduler.schedule(this, scheduleItem);
	  };

	  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
	    this.scheduler = scheduler;
	    this.state = state;
	    this.action = action;
	    this.dueTime = dueTime;
	    this.comparer = comparer || defaultSubComparer;
	    this.disposable = new SingleAssignmentDisposable();
	  }

	  ScheduledItem.prototype.invoke = function () {
	    this.disposable.setDisposable(this.invokeCore());
	  };

	  ScheduledItem.prototype.compareTo = function (other) {
	    return this.comparer(this.dueTime, other.dueTime);
	  };

	  ScheduledItem.prototype.isCancelled = function () {
	    return this.disposable.isDisposed;
	  };

	  ScheduledItem.prototype.invokeCore = function () {
	    return disposableFixup(this.action(this.scheduler, this.state));
	  };

	  /** Provides a set of static properties to access commonly used schedulers. */
	  var Scheduler = Rx.Scheduler = (function () {

	    function Scheduler() { }

	    /** Determines whether the given object is a scheduler */
	    Scheduler.isScheduler = function (s) {
	      return s instanceof Scheduler;
	    };

	    var schedulerProto = Scheduler.prototype;

	    /**
	   * Schedules an action to be executed.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */
	    schedulerProto.schedule = function (state, action) {
	      throw new NotImplementedError();
	    };

	  /**
	   * Schedules an action to be executed after dueTime.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @param {Number} dueTime Relative time after which to execute the action.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */
	    schedulerProto.scheduleFuture = function (state, dueTime, action) {
	      var dt = dueTime;
	      dt instanceof Date && (dt = dt - this.now());
	      dt = Scheduler.normalize(dt);

	      if (dt === 0) { return this.schedule(state, action); }

	      return this._scheduleFuture(state, dt, action);
	    };

	    schedulerProto._scheduleFuture = function (state, dueTime, action) {
	      throw new NotImplementedError();
	    };

	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.now = defaultNow;

	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.prototype.now = defaultNow;

	    /**
	     * Normalizes the specified TimeSpan value to a positive value.
	     * @param {Number} timeSpan The time span value to normalize.
	     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	     */
	    Scheduler.normalize = function (timeSpan) {
	      timeSpan < 0 && (timeSpan = 0);
	      return timeSpan;
	    };

	    return Scheduler;
	  }());

	  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;

	  (function (schedulerProto) {

	    function invokeRecImmediate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;

	      function innerAction(state2) {
	        var isAdded = false, isDone = false;

	        var d = scheduler.schedule(state2, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }

	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }

	    function invokeRecDate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;

	      function innerAction(state2, dueTime1) {
	        var isAdded = false, isDone = false;

	        var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }

	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }

	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursive = function (state, action) {
	      return this.schedule([state, action], invokeRecImmediate);
	    };

	    /**
	     * Schedules an action to be executed recursively after a specified relative or absolute due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveFuture = function (state, dueTime, action) {
	      return this.scheduleFuture([state, action], dueTime, invokeRecDate);
	    };

	  }(Scheduler.prototype));

	  (function (schedulerProto) {

	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    Scheduler.prototype.schedulePeriodic = function(state, period, action) {
	      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
	      period = normalizeTime(period);
	      var s = state, id = root.setInterval(function () { s = action(s); }, period);
	      return disposableCreate(function () { root.clearInterval(id); });
	    };

	  }(Scheduler.prototype));

	  (function (schedulerProto) {
	    /**
	     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	     */
	    schedulerProto.catchError = schedulerProto['catch'] = function (handler) {
	      return new CatchScheduler(this, handler);
	    };
	  }(Scheduler.prototype));

	  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
	    function tick(command, recurse) {
	      recurse(0, this._period);
	      try {
	        this._state = this._action(this._state);
	      } catch (e) {
	        this._cancel.dispose();
	        throw e;
	      }
	    }

	    function SchedulePeriodicRecursive(scheduler, state, period, action) {
	      this._scheduler = scheduler;
	      this._state = state;
	      this._period = period;
	      this._action = action;
	    }

	    SchedulePeriodicRecursive.prototype.start = function () {
	      var d = new SingleAssignmentDisposable();
	      this._cancel = d;
	      d.setDisposable(this._scheduler.scheduleRecursiveFuture(0, this._period, tick.bind(this)));

	      return d;
	    };

	    return SchedulePeriodicRecursive;
	  }());

	  /** Gets a scheduler that schedules work immediately on the current thread. */
	   var ImmediateScheduler = (function (__super__) {
	    inherits(ImmediateScheduler, __super__);
	    function ImmediateScheduler() {
	      __super__.call(this);
	    }

	    ImmediateScheduler.prototype.schedule = function (state, action) {
	      return disposableFixup(action(this, state));
	    };

	    return ImmediateScheduler;
	  }(Scheduler));

	  var immediateScheduler = Scheduler.immediate = new ImmediateScheduler();

	  /**
	   * Gets a scheduler that schedules work as soon as possible on the current thread.
	   */
	  var CurrentThreadScheduler = (function (__super__) {
	    var queue;

	    function runTrampoline () {
	      while (queue.length > 0) {
	        var item = queue.dequeue();
	        !item.isCancelled() && item.invoke();
	      }
	    }

	    inherits(CurrentThreadScheduler, __super__);
	    function CurrentThreadScheduler() {
	      __super__.call(this);
	    }

	    CurrentThreadScheduler.prototype.schedule = function (state, action) {
	      var si = new ScheduledItem(this, state, action, this.now());

	      if (!queue) {
	        queue = new PriorityQueue(4);
	        queue.enqueue(si);

	        var result = tryCatch(runTrampoline)();
	        queue = null;
	        if (result === errorObj) { thrower(result.e); }
	      } else {
	        queue.enqueue(si);
	      }
	      return si.disposable;
	    };

	    CurrentThreadScheduler.prototype.scheduleRequired = function () { return !queue; };

	    return CurrentThreadScheduler;
	  }(Scheduler));

	  var currentThreadScheduler = Scheduler.currentThread = new CurrentThreadScheduler();

	  var scheduleMethod, clearMethod;

	  var localTimer = (function () {
	    var localSetTimeout, localClearTimeout = noop;
	    if (!!root.setTimeout) {
	      localSetTimeout = root.setTimeout;
	      localClearTimeout = root.clearTimeout;
	    } else if (!!root.WScript) {
	      localSetTimeout = function (fn, time) {
	        root.WScript.Sleep(time);
	        fn();
	      };
	    } else {
	      throw new NotSupportedError();
	    }

	    return {
	      setTimeout: localSetTimeout,
	      clearTimeout: localClearTimeout
	    };
	  }());
	  var localSetTimeout = localTimer.setTimeout,
	    localClearTimeout = localTimer.clearTimeout;

	  (function () {

	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;

	    clearMethod = function (handle) {
	      delete tasksByHandle[handle];
	    };

	    function runTask(handle) {
	      if (currentlyRunning) {
	        localSetTimeout(function () { runTask(handle); }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          var result = tryCatch(task)();
	          clearMethod(handle);
	          currentlyRunning = false;
	          if (result === errorObj) { thrower(result.e); }
	        }
	      }
	    }

	    var reNative = new RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );

	    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
	      !reNative.test(setImmediate) && setImmediate;

	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;

	      return isAsync;
	    }

	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    if (isFunction(setImmediate)) {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        setImmediate(function () { runTask(id); });

	        return id;
	      };
	    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        process.nextTick(function () { runTask(id); });

	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

	      var onGlobalPostMessage = function (event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      };

	      root.addEventListener('message', onGlobalPostMessage, false);

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.postMessage(MSG_PREFIX + currentId, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();

	      channel.port1.onmessage = function (e) { runTask(e.data); };

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;

	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);
	        return id;
	      };

	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        localSetTimeout(function () {
	          runTask(id);
	        }, 0);

	        return id;
	      };
	    }
	  }());

	  /**
	   * Gets a scheduler that schedules work via a timed callback based upon platform.
	   */
	   var DefaultScheduler = (function (__super__) {
	     inherits(DefaultScheduler, __super__);
	     function DefaultScheduler() {
	       __super__.call(this);
	     }

	     function scheduleAction(disposable, action, scheduler, state) {
	       return function schedule() {
	         !disposable.isDisposed && disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
	       };
	     }

	     function ClearDisposable(method, id) {
	       this._id = id;
	       this._method = method;
	       this.isDisposed = false;
	     }

	     ClearDisposable.prototype.dispose = function () {
	       if (!this.isDisposed) {
	         this.isDisposed = true;
	         this._method.call(null, this._id);
	       }
	     };

	    DefaultScheduler.prototype.schedule = function (state, action) {
	      var disposable = new SingleAssignmentDisposable(),
	          id = scheduleMethod(scheduleAction(disposable, action, this, state));
	      return new BinaryDisposable(disposable, new ClearDisposable(clearMethod, id));
	    };

	    DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      if (dueTime === 0) { return this.schedule(state, action); }
	      var disposable = new SingleAssignmentDisposable(),
	          id = localSetTimeout(scheduleAction(disposable, action, this, state), dueTime);
	      return new BinaryDisposable(disposable, new ClearDisposable(localClearTimeout, id));
	    };

	    return DefaultScheduler;
	  }(Scheduler));

	  var defaultScheduler = Scheduler['default'] = Scheduler.async = new DefaultScheduler();

	  var CatchScheduler = (function (__super__) {
	    inherits(CatchScheduler, __super__);

	    function CatchScheduler(scheduler, handler) {
	      this._scheduler = scheduler;
	      this._handler = handler;
	      this._recursiveOriginal = null;
	      this._recursiveWrapper = null;
	      __super__.call(this);
	    }

	    CatchScheduler.prototype.schedule = function (state, action) {
	      return this._scheduler.schedule(state, this._wrap(action));
	    };

	    CatchScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      return this._scheduler.schedule(state, dueTime, this._wrap(action));
	    };

	    CatchScheduler.prototype.now = function () { return this._scheduler.now(); };

	    CatchScheduler.prototype._clone = function (scheduler) {
	        return new CatchScheduler(scheduler, this._handler);
	    };

	    CatchScheduler.prototype._wrap = function (action) {
	      var parent = this;
	      return function (self, state) {
	        var res = tryCatch(action)(parent._getRecursiveWrapper(self), state);
	        if (res === errorObj) {
	          if (!parent._handler(res.e)) { thrower(res.e); }
	          return disposableEmpty;
	        }
	        return disposableFixup(ret);
	      };
	    };

	    CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
	      if (this._recursiveOriginal !== scheduler) {
	        this._recursiveOriginal = scheduler;
	        var wrapper = this._clone(scheduler);
	        wrapper._recursiveOriginal = scheduler;
	        wrapper._recursiveWrapper = wrapper;
	        this._recursiveWrapper = wrapper;
	      }
	      return this._recursiveWrapper;
	    };

	    CatchScheduler.prototype.schedulePeriodic = function (state, period, action) {
	      var self = this, failed = false, d = new SingleAssignmentDisposable();

	      d.setDisposable(this._scheduler.schedulePeriodic(state, period, function (state1) {
	        if (failed) { return null; }
	        var res = tryCatch(action)(state1);
	        if (res === errorObj) {
	          failed = true;
	          if (!self._handler(res.e)) { thrower(res.e); }
	          d.dispose();
	          return null;
	        }
	        return ret;
	      }));

	      return d;
	    };

	    return CatchScheduler;
	  }(Scheduler));

	  /**
	   *  Represents a notification to an observer.
	   */
	  var Notification = Rx.Notification = (function () {
	    function Notification() {

	    }

	    Notification.prototype._accept = function (onNext, onError, onCompleted) {
	      throw new NotImplementedError();
	    };

	    Notification.prototype._acceptObservable = function (onNext, onError, onCompleted) {
	      throw new NotImplementedError();
	    };

	    /**
	     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	     *
	     * @memberOf Notification
	     * @param {Any} observerOrOnNext Delegate to invoke for an OnNext notification or Observer to invoke the notification on..
	     * @param {Function} onError Delegate to invoke for an OnError notification.
	     * @param {Function} onCompleted Delegate to invoke for an OnCompleted notification.
	     * @returns {Any} Result produced by the observation.
	     */
	    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
	      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
	        this._acceptObservable(observerOrOnNext) :
	        this._accept(observerOrOnNext, onError, onCompleted);
	    };

	    /**
	     * Returns an observable sequence with a single notification.
	     *
	     * @memberOf Notifications
	     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	     */
	    Notification.prototype.toObservable = function (scheduler) {
	      var self = this;
	      isScheduler(scheduler) || (scheduler = immediateScheduler);
	      return new AnonymousObservable(function (o) {
	        return scheduler.schedule(self, function (_, notification) {
	          notification._acceptObservable(o);
	          notification.kind === 'N' && o.onCompleted();
	        });
	      });
	    };

	    return Notification;
	  })();

	  var OnNextNotification = (function (__super__) {
	    inherits(OnNextNotification, __super__);
	    function OnNextNotification(value) {
	      this.value = value;
	      this.kind = 'N';
	    }

	    OnNextNotification.prototype._accept = function (onNext) {
	      return onNext(this.value);
	    };

	    OnNextNotification.prototype._acceptObservable = function (o) {
	      return o.onNext(this.value);
	    };

	    OnNextNotification.prototype.toString = function () {
	      return 'OnNext(' + this.value + ')';
	    };

	    return OnNextNotification;
	  }(Notification));

	  var OnErrorNotification = (function (__super__) {
	    inherits(OnErrorNotification, __super__);
	    function OnErrorNotification(error) {
	      this.error = error;
	      this.kind = 'E';
	    }

	    OnErrorNotification.prototype._accept = function (onNext, onError) {
	      return onError(this.error);
	    };

	    OnErrorNotification.prototype._acceptObservable = function (o) {
	      return o.onError(this.error);
	    };

	    OnErrorNotification.prototype.toString = function () {
	      return 'OnError(' + this.error + ')';
	    };

	    return OnErrorNotification;
	  }(Notification));

	  var OnCompletedNotification = (function (__super__) {
	    inherits(OnCompletedNotification, __super__);
	    function OnCompletedNotification() {
	      this.kind = 'C';
	    }

	    OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
	      return onCompleted();
	    };

	    OnCompletedNotification.prototype._acceptObservable = function (o) {
	      return o.onCompleted();
	    };

	    OnCompletedNotification.prototype.toString = function () {
	      return 'OnCompleted()';
	    };

	    return OnCompletedNotification;
	  }(Notification));

	  /**
	   * Creates an object that represents an OnNext notification to an observer.
	   * @param {Any} value The value contained in the notification.
	   * @returns {Notification} The OnNext notification containing the value.
	   */
	  var notificationCreateOnNext = Notification.createOnNext = function (value) {
	    return new OnNextNotification(value);
	  };

	  /**
	   * Creates an object that represents an OnError notification to an observer.
	   * @param {Any} error The exception contained in the notification.
	   * @returns {Notification} The OnError notification containing the exception.
	   */
	  var notificationCreateOnError = Notification.createOnError = function (error) {
	    return new OnErrorNotification(error);
	  };

	  /**
	   * Creates an object that represents an OnCompleted notification to an observer.
	   * @returns {Notification} The OnCompleted notification.
	   */
	  var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
	    return new OnCompletedNotification();
	  };

	  /**
	   * Supports push-style iteration over an observable sequence.
	   */
	  var Observer = Rx.Observer = function () { };

	  /**
	   *  Creates a notification callback from an observer.
	   * @returns The action that forwards its input notification to the underlying observer.
	   */
	  Observer.prototype.toNotifier = function () {
	    var observer = this;
	    return function (n) { return n.accept(observer); };
	  };

	  /**
	   *  Hides the identity of an observer.
	   * @returns An observer that hides the identity of the specified observer.
	   */
	  Observer.prototype.asObserver = function () {
	    var self = this;
	    return new AnonymousObserver(
	      function (x) { self.onNext(x); },
	      function (err) { self.onError(err); },
	      function () { self.onCompleted(); });
	  };

	  /**
	   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
	   *  If a violation is detected, an Error is thrown from the offending observer method call.
	   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
	   */
	  Observer.prototype.checked = function () { return new CheckedObserver(this); };

	  /**
	   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	   * @param {Function} [onNext] Observer's OnNext action implementation.
	   * @param {Function} [onError] Observer's OnError action implementation.
	   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	   * @returns {Observer} The observer object implemented using the given actions.
	   */
	  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
	    onNext || (onNext = noop);
	    onError || (onError = defaultError);
	    onCompleted || (onCompleted = noop);
	    return new AnonymousObserver(onNext, onError, onCompleted);
	  };

	  /**
	   *  Creates an observer from a notification callback.
	   * @param {Function} handler Action that handles a notification.
	   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
	   */
	  Observer.fromNotifier = function (handler, thisArg) {
	    var cb = bindCallback(handler, thisArg, 1);
	    return new AnonymousObserver(function (x) {
	      return cb(notificationCreateOnNext(x));
	    }, function (e) {
	      return cb(notificationCreateOnError(e));
	    }, function () {
	      return cb(notificationCreateOnCompleted());
	    });
	  };

	  /**
	   * Schedules the invocation of observer methods on the given scheduler.
	   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
	   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
	   */
	  Observer.prototype.notifyOn = function (scheduler) {
	    return new ObserveOnObserver(scheduler, this);
	  };

	  Observer.prototype.makeSafe = function(disposable) {
	    return new AnonymousSafeObserver(this._onNext, this._onError, this._onCompleted, disposable);
	  };

	  /**
	   * Abstract base class for implementations of the Observer class.
	   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
	   */
	  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
	    inherits(AbstractObserver, __super__);

	    /**
	     * Creates a new observer in a non-stopped state.
	     */
	    function AbstractObserver() {
	      this.isStopped = false;
	    }

	    // Must be implemented by other observers
	    AbstractObserver.prototype.next = notImplemented;
	    AbstractObserver.prototype.error = notImplemented;
	    AbstractObserver.prototype.completed = notImplemented;

	    /**
	     * Notifies the observer of a new element in the sequence.
	     * @param {Any} value Next element in the sequence.
	     */
	    AbstractObserver.prototype.onNext = function (value) {
	      !this.isStopped && this.next(value);
	    };

	    /**
	     * Notifies the observer that an exception has occurred.
	     * @param {Any} error The error that has occurred.
	     */
	    AbstractObserver.prototype.onError = function (error) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(error);
	      }
	    };

	    /**
	     * Notifies the observer of the end of the sequence.
	     */
	    AbstractObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.completed();
	      }
	    };

	    /**
	     * Disposes the observer, causing it to transition to the stopped state.
	     */
	    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };

	    AbstractObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(e);
	        return true;
	      }

	      return false;
	    };

	    return AbstractObserver;
	  }(Observer));

	  /**
	   * Class to create an Observer instance from delegate-based implementations of the on* methods.
	   */
	  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
	    inherits(AnonymousObserver, __super__);

	    /**
	     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	     * @param {Any} onNext Observer's OnNext action implementation.
	     * @param {Any} onError Observer's OnError action implementation.
	     * @param {Any} onCompleted Observer's OnCompleted action implementation.
	     */
	    function AnonymousObserver(onNext, onError, onCompleted) {
	      __super__.call(this);
	      this._onNext = onNext;
	      this._onError = onError;
	      this._onCompleted = onCompleted;
	    }

	    /**
	     * Calls the onNext action.
	     * @param {Any} value Next element in the sequence.
	     */
	    AnonymousObserver.prototype.next = function (value) {
	      this._onNext(value);
	    };

	    /**
	     * Calls the onError action.
	     * @param {Any} error The error that has occurred.
	     */
	    AnonymousObserver.prototype.error = function (error) {
	      this._onError(error);
	    };

	    /**
	     *  Calls the onCompleted action.
	     */
	    AnonymousObserver.prototype.completed = function () {
	      this._onCompleted();
	    };

	    return AnonymousObserver;
	  }(AbstractObserver));

	  var CheckedObserver = (function (__super__) {
	    inherits(CheckedObserver, __super__);

	    function CheckedObserver(observer) {
	      __super__.call(this);
	      this._observer = observer;
	      this._state = 0; // 0 - idle, 1 - busy, 2 - done
	    }

	    var CheckedObserverPrototype = CheckedObserver.prototype;

	    CheckedObserverPrototype.onNext = function (value) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onNext).call(this._observer, value);
	      this._state = 0;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.onError = function (err) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onError).call(this._observer, err);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.onCompleted = function () {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onCompleted).call(this._observer);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.checkAccess = function () {
	      if (this._state === 1) { throw new Error('Re-entrancy detected'); }
	      if (this._state === 2) { throw new Error('Observer completed'); }
	      if (this._state === 0) { this._state = 1; }
	    };

	    return CheckedObserver;
	  }(Observer));

	  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
	    inherits(ScheduledObserver, __super__);

	    function ScheduledObserver(scheduler, observer) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.observer = observer;
	      this.isAcquired = false;
	      this.hasFaulted = false;
	      this.queue = [];
	      this.disposable = new SerialDisposable();
	    }

	    ScheduledObserver.prototype.next = function (value) {
	      var self = this;
	      this.queue.push(function () { self.observer.onNext(value); });
	    };

	    ScheduledObserver.prototype.error = function (e) {
	      var self = this;
	      this.queue.push(function () { self.observer.onError(e); });
	    };

	    ScheduledObserver.prototype.completed = function () {
	      var self = this;
	      this.queue.push(function () { self.observer.onCompleted(); });
	    };

	    ScheduledObserver.prototype.ensureActive = function () {
	      var isOwner = false;
	      if (!this.hasFaulted && this.queue.length > 0) {
	        isOwner = !this.isAcquired;
	        this.isAcquired = true;
	      }
	      if (isOwner) {
	        this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, function (parent, self) {
	          var work;
	          if (parent.queue.length > 0) {
	            work = parent.queue.shift();
	          } else {
	            parent.isAcquired = false;
	            return;
	          }
	          var res = tryCatch(work)();
	          if (res === errorObj) {
	            parent.queue = [];
	            parent.hasFaulted = true;
	            return thrower(res.e);
	          }
	          self(parent);
	        }));
	      }
	    };

	    ScheduledObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.disposable.dispose();
	    };

	    return ScheduledObserver;
	  }(AbstractObserver));

	  var ObserveOnObserver = (function (__super__) {
	    inherits(ObserveOnObserver, __super__);

	    function ObserveOnObserver(scheduler, observer, cancel) {
	      __super__.call(this, scheduler, observer);
	      this._cancel = cancel;
	    }

	    ObserveOnObserver.prototype.next = function (value) {
	      __super__.prototype.next.call(this, value);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.error = function (e) {
	      __super__.prototype.error.call(this, e);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.completed = function () {
	      __super__.prototype.completed.call(this);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this._cancel && this._cancel.dispose();
	      this._cancel = null;
	    };

	    return ObserveOnObserver;
	  })(ScheduledObserver);

	  var observableProto;

	  /**
	   * Represents a push-style collection.
	   */
	  var Observable = Rx.Observable = (function () {

	    function makeSubscribe(self, subscribe) {
	      return function (o) {
	        var oldOnError = o.onError;
	        o.onError = function (e) {
	          makeStackTraceLong(e, self);
	          oldOnError.call(o, e);
	        };

	        return subscribe.call(self, o);
	      };
	    }

	    function Observable() {
	      if (Rx.config.longStackSupport && hasStacks) {
	        var oldSubscribe = this._subscribe;
	        var e = tryCatch(thrower)(new Error()).e;
	        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
	        this._subscribe = makeSubscribe(this, oldSubscribe);
	      }
	    }

	    observableProto = Observable.prototype;

	    /**
	    * Determines whether the given object is an Observable
	    * @param {Any} An object to determine whether it is an Observable
	    * @returns {Boolean} true if an Observable, else false.
	    */
	    Observable.isObservable = function (o) {
	      return o && isFunction(o.subscribe);
	    };

	    /**
	     *  Subscribes an o to the observable sequence.
	     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
	      return this._subscribe(typeof oOrOnNext === 'object' ?
	        oOrOnNext :
	        observerCreate(oOrOnNext, onError, onCompleted));
	    };

	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onNext The function to invoke on each element in the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnNext = function (onNext, thisArg) {
	      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
	    };

	    /**
	     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnError = function (onError, thisArg) {
	      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
	    };

	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
	      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
	    };

	    return Observable;
	  })();

	  var ObservableBase = Rx.ObservableBase = (function (__super__) {
	    inherits(ObservableBase, __super__);

	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }

	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.subscribeCore).call(self, ado);
	      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
	      ado.setDisposable(fixSubscriber(sub));
	    }

	    function ObservableBase() {
	      __super__.call(this);
	    }

	    ObservableBase.prototype._subscribe = function (o) {
	      var ado = new AutoDetachObserver(o), state = [ado, this];

	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.schedule(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    };

	    ObservableBase.prototype.subscribeCore = notImplemented;

	    return ObservableBase;
	  }(Observable));

	var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

	    inherits(FlatMapObservable, __super__);

	    function FlatMapObservable(source, selector, resultSelector, thisArg) {
	      this.resultSelector = isFunction(resultSelector) ? resultSelector : null;
	      this.selector = bindCallback(isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
	      this.source = source;
	      __super__.call(this);
	    }

	    FlatMapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(observer, selector, resultSelector, source) {
	      this.i = 0;
	      this.selector = selector;
	      this.resultSelector = resultSelector;
	      this.source = source;
	      this.o = observer;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype._wrapResult = function(result, x, i) {
	      return this.resultSelector ?
	        result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
	        result;
	    };

	    InnerObserver.prototype.next = function(x) {
	      var i = this.i++;
	      var result = tryCatch(this.selector)(x, i, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }

	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = Observable.from(result));
	      this.o.onNext(this._wrapResult(result, x, i));
	    };

	    InnerObserver.prototype.error = function(e) { this.o.onError(e); };

	    InnerObserver.prototype.onCompleted = function() { this.o.onCompleted(); };

	    return FlatMapObservable;

	}(ObservableBase));

	  var Enumerable = Rx.internals.Enumerable = function () { };

	  function IsDisposedDisposable(state) {
	    this._s = state;
	    this.isDisposed = false;
	  }

	  IsDisposedDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      this._s.isDisposed = true;
	    }
	  };

	  var ConcatEnumerableObservable = (function(__super__) {
	    inherits(ConcatEnumerableObservable, __super__);
	    function ConcatEnumerableObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
	      var state = { isDisposed: false }, subscription = new SerialDisposable();
	      var cancelable = currentThreadScheduler.scheduleRecursive(this.sources[$iterator$](), function (e, self) {
	        if (state.isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }

	        if (currentItem.done) {
	          return o.onCompleted();
	        }

	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(new InnerObserver(o, self, e)));
	      });

	      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, s, e) {
	      this._o = o;
	      this._s = s;
	      this._e = e;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.onNext = function (x) { this._o.onNext(x); };
	    InnerObserver.prototype.onError = function (e) { this._o.onError(e); };
	    InnerObserver.prototype.onCompleted = function () { this._s(this._e); };

	    return ConcatEnumerableObservable;
	  }(ObservableBase));

	  Enumerable.prototype.concat = function () {
	    return new ConcatEnumerableObservable(this);
	  };

	  var CatchErrorObservable = (function(__super__) {
	    inherits(CatchErrorObservable, __super__);
	    function CatchErrorObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    CatchErrorObservable.prototype.subscribeCore = function (o) {
	      var e = this.sources[$iterator$]();

	      var state = { isDisposed: false }, subscription = new SerialDisposable();
	      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (lastException, self) {
	        if (state.isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }

	        if (currentItem.done) {
	          return lastException !== null ? o.onError(lastException) : o.onCompleted();
	        }

	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(new InnerObserver(o, self)));
	      });
	      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, recurse) {
	      this._o = o;
	      this._recurse = recurse;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function (x) { this._o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._recurse(e); };
	    InnerObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return CatchErrorObservable;
	  }(ObservableBase));

	  Enumerable.prototype.catchError = function () {
	    return new CatchErrorObservable(this);
	  };

	  Enumerable.prototype.catchErrorWhen = function (notificationHandler) {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var exceptions = new Subject(),
	        notifier = new Subject(),
	        handled = notificationHandler(exceptions),
	        notificationDisposable = handled.subscribe(notifier);

	      var e = sources[$iterator$]();

	      var state = { isDisposed: false },
	        lastException,
	        subscription = new SerialDisposable();
	      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, self) {
	        if (state.isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }

	        if (currentItem.done) {
	          if (lastException) {
	            o.onError(lastException);
	          } else {
	            o.onCompleted();
	          }
	          return;
	        }

	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var outer = new SingleAssignmentDisposable();
	        var inner = new SingleAssignmentDisposable();
	        subscription.setDisposable(new BinaryDisposable(inner, outer));
	        outer.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          function (exn) {
	            inner.setDisposable(notifier.subscribe(self, function(ex) {
	              o.onError(ex);
	            }, function() {
	              o.onCompleted();
	            }));

	            exceptions.onNext(exn);
	          },
	          function() { o.onCompleted(); }));
	      });

	      return new NAryDisposable([notificationDisposable, subscription, cancelable, new IsDisposedDisposable(state)]);
	    });
	  };

	  var RepeatEnumerable = (function (__super__) {
	    inherits(RepeatEnumerable, __super__);

	    function RepeatEnumerable(v, c) {
	      this.v = v;
	      this.c = c == null ? -1 : c;
	    }
	    RepeatEnumerable.prototype[$iterator$] = function () {
	      return new RepeatEnumerator(this);
	    };

	    function RepeatEnumerator(p) {
	      this.v = p.v;
	      this.l = p.c;
	    }
	    RepeatEnumerator.prototype.next = function () {
	      if (this.l === 0) { return doneEnumerator; }
	      if (this.l > 0) { this.l--; }
	      return { done: false, value: this.v };
	    };

	    return RepeatEnumerable;
	  }(Enumerable));

	  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
	    return new RepeatEnumerable(value, repeatCount);
	  };

	  var OfEnumerable = (function(__super__) {
	    inherits(OfEnumerable, __super__);
	    function OfEnumerable(s, fn, thisArg) {
	      this.s = s;
	      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
	    }
	    OfEnumerable.prototype[$iterator$] = function () {
	      return new OfEnumerator(this);
	    };

	    function OfEnumerator(p) {
	      this.i = -1;
	      this.s = p.s;
	      this.l = this.s.length;
	      this.fn = p.fn;
	    }
	    OfEnumerator.prototype.next = function () {
	     return ++this.i < this.l ?
	       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
	       doneEnumerator;
	    };

	    return OfEnumerable;
	  }(Enumerable));

	  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
	    return new OfEnumerable(source, selector, thisArg);
	  };

	var ObserveOnObservable = (function (__super__) {
	  inherits(ObserveOnObservable, __super__);
	  function ObserveOnObservable(source, s) {
	    this.source = source;
	    this._s = s;
	    __super__.call(this);
	  }

	  ObserveOnObservable.prototype.subscribeCore = function (o) {
	    return this.source.subscribe(new ObserveOnObserver(this._s, o));
	  };

	  return ObserveOnObservable;
	}(ObservableBase));

	   /**
	   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
	   *
	   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
	   *  that require to be run on a scheduler, use subscribeOn.
	   *
	   *  @param {Scheduler} scheduler Scheduler to notify observers on.
	   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
	   */
	  observableProto.observeOn = function (scheduler) {
	    return new ObserveOnObservable(this, scheduler);
	  };

	  var SubscribeOnObservable = (function (__super__) {
	    inherits(SubscribeOnObservable, __super__);
	    function SubscribeOnObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleMethod(scheduler, state) {
	      var source = state[0], d = state[1], o = state[2];
	      d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(o)));
	    }

	    SubscribeOnObservable.prototype.subscribeCore = function (o) {
	      var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
	      d.setDisposable(m);
	      m.setDisposable(this._s.schedule([this.source, d, o], scheduleMethod));
	      return d;
	    };

	    return SubscribeOnObservable;
	  }(ObservableBase));

	   /**
	   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
	   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

	   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
	   *  callbacks on a scheduler, use observeOn.

	   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
	   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
	   */
	  observableProto.subscribeOn = function (scheduler) {
	    return new SubscribeOnObservable(this, scheduler);
	  };

	  var FromPromiseObservable = (function(__super__) {
	    inherits(FromPromiseObservable, __super__);
	    function FromPromiseObservable(p, s) {
	      this._p = p;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleNext(s, state) {
	      var o = state[0], data = state[1];
	      o.onNext(data);
	      o.onCompleted();
	    }

	    function scheduleError(s, state) {
	      var o = state[0], err = state[1];
	      o.onError(err);
	    }

	    FromPromiseObservable.prototype.subscribeCore = function(o) {
	      var sad = new SingleAssignmentDisposable(), self = this;

	      this._p
	        .then(function (data) {
	          sad.setDisposable(self._s.schedule([o, data], scheduleNext));
	        }, function (err) {
	          sad.setDisposable(self._s.schedule([o, err], scheduleError));
	        });

	      return sad;
	    };

	    return FromPromiseObservable;
	  }(ObservableBase));

	  /**
	  * Converts a Promise to an Observable sequence
	  * @param {Promise} An ES6 Compliant promise.
	  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	  */
	  var observableFromPromise = Observable.fromPromise = function (promise, scheduler) {
	    scheduler || (scheduler = defaultScheduler);
	    return new FromPromiseObservable(promise, scheduler);
	  };

	  /*
	   * Converts an existing observable sequence to an ES6 Compatible Promise
	   * @example
	   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
	   *
	   * // With config
	   * Rx.config.Promise = RSVP.Promise;
	   * var promise = Rx.Observable.return(42).toPromise();
	   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
	   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
	   */
	  observableProto.toPromise = function (promiseCtor) {
	    promiseCtor || (promiseCtor = Rx.config.Promise);
	    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
	    var source = this;
	    return new promiseCtor(function (resolve, reject) {
	      // No cancellation can be done
	      var value;
	      source.subscribe(function (v) {
	        value = v;
	      }, reject, function () {
	        resolve(value);
	      });
	    });
	  };

	  var ToArrayObservable = (function(__super__) {
	    inherits(ToArrayObservable, __super__);
	    function ToArrayObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    ToArrayObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o) {
	      this.o = o;
	      this.a = [];
	      AbstractObserver.call(this);
	    }
	    
	    InnerObserver.prototype.next = function (x) { this.a.push(x); };
	    InnerObserver.prototype.error = function (e) { this.o.onError(e);  };
	    InnerObserver.prototype.completed = function () { this.o.onNext(this.a); this.o.onCompleted(); };

	    return ToArrayObservable;
	  }(ObservableBase));

	  /**
	  * Creates an array from an observable sequence.
	  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	  */
	  observableProto.toArray = function () {
	    return new ToArrayObservable(this);
	  };

	  /**
	   *  Creates an observable sequence from a specified subscribe method implementation.
	   * @example
	   *  var res = Rx.Observable.create(function (observer) { return function () { } );
	   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
	   *  var res = Rx.Observable.create(function (observer) { } );
	   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	   */
	  Observable.create = function (subscribe, parent) {
	    return new AnonymousObservable(subscribe, parent);
	  };

	  var Defer = (function(__super__) {
	    inherits(Defer, __super__);
	    function Defer(factory) {
	      this._f = factory;
	      __super__.call(this);
	    }

	    Defer.prototype.subscribeCore = function (o) {
	      var result = tryCatch(this._f)();
	      if (result === errorObj) { return observableThrow(result.e).subscribe(o);}
	      isPromise(result) && (result = observableFromPromise(result));
	      return result.subscribe(o);
	    };

	    return Defer;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	   *
	   * @example
	   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	   */
	  var observableDefer = Observable.defer = function (observableFactory) {
	    return new Defer(observableFactory);
	  };

	  var EmptyObservable = (function(__super__) {
	    inherits(EmptyObservable, __super__);
	    function EmptyObservable(scheduler) {
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    EmptyObservable.prototype.subscribeCore = function (observer) {
	      var sink = new EmptySink(observer, this.scheduler);
	      return sink.run();
	    };

	    function EmptySink(observer, scheduler) {
	      this.observer = observer;
	      this.scheduler = scheduler;
	    }

	    function scheduleItem(s, state) {
	      state.onCompleted();
	      return disposableEmpty;
	    }

	    EmptySink.prototype.run = function () {
	      var state = this.observer;
	      return this.scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this.scheduler.schedule(state, scheduleItem);
	    };

	    return EmptyObservable;
	  }(ObservableBase));

	  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);

	  /**
	   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	   *
	   * @example
	   *  var res = Rx.Observable.empty();
	   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	   * @returns {Observable} An observable sequence with no elements.
	   */
	  var observableEmpty = Observable.empty = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
	  };

	  var FromObservable = (function(__super__) {
	    inherits(FromObservable, __super__);
	    function FromObservable(iterable, mapper, scheduler) {
	      this.iterable = iterable;
	      this.mapper = mapper;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    FromObservable.prototype.subscribeCore = function (o) {
	      var sink = new FromSink(o, this);
	      return sink.run();
	    };

	    return FromObservable;
	  }(ObservableBase));

	  var FromSink = (function () {
	    function FromSink(o, parent) {
	      this.o = o;
	      this.parent = parent;
	    }

	    FromSink.prototype.run = function () {
	      var list = Object(this.parent.iterable),
	          it = getIterable(list),
	          o = this.o,
	          mapper = this.parent.mapper;

	      function loopRecursive(i, recurse) {
	        var next = tryCatch(it.next).call(it);
	        if (next === errorObj) { return o.onError(next.e); }
	        if (next.done) { return o.onCompleted(); }

	        var result = next.value;

	        if (isFunction(mapper)) {
	          result = tryCatch(mapper)(result, i);
	          if (result === errorObj) { return o.onError(result.e); }
	        }

	        o.onNext(result);
	        recurse(i + 1);
	      }

	      return this.parent.scheduler.scheduleRecursive(0, loopRecursive);
	    };

	    return FromSink;
	  }());

	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  function StringIterable(s) {
	    this._s = s;
	  }

	  StringIterable.prototype[$iterator$] = function () {
	    return new StringIterator(this._s);
	  };

	  function StringIterator(s) {
	    this._s = s;
	    this._l = s.length;
	    this._i = 0;
	  }

	  StringIterator.prototype[$iterator$] = function () {
	    return this;
	  };

	  StringIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
	  };

	  function ArrayIterable(a) {
	    this._a = a;
	  }

	  ArrayIterable.prototype[$iterator$] = function () {
	    return new ArrayIterator(this._a);
	  };

	  function ArrayIterator(a) {
	    this._a = a;
	    this._l = toLength(a);
	    this._i = 0;
	  }

	  ArrayIterator.prototype[$iterator$] = function () {
	    return this;
	  };

	  ArrayIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
	  };

	  function numberIsFinite(value) {
	    return typeof value === 'number' && root.isFinite(value);
	  }

	  function isNan(n) {
	    return n !== n;
	  }

	  function getIterable(o) {
	    var i = o[$iterator$], it;
	    if (!i && typeof o === 'string') {
	      it = new StringIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i && o.length !== undefined) {
	      it = new ArrayIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i) { throw new TypeError('Object is not iterable'); }
	    return o[$iterator$]();
	  }

	  function sign(value) {
	    var number = +value;
	    if (number === 0) { return number; }
	    if (isNaN(number)) { return number; }
	    return number < 0 ? -1 : 1;
	  }

	  function toLength(o) {
	    var len = +o.length;
	    if (isNaN(len)) { return 0; }
	    if (len === 0 || !numberIsFinite(len)) { return len; }
	    len = sign(len) * Math.floor(Math.abs(len));
	    if (len <= 0) { return 0; }
	    if (len > maxSafeInteger) { return maxSafeInteger; }
	    return len;
	  }

	  /**
	  * This method creates a new Observable sequence from an array-like or iterable object.
	  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	  * @param {Function} [mapFn] Map function to call on every element of the array.
	  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
	  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	  */
	  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
	    if (iterable == null) {
	      throw new Error('iterable cannot be null.')
	    }
	    if (mapFn && !isFunction(mapFn)) {
	      throw new Error('mapFn when provided must be a function');
	    }
	    if (mapFn) {
	      var mapper = bindCallback(mapFn, thisArg, 2);
	    }
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromObservable(iterable, mapper, scheduler);
	  }

	  var FromArrayObservable = (function(__super__) {
	    inherits(FromArrayObservable, __super__);
	    function FromArrayObservable(args, scheduler) {
	      this.args = args;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    FromArrayObservable.prototype.subscribeCore = function (observer) {
	      var sink = new FromArraySink(observer, this);
	      return sink.run();
	    };

	    return FromArrayObservable;
	  }(ObservableBase));

	  function FromArraySink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }

	  function loopRecursive(args, observer) {
	    var len = args.length;
	    return function loop (i, recurse) {
	      if (i < len) {
	        observer.onNext(args[i]);
	        recurse(i + 1);
	      } else {
	        observer.onCompleted();
	      }
	    };
	  }

	  FromArraySink.prototype.run = function () {
	    return this.parent.scheduler.scheduleRecursive(0, loopRecursive(this.parent.args, this.observer));
	  };

	  /**
	  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
	  * @deprecated use Observable.from or Observable.of
	  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
	  */
	  var observableFromArray = Observable.fromArray = function (array, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler)
	  };

	  var GenerateObservable = (function (__super__) {
	    inherits(GenerateObservable, __super__);
	    function GenerateObservable(state, cndFn, itrFn, resFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._s = s;
	      this._first = true;
	      __super__.call(this);
	    }

	    function scheduleRecursive(self, recurse) {
	      if (self._first) {
	        self._first = false;
	      } else {
	        self._state = tryCatch(self._itrFn)(self._state);
	        if (self._state === errorObj) { return self._o.onError(self._state.e); }
	      }
	      var hasResult = tryCatch(self._cndFn)(self._state);
	      if (hasResult === errorObj) { return self._o.onError(hasResult.e); }
	      if (hasResult) {
	        var result = tryCatch(self._resFn)(self._state);
	        if (result === errorObj) { return self._o.onError(result.e); }
	        self._o.onNext(result);
	        recurse(self);
	      } else {
	        self._o.onCompleted();
	      }
	    }

	    GenerateObservable.prototype.subscribeCore = function (o) {
	      this._o = o;
	      return this._s.scheduleRecursive(this, scheduleRecursive);
	    };

	    return GenerateObservable;
	  }(ObservableBase));

	  /**
	   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
	   *
	   * @example
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
	  };

	  function observableOf (scheduler, array) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler);
	  }

	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.of = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return new FromArrayObservable(args, currentThreadScheduler);
	  };

	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.ofWithScheduler = function (scheduler) {
	    var len = arguments.length, args = new Array(len - 1);
	    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
	    return new FromArrayObservable(args, scheduler);
	  };

	  /**
	   * Creates an Observable sequence from changes to an array using Array.observe.
	   * @param {Array} array An array to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
	   */
	  Observable.ofArrayChanges = function(array) {
	    if (!Array.isArray(array)) { throw new TypeError('Array.observe only accepts arrays.'); }
	    if (typeof Array.observe !== 'function' && typeof Array.unobserve !== 'function') { throw new TypeError('Array.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	      
	      Array.observe(array, observerFn);

	      return function () {
	        Array.unobserve(array, observerFn);
	      };
	    });
	  };

	  /**
	   * Creates an Observable sequence from changes to an object using Object.observe.
	   * @param {Object} obj An object to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
	   */
	  Observable.ofObjectChanges = function(obj) {
	    if (obj == null) { throw new TypeError('object must not be null or undefined.'); }
	    if (typeof Object.observe !== 'function' && typeof Object.unobserve !== 'function') { throw new TypeError('Object.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }

	      Object.observe(obj, observerFn);

	      return function () {
	        Object.unobserve(obj, observerFn);
	      };
	    });
	  };

	  var NeverObservable = (function(__super__) {
	    inherits(NeverObservable, __super__);
	    function NeverObservable() {
	      __super__.call(this);
	    }

	    NeverObservable.prototype.subscribeCore = function (observer) {
	      return disposableEmpty;
	    };

	    return NeverObservable;
	  }(ObservableBase));

	  var NEVER_OBSERVABLE = new NeverObservable();

	  /**
	   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	   * @returns {Observable} An observable sequence whose observers will never get called.
	   */
	  var observableNever = Observable.never = function () {
	    return NEVER_OBSERVABLE;
	  };

	  var PairsObservable = (function(__super__) {
	    inherits(PairsObservable, __super__);
	    function PairsObservable(obj, scheduler) {
	      this.obj = obj;
	      this.keys = Object.keys(obj);
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    PairsObservable.prototype.subscribeCore = function (observer) {
	      var sink = new PairsSink(observer, this);
	      return sink.run();
	    };

	    return PairsObservable;
	  }(ObservableBase));

	  function PairsSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }

	  PairsSink.prototype.run = function () {
	    var observer = this.observer, obj = this.parent.obj, keys = this.parent.keys, len = keys.length;
	    function loopRecursive(i, recurse) {
	      if (i < len) {
	        var key = keys[i];
	        observer.onNext([key, obj[key]]);
	        recurse(i + 1);
	      } else {
	        observer.onCompleted();
	      }
	    }

	    return this.parent.scheduler.scheduleRecursive(0, loopRecursive);
	  };

	  /**
	   * Convert an object into an observable sequence of [key, value] pairs.
	   * @param {Object} obj The object to inspect.
	   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
	   */
	  Observable.pairs = function (obj, scheduler) {
	    scheduler || (scheduler = currentThreadScheduler);
	    return new PairsObservable(obj, scheduler);
	  };

	    var RangeObservable = (function(__super__) {
	    inherits(RangeObservable, __super__);
	    function RangeObservable(start, count, scheduler) {
	      this.start = start;
	      this.rangeCount = count;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    RangeObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RangeSink(observer, this);
	      return sink.run();
	    };

	    return RangeObservable;
	  }(ObservableBase));

	  var RangeSink = (function () {
	    function RangeSink(observer, parent) {
	      this.observer = observer;
	      this.parent = parent;
	    }

	    function loopRecursive(start, count, observer) {
	      return function loop (i, recurse) {
	        if (i < count) {
	          observer.onNext(start + i);
	          recurse(i + 1);
	        } else {
	          observer.onCompleted();
	        }
	      };
	    }

	    RangeSink.prototype.run = function () {
	      return this.parent.scheduler.scheduleRecursive(
	        0,
	        loopRecursive(this.parent.start, this.parent.rangeCount, this.observer)
	      );
	    };

	    return RangeSink;
	  }());

	  /**
	  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	  * @param {Number} start The value of the first integer in the sequence.
	  * @param {Number} count The number of sequential integers to generate.
	  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	  */
	  Observable.range = function (start, count, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RangeObservable(start, count, scheduler);
	  };

	  var RepeatObservable = (function(__super__) {
	    inherits(RepeatObservable, __super__);
	    function RepeatObservable(value, repeatCount, scheduler) {
	      this.value = value;
	      this.repeatCount = repeatCount == null ? -1 : repeatCount;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    RepeatObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RepeatSink(observer, this);
	      return sink.run();
	    };

	    return RepeatObservable;
	  }(ObservableBase));

	  function RepeatSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }

	  RepeatSink.prototype.run = function () {
	    var observer = this.observer, value = this.parent.value;
	    function loopRecursive(i, recurse) {
	      if (i === -1 || i > 0) {
	        observer.onNext(value);
	        i > 0 && i--;
	      }
	      if (i === 0) { return observer.onCompleted(); }
	      recurse(i);
	    }

	    return this.parent.scheduler.scheduleRecursive(this.parent.repeatCount, loopRecursive);
	  };

	  /**
	   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
	   * @param {Mixed} value Element to repeat.
	   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
	   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
	   */
	  Observable.repeat = function (value, repeatCount, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RepeatObservable(value, repeatCount, scheduler);
	  };

	  var JustObservable = (function(__super__) {
	    inherits(JustObservable, __super__);
	    function JustObservable(value, scheduler) {
	      this.value = value;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    JustObservable.prototype.subscribeCore = function (observer) {
	      var sink = new JustSink(observer, this.value, this.scheduler);
	      return sink.run();
	    };

	    function JustSink(observer, value, scheduler) {
	      this.observer = observer;
	      this.value = value;
	      this.scheduler = scheduler;
	    }

	    function scheduleItem(s, state) {
	      var value = state[0], observer = state[1];
	      observer.onNext(value);
	      observer.onCompleted();
	      return disposableEmpty;
	    }

	    JustSink.prototype.run = function () {
	      var state = [this.value, this.observer];
	      return this.scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this.scheduler.schedule(state, scheduleItem);
	    };

	    return JustObservable;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
	   *  There is an alias called 'just' or browsers <IE9.
	   * @param {Mixed} value Single element in the resulting observable sequence.
	   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence containing the single specified element.
	   */
	  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new JustObservable(value, scheduler);
	  };

	  var ThrowObservable = (function(__super__) {
	    inherits(ThrowObservable, __super__);
	    function ThrowObservable(error, scheduler) {
	      this.error = error;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    ThrowObservable.prototype.subscribeCore = function (o) {
	      var sink = new ThrowSink(o, this);
	      return sink.run();
	    };

	    function ThrowSink(o, p) {
	      this.o = o;
	      this.p = p;
	    }

	    function scheduleItem(s, state) {
	      var e = state[0], o = state[1];
	      o.onError(e);
	    }

	    ThrowSink.prototype.run = function () {
	      return this.p.scheduler.schedule([this.p.error, this.o], scheduleItem);
	    };

	    return ThrowObservable;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
	   *  There is an alias to this method called 'throwError' for browsers <IE9.
	   * @param {Mixed} error An object used for the sequence's termination.
	   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
	   */
	  var observableThrow = Observable['throw'] = function (error, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new ThrowObservable(error, scheduler);
	  };

	  var UsingObservable = (function (__super__) {
	    inherits(UsingObservable, __super__);
	    function UsingObservable(resFn, obsFn) {
	      this._resFn = resFn;
	      this._obsFn = obsFn;
	      __super__.call(this);
	    }

	    UsingObservable.prototype.subscribeCore = function (o) {
	      var disposable = disposableEmpty;
	      var resource = tryCatch(this._resFn)();
	      if (resource === errorObj) {
	        return new BinaryDisposable(observableThrow(resource.e).subscribe(o), disposable);
	      }
	      resource && (disposable = resource);
	      var source = tryCatch(this._obsFn)(resource);
	      if (source === errorObj) {
	        return new BinaryDisposable(observableThrow(source.e).subscribe(o), disposable);
	      }
	      return new BinaryDisposable(source.subscribe(o), disposable);
	    };

	    return UsingObservable;
	  }(ObservableBase));

	  /**
	   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	   * @param {Function} resourceFactory Factory function to obtain a resource object.
	   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	   */
	  Observable.using = function (resourceFactory, observableFactory) {
	    return new UsingObservable(resourceFactory, observableFactory);
	  };

	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @param {Observable} rightSource Second observable sequence or Promise.
	   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
	   */
	  observableProto.amb = function (rightSource) {
	    var leftSource = this;
	    return new AnonymousObservable(function (observer) {
	      var choice,
	        leftChoice = 'L', rightChoice = 'R',
	        leftSubscription = new SingleAssignmentDisposable(),
	        rightSubscription = new SingleAssignmentDisposable();

	      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));

	      function choiceL() {
	        if (!choice) {
	          choice = leftChoice;
	          rightSubscription.dispose();
	        }
	      }

	      function choiceR() {
	        if (!choice) {
	          choice = rightChoice;
	          leftSubscription.dispose();
	        }
	      }

	      var leftSubscribe = observerCreate(
	        function (left) {
	          choiceL();
	          choice === leftChoice && observer.onNext(left);
	        },
	        function (e) {
	          choiceL();
	          choice === leftChoice && observer.onError(e);
	        },
	        function () {
	          choiceL();
	          choice === leftChoice && observer.onCompleted();
	        }
	      );
	      var rightSubscribe = observerCreate(
	        function (right) {
	          choiceR();
	          choice === rightChoice && observer.onNext(right);
	        },
	        function (e) {
	          choiceR();
	          choice === rightChoice && observer.onError(e);
	        },
	        function () {
	          choiceR();
	          choice === rightChoice && observer.onCompleted();
	        }
	      );

	      leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));
	      rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    });
	  };

	  function amb(p, c) { return p.amb(c); }

	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	   */
	  Observable.amb = function () {
	    var acc = observableNever(), items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(items);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    for (var i = 0, len = items.length; i < len; i++) {
	      acc = amb(acc, items[i]);
	    }
	    return acc;
	  };

	  var CatchObservable = (function (__super__) {
	    inherits(CatchObservable, __super__);
	    function CatchObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CatchObservable.prototype.subscribeCore = function (o) {
	      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
	      subscription.setDisposable(d1);
	      d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
	      return subscription;
	    };

	    return CatchObservable;
	  }(ObservableBase));

	  var CatchObserver = (function(__super__) {
	    inherits(CatchObserver, __super__);
	    function CatchObserver(o, s, fn) {
	      this._o = o;
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
	    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
	    CatchObserver.prototype.error = function (e) {
	      var result = tryCatch(this._fn)(e);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      isPromise(result) && (result = observableFromPromise(result));

	      var d = new SingleAssignmentDisposable();
	      this._s.setDisposable(d);
	      d.setDisposable(result.subscribe(this._o));
	    };

	    return CatchObserver;
	  }(AbstractObserver));

	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	   */
	  observableProto['catch'] = function (handlerOrSecond) {
	    return isFunction(handlerOrSecond) ? new CatchObservable(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
	  };

	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
	   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
	   */
	  var observableCatch = Observable['catch'] = function () {
	    var items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(len);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    return enumerableOf(items).catchError();
	  };

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   * This can be in the form of an argument list of observables or an array.
	   *
	   * @example
	   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return combineLatest.apply(this, args);
	  };

	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var CombineLatestObservable = (function(__super__) {
	    inherits(CombineLatestObservable, __super__);
	    function CombineLatestObservable(params, cb) {
	      var len = params.length;
	      this._params = params;
	      this._cb = cb;
	      this._hv = arrayInitialize(len, falseFactory);
	      this._hvAll = false;
	      this._done = arrayInitialize(len, falseFactory);
	      this._v = new Array(len);
	      __super__.call(this);
	    }

	    CombineLatestObservable.prototype.subscribeCore = function(observer) {
	      var len = this._params.length, subscriptions = new Array(len);

	      for (var i = 0; i < len; i++) {
	        var source = this._params[i], sad = new SingleAssignmentDisposable();
	        subscriptions[i] = sad;
	        isPromise(source) && (source = observableFromPromise(source));
	        sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this)));
	      }

	      return new NAryDisposable(subscriptions);
	    };

	    return CombineLatestObservable;
	  }(ObservableBase));

	  var CombineLatestObserver = (function (__super__) {
	    inherits(CombineLatestObserver, __super__);
	    function CombineLatestObserver(o, i, p) {
	      this._o = o;
	      this._i = i;
	      this._p = p;
	      __super__.call(this);
	    }

	    CombineLatestObserver.prototype.next = function (x) {
	      this._p._v[this._i] = x;
	      this._p._hv[this._i] = true;
	      if (this._p._hvAll || (this._p._hvAll = this._p._hv.every(identity))) {
	        var res = tryCatch(this._p._cb).apply(null, this._p._v);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._o.onNext(res);
	      } else if (this._p._done.filter(function (x, j) { return j !== this._i; }, this).every(identity)) {
	        this._o.onCompleted();
	      }
	    };

	    CombineLatestObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    CombineLatestObserver.prototype.completed = function () {
	      this._p._done[this._i] = true;
	      this._p._done.every(identity) && this._o.onCompleted();
	    };

	    return CombineLatestObserver;
	  }(AbstractObserver));

	  /**
	  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	  *
	  * @example
	  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	  */
	  var combineLatest = Observable.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	    return new CombineLatestObservable(args, resultSelector);
	  };

	  /**
	   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  observableProto.concat = function () {
	    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    args.unshift(this);
	    return observableConcat.apply(null, args);
	  };

	  var ConcatObservable = (function(__super__) {
	    inherits(ConcatObservable, __super__);
	    function ConcatObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    ConcatObservable.prototype.subscribeCore = function(o) {
	      var sink = new ConcatSink(this.sources, o);
	      return sink.run();
	    };

	    function ConcatSink(sources, o) {
	      this.sources = sources;
	      this.o = o;
	    }
	    ConcatSink.prototype.run = function () {
	      var isDisposed, subscription = new SerialDisposable(), sources = this.sources, length = sources.length, o = this.o;
	      var cancelable = immediateScheduler.scheduleRecursive(0, function (i, self) {
	        if (isDisposed) { return; }
	        if (i === length) {
	          return o.onCompleted();
	        }

	        // Check if promise
	        var currentValue = sources[i];
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(
	          function (x) { o.onNext(x); },
	          function (e) { o.onError(e); },
	          function () { self(i + 1); }
	        ));
	      });

	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };


	    return ConcatObservable;
	  }(ObservableBase));

	  /**
	   * Concatenates all the observable sequences.
	   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  var observableConcat = Observable.concat = function () {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      args = new Array(arguments.length);
	      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
	    }
	    return new ConcatObservable(args);
	  };

	  /**
	   * Concatenates an observable sequence of observable sequences.
	   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
	   */
	  observableProto.concatAll = function () {
	    return this.merge(1);
	  };

	  var MergeObservable = (function (__super__) {
	    inherits(MergeObservable, __super__);

	    function MergeObservable(source, maxConcurrent) {
	      this.source = source;
	      this.maxConcurrent = maxConcurrent;
	      __super__.call(this);
	    }

	    MergeObservable.prototype.subscribeCore = function(observer) {
	      var g = new CompositeDisposable();
	      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
	      return g;
	    };

	    return MergeObservable;

	  }(ObservableBase));

	  var MergeObserver = (function () {
	    function MergeObserver(o, max, g) {
	      this.o = o;
	      this.max = max;
	      this.g = g;
	      this.done = false;
	      this.q = [];
	      this.activeCount = 0;
	      this.isStopped = false;
	    }
	    MergeObserver.prototype.handleSubscribe = function (xs) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(xs) && (xs = observableFromPromise(xs));
	      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
	    };
	    MergeObserver.prototype.onNext = function (innerSource) {
	      if (this.isStopped) { return; }
	        if(this.activeCount < this.max) {
	          this.activeCount++;
	          this.handleSubscribe(innerSource);
	        } else {
	          this.q.push(innerSource);
	        }
	      };
	      MergeObserver.prototype.onError = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	        }
	      };
	      MergeObserver.prototype.onCompleted = function () {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.done = true;
	          this.activeCount === 0 && this.o.onCompleted();
	        }
	      };
	      MergeObserver.prototype.dispose = function() { this.isStopped = true; };
	      MergeObserver.prototype.fail = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	          return true;
	        }

	        return false;
	      };

	      function InnerObserver(parent, sad) {
	        this.parent = parent;
	        this.sad = sad;
	        this.isStopped = false;
	      }
	      InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.parent.o.onNext(x); } };
	      InnerObserver.prototype.onError = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.parent.o.onError(e);
	        }
	      };
	      InnerObserver.prototype.onCompleted = function () {
	        if(!this.isStopped) {
	          this.isStopped = true;
	          var parent = this.parent;
	          parent.g.remove(this.sad);
	          if (parent.q.length > 0) {
	            parent.handleSubscribe(parent.q.shift());
	          } else {
	            parent.activeCount--;
	            parent.done && parent.activeCount === 0 && parent.o.onCompleted();
	          }
	        }
	      };
	      InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	      InnerObserver.prototype.fail = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.parent.o.onError(e);
	          return true;
	        }

	        return false;
	      };

	      return MergeObserver;
	  }());





	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	  * Or merges two observable sequences into a single observable sequence.
	  *
	  * @example
	  * 1 - merged = sources.merge(1);
	  * 2 - merged = source.merge(otherSource);
	  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.merge = function (maxConcurrentOrOther) {
	    return typeof maxConcurrentOrOther !== 'number' ?
	      observableMerge(this, maxConcurrentOrOther) :
	      new MergeObservable(this, maxConcurrentOrOther);
	  };

	  /**
	   * Merges all the observable sequences into a single observable sequence.
	   * The scheduler is optional and if not specified, the immediate scheduler is used.
	   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
	   */
	  var observableMerge = Observable.merge = function () {
	    var scheduler, sources = [], i, len = arguments.length;
	    if (!arguments[0]) {
	      scheduler = immediateScheduler;
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else if (isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else {
	      scheduler = immediateScheduler;
	      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
	    }
	    if (Array.isArray(sources[0])) {
	      sources = sources[0];
	    }
	    return observableOf(scheduler, sources).mergeAll();
	  };

	  var MergeAllObservable = (function (__super__) {
	    inherits(MergeAllObservable, __super__);

	    function MergeAllObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MergeAllObservable.prototype.subscribeCore = function (observer) {
	      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
	      g.add(m);
	      m.setDisposable(this.source.subscribe(new MergeAllObserver(observer, g)));
	      return g;
	    };

	    function MergeAllObserver(o, g) {
	      this.o = o;
	      this.g = g;
	      this.isStopped = false;
	      this.done = false;
	    }
	    MergeAllObserver.prototype.onNext = function(innerSource) {
	      if(this.isStopped) { return; }
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);

	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));

	      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
	    };
	    MergeAllObserver.prototype.onError = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    MergeAllObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.done = true;
	        this.g.length === 1 && this.o.onCompleted();
	      }
	    };
	    MergeAllObserver.prototype.dispose = function() { this.isStopped = true; };
	    MergeAllObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }

	      return false;
	    };

	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if (!this.isStopped) { this.parent.o.onNext(x); } };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        var parent = this.parent;
	        this.isStopped = true;
	        parent.g.remove(this.sad);
	        parent.done && parent.g.length === 1 && parent.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	        return true;
	      }

	      return false;
	    };

	    return MergeAllObservable;
	  }(ObservableBase));

	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.mergeAll = function () {
	    return new MergeAllObservable(this);
	  };

	  var CompositeError = Rx.CompositeError = function(errors) {
	    this.innerErrors = errors;
	    this.message = 'This contains multiple errors. Check the innerErrors';
	    Error.call(this);
	  };
	  CompositeError.prototype = Error.prototype;
	  CompositeError.prototype.name = 'NotImplementedError';

	  /**
	  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
	  * receive all successfully emitted items from all of the source Observables without being interrupted by
	  * an error notification from one of them.
	  *
	  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
	  * error via the Observer's onError, mergeDelayError will refrain from propagating that
	  * error notification until all of the merged Observables have finished emitting items.
	  * @param {Array | Arguments} args Arguments or an array to merge.
	  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
	  */
	  Observable.mergeDelayError = function() {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      var len = arguments.length;
	      args = new Array(len);
	      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    var source = observableOf(null, args);

	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable(),
	        m = new SingleAssignmentDisposable(),
	        isStopped = false,
	        errors = [];

	      function setCompletion() {
	        if (errors.length === 0) {
	          o.onCompleted();
	        } else if (errors.length === 1) {
	          o.onError(errors[0]);
	        } else {
	          o.onError(new CompositeError(errors));
	        }
	      }

	      group.add(m);

	      m.setDisposable(source.subscribe(
	        function (innerSource) {
	          var innerSubscription = new SingleAssignmentDisposable();
	          group.add(innerSubscription);

	          // Check for promises support
	          isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));

	          innerSubscription.setDisposable(innerSource.subscribe(
	            function (x) { o.onNext(x); },
	            function (e) {
	              errors.push(e);
	              group.remove(innerSubscription);
	              isStopped && group.length === 1 && setCompletion();
	            },
	            function () {
	              group.remove(innerSubscription);
	              isStopped && group.length === 1 && setCompletion();
	          }));
	        },
	        function (e) {
	          errors.push(e);
	          isStopped = true;
	          group.length === 1 && setCompletion();
	        },
	        function () {
	          isStopped = true;
	          group.length === 1 && setCompletion();
	        }));
	      return group;
	    });
	  };

	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
	   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
	   */
	  observableProto.onErrorResumeNext = function (second) {
	    if (!second) { throw new Error('Second observable is required'); }
	    return onErrorResumeNext([this, second]);
	  };

	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   *
	   * @example
	   * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
	   * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
	   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	   */
	  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
	    var sources = [];
	    if (Array.isArray(arguments[0])) {
	      sources = arguments[0];
	    } else {
	      for(var i = 0, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    }
	    return new AnonymousObservable(function (observer) {
	      var pos = 0, subscription = new SerialDisposable(),
	      cancelable = immediateScheduler.scheduleRecursive(null, function (_, self) {
	        var current, d;
	        if (pos < sources.length) {
	          current = sources[pos++];
	          isPromise(current) && (current = observableFromPromise(current));
	          d = new SingleAssignmentDisposable();
	          subscription.setDisposable(d);
	          d.setDisposable(current.subscribe(observer.onNext.bind(observer), self, self));
	        } else {
	          observer.onCompleted();
	        }
	      });
	      return new BinaryDisposable(subscription, cancelable);
	    });
	  };

	  var SkipUntilObservable = (function(__super__) {
	    inherits(SkipUntilObservable, __super__);

	    function SkipUntilObservable(source, other) {
	      this._s = source;
	      this._o = isPromise(other) ? observableFromPromise(other) : other;
	      this._open = false;
	      __super__.call(this);
	    }

	    SkipUntilObservable.prototype.subscribeCore = function(o) {
	      var leftSubscription = new SingleAssignmentDisposable();
	      leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

	      isPromise(this._o) && (this._o = observableFromPromise(this._o));

	      var rightSubscription = new SingleAssignmentDisposable();
	      rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    };

	    return SkipUntilObservable;
	  }(ObservableBase));

	  var SkipUntilSourceObserver = (function(__super__) {
	    inherits(SkipUntilSourceObserver, __super__);
	    function SkipUntilSourceObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipUntilSourceObserver.prototype.next = function (x) {
	      this._p._open && this._o.onNext(x);
	    };

	    SkipUntilSourceObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    SkipUntilSourceObserver.prototype.onCompleted = function () {
	      this._p._open && this._o.onCompleted();
	    };

	    return SkipUntilSourceObserver;
	  }(AbstractObserver));

	  var SkipUntilOtherObserver = (function(__super__) {
	    inherits(SkipUntilOtherObserver, __super__);
	    function SkipUntilOtherObserver(o, p, r) {
	      this._o = o;
	      this._p = p;
	      this._r = r;
	      __super__.call(this);
	    }

	    SkipUntilOtherObserver.prototype.next = function () {
	      this._p._open = true;
	      this._r.dispose();
	    };

	    SkipUntilOtherObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    SkipUntilOtherObserver.prototype.onCompleted = function () {
	      this._r.dispose();
	    };

	    return SkipUntilOtherObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	   */
	  observableProto.skipUntil = function (other) {
	    return new SkipUntilObservable(this, other);
	  };

	  var SwitchObservable = (function(__super__) {
	    inherits(SwitchObservable, __super__);
	    function SwitchObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    SwitchObservable.prototype.subscribeCore = function (o) {
	      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
	      return new BinaryDisposable(s, inner);
	    };

	    inherits(SwitchObserver, AbstractObserver);
	    function SwitchObserver(o, inner) {
	      this.o = o;
	      this.inner = inner;
	      this.stopped = false;
	      this.latest = 0;
	      this.hasLatest = false;
	      AbstractObserver.call(this);
	    }

	    SwitchObserver.prototype.next = function (innerSource) {
	      var d = new SingleAssignmentDisposable(), id = ++this.latest;
	      this.hasLatest = true;
	      this.inner.setDisposable(d);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
	    };

	    SwitchObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    SwitchObserver.prototype.completed = function () {
	      this.stopped = true;
	      !this.hasLatest && this.o.onCompleted();
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(parent, id) {
	      this.parent = parent;
	      this.id = id;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.next = function (x) {
	      this.parent.latest === this.id && this.parent.o.onNext(x);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.parent.latest === this.id && this.parent.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      if (this.parent.latest === this.id) {
	        this.parent.hasLatest = false;
	        this.parent.isStopped && this.parent.o.onCompleted();
	      }
	    };

	    return SwitchObservable;
	  }(ObservableBase));

	  /**
	  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	  */
	  observableProto['switch'] = observableProto.switchLatest = function () {
	    return new SwitchObservable(this);
	  };

	  var TakeUntilObservable = (function(__super__) {
	    inherits(TakeUntilObservable, __super__);

	    function TakeUntilObservable(source, other) {
	      this.source = source;
	      this.other = isPromise(other) ? observableFromPromise(other) : other;
	      __super__.call(this);
	    }

	    TakeUntilObservable.prototype.subscribeCore = function(o) {
	      return new BinaryDisposable(
	        this.source.subscribe(o),
	        this.other.subscribe(new TakeUntilObserver(o))
	      );
	    };

	    return TakeUntilObservable;
	  }(ObservableBase));

	  var TakeUntilObserver = (function(__super__) {
	    inherits(TakeUntilObserver, __super__);
	    function TakeUntilObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    TakeUntilObserver.prototype.next = function () {
	      this._o.onCompleted();
	    };

	    TakeUntilObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    TakeUntilObserver.prototype.onCompleted = noop;

	    return TakeUntilObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the values from the source observable sequence until the other observable sequence produces a value.
	   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	   */
	  observableProto.takeUntil = function (other) {
	    return new TakeUntilObservable(this, other);
	  };

	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var WithLatestFromObservable = (function(__super__) {
	    inherits(WithLatestFromObservable, __super__);
	    function WithLatestFromObservable(source, sources, resultSelector) {
	      var len = sources.length;
	      this._s = source;
	      this._ss = sources;
	      this._cb = resultSelector;
	      this._hv = arrayInitialize(len, falseFactory);
	      this._hvAll = false;
	      this._v = new Array(len);
	      __super__.call(this);
	    }

	    WithLatestFromObservable.prototype.subscribeCore = function (o) {
	      var n = this._ss.length, subscriptions = new Array(n + 1);
	      for (var i = 0; i < n; i++) {
	        var other = this._ss[i], sad = new SingleAssignmentDisposable();
	        isPromise(other) && (other = observableFromPromise(other));
	        sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, this)));
	        subscriptions[i] = sad;
	      }

	      var sad = new SingleAssignmentDisposable();
	      sad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this)));
	      subscriptions[n] = sad;

	      return new NAryDisposable(subscriptions);
	    };

	    return WithLatestFromObservable;
	  }(ObservableBase));

	  var WithLatestFromOtherObserver = (function (__super__) {
	    inherits(WithLatestFromOtherObserver, __super__);
	    function WithLatestFromOtherObserver(o, i, p) {
	      this._o = o;
	      this._i = i;
	      this._p = p;
	      __super__.call(this);
	    }

	    WithLatestFromOtherObserver.prototype.next = function (x) {
	      this._p._v[this._i] = x;
	      this._p._hv[this._i] = true;
	      this._p._hvAll = this._p._hv.every(identity);
	    };

	    WithLatestFromOtherObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    WithLatestFromOtherObserver.prototype.completed = noop;

	    return WithLatestFromOtherObserver;
	  }(AbstractObserver));

	  var WithLatestFromSourceObserver = (function (__super__) {
	    inherits(WithLatestFromSourceObserver, __super__);
	    function WithLatestFromSourceObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    WithLatestFromSourceObserver.prototype.next = function (x) {
	      var allValues = [x].concat(this._p._v);
	      if (!this._p._hvAll) { return; }
	      var res = tryCatch(this._p._cb).apply(null, allValues);
	      if (res === errorObj) { return this._o.onError(res.e); }
	      this._o.onNext(res);
	    };

	    WithLatestFromSourceObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    WithLatestFromSourceObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return WithLatestFromSourceObserver;
	  }(AbstractObserver));

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.withLatestFrom = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }

	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);

	    return new WithLatestFromObservable(this, args, resultSelector);
	  };

	  function falseFactory() { return false; }
	  function emptyArrayFactory() { return []; }

	  var ZipObservable = (function(__super__) {
	    inherits(ZipObservable, __super__);
	    function ZipObservable(sources, resultSelector) {
	      var len = sources.length;
	      this._s = sources;
	      this._cb = resultSelector;
	      this._done = arrayInitialize(len, falseFactory);
	      this._q = arrayInitialize(len, emptyArrayFactory);
	      __super__.call(this);
	    }

	    ZipObservable.prototype.subscribeCore = function(observer) {
	      var n = this._s.length, subscriptions = new Array(n);

	      for (var i = 0; i < n; i++) {
	        var source = this._s[i], sad = new SingleAssignmentDisposable();
	        subscriptions[i] = sad;
	        isPromise(source) && (source = observableFromPromise(source));
	        sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this)));
	      }

	      return new NAryDisposable(subscriptions);
	    };

	    return ZipObservable;
	  }(ObservableBase));

	  var ZipObserver = (function (__super__) {
	    inherits(ZipObserver, __super__);
	    function ZipObserver(o, i, p) {
	      this._o = o;
	      this._i = i;
	      this._p = p;
	      __super__.call(this);
	    }

	    ZipObserver.prototype.next = function (x) {
	      this._p._q[this._i].push(x);
	      if (this._p._q.every(function (x) { return x.length > 0; })) {
	        var queuedValues = this._p._q.map(function (x) { return x.shift(); });
	        var res = tryCatch(this._p._cb).apply(null, queuedValues);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._o.onNext(res);
	      } else if (this._p._done.filter(function (x, j) { return j !== this._i; }, this).every(identity)) {
	        this._o.onCompleted();
	      }
	    };

	    ZipObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ZipObserver.prototype.completed = function () {
	      this._p._done[this._i] = true;
	      this._p._done.every(identity) && this._o.onCompleted();
	    };

	    return ZipObserver;
	  }(AbstractObserver));

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	   */
	  observableProto.zip = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }

	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);

	    var parent = this;
	    args.unshift(parent);

	    return new ZipObservable(args, resultSelector);
	  };

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
	   * @param arguments Observable sources.
	   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  Observable.zip = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args = isFunction(args[1]) ? args[0].concat(args[1]) : args[0];
	    }
	    var first = args.shift();
	    return first.zip.apply(first, args);
	  };

	function falseFactory() { return false; }
	function emptyArrayFactory() { return []; }
	function argumentsToArray() {
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  return args;
	}

	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */
	observableProto.zipIterable = function () {
	  if (arguments.length === 0) { throw new Error('invalid arguments'); }

	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

	  var parent = this;
	  args.unshift(parent);
	  return new AnonymousObservable(function (o) {
	    var n = args.length,
	      queues = arrayInitialize(n, emptyArrayFactory),
	      isDone = arrayInitialize(n, falseFactory);

	    var subscriptions = new Array(n);
	    for (var idx = 0; idx < n; idx++) {
	      (function (i) {
	        var source = args[i], sad = new SingleAssignmentDisposable();

	        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));

	        sad.setDisposable(source.subscribe(function (x) {
	          queues[i].push(x);
	          if (queues.every(function (x) { return x.length > 0; })) {
	            var queuedValues = queues.map(function (x) { return x.shift(); }),
	                res = tryCatch(resultSelector).apply(parent, queuedValues);
	            if (res === errorObj) { return o.onError(res.e); }
	            o.onNext(res);
	          } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	            o.onCompleted();
	          }
	        }, function (e) { o.onError(e); }, function () {
	          isDone[i] = true;
	          isDone.every(identity) && o.onCompleted();
	        }));
	        subscriptions[i] = sad;
	      })(idx);
	    }

	    return new CompositeDisposable(subscriptions);
	  }, parent);
	};

	  function asObservable(source) {
	    return function subscribe(o) { return source.subscribe(o); };
	  }

	  /**
	   *  Hides the identity of an observable sequence.
	   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	   */
	  observableProto.asObservable = function () {
	    return new AnonymousObservable(asObservable(this), this);
	  };

	  function toArray(x) { return x.toArray(); }
	  function notEmpty(x) { return x.length > 0; }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
	   * @param {Number} count Length of each buffer.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithCount = function (count, skip) {
	    typeof skip !== 'number' && (skip = count);
	    return this.windowWithCount(count, skip)
	      .flatMap(toArray)
	      .filter(notEmpty);
	  };

	  var DematerializeObservable = (function (__super__) {
	    inherits(DematerializeObservable, __super__);
	    function DematerializeObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    DematerializeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DematerializeObserver(o));
	    };

	    return DematerializeObservable;
	  }(ObservableBase));

	  var DematerializeObserver = (function (__super__) {
	    inherits(DematerializeObserver, __super__);

	    function DematerializeObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    DematerializeObserver.prototype.next = function (x) { x.accept(this._o); };
	    DematerializeObserver.prototype.error = function (e) { this._o.onError(e); };
	    DematerializeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return DematerializeObserver;
	  }(AbstractObserver));

	  /**
	   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	   */
	  observableProto.dematerialize = function () {
	    return new DematerializeObservable(this);
	  };

	  var DistinctUntilChangedObservable = (function(__super__) {
	    inherits(DistinctUntilChangedObservable, __super__);
	    function DistinctUntilChangedObservable(source, keyFn, comparer) {
	      this.source = source;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      __super__.call(this);
	    }

	    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
	    };

	    return DistinctUntilChangedObservable;
	  }(ObservableBase));

	  var DistinctUntilChangedObserver = (function(__super__) {
	    inherits(DistinctUntilChangedObserver, __super__);
	    function DistinctUntilChangedObserver(o, keyFn, comparer) {
	      this.o = o;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      this.hasCurrentKey = false;
	      this.currentKey = null;
	      __super__.call(this);
	    }

	    DistinctUntilChangedObserver.prototype.next = function (x) {
	      var key = x, comparerEquals;
	      if (isFunction(this.keyFn)) {
	        key = tryCatch(this.keyFn)(x);
	        if (key === errorObj) { return this.o.onError(key.e); }
	      }
	      if (this.hasCurrentKey) {
	        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
	        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
	      }
	      if (!this.hasCurrentKey || !comparerEquals) {
	        this.hasCurrentKey = true;
	        this.currentKey = key;
	        this.o.onNext(x);
	      }
	    };
	    DistinctUntilChangedObserver.prototype.error = function(e) {
	      this.o.onError(e);
	    };
	    DistinctUntilChangedObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return DistinctUntilChangedObserver;
	  }(AbstractObserver));

	  /**
	  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	  */
	  observableProto.distinctUntilChanged = function (keyFn, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctUntilChangedObservable(this, keyFn, comparer);
	  };

	  var TapObservable = (function(__super__) {
	    inherits(TapObservable,__super__);
	    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
	      this.source = source;
	      this._oN = observerOrOnNext;
	      this._oE = onError;
	      this._oC = onCompleted;
	      __super__.call(this);
	    }

	    TapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, p) {
	      this.o = o;
	      this.t = !p._oN || isFunction(p._oN) ?
	        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
	        p._oN;
	      this.isStopped = false;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.next = function(x) {
	      var res = tryCatch(this.t.onNext).call(this.t, x);
	      if (res === errorObj) { this.o.onError(res.e); }
	      this.o.onNext(x);
	    };
	    InnerObserver.prototype.error = function(err) {
	      var res = tryCatch(this.t.onError).call(this.t, err);
	      if (res === errorObj) { return this.o.onError(res.e); }
	      this.o.onError(err);
	    };
	    InnerObserver.prototype.completed = function() {
	      var res = tryCatch(this.t.onCompleted).call(this.t);
	      if (res === errorObj) { return this.o.onError(res.e); }
	      this.o.onCompleted();
	    };

	    return TapObservable;
	  }(ObservableBase));

	  /**
	  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
	    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
	  };

	  /**
	  *  Invokes an action for each element in the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onNext Action to invoke for each element in the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
	    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
	  };

	  /**
	  *  Invokes an action upon exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
	    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
	  };

	  /**
	  *  Invokes an action upon graceful termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
	    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
	  };

	  /**
	   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	   */
	  observableProto['finally'] = function (action) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var subscription = tryCatch(source.subscribe).call(source, observer);
	      if (subscription === errorObj) {
	        action();
	        return thrower(subscription.e);
	      }
	      return disposableCreate(function () {
	        var r = tryCatch(subscription.dispose).call(subscription);
	        action();
	        r === errorObj && thrower(r.e);
	      });
	    }, this);
	  };

	  var IgnoreElementsObservable = (function(__super__) {
	    inherits(IgnoreElementsObservable, __super__);

	    function IgnoreElementsObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };

	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = noop;
	    InnerObserver.prototype.onError = function (err) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.observer.onError(e);
	        return true;
	      }

	      return false;
	    };

	    return IgnoreElementsObservable;
	  }(ObservableBase));

	  /**
	   *  Ignores all elements in an observable sequence leaving only the termination messages.
	   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	   */
	  observableProto.ignoreElements = function () {
	    return new IgnoreElementsObservable(this);
	  };

	  var MaterializeObservable = (function (__super__) {
	    inherits(MaterializeObservable, __super__);
	    function MaterializeObservable(source, fn) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MaterializeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new MaterializeObserver(o));
	    };

	    return MaterializeObservable;
	  }(ObservableBase));

	  var MaterializeObserver = (function (__super__) {
	    inherits(MaterializeObserver, __super__);

	    function MaterializeObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    MaterializeObserver.prototype.next = function (x) { this._o.onNext(notificationCreateOnNext(x)) };
	    MaterializeObserver.prototype.error = function (e) { this._o.onNext(notificationCreateOnError(e)); this._o.onCompleted(); };
	    MaterializeObserver.prototype.completed = function () { this._o.onNext(notificationCreateOnCompleted()); this._o.onCompleted(); };

	    return MaterializeObserver;
	  }(AbstractObserver));

	  /**
	   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	   */
	  observableProto.materialize = function () {
	    return new MaterializeObservable(this);
	  };

	  /**
	   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
	   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
	   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
	   */
	  observableProto.repeat = function (repeatCount) {
	    return enumerableRepeat(this, repeatCount).concat();
	  };

	  /**
	   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
	   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
	   *
	   * @example
	   *  var res = retried = retry.repeat();
	   *  var res = retried = retry.repeat(2);
	   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retry = function (retryCount) {
	    return enumerableRepeat(this, retryCount).catchError();
	  };

	  /**
	   *  Repeats the source observable sequence upon error each time the notifier emits or until it successfully terminates. 
	   *  if the notifier completes, the observable sequence completes.
	   *
	   * @example
	   *  var timer = Observable.timer(500);
	   *  var source = observable.retryWhen(timer);
	   * @param {Observable} [notifier] An observable that triggers the retries or completes the observable with onNext or onCompleted respectively.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retryWhen = function (notifier) {
	    return enumerableRepeat(this).catchErrorWhen(notifier);
	  };
	  var ScanObservable = (function(__super__) {
	    inherits(ScanObservable, __super__);
	    function ScanObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }

	    ScanObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new ScanObserver(o,this));
	    };

	    return ScanObservable;
	  }(ObservableBase));

	  var ScanObserver = (function (__super__) {
	    inherits(ScanObserver, __super__);
	    function ScanObserver(o, parent) {
	      this._o = o;
	      this._p = parent;
	      this._fn = parent.accumulator;
	      this._hs = parent.hasSeed;
	      this._s = parent.seed;
	      this._ha = false;
	      this._a = null;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    ScanObserver.prototype.next = function (x) {
	      !this._hv && (this._hv = true);
	      if (this._ha) {
	        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	      } else {
	        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	        this._ha = true;
	      }
	      if (this._a === errorObj) { return this._o.onError(this._a.e); }
	      this._o.onNext(this._a);
	      this._i++;
	    };

	    ScanObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ScanObserver.prototype.completed = function () {
	      !this._hv && this._hs && this._o.onNext(this._s);
	      this._o.onCompleted();
	    };

	    return ScanObserver;
	  }(AbstractObserver));

	  /**
	  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
	  * @param {Mixed} [seed] The initial accumulator value.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @returns {Observable} An observable sequence containing the accumulated values.
	  */
	  observableProto.scan = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ScanObservable(this, accumulator, hasSeed, seed);
	  };

	  var SkipLastObservable = (function (__super__) {
	    inherits(SkipLastObservable, __super__);
	    function SkipLastObservable(source, c) {
	      this.source = source;
	      this._c = c;
	      __super__.call(this);
	    }

	    SkipLastObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipLastObserver(o, this._c));
	    };

	    return SkipLastObservable;
	  }(ObservableBase));

	  var SkipLastObserver = (function (__super__) {
	    inherits(SkipLastObserver, __super__);
	    function SkipLastObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    SkipLastObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._o.onNext(this._q.shift());
	    };

	    SkipLastObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    SkipLastObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return SkipLastObserver;
	  }(AbstractObserver));

	  /**
	   *  Bypasses a specified number of elements at the end of an observable sequence.
	   * @description
	   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
	   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
	   * @param count Number of elements to bypass at the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
	   */
	  observableProto.skipLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipLastObservable(this, count);
	  };

	  /**
	   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
	   *  @example
	   *  var res = source.startWith(1, 2, 3);
	   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
	   * @param {Arguments} args The specified values to prepend to the observable sequence
	   * @returns {Observable} The source sequence prepended with the specified values.
	   */
	  observableProto.startWith = function () {
	    var values, scheduler, start = 0;
	    if (!!arguments.length && isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      start = 1;
	    } else {
	      scheduler = immediateScheduler;
	    }
	    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    return enumerableOf([observableFromArray(args, scheduler), this]).concat();
	  };

	  var TakeLastObserver = (function (__super__) {
	    inherits(TakeLastObserver, __super__);
	    function TakeLastObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._q.shift();
	    };

	    TakeLastObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TakeLastObserver.prototype.completed = function () {
	      while (this._q.length > 0) { this._o.onNext(this._q.shift()); }
	      this._o.onCompleted();
	    };

	    return TakeLastObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns a specified number of contiguous elements from the end of an observable sequence.
	   * @description
	   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
	   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new TakeLastObserver(o, count));
	    }, source);
	  };

	  var TakeLastBufferObserver = (function (__super__) {
	    inherits(TakeLastBufferObserver, __super__);
	    function TakeLastBufferObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastBufferObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._q.shift();
	    };

	    TakeLastBufferObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TakeLastBufferObserver.prototype.completed = function () {
	      this._o.onNext(this._q);
	      this._o.onCompleted();
	    };

	    return TakeLastBufferObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
	   *
	   * @description
	   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
	   *  source sequence, this buffer is produced on the result sequence.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLastBuffer = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new TakeLastBufferObserver(o, count));
	    }, source);
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
	   * @param {Number} count Length of each window.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithCount = function (count, skip) {
	    var source = this;
	    +count || (count = 0);
	    Math.abs(count) === Infinity && (count = 0);
	    if (count <= 0) { throw new ArgumentOutOfRangeError(); }
	    skip == null && (skip = count);
	    +skip || (skip = 0);
	    Math.abs(skip) === Infinity && (skip = 0);

	    if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(),
	        refCountDisposable = new RefCountDisposable(m),
	        n = 0,
	        q = [];

	      function createWindow () {
	        var s = new Subject();
	        q.push(s);
	        observer.onNext(addRef(s, refCountDisposable));
	      }

	      createWindow();

	      m.setDisposable(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	          var c = n - count + 1;
	          c >= 0 && c % skip === 0 && q.shift().onCompleted();
	          ++n % skip === 0 && createWindow();
	        },
	        function (e) {
	          while (q.length > 0) { q.shift().onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          while (q.length > 0) { q.shift().onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  function concatMap(source, selector, thisArg) {
	    var selectorFunc = bindCallback(selector, thisArg, 3);
	    return source.map(function (x, i) {
	      var result = selectorFunc(x, i, source);
	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
	      return result;
	    }).concatAll();
	  }

	  /**
	   *  One of the Following:
	   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   * @example
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
	   *  Or:
	   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
	   *
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
	   *  Or:
	   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
	   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
	   * source sequence onto which could be either an observable or Promise.
	   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
	   */
	  observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
	    if (isFunction(selector) && isFunction(resultSelector)) {
	      return this.concatMap(function (x, i) {
	        var selectorResult = selector(x, i);
	        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
	        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));

	        return selectorResult.map(function (y, i2) {
	          return resultSelector(x, y, i, i2);
	        });
	      });
	    }
	    return isFunction(selector) ?
	      concatMap(this, selector, thisArg) :
	      concatMap(this, function () { return selector; });
	  };

	  /**
	   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.concatMapObserver = observableProto.selectConcatObserver = function(onNext, onError, onCompleted, thisArg) {
	    var source = this,
	        onNextFunc = bindCallback(onNext, thisArg, 2),
	        onErrorFunc = bindCallback(onError, thisArg, 1),
	        onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNextFunc(x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onErrorFunc(err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompletedFunc();
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, this).concatAll();
	  };

	  var DefaultIfEmptyObserver = (function (__super__) {
	    inherits(DefaultIfEmptyObserver, __super__);
	    function DefaultIfEmptyObserver(o, d) {
	      this._o = o;
	      this._d = d;
	      this._f = false;
	      __super__.call(this);
	    }

	    DefaultIfEmptyObserver.prototype.next = function (x) {
	      this._f = true;
	      this._o.onNext(x);
	    };

	    DefaultIfEmptyObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    DefaultIfEmptyObserver.prototype.completed = function () {
	      !this._f && this._o.onNext(this._d);
	      this._o.onCompleted();
	    };

	    return DefaultIfEmptyObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	   *
	   *  var res = obs = xs.defaultIfEmpty();
	   *  2 - obs = xs.defaultIfEmpty(false);
	   *
	   * @memberOf Observable#
	   * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	   * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	   */
	    observableProto.defaultIfEmpty = function (defaultValue) {
	      var source = this;
	      defaultValue === undefined && (defaultValue = null);
	      return new AnonymousObservable(function (o) {
	        return source.subscribe(new DefaultIfEmptyObserver(o, defaultValue));
	      }, source);
	    };

	  // Swap out for Array.findIndex
	  function arrayIndexOfComparer(array, item, comparer) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (comparer(array[i], item)) { return i; }
	    }
	    return -1;
	  }

	  function HashSet(comparer) {
	    this.comparer = comparer;
	    this.set = [];
	  }
	  HashSet.prototype.push = function(value) {
	    var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
	    retValue && this.set.push(value);
	    return retValue;
	  };

	  var DistinctObservable = (function (__super__) {
	    inherits(DistinctObservable, __super__);
	    function DistinctObservable(source, keyFn, cmpFn) {
	      this.source = source;
	      this._keyFn = keyFn;
	      this._cmpFn = cmpFn;
	      __super__.call(this);
	    }

	    DistinctObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctObserver(o, this._keyFn, this._cmpFn));
	    };

	    return DistinctObservable;
	  }(ObservableBase));

	  var DistinctObserver = (function (__super__) {
	    inherits(DistinctObserver, __super__);
	    function DistinctObserver(o, keyFn, cmpFn) {
	      this._o = o;
	      this._keyFn = keyFn;
	      this._h = new HashSet(cmpFn);
	      __super__.call(this);
	    }

	    DistinctObserver.prototype.next = function (x) {
	      var key = x;
	      if (isFunction(this._keyFn)) {
	        key = tryCatch(this._keyFn)(x);
	        if (key === errorObj) { return this._o.onError(key.e); }
	      }
	      this._h.push(key) && this._o.onNext(x);
	    };

	    DistinctObserver.prototype.error = function (e) { this._o.onError(e); };
	    DistinctObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return DistinctObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
	   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
	   *
	   * @example
	   *  var res = obs = xs.distinct();
	   *  2 - obs = xs.distinct(function (x) { return x.id; });
	   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
	   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
	   * @param {Function} [comparer]  Used to compare items in the collection.
	   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
	   */
	  observableProto.distinct = function (keySelector, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctObservable(this, keySelector, comparer);
	  };

	  /**
	   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
	   *
	   * @example
	   *  var res = observable.groupBy(function (x) { return x.id; });
	   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
	   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
	   * @param {Function} keySelector A function to extract the key for each element.
	   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
	   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	   */
	  observableProto.groupBy = function (keySelector, elementSelector) {
	    return this.groupByUntil(keySelector, elementSelector, observableNever);
	  };

	    /**
	     *  Groups the elements of an observable sequence according to a specified key selector function.
	     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
	     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
	     *
	     * @example
	     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
	     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
	     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
	     * @param {Function} keySelector A function to extract the key for each element.
	     * @param {Function} durationSelector A function to signal the expiration of a group.
	     * @returns {Observable}
	     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
	     *
	     */
	    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector) {
	      var source = this;
	      return new AnonymousObservable(function (o) {
	        var map = new Map(),
	          groupDisposable = new CompositeDisposable(),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          handleError = function (e) { return function (item) { item.onError(e); }; };

	        groupDisposable.add(
	          source.subscribe(function (x) {
	            var key = tryCatch(keySelector)(x);
	            if (key === errorObj) {
	              map.forEach(handleError(key.e));
	              return o.onError(key.e);
	            }

	            var fireNewMapEntry = false, writer = map.get(key);
	            if (writer === undefined) {
	              writer = new Subject();
	              map.set(key, writer);
	              fireNewMapEntry = true;
	            }

	            if (fireNewMapEntry) {
	              var group = new GroupedObservable(key, writer, refCountDisposable),
	                durationGroup = new GroupedObservable(key, writer);
	              var duration = tryCatch(durationSelector)(durationGroup);
	              if (duration === errorObj) {
	                map.forEach(handleError(duration.e));
	                return o.onError(duration.e);
	              }

	              o.onNext(group);

	              var md = new SingleAssignmentDisposable();
	              groupDisposable.add(md);

	              md.setDisposable(duration.take(1).subscribe(
	                noop,
	                function (e) {
	                  map.forEach(handleError(e));
	                  o.onError(e);
	                },
	                function () {
	                  if (map['delete'](key)) { writer.onCompleted(); }
	                  groupDisposable.remove(md);
	                }));
	            }

	            var element = x;
	            if (isFunction(elementSelector)) {
	              element = tryCatch(elementSelector)(x);
	              if (element === errorObj) {
	                map.forEach(handleError(element.e));
	                return o.onError(element.e);
	              }
	            }

	            writer.onNext(element);
	        }, function (e) {
	          map.forEach(handleError(e));
	          o.onError(e);
	        }, function () {
	          map.forEach(function (item) { item.onCompleted(); });
	          o.onCompleted();
	        }));

	      return refCountDisposable;
	    }, source);
	  };

	  var MapObservable = (function (__super__) {
	    inherits(MapObservable, __super__);

	    function MapObservable(source, selector, thisArg) {
	      this.source = source;
	      this.selector = bindCallback(selector, thisArg, 3);
	      __super__.call(this);
	    }

	    function innerMap(selector, self) {
	      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); }
	    }

	    MapObservable.prototype.internalMap = function (selector, thisArg) {
	      return new MapObservable(this.source, innerMap(selector, this), thisArg);
	    };

	    MapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, selector, source) {
	      this.o = o;
	      this.selector = selector;
	      this.source = source;
	      this.i = 0;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function(x) {
	      var result = tryCatch(this.selector)(x, this.i++, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }
	      this.o.onNext(result);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return MapObservable;

	  }(ObservableBase));

	  /**
	  * Projects each element of an observable sequence into a new form by incorporating the element's index.
	  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
	  */
	  observableProto.map = observableProto.select = function (selector, thisArg) {
	    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
	    return this instanceof MapObservable ?
	      this.internalMap(selectorFn, thisArg) :
	      new MapObservable(this, selectorFn, thisArg);
	  };

	  function plucker(args, len) {
	    return function mapper(x) {
	      var currentProp = x;
	      for (var i = 0; i < len; i++) {
	        var p = currentProp[args[i]];
	        if (typeof p !== 'undefined') {
	          currentProp = p;
	        } else {
	          return undefined;
	        }
	      }
	      return currentProp;
	    }
	  }

	  /**
	   * Retrieves the value of a specified nested property from all elements in
	   * the Observable sequence.
	   * @param {Arguments} arguments The nested properties to pluck.
	   * @returns {Observable} Returns a new Observable sequence of property values.
	   */
	  observableProto.pluck = function () {
	    var len = arguments.length, args = new Array(len);
	    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return this.map(plucker(args, len));
	  };

	observableProto.flatMap = observableProto.selectMany = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
	};


	//
	//Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	//    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	//};
	//

	  /**
	   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var index = 0;

	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNext.call(thisArg, x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onError.call(thisArg, err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompleted.call(thisArg);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, source).mergeAll();
	  };

	Rx.Observable.prototype.flatMapLatest = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
	};
	  var SkipObservable = (function(__super__) {
	    inherits(SkipObservable, __super__);
	    function SkipObservable(source, count) {
	      this.source = source;
	      this.skipCount = count;
	      __super__.call(this);
	    }
	    
	    SkipObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.skipCount));
	    };
	    
	    function InnerObserver(o, c) {
	      this.c = c;
	      this.r = c;
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      if (this.r <= 0) { 
	        this.o.onNext(x);
	      } else {
	        this.r--;
	      }
	    };
	    InnerObserver.prototype.onError = function(e) {
	      if (!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function() {
	      if (!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function(e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	    
	    return SkipObservable;
	  }(ObservableBase));  
	  
	  /**
	   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	   * @param {Number} count The number of elements to skip before returning the remaining elements.
	   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	   */
	  observableProto.skip = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipObservable(this, count);
	  };
	  var SkipWhileObservable = (function (__super__) {
	    inherits(SkipWhileObservable, __super__);
	    function SkipWhileObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SkipWhileObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipWhileObserver(o, this));
	    };

	    return SkipWhileObservable;
	  }(ObservableBase));

	  var SkipWhileObserver = (function (__super__) {
	    inherits(SkipWhileObserver, __super__);

	    function SkipWhileObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      this._i = 0;
	      this._r = false;
	      __super__.call(this);
	    }

	    SkipWhileObserver.prototype.next = function (x) {
	      if (!this._r) {
	        var res = tryCatch(this._p._fn)(x, this._i++, this._p);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._r = !res;
	      }
	      this._r && this._o.onNext(x);
	    };
	    SkipWhileObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipWhileObserver;
	  }(AbstractObserver));

	  /**
	   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
	   *  The element's index is used in the logic of the predicate function.
	   *
	   *  var res = source.skipWhile(function (value) { return value < 10; });
	   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
	   */
	  observableProto.skipWhile = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new SkipWhileObservable(this, fn);
	  };

	  var TakeObservable = (function(__super__) {
	    inherits(TakeObservable, __super__);
	    
	    function TakeObservable(source, count) {
	      this.source = source;
	      this.takeCount = count;
	      __super__.call(this);
	    }
	    
	    TakeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.takeCount));
	    };
	    
	    function InnerObserver(o, c) {
	      this.o = o;
	      this.c = c;
	      this.r = c;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype = {
	      onNext: function (x) {
	        if (this.isStopped) { return; }
	        if (this.r-- > 0) {
	          this.o.onNext(x);
	          this.r <= 0 && this.o.onCompleted();
	        }
	      },
	      onError: function (err) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(err);
	        }
	      },
	      onCompleted: function () {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onCompleted();
	        }
	      },
	      dispose: function () { this.isStopped = true; },
	      fail: function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	          return true;
	        }
	        return false;
	      }
	    };
	    
	    return TakeObservable;
	  }(ObservableBase));  
	  
	  /**
	   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	   * @param {Number} count The number of elements to return.
	   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	   */
	  observableProto.take = function (count, scheduler) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    if (count === 0) { return observableEmpty(scheduler); }
	    return new TakeObservable(this, count);
	  };

	  var TakeWhileObservable = (function (__super__) {
	    inherits(TakeWhileObservable, __super__);
	    function TakeWhileObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    TakeWhileObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeWhileObserver(o, this));
	    };

	    return TakeWhileObservable;
	  }(ObservableBase));

	  var TakeWhileObserver = (function (__super__) {
	    inherits(TakeWhileObserver, __super__);

	    function TakeWhileObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      this._i = 0;
	      this._r = true;
	      __super__.call(this);
	    }

	    TakeWhileObserver.prototype.next = function (x) {
	      if (this._r) {
	        this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
	        if (this._r === errorObj) { return this._o.onError(this._r.e); }
	      }
	      if (this._r) {
	        this._o.onNext(x);
	      } else {
	        this._o.onCompleted();
	      }
	    };
	    TakeWhileObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TakeWhileObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns elements from an observable sequence as long as a specified condition is true.
	   *  The element's index is used in the logic of the predicate function.
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
	   */
	  observableProto.takeWhile = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new TakeWhileObservable(this, fn);
	  };

	  var FilterObservable = (function (__super__) {
	    inherits(FilterObservable, __super__);

	    function FilterObservable(source, predicate, thisArg) {
	      this.source = source;
	      this.predicate = bindCallback(predicate, thisArg, 3);
	      __super__.call(this);
	    }

	    FilterObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
	    };

	    function innerPredicate(predicate, self) {
	      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
	    }

	    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
	      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, predicate, source) {
	      this.o = o;
	      this.predicate = predicate;
	      this.source = source;
	      this.i = 0;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function(x) {
	      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
	      if (shouldYield === errorObj) {
	        return this.o.onError(shouldYield.e);
	      }
	      shouldYield && this.o.onNext(x);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return FilterObservable;

	  }(ObservableBase));

	  /**
	  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	  */
	  observableProto.filter = observableProto.where = function (predicate, thisArg) {
	    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
	      new FilterObservable(this, predicate, thisArg);
	  };

	  var ExtremaByObservable = (function (__super__) {
	    inherits(ExtremaByObservable, __super__);
	    function ExtremaByObservable(source, k, c) {
	      this.source = source;
	      this._k = k;
	      this._c = c;
	      __super__.call(this);
	    }

	    ExtremaByObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ExtremaByObserver(o, this._k, this._c));
	    };

	    return ExtremaByObservable;
	  }(ObservableBase));

	  var ExtremaByObserver = (function (__super__) {
	    inherits(ExtremaByObserver, __super__);
	    function ExtremaByObserver(o, k, c) {
	      this._o = o;
	      this._k = k;
	      this._c = c;
	      this._v = null;
	      this._hv = false;
	      this._l = [];
	      __super__.call(this);
	    }

	    ExtremaByObserver.prototype.next = function (x) {
	      var key = tryCatch(this._k)(x);
	      if (key === errorObj) { return this._o.onError(key.e); }
	      var comparison = 0;
	      if (!this._hv) {
	        this._hv = true;
	        this._v = key;
	      } else {
	        comparison = tryCatch(this._c)(key, this._v);
	        if (comparison === errorObj) { return this._o.onError(comparison.e); }
	      }
	      if (comparison > 0) {
	        this._v = key;
	        this._l = [];
	      }
	      if (comparison >= 0) { this._l.push(x); }
	    };

	    ExtremaByObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ExtremaByObserver.prototype.completed = function () {
	      this._o.onNext(this._l);
	      this._o.onCompleted();
	    };

	    return ExtremaByObserver;
	  }(AbstractObserver));

	  function firstOnly(x) {
	    if (x.length === 0) { throw new EmptyError(); }
	    return x[0];
	  }

	  var ReduceObservable = (function(__super__) {
	    inherits(ReduceObservable, __super__);
	    function ReduceObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }

	    ReduceObservable.prototype.subscribeCore = function(observer) {
	      return this.source.subscribe(new ReduceObserver(observer,this));
	    };

	    return ReduceObservable;
	  }(ObservableBase));

	  var ReduceObserver = (function (__super__) {
	    inherits(ReduceObserver, __super__);
	    function ReduceObserver(o, parent) {
	      this._o = o;
	      this._p = parent;
	      this._fn = parent.accumulator;
	      this._hs = parent.hasSeed;
	      this._s = parent.seed;
	      this._ha = false;
	      this._a = null;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    ReduceObserver.prototype.next = function (x) {
	      !this._hv && (this._hv = true);
	      if (this._ha) {
	        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	      } else {
	        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	        this._ha = true;
	      }
	      if (this._a === errorObj) { return this._o.onError(this._a.e); }
	      this._i++;
	    };

	    ReduceObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ReduceObserver.prototype.completed = function () {
	      this._hv && this._o.onNext(this._a);
	      !this._hv && this._hs && this._o.onNext(this._s);
	      !this._hv && !this._hs && this._o.onError(new EmptyError());
	      this._o.onCompleted();
	    };

	    return ReduceObserver;
	  }(AbstractObserver));

	  /**
	  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	  * For aggregation behavior with incremental intermediate results, see Observable.scan.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @param {Any} [seed] The initial accumulator value.
	  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	  */
	  observableProto.reduce = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ReduceObservable(this, accumulator, hasSeed, seed);
	  };

	  var SomeObservable = (function (__super__) {
	    inherits(SomeObservable, __super__);
	    function SomeObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SomeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SomeObserver(o, this._fn, this.source));
	    };

	    return SomeObservable;
	  }(ObservableBase));

	  var SomeObserver = (function (__super__) {
	    inherits(SomeObserver, __super__);

	    function SomeObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    SomeObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (Boolean(result)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    SomeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SomeObserver.prototype.completed = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };

	    return SomeObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
	   */
	  observableProto.some = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new SomeObservable(this, fn);
	  };

	  var IsEmptyObservable = (function (__super__) {
	    inherits(IsEmptyObservable, __super__);
	    function IsEmptyObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    IsEmptyObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new IsEmptyObserver(o));
	    };

	    return IsEmptyObservable;
	  }(ObservableBase));

	  var IsEmptyObserver = (function(__super__) {
	    inherits(IsEmptyObserver, __super__);
	    function IsEmptyObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    IsEmptyObserver.prototype.next = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	    IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
	    IsEmptyObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };

	    return IsEmptyObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether an observable sequence is empty.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
	   */
	  observableProto.isEmpty = function () {
	    return new IsEmptyObservable(this);
	  };

	  var EveryObservable = (function (__super__) {
	    inherits(EveryObservable, __super__);
	    function EveryObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    EveryObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new EveryObserver(o, this._fn, this.source));
	    };

	    return EveryObservable;
	  }(ObservableBase));

	  var EveryObserver = (function (__super__) {
	    inherits(EveryObserver, __super__);

	    function EveryObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    EveryObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (!Boolean(result)) {
	        this._o.onNext(false);
	        this._o.onCompleted();
	      }
	    };
	    EveryObserver.prototype.error = function (e) { this._o.onError(e); };
	    EveryObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };

	    return EveryObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether all elements of an observable sequence satisfy a condition.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
	   */
	  observableProto.every = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new EveryObservable(this, fn);
	  };

	  var IncludesObservable = (function (__super__) {
	    inherits(IncludesObservable, __super__);
	    function IncludesObservable(source, elem, idx) {
	      var n = +idx || 0;
	      Math.abs(n) === Infinity && (n = 0);

	      this.source = source;
	      this._elem = elem;
	      this._n = n;
	      __super__.call(this);
	    }

	    IncludesObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(false);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
	    };

	    return IncludesObservable;
	  }(ObservableBase));

	  var IncludesObserver = (function (__super__) {
	    inherits(IncludesObserver, __super__);
	    function IncludesObserver(o, elem, n) {
	      this._o = o;
	      this._elem = elem;
	      this._n = n;
	      this._i = 0;
	      __super__.call(this);
	    }

	    function comparer(a, b) {
	      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
	    }

	    IncludesObserver.prototype.next = function (x) {
	      if (this._i++ >= this._n && comparer(x, this._elem)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    IncludesObserver.prototype.error = function (e) { this._o.onError(e); };
	    IncludesObserver.prototype.completed = function () { this._o.onNext(false); this._o.onCompleted(); };

	    return IncludesObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
	   * @param searchElement The value to locate in the source sequence.
	   * @param {Number} [fromIndex] An equality comparer to compare elements.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
	   */
	  observableProto.includes = function (searchElement, fromIndex) {
	    return new IncludesObservable(this, searchElement, fromIndex);
	  };

	  var CountObservable = (function (__super__) {
	    inherits(CountObservable, __super__);
	    function CountObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CountObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new CountObserver(o, this._fn, this.source));
	    };

	    return CountObservable;
	  }(ObservableBase));

	  var CountObserver = (function (__super__) {
	    inherits(CountObserver, __super__);

	    function CountObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      this._c = 0;
	      __super__.call(this);
	    }

	    CountObserver.prototype.next = function (x) {
	      if (this._fn) {
	        var result = tryCatch(this._fn)(x, this._i++, this._s);
	        if (result === errorObj) { return this._o.onError(result.e); }
	        Boolean(result) && (this._c++);
	      } else {
	        this._c++;
	      }
	    };
	    CountObserver.prototype.error = function (e) { this._o.onError(e); };
	    CountObserver.prototype.completed = function () {
	      this._o.onNext(this._c);
	      this._o.onCompleted();
	    };

	    return CountObserver;
	  }(AbstractObserver));

	  /**
	   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
	   * @example
	   * res = source.count();
	   * res = source.count(function (x) { return x > 3; });
	   * @param {Function} [predicate]A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
	   */
	  observableProto.count = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new CountObservable(this, fn);
	  };

	  var IndexOfObservable = (function (__super__) {
	    inherits(IndexOfObservable, __super__);
	    function IndexOfObservable(source, e, n) {
	      this.source = source;
	      this._e = e;
	      this._n = n;
	      __super__.call(this);
	    }

	    IndexOfObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new IndexOfObserver(o, this._e, this._n));
	    };

	    return IndexOfObservable;
	  }(ObservableBase));

	  var IndexOfObserver = (function (__super__) {
	    inherits(IndexOfObserver, __super__);
	    function IndexOfObserver(o, e, n) {
	      this._o = o;
	      this._e = e;
	      this._n = n;
	      this._i = 0;
	      __super__.call(this);
	    }

	    IndexOfObserver.prototype.next = function (x) {
	      if (this._i >= this._n && x === this._e) {
	        this._o.onNext(this._i);
	        this._o.onCompleted();
	      }
	      this._i++;
	    };
	    IndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
	    IndexOfObserver.prototype.completed = function () { this._o.onNext(-1); this._o.onCompleted(); };

	    return IndexOfObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.indexOf = function(searchElement, fromIndex) {
	    var n = +fromIndex || 0;
	    Math.abs(n) === Infinity && (n = 0);
	    return new IndexOfObservable(this, searchElement, n);
	  };

	  var SumObservable = (function (__super__) {
	    inherits(SumObservable, __super__);
	    function SumObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SumObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SumObserver(o, this._fn, this.source));
	    };

	    return SumObservable;
	  }(ObservableBase));

	  var SumObserver = (function (__super__) {
	    inherits(SumObserver, __super__);

	    function SumObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      this._c = 0;
	      __super__.call(this);
	    }

	    SumObserver.prototype.next = function (x) {
	      if (this._fn) {
	        var result = tryCatch(this._fn)(x, this._i++, this._s);
	        if (result === errorObj) { return this._o.onError(result.e); }
	        this._c += result;
	      } else {
	        this._c += x;
	      }
	    };
	    SumObserver.prototype.error = function (e) { this._o.onError(e); };
	    SumObserver.prototype.completed = function () {
	      this._o.onNext(this._c);
	      this._o.onCompleted();
	    };

	    return SumObserver;
	  }(AbstractObserver));

	  /**
	   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
	   */
	  observableProto.sum = function (keySelector, thisArg) {
	    var fn = bindCallback(keySelector, thisArg, 3);
	    return new SumObservable(this, fn);
	  };

	  /**
	   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
	   * @example
	   * var res = source.minBy(function (x) { return x.value; });
	   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer] Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
	   */
	  observableProto.minBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return new ExtremaByObservable(this, keySelector, function (x, y) { return comparer(x, y) * -1; });
	  };

	  /**
	   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
	   * @example
	   * var res = source.min();
	   * var res = source.min(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
	   */
	  observableProto.min = function (comparer) {
	    return this.minBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };

	  /**
	   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
	   * @example
	   * var res = source.maxBy(function (x) { return x.value; });
	   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer]  Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
	   */
	  observableProto.maxBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return new ExtremaByObservable(this, keySelector, comparer);
	  };

	  /**
	   * Returns the maximum value in an observable sequence according to the specified comparer.
	   * @example
	   * var res = source.max();
	   * var res = source.max(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
	   */
	  observableProto.max = function (comparer) {
	    return this.maxBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };

	  var AverageObservable = (function (__super__) {
	    inherits(AverageObservable, __super__);
	    function AverageObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    AverageObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new AverageObserver(o, this._fn, this.source));
	    };

	    return AverageObservable;
	  }(ObservableBase));

	  var AverageObserver = (function(__super__) {
	    inherits(AverageObserver, __super__);
	    function AverageObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._c = 0;
	      this._t = 0;
	      __super__.call(this);
	    }

	    AverageObserver.prototype.next = function (x) {
	      if(this._fn) {
	        var r = tryCatch(this._fn)(x, this._c++, this._s);
	        if (r === errorObj) { return this._o.onError(r.e); }
	        this._t += r;
	      } else {
	        this._c++;
	        this._t += x;
	      }
	    };
	    AverageObserver.prototype.error = function (e) { this._o.onError(e); };
	    AverageObserver.prototype.completed = function () {
	      if (this._c === 0) { return this._o.onError(new EmptyError()); }
	      this._o.onNext(this._t / this._c);
	      this._o.onCompleted();
	    };

	    return AverageObserver;
	  }(AbstractObserver));

	  /**
	   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	   */
	  observableProto.average = function (keySelector, thisArg) {
	    var source = this, fn;
	    if (isFunction(keySelector)) {
	      fn = bindCallback(keySelector, thisArg, 3);
	    }
	    return new AverageObservable(source, fn);
	  };

	  /**
	   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
	   *
	   * @example
	   * var res = res = source.sequenceEqual([1,2,3]);
	   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
	   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
	   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
	   * @param {Observable} second Second observable sequence or array to compare.
	   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
	   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
	   */
	  observableProto.sequenceEqual = function (second, comparer) {
	    var first = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var donel = false, doner = false, ql = [], qr = [];
	      var subscription1 = first.subscribe(function (x) {
	        if (qr.length > 0) {
	          var v = qr.shift();
	          var equal = tryCatch(comparer)(v, x);
	          if (equal === errorObj) { return o.onError(equal.e); }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (doner) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          ql.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        donel = true;
	        if (ql.length === 0) {
	          if (qr.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (doner) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });

	      (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
	      isPromise(second) && (second = observableFromPromise(second));
	      var subscription2 = second.subscribe(function (x) {
	        if (ql.length > 0) {
	          var v = ql.shift();
	          var equal = tryCatch(comparer)(v, x);
	          if (equal === errorObj) { return o.onError(equal.e); }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (donel) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          qr.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        doner = true;
	        if (qr.length === 0) {
	          if (ql.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (donel) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	      return new BinaryDisposable(subscription1, subscription2);
	    }, first);
	  };

	  var ElementAtObservable = (function (__super__) {
	    inherits(ElementAtObservable, __super__);
	    function ElementAtObservable(source, i, d) {
	      this.source = source;
	      this._i = i;
	      this._d = d;
	      __super__.call(this);
	    }

	    ElementAtObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ElementAtObserver(o, this._i, this._d));
	    };

	    return ElementAtObservable;
	  }(ObservableBase));

	  var ElementAtObserver = (function (__super__) {
	    inherits(ElementAtObserver, __super__);

	    function ElementAtObserver(o, i, d) {
	      this._o = o;
	      this._i = i;
	      this._d = d;
	      __super__.call(this);
	    }

	    ElementAtObserver.prototype.next = function (x) {
	      if (this._i-- === 0) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    ElementAtObserver.prototype.error = function (e) { this._o.onError(e); };
	    ElementAtObserver.prototype.completed = function () {
	      if (this._d === undefined) {
	        this._o.onError(new ArgumentOutOfRangeError());
	      } else {
	        this._o.onNext(this._d);
	        this._o.onCompleted();
	      }
	    };

	    return ElementAtObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the element at a specified index in a sequence or default value if not found.
	   * @param {Number} index The zero-based index of the element to retrieve.
	   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
	   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
	   */
	  observableProto.elementAt =  function (index, defaultValue) {
	    if (index < 0) { throw new ArgumentOutOfRangeError(); }
	    return new ElementAtObservable(this, index, defaultValue);
	  };

	  var SingleObserver = (function(__super__) {
	    inherits(SingleObserver, __super__);
	    function SingleObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      this._hv = false;
	      this._v = null;
	      __super__.call(this);
	    }

	    SingleObserver.prototype.next = function (x) {
	      var shouldYield = false;
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        Boolean(res) && (shouldYield = true);
	      } else if (!this._obj.predicate) {
	        shouldYield = true;
	      }
	      if (shouldYield) {
	        if (this._hv) {
	          return this._o.onError(new Error('Sequence contains more than one matching element'));
	        }
	        this._hv = true;
	        this._v = x;
	      }
	    };
	    SingleObserver.prototype.error = function (e) { this._o.onError(e); };
	    SingleObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	        this._o.onCompleted();
	      }
	      else if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return SingleObserver;
	  }(AbstractObserver));


	    /**
	     * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
	     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
	     */
	    observableProto.single = function (predicate, thisArg) {
	      var obj = {}, source = this;
	      if (typeof arguments[0] === 'object') {
	        obj = arguments[0];
	      } else {
	        obj = {
	          predicate: arguments[0],
	          thisArg: arguments[1],
	          defaultValue: arguments[2]
	        };
	      }
	      if (isFunction (obj.predicate)) {
	        var fn = obj.predicate;
	        obj.predicate = bindCallback(fn, obj.thisArg, 3);
	      }
	      return new AnonymousObservable(function (o) {
	        return source.subscribe(new SingleObserver(o, obj, source));
	      }, source);
	    };

	  var FirstObservable = (function (__super__) {
	    inherits(FirstObservable, __super__);
	    function FirstObservable(source, obj) {
	      this.source = source;
	      this._obj = obj;
	      __super__.call(this);
	    }

	    FirstObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new FirstObserver(o, this._obj, this.source));
	    };

	    return FirstObservable;
	  }(ObservableBase));

	  var FirstObserver = (function(__super__) {
	    inherits(FirstObserver, __super__);
	    function FirstObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    FirstObserver.prototype.next = function (x) {
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        if (Boolean(res)) {
	          this._o.onNext(x);
	          this._o.onCompleted();
	        }
	      } else if (!this._obj.predicate) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    FirstObserver.prototype.error = function (e) { this._o.onError(e); };
	    FirstObserver.prototype.completed = function () {
	      if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return FirstObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
	   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
	   */
	  observableProto.first = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new FirstObservable(this, obj);
	  };

	  var LastObservable = (function (__super__) {
	    inherits(LastObservable, __super__);
	    function LastObservable(source, obj) {
	      this.source = source;
	      this._obj = obj;
	      __super__.call(this);
	    }

	    LastObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new LastObserver(o, this._obj, this.source));
	    };

	    return LastObservable;
	  }(ObservableBase));

	  var LastObserver = (function(__super__) {
	    inherits(LastObserver, __super__);
	    function LastObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      this._hv = false;
	      this._v = null;
	      __super__.call(this);
	    }

	    LastObserver.prototype.next = function (x) {
	      var shouldYield = false;
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        Boolean(res) && (shouldYield = true);
	      } else if (!this._obj.predicate) {
	        shouldYield = true;
	      }
	      if (shouldYield) {
	        this._hv = true;
	        this._v = x;
	      }
	    };
	    LastObserver.prototype.error = function (e) { this._o.onError(e); };
	    LastObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	        this._o.onCompleted();
	      }
	      else if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return LastObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
	   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.last = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new LastObservable(this, obj);
	  };

	  var FindValueObserver = (function(__super__) {
	    inherits(FindValueObserver, __super__);
	    function FindValueObserver(observer, source, callback, yieldIndex) {
	      this._o = observer;
	      this._s = source;
	      this._cb = callback;
	      this._y = yieldIndex;
	      this._i = 0;
	      __super__.call(this);
	    }

	    FindValueObserver.prototype.next = function (x) {
	      var shouldRun = tryCatch(this._cb)(x, this._i, this._s);
	      if (shouldRun === errorObj) { return this._o.onError(shouldRun.e); }
	      if (shouldRun) {
	        this._o.onNext(this._y ? this._i : x);
	        this._o.onCompleted();
	      } else {
	        this._i++;
	      }
	    };

	    FindValueObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    FindValueObserver.prototype.completed = function () {
	      this._y && this._o.onNext(-1);
	      this._o.onCompleted();
	    };

	    return FindValueObserver;
	  }(AbstractObserver));

	  function findValue (source, predicate, thisArg, yieldIndex) {
	    var callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new FindValueObserver(o, source, callback, yieldIndex));
	    }, source);
	  }

	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
	   */
	  observableProto.find = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, false);
	  };

	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns
	   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
	  */
	  observableProto.findIndex = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, true);
	  };

	  var ToSetObservable = (function (__super__) {
	    inherits(ToSetObservable, __super__);
	    function ToSetObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    ToSetObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ToSetObserver(o));
	    };

	    return ToSetObservable;
	  }(ObservableBase));

	  var ToSetObserver = (function (__super__) {
	    inherits(ToSetObserver, __super__);
	    function ToSetObserver(o) {
	      this._o = o;
	      this._s = new root.Set();
	      __super__.call(this);
	    }

	    ToSetObserver.prototype.next = function (x) {
	      this._s.add(x);
	    };

	    ToSetObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ToSetObserver.prototype.completed = function () {
	      this._o.onNext(this._s);
	      this._o.onCompleted();
	    };

	    return ToSetObserver;
	  }(AbstractObserver));

	  /**
	   * Converts the observable sequence to a Set if it exists.
	   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
	   */
	  observableProto.toSet = function () {
	    if (typeof root.Set === 'undefined') { throw new TypeError(); }
	    return new ToSetObservable(this);
	  };

	  var ToMapObservable = (function (__super__) {
	    inherits(ToMapObservable, __super__);
	    function ToMapObservable(source, k, e) {
	      this.source = source;
	      this._k = k;
	      this._e = e;
	      __super__.call(this);
	    }

	    ToMapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ToMapObserver(o, this._k, this._e));
	    };

	    return ToMapObservable;
	  }(ObservableBase));

	  var ToMapObserver = (function (__super__) {
	    inherits(ToMapObserver, __super__);
	    function ToMapObserver(o, k, e) {
	      this._o = o;
	      this._k = k;
	      this._e = e;
	      this._m = new root.Map();
	      __super__.call(this);
	    }

	    ToMapObserver.prototype.next = function (x) {
	      var key = tryCatch(this._k)(x);
	      if (key === errorObj) { return this._o.onError(key.e); }
	      var elem = x;
	      if (this._e) {
	        elem = tryCatch(this._e)(x);
	        if (elem === errorObj) { return this._o.onError(elem.e); }
	      }

	      this._m.set(key, elem);
	    };

	    ToMapObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ToMapObserver.prototype.completed = function () {
	      this._o.onNext(this._m);
	      this._o.onCompleted();
	    };

	    return ToMapObserver;
	  }(AbstractObserver));

	  /**
	  * Converts the observable sequence to a Map if it exists.
	  * @param {Function} keySelector A function which produces the key for the Map.
	  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
	  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
	  */
	  observableProto.toMap = function (keySelector, elementSelector) {
	    if (typeof root.Map === 'undefined') { throw new TypeError(); }
	    return new ToMapObservable(this, keySelector, elementSelector);
	  };

	  var SliceObservable = (function (__super__) {
	    inherits(SliceObservable, __super__);
	    function SliceObservable(source, b, e) {
	      this.source = source;
	      this._b = b;
	      this._e = e;
	      __super__.call(this);
	    }

	    SliceObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SliceObserver(o, this._b, this._e));
	    };

	    return SliceObservable;
	  }(ObservableBase));

	  var SliceObserver = (function (__super__) {
	    inherits(SliceObserver, __super__);

	    function SliceObserver(o, b, e) {
	      this._o = o;
	      this._b = b;
	      this._e = e;
	      this._i = 0;
	      __super__.call(this);
	    }

	    SliceObserver.prototype.next = function (x) {
	      if (this._i >= this._b) {
	        if (this._e === this._i) {
	          this._o.onCompleted();
	        } else {
	          this._o.onNext(x);
	        }
	      }
	      this._i++;
	    };
	    SliceObserver.prototype.error = function (e) { this._o.onError(e); };
	    SliceObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SliceObserver;
	  }(AbstractObserver));

	  /*
	  * The slice() method returns a shallow copy of a portion of an Observable into a new Observable object.
	  * Unlike the array version, this does not support negative numbers for being or end.
	  * @param {Number} [begin] Zero-based index at which to begin extraction. If omitted, this will default to zero.
	  * @param {Number} [end] Zero-based index at which to end extraction. slice extracts up to but not including end.
	  * If omitted, this will emit the rest of the Observable object.
	  * @returns {Observable} A shallow copy of a portion of an Observable into a new Observable object.
	  */
	  observableProto.slice = function (begin, end) {
	    var start = begin || 0;
	    if (start < 0) { throw new Rx.ArgumentOutOfRangeError(); }
	    if (typeof end === 'number' && end < start) {
	      throw new Rx.ArgumentOutOfRangeError();
	    }
	    return new SliceObservable(this, start, end);
	  };

	  var LastIndexOfObservable = (function (__super__) {
	    inherits(LastIndexOfObservable, __super__);
	    function LastIndexOfObservable(source, e, n) {
	      this.source = source;
	      this._e = e;
	      this._n = n;
	      __super__.call(this);
	    }

	    LastIndexOfObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new LastIndexOfObserver(o, this._e, this._n));
	    };

	    return LastIndexOfObservable;
	  }(ObservableBase));

	  var LastIndexOfObserver = (function (__super__) {
	    inherits(LastIndexOfObserver, __super__);
	    function LastIndexOfObserver(o, e, n) {
	      this._o = o;
	      this._e = e;
	      this._n = n;
	      this._v = 0;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    LastIndexOfObserver.prototype.next = function (x) {
	      if (this._i >= this._n && x === this._e) {
	        this._hv = true;
	        this._v = this._i;
	      }
	      this._i++;
	    };
	    LastIndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
	    LastIndexOfObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	      } else {
	        this._o.onNext(-1);
	      }
	      this._o.onCompleted();
	    };

	    return LastIndexOfObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.lastIndexOf = function(searchElement, fromIndex) {
	    var n = +fromIndex || 0;
	    Math.abs(n) === Infinity && (n = 0);
	    return new LastIndexOfObservable(this, searchElement, n);
	  };

	  Observable.wrap = function (fn) {
	    createObservable.__generatorFunction__ = fn;
	    return createObservable;

	    function createObservable() {
	      return Observable.spawn.call(this, fn.apply(this, arguments));
	    }
	  };

	  var spawn = Observable.spawn = function () {
	    var gen = arguments[0], self = this, args = [];
	    for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }

	    return new AnonymousObservable(function (o) {
	      var g = new CompositeDisposable();

	      if (isFunction(gen)) { gen = gen.apply(self, args); }
	      if (!gen || !isFunction(gen.next)) {
	        o.onNext(gen);
	        return o.onCompleted();
	      }

	      processGenerator();

	      function processGenerator(res) {
	        var ret = tryCatch(gen.next).call(gen, res);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }

	      function onError(err) {
	        var ret = tryCatch(gen.next).call(gen, err);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }

	      function next(ret) {
	        if (ret.done) {
	          o.onNext(ret.value);
	          o.onCompleted();
	          return;
	        }
	        var obs = toObservable.call(self, ret.value);
	        var value = null;
	        var hasValue = false;
	        if (Observable.isObservable(obs)) {
	          g.add(obs.subscribe(function(val) {
	            hasValue = true;
	            value = val;
	          }, onError, function() {
	            hasValue && processGenerator(value);
	          }));
	        } else {
	          onError(new TypeError('type not supported'));
	        }
	      }

	      return g;
	    });
	  };

	  function toObservable(obj) {
	    if (!obj) { return obj; }
	    if (Observable.isObservable(obj)) { return obj; }
	    if (isPromise(obj)) { return Observable.fromPromise(obj); }
	    if (isGeneratorFunction(obj) || isGenerator(obj)) { return spawn.call(this, obj); }
	    if (isFunction(obj)) { return thunkToObservable.call(this, obj); }
	    if (isArrayLike(obj) || isIterable(obj)) { return arrayToObservable.call(this, obj); }
	    if (isObject(obj)) {return objectToObservable.call(this, obj);}
	    return obj;
	  }

	  function arrayToObservable (obj) {
	    return Observable.from(obj).concatMap(function(o) {
	      if(Observable.isObservable(o) || isObject(o)) {
	        return toObservable.call(null, o);
	      } else {
	        return Rx.Observable.just(o);
	      }
	    }).toArray();
	  }

	  function objectToObservable (obj) {
	    var results = new obj.constructor(), keys = Object.keys(obj), observables = [];
	    for (var i = 0, len = keys.length; i < len; i++) {
	      var key = keys[i];
	      var observable = toObservable.call(this, obj[key]);

	      if(observable && Observable.isObservable(observable)) {
	        defer(observable, key);
	      } else {
	        results[key] = obj[key];
	      }
	    }

	    return Observable.forkJoin.apply(Observable, observables).map(function() {
	      return results;
	    });


	    function defer (observable, key) {
	      results[key] = undefined;
	      observables.push(observable.map(function (next) {
	        results[key] = next;
	      }));
	    }
	  }

	  function thunkToObservable(fn) {
	    var self = this;
	    return new AnonymousObservable(function (o) {
	      fn.call(self, function () {
	        var err = arguments[0], res = arguments[1];
	        if (err) { return o.onError(err); }
	        if (arguments.length > 2) {
	          var args = [];
	          for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	          res = args;
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    });
	  }

	  function isGenerator(obj) {
	    return isFunction (obj.next) && isFunction (obj.throw);
	  }

	  function isGeneratorFunction(obj) {
	    var ctor = obj.constructor;
	    if (!ctor) { return false; }
	    if (ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') { return true; }
	    return isGenerator(ctor.prototype);
	  }

	  function isObject(val) {
	    return Object == val.constructor;
	  }

	  /**
	   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
	   *
	   * @example
	   * var res = Rx.Observable.start(function () { console.log('hello'); });
	   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
	   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
	   *
	   * @param {Function} func Function to run asynchronously.
	   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   *
	   * Remarks
	   * * The function is called immediately, not during the subscription of the resulting sequence.
	   * * Multiple subscriptions to the resulting sequence can observe the function's result.
	   */
	  Observable.start = function (func, context, scheduler) {
	    return observableToAsync(func, context, scheduler)();
	  };

	  /**
	   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
	   * @param {Function} function Function to convert to an asynchronous function.
	   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Function} Asynchronous function.
	   */
	  var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return function () {
	      var args = arguments,
	        subject = new AsyncSubject();

	      scheduler.schedule(null, function () {
	        var result;
	        try {
	          result = func.apply(context, args);
	        } catch (e) {
	          subject.onError(e);
	          return;
	        }
	        subject.onNext(result);
	        subject.onCompleted();
	      });
	      return subject.asObservable();
	    };
	  };

	function createCbObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createCbHandler(o, ctx, selector));
	  fn.apply(ctx, args);

	  return o.asObservable();
	}

	function createCbHandler(o, ctx, selector) {
	  return function handler () {
	    var len = arguments.length, results = new Array(len);
	    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }

	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	/**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */
	Observable.fromCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 

	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createCbObservable(fn, ctx, selector, args);
	  };
	};

	function createNodeObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createNodeHandler(o, ctx, selector));
	  fn.apply(ctx, args);

	  return o.asObservable();
	}

	function createNodeHandler(o, ctx, selector) {
	  return function handler () {
	    var err = arguments[0];
	    if (err) { return o.onError(err); }

	    var len = arguments.length, results = [];
	    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }

	    if (isFunction(selector)) {
	      var results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	/**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */
	Observable.fromNodeCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createNodeObservable(fn, ctx, selector, args);
	  };
	};

	  function isNodeList(el) {
	    if (root.StaticNodeList) {
	      // IE8 Specific
	      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
	      return el instanceof root.StaticNodeList || el instanceof root.NodeList;
	    } else {
	      return Object.prototype.toString.call(el) === '[object NodeList]';
	    }
	  }

	  function ListenDisposable(e, n, fn) {
	    this._e = e;
	    this._n = n;
	    this._fn = fn;
	    this._e.addEventListener(this._n, this._fn, false);
	    this.isDisposed = false;
	  }
	  ListenDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this._e.removeEventListener(this._n, this._fn, false);
	      this.isDisposed = true;
	    }
	  };

	  function createEventListener (el, eventName, handler) {
	    var disposables = new CompositeDisposable();

	    // Asume NodeList or HTMLCollection
	    var elemToString = Object.prototype.toString.call(el);
	    if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler));
	      }
	    } else if (el) {
	      disposables.add(new ListenDisposable(el, eventName, handler));
	    }

	    return disposables;
	  }

	  /**
	   * Configuration option to determine whether to use native events only
	   */
	  Rx.config.useNativeEvents = false;

	  var EventObservable = (function(__super__) {
	    inherits(EventObservable, __super__);
	    function EventObservable(el, name, fn) {
	      this._el = el;
	      this._name = name;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    function createHandler(o, fn) {
	      return function handler () {
	        var results = arguments[0];
	        if (isFunction(fn)) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }

	    EventObservable.prototype.subscribeCore = function (o) {
	      return createEventListener(
	        this._el,
	        this._n,
	        createHandler(o, this._fn));
	    };

	    return EventObservable;
	  }(ObservableBase));

	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  Observable.fromEvent = function (element, eventName, selector) {
	    // Node.js specific
	    if (element.addListener) {
	      return fromEventPattern(
	        function (h) { element.addListener(eventName, h); },
	        function (h) { element.removeListener(eventName, h); },
	        selector);
	    }

	    // Use only if non-native events are allowed
	    if (!Rx.config.useNativeEvents) {
	      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	      if (typeof element.on === 'function' && typeof element.off === 'function') {
	        return fromEventPattern(
	          function (h) { element.on(eventName, h); },
	          function (h) { element.off(eventName, h); },
	          selector);
	      }
	    }

	    return new EventObservable(element, eventName, selector).publish().refCount();
	  };

	  var EventPatternObservable = (function(__super__) {
	    inherits(EventPatternObservable, __super__);
	    function EventPatternObservable(add, del, fn) {
	      this._add = add;
	      this._del = del;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    function createHandler(o, fn) {
	      return function handler () {
	        var results = arguments[0];
	        if (isFunction(fn)) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }

	    EventPatternObservable.prototype.subscribeCore = function (o) {
	      var fn = createHandler(o, this._fn);
	      var returnValue = this._add(fn);
	      return new EventPatternDisposable(this._del, fn, returnValue);
	    };

	    function EventPatternDisposable(del, fn, ret) {
	      this._del = del;
	      this._fn = fn;
	      this._ret = ret;
	      this.isDisposed = false;
	    }

	    EventPatternDisposable.prototype.dispose = function () {
	      if(!this.isDisposed) {
	        isFunction(this._del) && this._del(this._fn, this._ret);
	      }
	    };

	    return EventPatternObservable;
	  }(ObservableBase));

	  /**
	   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	   * @param {Function} addHandler The function to add a handler to the emitter.
	   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence which wraps an event from an event emitter
	   */
	  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
	    return new EventPatternObservable(addHandler, removeHandler, selector).publish().refCount();
	  };

	  /**
	   * Invokes the asynchronous function, surfacing the result through an observable sequence.
	   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   */
	  Observable.startAsync = function (functionAsync) {
	    var promise = tryCatch(functionAsync)();
	    if (promise === errorObj) { return observableThrow(promise.e); }
	    return observableFromPromise(promise);
	  };

	  var PausableObservable = (function (__super__) {
	    inherits(PausableObservable, __super__);
	    function PausableObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();

	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }

	      __super__.call(this);
	    }

	    PausableObservable.prototype._subscribe = function (o) {
	      var conn = this.source.publish(),
	        subscription = conn.subscribe(o),
	        connection = disposableEmpty;

	      var pausable = this.pauser.distinctUntilChanged().subscribe(function (b) {
	        if (b) {
	          connection = conn.connect();
	        } else {
	          connection.dispose();
	          connection = disposableEmpty;
	        }
	      });

	      return new NAryDisposable([subscription, connection, pausable]);
	    };

	    PausableObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };

	    PausableObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };

	    return PausableObservable;

	  }(Observable));

	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausable(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausable = function (pauser) {
	    return new PausableObservable(this, pauser);
	  };

	  function combineLatestSource(source, subject, resultSelector) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = [false, false],
	        hasValueAll = false,
	        isDone = false,
	        values = new Array(2),
	        err;

	      function next(x, i) {
	        values[i] = x;
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          if (err) { return o.onError(err); }
	          var res = tryCatch(resultSelector).apply(null, values);
	          if (res === errorObj) { return o.onError(res.e); }
	          o.onNext(res);
	        }
	        isDone && values[1] && o.onCompleted();
	      }

	      return new BinaryDisposable(
	        source.subscribe(
	          function (x) {
	            next(x, 0);
	          },
	          function (e) {
	            if (values[1]) {
	              o.onError(e);
	            } else {
	              err = e;
	            }
	          },
	          function () {
	            isDone = true;
	            values[1] && o.onCompleted();
	          }),
	        subject.subscribe(
	          function (x) {
	            next(x, 1);
	          },
	          function (e) { o.onError(e); },
	          function () {
	            isDone = true;
	            next(true, 1);
	          })
	        );
	    }, source);
	  }

	  var PausableBufferedObservable = (function (__super__) {
	    inherits(PausableBufferedObservable, __super__);
	    function PausableBufferedObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();

	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }

	      __super__.call(this);
	    }

	    PausableBufferedObservable.prototype._subscribe = function (o) {
	      var q = [], previousShouldFire;

	      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }

	      var subscription =
	        combineLatestSource(
	          this.source,
	          this.pauser.startWith(false).distinctUntilChanged(),
	          function (data, shouldFire) {
	            return { data: data, shouldFire: shouldFire };
	          })
	          .subscribe(
	            function (results) {
	              if (previousShouldFire !== undefined && results.shouldFire !== previousShouldFire) {
	                previousShouldFire = results.shouldFire;
	                // change in shouldFire
	                if (results.shouldFire) { drainQueue(); }
	              } else {
	                previousShouldFire = results.shouldFire;
	                // new data
	                if (results.shouldFire) {
	                  o.onNext(results.data);
	                } else {
	                  q.push(results.data);
	                }
	              }
	            },
	            function (err) {
	              drainQueue();
	              o.onError(err);
	            },
	            function () {
	              drainQueue();
	              o.onCompleted();
	            }
	          );
	      return subscription;      
	    };

	    PausableBufferedObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };

	    PausableBufferedObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };

	    return PausableBufferedObservable;

	  }(Observable));

	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
	   * and yields the values that were buffered while paused.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausableBuffered = function (subject) {
	    return new PausableBufferedObservable(this, subject);
	  };

	  var ControlledObservable = (function (__super__) {
	    inherits(ControlledObservable, __super__);
	    function ControlledObservable (source, enableQueue, scheduler) {
	      __super__.call(this);
	      this.subject = new ControlledSubject(enableQueue, scheduler);
	      this.source = source.multicast(this.subject).refCount();
	    }

	    ControlledObservable.prototype._subscribe = function (o) {
	      return this.source.subscribe(o);
	    };

	    ControlledObservable.prototype.request = function (numberOfItems) {
	      return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
	    };

	    return ControlledObservable;

	  }(Observable));

	  var ControlledSubject = (function (__super__) {
	    inherits(ControlledSubject, __super__);
	    function ControlledSubject(enableQueue, scheduler) {
	      enableQueue == null && (enableQueue = true);

	      __super__.call(this);
	      this.subject = new Subject();
	      this.enableQueue = enableQueue;
	      this.queue = enableQueue ? [] : null;
	      this.requestedCount = 0;
	      this.requestedDisposable = null;
	      this.error = null;
	      this.hasFailed = false;
	      this.hasCompleted = false;
	      this.scheduler = scheduler || currentThreadScheduler;
	    }

	    addProperties(ControlledSubject.prototype, Observer, {
	      _subscribe: function (o) {
	        return this.subject.subscribe(o);
	      },
	      onCompleted: function () {
	        this.hasCompleted = true;
	        if (!this.enableQueue || this.queue.length === 0) {
	          this.subject.onCompleted();
	          this.disposeCurrentRequest();
	        } else {
	          this.queue.push(Notification.createOnCompleted());
	        }
	      },
	      onError: function (error) {
	        this.hasFailed = true;
	        this.error = error;
	        if (!this.enableQueue || this.queue.length === 0) {
	          this.subject.onError(error);
	          this.disposeCurrentRequest();
	        } else {
	          this.queue.push(Notification.createOnError(error));
	        }
	      },
	      onNext: function (value) {
	        if (this.requestedCount <= 0) {
	          this.enableQueue && this.queue.push(Notification.createOnNext(value));
	        } else {
	          (this.requestedCount-- === 0) && this.disposeCurrentRequest();
	          this.subject.onNext(value);
	        }
	      },
	      _processRequest: function (numberOfItems) {
	        if (this.enableQueue) {
	          while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
	            var first = this.queue.shift();
	            first.accept(this.subject);
	            if (first.kind === 'N') {
	              numberOfItems--;
	            } else {
	              this.disposeCurrentRequest();
	              this.queue = [];
	            }
	          }
	        }

	        return numberOfItems;
	      },
	      request: function (number) {
	        this.disposeCurrentRequest();
	        var self = this;

	        this.requestedDisposable = this.scheduler.schedule(number,
	        function(s, i) {
	          var remaining = self._processRequest(i);
	          var stopped = self.hasCompleted || self.hasFailed;
	          if (!stopped && remaining > 0) {
	            self.requestedCount = remaining;

	            return disposableCreate(function () {
	              self.requestedCount = 0;
	            });
	              // Scheduled item is still in progress. Return a new
	              // disposable to allow the request to be interrupted
	              // via dispose.
	          }
	        });

	        return this.requestedDisposable;
	      },
	      disposeCurrentRequest: function () {
	        if (this.requestedDisposable) {
	          this.requestedDisposable.dispose();
	          this.requestedDisposable = null;
	        }
	      }
	    });

	    return ControlledSubject;
	  }(Observable));

	  /**
	   * Attaches a controller to the observable sequence with the ability to queue.
	   * @example
	   * var source = Rx.Observable.interval(100).controlled();
	   * source.request(3); // Reads 3 values
	   * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
	   * @param {Scheduler} scheduler determines how the requests will be scheduled
	   * @returns {Observable} The observable sequence which only propagates values on request.
	   */
	  observableProto.controlled = function (enableQueue, scheduler) {

	    if (enableQueue && isScheduler(enableQueue)) {
	      scheduler = enableQueue;
	      enableQueue = true;
	    }

	    if (enableQueue == null) {  enableQueue = true; }
	    return new ControlledObservable(this, enableQueue, scheduler);
	  };

	  var StopAndWaitObservable = (function (__super__) {
	    inherits(StopAndWaitObservable, __super__);
	    function StopAndWaitObservable (source) {
	      __super__.call(this);
	      this.source = source;
	    }

	    function scheduleMethod(s, self) {
	      self.source.request(1);
	    }

	    StopAndWaitObservable.prototype._subscribe = function (o) {
	      this.subscription = this.source.subscribe(new StopAndWaitObserver(o, this, this.subscription));
	      return new BinaryDisposable(
	        this.subscription,
	        defaultScheduler.schedule(this, scheduleMethod)
	      );
	    };

	    var StopAndWaitObserver = (function (__sub__) {
	      inherits(StopAndWaitObserver, __sub__);
	      function StopAndWaitObserver (observer, observable, cancel) {
	        __sub__.call(this);
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.scheduleDisposable = null;
	      }

	      StopAndWaitObserver.prototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };

	      StopAndWaitObserver.prototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };

	      function innerScheduleMethod(s, self) {
	        self.observable.source.request(1);
	      }

	      StopAndWaitObserver.prototype.next = function (value) {
	        this.observer.onNext(value);
	        this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod);
	      };

	      StopAndWaitObservable.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        if (this.scheduleDisposable) {
	          this.scheduleDisposable.dispose();
	          this.scheduleDisposable = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };

	      return StopAndWaitObserver;
	    }(AbstractObserver));

	    return StopAndWaitObservable;
	  }(Observable));


	  /**
	   * Attaches a stop and wait observable to the current observable.
	   * @returns {Observable} A stop and wait observable.
	   */
	  ControlledObservable.prototype.stopAndWait = function () {
	    return new StopAndWaitObservable(this);
	  };

	  var WindowedObservable = (function (__super__) {
	    inherits(WindowedObservable, __super__);
	    function WindowedObservable(source, windowSize) {
	      __super__.call(this);
	      this.source = source;
	      this.windowSize = windowSize;
	    }

	    function scheduleMethod(s, self) {
	      self.source.request(self.windowSize);
	    }

	    WindowedObservable.prototype._subscribe = function (o) {
	      this.subscription = this.source.subscribe(new WindowedObserver(o, this, this.subscription));
	      return new BinaryDisposable(
	        this.subscription,
	        defaultScheduler.schedule(this, scheduleMethod)
	      );
	    };

	    var WindowedObserver = (function (__sub__) {
	      inherits(WindowedObserver, __sub__);
	      function WindowedObserver(observer, observable, cancel) {
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.received = 0;
	        this.scheduleDisposable = null;
	        __sub__.call(this);
	      }

	      WindowedObserver.prototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };

	      WindowedObserver.prototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };

	      function innerScheduleMethod(s, self) {
	        self.observable.source.request(self.observable.windowSize);
	      }

	      WindowedObserver.prototype.next = function (value) {
	        this.observer.onNext(value);
	        this.received = ++this.received % this.observable.windowSize;
	        this.received === 0 && (this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod));
	      };

	      WindowedObserver.prototype.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        if (this.scheduleDisposable) {
	          this.scheduleDisposable.dispose();
	          this.scheduleDisposable = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };

	      return WindowedObserver;
	    }(AbstractObserver));

	    return WindowedObservable;
	  }(Observable));

	  /**
	   * Creates a sliding windowed observable based upon the window size.
	   * @param {Number} windowSize The number of items in the window
	   * @returns {Observable} A windowed observable based upon the window size.
	   */
	  ControlledObservable.prototype.windowed = function (windowSize) {
	    return new WindowedObservable(this, windowSize);
	  };

	  /**
	   * Pipes the existing Observable sequence into a Node.js Stream.
	   * @param {Stream} dest The destination Node.js stream.
	   * @returns {Stream} The destination stream.
	   */
	  observableProto.pipe = function (dest) {
	    var source = this.pausableBuffered();

	    function onDrain() {
	      source.resume();
	    }

	    dest.addListener('drain', onDrain);

	    source.subscribe(
	      function (x) {
	        !dest.write(String(x)) && source.pause();
	      },
	      function (err) {
	        dest.emit('error', err);
	      },
	      function () {
	        // Hack check because STDIO is not closable
	        !dest._isStdio && dest.end();
	        dest.removeListener('drain', onDrain);
	      });

	    source.resume();

	    return dest;
	  };

	  var MulticastObservable = (function (__super__) {
	    inherits(MulticastObservable, __super__);
	    function MulticastObservable(source, fn1, fn2) {
	      this.source = source;
	      this._fn1 = fn1;
	      this._fn2 = fn2;
	      __super__.call(this);
	    }

	    MulticastObservable.prototype.subscribeCore = function (o) {
	      var connectable = this.source.multicast(this._fn1());
	      return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
	    };

	    return MulticastObservable;
	  }(ObservableBase));

	  /**
	   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	   *
	   * @example
	   * 1 - res = source.multicast(observable);
	   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
	   *
	   * @param {Function|Subject} subjectOrSubjectSelector
	   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	   * Or:
	   * Subject to push source elements into.
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
	    return isFunction(subjectOrSubjectSelector) ?
	      new MulticastObservable(this, subjectOrSubjectSelector, selector) :
	      new ConnectableObservable(this, subjectOrSubjectSelector);
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of Multicast using a regular Subject.
	   *
	   * @example
	   * var resres = source.publish();
	   * var res = source.publish(function (x) { return x; });
	   *
	   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publish = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new Subject(); }, selector) :
	      this.multicast(new Subject());
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.share = function () {
	    return this.publish().refCount();
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
	   * This operator is a specialization of Multicast using a AsyncSubject.
	   *
	   * @example
	   * var res = source.publishLast();
	   * var res = source.publishLast(function (x) { return x; });
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishLast = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new AsyncSubject(); }, selector) :
	      this.multicast(new AsyncSubject());
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
	   * This operator is a specialization of Multicast using a BehaviorSubject.
	   *
	   * @example
	   * var res = source.publishValue(42);
	   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
	    return arguments.length === 2 ?
	      this.multicast(function () {
	        return new BehaviorSubject(initialValue);
	      }, initialValueOrSelector) :
	      this.multicast(new BehaviorSubject(initialValueOrSelector));
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
	   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareValue = function (initialValue) {
	    return this.publishValue(initialValue).refCount();
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of Multicast using a ReplaySubject.
	   *
	   * @example
	   * var res = source.replay(null, 3);
	   * var res = source.replay(null, 3, 500);
	   * var res = source.replay(null, 3, 500, scheduler);
	   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param windowSize [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
	      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   *
	   * @example
	   * var res = source.shareReplay(3);
	   * var res = source.shareReplay(3, 500);
	   * var res = source.shareReplay(3, 500, scheduler);
	   *

	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param window [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
	    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
	  };

	  var InnerSubscription = function (s, o) {
	    this._s = s;
	    this._o = o;
	  };

	  InnerSubscription.prototype.dispose = function () {
	    if (!this._s.isDisposed && this._o !== null) {
	      var idx = this._s.observers.indexOf(this._o);
	      this._s.observers.splice(idx, 1);
	      this._o = null;
	    }
	  };

	  var RefCountObservable = (function (__super__) {
	    inherits(RefCountObservable, __super__);
	    function RefCountObservable(source) {
	      this.source = source;
	      this._count = 0;
	      this._connectableSubscription = null;
	      __super__.call(this);
	    }

	    RefCountObservable.prototype.subscribeCore = function (o) {
	      var shouldConnect = ++this._count === 1, subscription = this.source.subscribe(o);
	      shouldConnect && (this._connectableSubscription = this.source.connect());
	      return new RefCountDisposable(this, subscription);
	    };

	    function RefCountDisposable(p, s) {
	      this._p = p;
	      this._s = s;
	      this.isDisposed = false;
	    }

	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._s.dispose();
	        --this._p._count === 0 && this._p._connectableSubscription.dispose();
	      }
	    };

	    return RefCountObservable;
	  }(ObservableBase));

	  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
	    inherits(ConnectableObservable, __super__);
	    function ConnectableObservable(source, subject) {
	      this.source = source;
	      this._hasSubscription  = false;
	      this._subscription = null;
	      this._sourceObservable = source.asObservable();
	      this._subject = subject;
	      __super__.call(this);
	    }

	    function ConnectDisposable(parent) {
	      this._p = parent;
	      this.isDisposed = false;
	    }

	    ConnectDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._p._hasSubscription = false;
	      }
	    };

	    ConnectableObservable.prototype.connect = function () {
	      if (!this._hasSubscription) {
	        this._hasSubscription = true;
	        this._subscription = new BinaryDisposable(
	          this._sourceObservable.subscribe(this._subject),
	          new ConnectDisposable(this)
	        );
	      }
	      return this._subscription;
	    };

	    ConnectableObservable.prototype._subscribe = function (o) {
	      return this._subject.subscribe(o);
	    };

	    ConnectableObservable.prototype.refCount = function () {
	      return new RefCountObservable(this);
	    };

	    return ConnectableObservable;
	  }(Observable));

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
	   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
	   */
	  observableProto.singleInstance = function() {
	    var source = this, hasObservable = false, observable;

	    function getObservable() {
	      if (!hasObservable) {
	        hasObservable = true;
	        observable = source.finally(function() { hasObservable = false; }).publish().refCount();
	      }
	      return observable;
	    }

	    return new AnonymousObservable(function(o) {
	      return getObservable().subscribe(o);
	    });
	  };

	  /**
	   *  Correlates the elements of two sequences based on overlapping durations.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var leftDone = false, rightDone = false;
	      var leftId = 0, rightId = 0;
	      var leftMap = new Map(), rightMap = new Map();
	      var handleError = function (e) { o.onError(e); };

	      group.add(left.subscribe(
	        function (value) {
	          var id = leftId++, md = new SingleAssignmentDisposable();

	          leftMap.set(id, value);
	          group.add(md);

	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
	              group.remove(md);
	            }));

	          rightMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(value, v);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          leftDone = true;
	          (rightDone || leftMap.size === 0) && o.onCompleted();
	        })
	      );

	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++, md = new SingleAssignmentDisposable();

	          rightMap.set(id, value);
	          group.add(md);

	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
	              group.remove(md);
	            }));

	          leftMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(v, value);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          rightDone = true;
	          (leftDone || rightMap.size === 0) && o.onCompleted();
	        })
	      );
	      return group;
	    }, left);
	  };

	  /**
	   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var r = new RefCountDisposable(group);
	      var leftMap = new Map(), rightMap = new Map();
	      var leftId = 0, rightId = 0;
	      var handleError = function (e) { return function (v) { v.onError(e); }; };

	      function handleError(e) { };

	      group.add(left.subscribe(
	        function (value) {
	          var s = new Subject();
	          var id = leftId++;
	          leftMap.set(id, s);

	          var result = tryCatch(resultSelector)(value, addRef(s, r));
	          if (result === errorObj) {
	            leftMap.forEach(handleError(result.e));
	            return o.onError(result.e);
	          }
	          o.onNext(result);

	          rightMap.forEach(function (v) { s.onNext(v); });

	          var md = new SingleAssignmentDisposable();
	          group.add(md);

	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              leftMap['delete'](id) && s.onCompleted();
	              group.remove(md);
	            }));
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        },
	        function () { o.onCompleted(); })
	      );

	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++;
	          rightMap.set(id, value);

	          var md = new SingleAssignmentDisposable();
	          group.add(md);

	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              rightMap['delete'](id);
	              group.remove(md);
	            }));

	          leftMap.forEach(function (v) { v.onNext(value); });
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        })
	      );

	      return r;
	    }, left);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers.
	   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.buffer = function () {
	    return this.window.apply(this, arguments)
	      .flatMap(toArray);
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows.
	   *
	   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
	    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	      return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector);
	    }
	    return typeof windowOpeningsOrClosingSelector === 'function' ?
	      observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
	      observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
	  };

	  function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
	    return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
	      return win;
	    });
	  }

	  function observableWindowWithBoundaries(windowBoundaries) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var win = new Subject(),
	        d = new CompositeDisposable(),
	        r = new RefCountDisposable(d);

	      observer.onNext(addRef(win, r));

	      d.add(source.subscribe(function (x) {
	        win.onNext(x);
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));

	      isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));

	      d.add(windowBoundaries.subscribe(function (w) {
	        win.onCompleted();
	        win = new Subject();
	        observer.onNext(addRef(win, r));
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));

	      return r;
	    }, source);
	  }

	  function observableWindowWithClosingSelector(windowClosingSelector) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        r = new RefCountDisposable(d),
	        win = new Subject();
	      observer.onNext(addRef(win, r));
	      d.add(source.subscribe(function (x) {
	          win.onNext(x);
	      }, function (err) {
	          win.onError(err);
	          observer.onError(err);
	      }, function () {
	          win.onCompleted();
	          observer.onCompleted();
	      }));

	      function createWindowClose () {
	        var windowClose;
	        try {
	          windowClose = windowClosingSelector();
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }

	        isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));

	        var m1 = new SingleAssignmentDisposable();
	        m.setDisposable(m1);
	        m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
	          win.onError(err);
	          observer.onError(err);
	        }, function () {
	          win.onCompleted();
	          win = new Subject();
	          observer.onNext(addRef(win, r));
	          createWindowClose();
	        }));
	      }

	      createWindowClose();
	      return r;
	    }, source);
	  }

	  var PairwiseObservable = (function (__super__) {
	    inherits(PairwiseObservable, __super__);
	    function PairwiseObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    PairwiseObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new PairwiseObserver(o));
	    };

	    return PairwiseObservable;
	  }(ObservableBase));

	  var PairwiseObserver = (function(__super__) {
	    inherits(PairwiseObserver, __super__);
	    function PairwiseObserver(o) {
	      this._o = o;
	      this._p = null;
	      this._hp = false;
	    }

	    PairwiseObserver.prototype.next = function (x) {
	      if (this._hp) {
	        this._o.onNext([this._p, x]);
	      } else {
	        this._hp = true;
	      }
	      this._p = x;
	    };
	    PairwiseObserver.prototype.error = function (err) { this._o.onError(err); };
	    PairwiseObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return PairwiseObserver;
	  }(AbstractObserver));

	  /**
	   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
	   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
	   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
	   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
	   */
	  observableProto.pairwise = function () {
	    return new PairwiseObservable(this);
	  };

	  /**
	   * Returns two observables which partition the observations of the source by the given function.
	   * The first will trigger observations for those values for which the predicate returns true.
	   * The second will trigger observations for those values where the predicate returns false.
	   * The predicate is executed once for each subscribed observer.
	   * Both also propagate all error observations arising from the source and each completes
	   * when the source completes.
	   * @param {Function} predicate
	   *    The function to determine which output Observable will trigger a particular observation.
	   * @returns {Array}
	   *    An array of observables. The first triggers when the predicate returns true,
	   *    and the second triggers when the predicate returns false.
	  */
	  observableProto.partition = function(predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return [
	      this.filter(predicate, thisArg),
	      this.filter(function (x, i, o) { return !fn(x, i, o); })
	    ];
	  };

	  var WhileEnumerable = (function(__super__) {
	    inherits(WhileEnumerable, __super__);
	    function WhileEnumerable(c, s) {
	      this.c = c;
	      this.s = s;
	    }
	    WhileEnumerable.prototype[$iterator$] = function () {
	      var self = this;
	      return {
	        next: function () {
	          return self.c() ?
	           { done: false, value: self.s } :
	           { done: true, value: void 0 };
	        }
	      };
	    };
	    return WhileEnumerable;
	  }(Enumerable));
	  
	  function enumerableWhile(condition, source) {
	    return new WhileEnumerable(condition, source);
	  }  

	   /**
	   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
	   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
	   *
	   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.letBind = observableProto['let'] = function (func) {
	    return func(this);
	  };

	   /**
	   *  Determines whether an observable collection contains values. 
	   *
	   * @example
	   *  1 - res = Rx.Observable.if(condition, obs1);
	   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
	   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
	   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
	   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
	   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
	   */
	  Observable['if'] = function (condition, thenSource, elseSourceOrScheduler) {
	    return observableDefer(function () {
	      elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());

	      isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
	      isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));

	      // Assume a scheduler for empty only
	      typeof elseSourceOrScheduler.now === 'function' && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
	      return condition() ? thenSource : elseSourceOrScheduler;
	    });
	  };

	   /**
	   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
	   * There is an alias for this method called 'forIn' for browsers <IE9
	   * @param {Array} sources An array of values to turn into an observable sequence.
	   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
	   * @returns {Observable} An observable sequence from the concatenated observable sequences.
	   */
	  Observable['for'] = Observable.forIn = function (sources, resultSelector, thisArg) {
	    return enumerableOf(sources, resultSelector, thisArg).concat();
	  };

	   /**
	   *  Repeats source as long as condition holds emulating a while loop.
	   * There is an alias for this method called 'whileDo' for browsers <IE9
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
	    isPromise(source) && (source = observableFromPromise(source));
	    return enumerableWhile(condition, source).concat();
	  };

	   /**
	   *  Repeats source as long as condition holds emulating a do while loop.
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  observableProto.doWhile = function (condition) {
	    return observableConcat([this, observableWhileDo(condition, this)]);
	  };

	   /**
	   *  Uses selector to determine which source in sources to use.
	   * @param {Function} selector The function which extracts the value for to test in a case statement.
	   * @param {Array} sources A object which has keys which correspond to the case statement labels.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	   *
	   * @returns {Observable} An observable sequence which is determined by a case statement.
	   */
	  Observable['case'] = function (selector, sources, defaultSourceOrScheduler) {
	    return observableDefer(function () {
	      isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
	      defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());

	      isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));

	      var result = sources[selector()];
	      isPromise(result) && (result = observableFromPromise(result));

	      return result || defaultSourceOrScheduler;
	    });
	  };

	   /**
	   *  Expands an observable sequence by recursively invoking selector.
	   *
	   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
	   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
	   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
	   */
	  observableProto.expand = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [],
	        m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        activeCount = 0,
	        isAcquired = false;

	      var ensureActive = function () {
	        var isOwner = false;
	        if (q.length > 0) {
	          isOwner = !isAcquired;
	          isAcquired = true;
	        }
	        if (isOwner) {
	          m.setDisposable(scheduler.scheduleRecursive(null, function (_, self) {
	            var work;
	            if (q.length > 0) {
	              work = q.shift();
	            } else {
	              isAcquired = false;
	              return;
	            }
	            var m1 = new SingleAssignmentDisposable();
	            d.add(m1);
	            m1.setDisposable(work.subscribe(function (x) {
	              o.onNext(x);
	              var result = null;
	              try {
	                result = selector(x);
	              } catch (e) {
	                o.onError(e);
	              }
	              q.push(result);
	              activeCount++;
	              ensureActive();
	            }, function (e) { o.onError(e); }, function () {
	              d.remove(m1);
	              activeCount--;
	              if (activeCount === 0) {
	                o.onCompleted();
	              }
	            }));
	            self();
	          }));
	        }
	      };

	      q.push(source);
	      activeCount++;
	      ensureActive();
	      return d;
	    }, this);
	  };

	   /**
	   *  Runs all observable sequences in parallel and collect their last elements.
	   *
	   * @example
	   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
	   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
	   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
	   */
	  Observable.forkJoin = function () {
	    var allSources = [];
	    if (Array.isArray(arguments[0])) {
	      allSources = arguments[0];
	    } else {
	      for(var i = 0, len = arguments.length; i < len; i++) { allSources.push(arguments[i]); }
	    }
	    return new AnonymousObservable(function (subscriber) {
	      var count = allSources.length;
	      if (count === 0) {
	        subscriber.onCompleted();
	        return disposableEmpty;
	      }
	      var group = new CompositeDisposable(),
	        finished = false,
	        hasResults = new Array(count),
	        hasCompleted = new Array(count),
	        results = new Array(count);

	      for (var idx = 0; idx < count; idx++) {
	        (function (i) {
	          var source = allSources[i];
	          isPromise(source) && (source = observableFromPromise(source));
	          group.add(
	            source.subscribe(
	              function (value) {
	              if (!finished) {
	                hasResults[i] = true;
	                results[i] = value;
	              }
	            },
	            function (e) {
	              finished = true;
	              subscriber.onError(e);
	              group.dispose();
	            },
	            function () {
	              if (!finished) {
	                if (!hasResults[i]) {
	                    subscriber.onCompleted();
	                    return;
	                }
	                hasCompleted[i] = true;
	                for (var ix = 0; ix < count; ix++) {
	                  if (!hasCompleted[ix]) { return; }
	                }
	                finished = true;
	                subscriber.onNext(results);
	                subscriber.onCompleted();
	              }
	            }));
	        })(idx);
	      }

	      return group;
	    });
	  };

	   /**
	   *  Runs two observable sequences in parallel and combines their last elemenets.
	   * @param {Observable} second Second observable sequence.
	   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
	   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
	   */
	  observableProto.forkJoin = function (second, resultSelector) {
	    var first = this;
	    return new AnonymousObservable(function (observer) {
	      var leftStopped = false, rightStopped = false,
	        hasLeft = false, hasRight = false,
	        lastLeft, lastRight,
	        leftSubscription = new SingleAssignmentDisposable(), rightSubscription = new SingleAssignmentDisposable();

	      isPromise(second) && (second = observableFromPromise(second));

	      leftSubscription.setDisposable(
	          first.subscribe(function (left) {
	            hasLeft = true;
	            lastLeft = left;
	          }, function (err) {
	            rightSubscription.dispose();
	            observer.onError(err);
	          }, function () {
	            leftStopped = true;
	            if (rightStopped) {
	              if (!hasLeft) {
	                  observer.onCompleted();
	              } else if (!hasRight) {
	                  observer.onCompleted();
	              } else {
	                var result = tryCatch(resultSelector)(lastLeft, lastRight);
	                if (result === errorObj) { return observer.onError(e); }
	                observer.onNext(result);
	                observer.onCompleted();
	              }
	            }
	          })
	      );

	      rightSubscription.setDisposable(
	        second.subscribe(function (right) {
	          hasRight = true;
	          lastRight = right;
	        }, function (err) {
	          leftSubscription.dispose();
	          observer.onError(err);
	        }, function () {
	          rightStopped = true;
	          if (leftStopped) {
	            if (!hasLeft) {
	              observer.onCompleted();
	            } else if (!hasRight) {
	              observer.onCompleted();
	            } else {
	              var result = tryCatch(resultSelector)(lastLeft, lastRight);
	              if (result === errorObj) { return observer.onError(result.e); }
	              observer.onNext(result);
	              observer.onCompleted();
	            }
	          }
	        })
	      );

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    }, first);
	  };

	  /**
	   * Comonadic bind operator.
	   * @param {Function} selector A transform function to apply to each element.
	   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
	   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
	   */
	  observableProto.manySelect = observableProto.extend = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    var source = this;
	    return observableDefer(function () {
	      var chain;

	      return source
	        .map(function (x) {
	          var curr = new ChainObservable(x);

	          chain && chain.onNext(x);
	          chain = curr;

	          return curr;
	        })
	        .tap(
	          noop,
	          function (e) { chain && chain.onError(e); },
	          function () { chain && chain.onCompleted(); }
	        )
	        .observeOn(scheduler)
	        .map(selector);
	    }, source);
	  };

	  var ChainObservable = (function (__super__) {
	    inherits(ChainObservable, __super__);
	    function ChainObservable(head) {
	      __super__.call(this);
	      this.head = head;
	      this.tail = new AsyncSubject();
	    }

	    addProperties(ChainObservable.prototype, Observer, {
	      _subscribe: function (o) {
	        var g = new CompositeDisposable();
	        g.add(currentThreadScheduler.schedule(this, function (_, self) {
	          o.onNext(self.head);
	          g.add(self.tail.mergeAll().subscribe(o));
	        }));

	        return g;
	      },
	      onCompleted: function () {
	        this.onNext(Observable.empty());
	      },
	      onError: function (e) {
	        this.onNext(Observable['throw'](e));
	      },
	      onNext: function (v) {
	        this.tail.onNext(v);
	        this.tail.onCompleted();
	      }
	    });

	    return ChainObservable;

	  }(Observable));

	  var Map = root.Map || (function () {
	    function Map() {
	      this.size = 0;
	      this._values = [];
	      this._keys = [];
	    }

	    Map.prototype['delete'] = function (key) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) { return false; }
	      this._values.splice(i, 1);
	      this._keys.splice(i, 1);
	      this.size--;
	      return true;
	    };

	    Map.prototype.get = function (key) {
	      var i = this._keys.indexOf(key);
	      return i === -1 ? undefined : this._values[i];
	    };

	    Map.prototype.set = function (key, value) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) {
	        this._keys.push(key);
	        this._values.push(value);
	        this.size++;
	      } else {
	        this._values[i] = value;
	      }
	      return this;
	    };

	    Map.prototype.forEach = function (cb, thisArg) {
	      for (var i = 0; i < this.size; i++) {
	        cb.call(thisArg, this._values[i], this._keys[i]);
	      }
	    };

	    return Map;
	  }());

	  /**
	   * @constructor
	   * Represents a join pattern over observable sequences.
	   */
	  function Pattern(patterns) {
	    this.patterns = patterns;
	  }

	  /**
	   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	   *  @param other Observable sequence to match in addition to the current pattern.
	   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	   */
	  Pattern.prototype.and = function (other) {
	    return new Pattern(this.patterns.concat(other));
	  };

	  /**
	   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  Pattern.prototype.thenDo = function (selector) {
	    return new Plan(this, selector);
	  };

	  function Plan(expression, selector) {
	      this.expression = expression;
	      this.selector = selector;
	  }

	  Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
	    var self = this;
	    var joinObservers = [];
	    for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
	      joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], observer.onError.bind(observer)));
	    }
	    var activePlan = new ActivePlan(joinObservers, function () {
	      var result;
	      try {
	        result = self.selector.apply(self, arguments);
	      } catch (e) {
	        observer.onError(e);
	        return;
	      }
	      observer.onNext(result);
	    }, function () {
	      for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
	        joinObservers[j].removeActivePlan(activePlan);
	      }
	      deactivate(activePlan);
	    });
	    for (i = 0, len = joinObservers.length; i < len; i++) {
	      joinObservers[i].addActivePlan(activePlan);
	    }
	    return activePlan;
	  };

	  function planCreateObserver(externalSubscriptions, observable, onError) {
	    var entry = externalSubscriptions.get(observable);
	    if (!entry) {
	      var observer = new JoinObserver(observable, onError);
	      externalSubscriptions.set(observable, observer);
	      return observer;
	    }
	    return entry;
	  }

	  function ActivePlan(joinObserverArray, onNext, onCompleted) {
	    this.joinObserverArray = joinObserverArray;
	    this.onNext = onNext;
	    this.onCompleted = onCompleted;
	    this.joinObservers = new Map();
	    for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      var joinObserver = this.joinObserverArray[i];
	      this.joinObservers.set(joinObserver, joinObserver);
	    }
	  }

	  ActivePlan.prototype.dequeue = function () {
	    this.joinObservers.forEach(function (v) { v.queue.shift(); });
	  };

	  ActivePlan.prototype.match = function () {
	    var i, len, hasValues = true;
	    for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      if (this.joinObserverArray[i].queue.length === 0) {
	        hasValues = false;
	        break;
	      }
	    }
	    if (hasValues) {
	      var firstValues = [],
	          isCompleted = false;
	      for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	        firstValues.push(this.joinObserverArray[i].queue[0]);
	        this.joinObserverArray[i].queue[0].kind === 'C' && (isCompleted = true);
	      }
	      if (isCompleted) {
	        this.onCompleted();
	      } else {
	        this.dequeue();
	        var values = [];
	        for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
	          values.push(firstValues[i].value);
	        }
	        this.onNext.apply(this, values);
	      }
	    }
	  };

	  var JoinObserver = (function (__super__) {
	    inherits(JoinObserver, __super__);

	    function JoinObserver(source, onError) {
	      __super__.call(this);
	      this.source = source;
	      this.onError = onError;
	      this.queue = [];
	      this.activePlans = [];
	      this.subscription = new SingleAssignmentDisposable();
	      this.isDisposed = false;
	    }

	    var JoinObserverPrototype = JoinObserver.prototype;

	    JoinObserverPrototype.next = function (notification) {
	      if (!this.isDisposed) {
	        if (notification.kind === 'E') {
	          return this.onError(notification.error);
	        }
	        this.queue.push(notification);
	        var activePlans = this.activePlans.slice(0);
	        for (var i = 0, len = activePlans.length; i < len; i++) {
	          activePlans[i].match();
	        }
	      }
	    };

	    JoinObserverPrototype.error = noop;
	    JoinObserverPrototype.completed = noop;

	    JoinObserverPrototype.addActivePlan = function (activePlan) {
	      this.activePlans.push(activePlan);
	    };

	    JoinObserverPrototype.subscribe = function () {
	      this.subscription.setDisposable(this.source.materialize().subscribe(this));
	    };

	    JoinObserverPrototype.removeActivePlan = function (activePlan) {
	      this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
	      this.activePlans.length === 0 && this.dispose();
	    };

	    JoinObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this.subscription.dispose();
	      }
	    };

	    return JoinObserver;
	  } (AbstractObserver));

	  /**
	   *  Creates a pattern that matches when both observable sequences have an available value.
	   *
	   *  @param right Observable sequence to match with the current sequence.
	   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
	   */
	  observableProto.and = function (right) {
	    return new Pattern([this, right]);
	  };

	  /**
	   *  Matches when the observable sequence has an available value and projects the value.
	   *
	   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
	   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  observableProto.thenDo = function (selector) {
	    return new Pattern([this]).thenDo(selector);
	  };

	  /**
	   *  Joins together the results from several patterns.
	   *
	   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	   *  @returns {Observable} Observable sequence with the results form matching several patterns.
	   */
	  Observable.when = function () {
	    var len = arguments.length, plans;
	    if (Array.isArray(arguments[0])) {
	      plans = arguments[0];
	    } else {
	      plans = new Array(len);
	      for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
	    }
	    return new AnonymousObservable(function (o) {
	      var activePlans = [],
	          externalSubscriptions = new Map();
	      var outObserver = observerCreate(
	        function (x) { o.onNext(x); },
	        function (err) {
	          externalSubscriptions.forEach(function (v) { v.onError(err); });
	          o.onError(err);
	        },
	        function (x) { o.onCompleted(); }
	      );
	      try {
	        for (var i = 0, len = plans.length; i < len; i++) {
	          activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
	            var idx = activePlans.indexOf(activePlan);
	            activePlans.splice(idx, 1);
	            activePlans.length === 0 && o.onCompleted();
	          }));
	        }
	      } catch (e) {
	        observableThrow(e).subscribe(o);
	      }
	      var group = new CompositeDisposable();
	      externalSubscriptions.forEach(function (joinObserver) {
	        joinObserver.subscribe();
	        group.add(joinObserver);
	      });

	      return group;
	    });
	  };

	  var TimerObservable = (function(__super__) {
	    inherits(TimerObservable, __super__);
	    function TimerObservable(dt, s) {
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimerObservable.prototype.subscribeCore = function (o) {
	      return this._s.scheduleFuture(o, this._dt, scheduleMethod);
	    };

	    function scheduleMethod(s, o) {
	      o.onNext(0);
	      o.onCompleted();
	    }

	    return TimerObservable;
	  }(ObservableBase));

	  function _observableTimer(dueTime, scheduler) {
	    return new TimerObservable(dueTime, scheduler);
	  }

	  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      var d = dueTime, p = normalizeTime(period);
	      return scheduler.scheduleRecursiveFuture(0, d, function (count, self) {
	        if (p > 0) {
	          var now = scheduler.now();
	          d = new Date(d.getTime() + p);
	          d.getTime() <= now && (d = new Date(now + p));
	        }
	        observer.onNext(count);
	        self(count + 1, new Date(d));
	      });
	    });
	  }

	  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
	    return dueTime === period ?
	      new AnonymousObservable(function (observer) {
	        return scheduler.schedulePeriodic(0, period, function (count) {
	          observer.onNext(count);
	          return count + 1;
	        });
	      }) :
	      observableDefer(function () {
	        return observableTimerDateAndPeriod(new Date(scheduler.now() + dueTime), period, scheduler);
	      });
	  }

	  /**
	   *  Returns an observable sequence that produces a value after each period.
	   *
	   * @example
	   *  1 - res = Rx.Observable.interval(1000);
	   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
	   *
	   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	   * @returns {Observable} An observable sequence that produces a value after each period.
	   */
	  var observableinterval = Observable.interval = function (period, scheduler) {
	    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : defaultScheduler);
	  };

	  /**
	   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	   */
	  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
	    var period;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
	      period = periodOrScheduler;
	    } else if (isScheduler(periodOrScheduler)) {
	      scheduler = periodOrScheduler;
	    }
	    if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
	      return _observableTimer(dueTime, scheduler);
	    }
	    if (dueTime instanceof Date && period !== undefined) {
	      return observableTimerDateAndPeriod(dueTime.getTime(), periodOrScheduler, scheduler);
	    }
	    return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
	  };

	  function observableDelayRelative(source, dueTime, scheduler) {
	    return new AnonymousObservable(function (o) {
	      var active = false,
	        cancelable = new SerialDisposable(),
	        exception = null,
	        q = [],
	        running = false,
	        subscription;
	      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
	        var d, shouldRun;
	        if (notification.value.kind === 'E') {
	          q = [];
	          q.push(notification);
	          exception = notification.value.error;
	          shouldRun = !running;
	        } else {
	          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
	          shouldRun = !active;
	          active = true;
	        }
	        if (shouldRun) {
	          if (exception !== null) {
	            o.onError(exception);
	          } else {
	            d = new SingleAssignmentDisposable();
	            cancelable.setDisposable(d);
	            d.setDisposable(scheduler.scheduleRecursiveFuture(null, dueTime, function (_, self) {
	              var e, recurseDueTime, result, shouldRecurse;
	              if (exception !== null) {
	                return;
	              }
	              running = true;
	              do {
	                result = null;
	                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
	                  result = q.shift().value;
	                }
	                if (result !== null) {
	                  result.accept(o);
	                }
	              } while (result !== null);
	              shouldRecurse = false;
	              recurseDueTime = 0;
	              if (q.length > 0) {
	                shouldRecurse = true;
	                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
	              } else {
	                active = false;
	              }
	              e = exception;
	              running = false;
	              if (e !== null) {
	                o.onError(e);
	              } else if (shouldRecurse) {
	                self(null, recurseDueTime);
	              }
	            }));
	          }
	        }
	      });
	      return new BinaryDisposable(subscription, cancelable);
	    }, source);
	  }

	  function observableDelayAbsolute(source, dueTime, scheduler) {
	    return observableDefer(function () {
	      return observableDelayRelative(source, dueTime - scheduler.now(), scheduler);
	    });
	  }

	  function delayWithSelector(source, subscriptionDelay, delayDurationSelector) {
	    var subDelay, selector;
	    if (isFunction(subscriptionDelay)) {
	      selector = subscriptionDelay;
	    } else {
	      subDelay = subscriptionDelay;
	      selector = delayDurationSelector;
	    }
	    return new AnonymousObservable(function (o) {
	      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();

	      function start() {
	        subscription.setDisposable(source.subscribe(
	          function (x) {
	            var delay = tryCatch(selector)(x);
	            if (delay === errorObj) { return o.onError(delay.e); }
	            var d = new SingleAssignmentDisposable();
	            delays.add(d);
	            d.setDisposable(delay.subscribe(
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              },
	              function (e) { o.onError(e); },
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              }
	            ));
	          },
	          function (e) { o.onError(e); },
	          function () {
	            atEnd = true;
	            subscription.dispose();
	            done();
	          }
	        ));
	      }

	      function done () {
	        atEnd && delays.length === 0 && o.onCompleted();
	      }

	      if (!subDelay) {
	        start();
	      } else {
	        subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
	      }

	      return new BinaryDisposable(subscription, delays);
	    }, this);
	  }

	  /**
	   *  Time shifts the observable sequence by dueTime.
	   *  The relative time intervals between the values are preserved.
	   *
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delay = function () {
	    var firstArg = arguments[0];
	    if (typeof firstArg === 'number' || firstArg instanceof Date) {
	      var dueTime = firstArg, scheduler = arguments[1];
	      isScheduler(scheduler) || (scheduler = defaultScheduler);
	      return dueTime instanceof Date ?
	        observableDelayAbsolute(this, dueTime, scheduler) :
	        observableDelayRelative(this, dueTime, scheduler);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return delayWithSelector(this, firstArg, arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  var DebounceObservable = (function (__super__) {
	    inherits(DebounceObservable, __super__);
	    function DebounceObservable(source, dt, s) {
	      isScheduler(s) || (s = defaultScheduler);
	      this.source = source;
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    DebounceObservable.prototype.subscribeCore = function (o) {
	      var cancelable = new SerialDisposable();
	      return new BinaryDisposable(
	        this.source.subscribe(new DebounceObserver(o, this.source, this._dt, this._s, cancelable)),
	        cancelable);
	    };

	    return DebounceObservable;
	  }(ObservableBase));

	  var DebounceObserver = (function (__super__) {
	    inherits(DebounceObserver, __super__);
	    function DebounceObserver(observer, source, dueTime, scheduler, cancelable) {
	      this._o = observer;
	      this._s = source;
	      this._d = dueTime;
	      this._scheduler = scheduler;
	      this._c = cancelable;
	      this._v = null;
	      this._hv = false;
	      this._id = 0;
	      __super__.call(this);
	    }

	    DebounceObserver.prototype.next = function (x) {
	      this._hv = true;
	      this._v = x;
	      var currentId = ++this._id, d = new SingleAssignmentDisposable();
	      this._c.setDisposable(d);
	      d.setDisposable(this._scheduler.scheduleFuture(this, this._d, function (_, self) {
	        self._hv && self._id === currentId && self._o.onNext(x);
	        self._hv = false;
	      }));
	    };

	    DebounceObserver.prototype.error = function (e) {
	      this._c.dispose();
	      this._o.onError(e);
	      this._hv = false;
	      this._id++;
	    };

	    DebounceObserver.prototype.completed = function () {
	      this._c.dispose();
	      this._hv && this._o.onNext(this._v);
	      this._o.onCompleted();
	      this._hv = false;
	      this._id++;
	    };

	    return DebounceObserver;
	  }(AbstractObserver));

	  function debounceWithSelector(source, durationSelector) {
	    return new AnonymousObservable(function (o) {
	      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          var throttle = tryCatch(durationSelector)(x);
	          if (throttle === errorObj) { return o.onError(throttle.e); }

	          isPromise(throttle) && (throttle = observableFromPromise(throttle));

	          hasValue = true;
	          value = x;
	          id++;
	          var currentid = id, d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(throttle.subscribe(
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            },
	            function (e) { o.onError(e); },
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            }
	          ));
	        },
	        function (e) {
	          cancelable.dispose();
	          o.onError(e);
	          hasValue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasValue && o.onNext(value);
	          o.onCompleted();
	          hasValue = false;
	          id++;
	        }
	      );
	      return new BinaryDisposable(subscription, cancelable);
	    }, source);
	  }

	  observableProto.debounce = function () {
	    if (isFunction (arguments[0])) {
	      return debounceWithSelector(this, arguments[0]);
	    } else if (typeof arguments[0] === 'number') {
	      return new DebounceObservable(this, arguments[0], arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
	   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    var source = this, timeShift;
	    timeShiftOrScheduler == null && (timeShift = timeSpan);
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    if (typeof timeShiftOrScheduler === 'number') {
	      timeShift = timeShiftOrScheduler;
	    } else if (isScheduler(timeShiftOrScheduler)) {
	      timeShift = timeSpan;
	      scheduler = timeShiftOrScheduler;
	    }
	    return new AnonymousObservable(function (observer) {
	      var groupDisposable,
	        nextShift = timeShift,
	        nextSpan = timeSpan,
	        q = [],
	        refCountDisposable,
	        timerD = new SerialDisposable(),
	        totalTime = 0;
	        groupDisposable = new CompositeDisposable(timerD),
	        refCountDisposable = new RefCountDisposable(groupDisposable);

	       function createTimer () {
	        var m = new SingleAssignmentDisposable(),
	          isSpan = false,
	          isShift = false;
	        timerD.setDisposable(m);
	        if (nextSpan === nextShift) {
	          isSpan = true;
	          isShift = true;
	        } else if (nextSpan < nextShift) {
	            isSpan = true;
	        } else {
	          isShift = true;
	        }
	        var newTotalTime = isSpan ? nextSpan : nextShift,
	          ts = newTotalTime - totalTime;
	        totalTime = newTotalTime;
	        if (isSpan) {
	          nextSpan += timeShift;
	        }
	        if (isShift) {
	          nextShift += timeShift;
	        }
	        m.setDisposable(scheduler.scheduleFuture(null, ts, function () {
	          if (isShift) {
	            var s = new Subject();
	            q.push(s);
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          isSpan && q.shift().onCompleted();
	          createTimer();
	        }));
	      };
	      q.push(new Subject());
	      observer.onNext(addRef(q[0], refCountDisposable));
	      createTimer();
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	        },
	        function (e) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  /**
	   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a window.
	   * @param {Number} count Maximum element count of a window.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new AnonymousObservable(function (observer) {
	      var timerD = new SerialDisposable(),
	          groupDisposable = new CompositeDisposable(timerD),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          n = 0,
	          windowId = 0,
	          s = new Subject();

	      function createTimer(id) {
	        var m = new SingleAssignmentDisposable();
	        timerD.setDisposable(m);
	        m.setDisposable(scheduler.scheduleFuture(null, timeSpan, function () {
	          if (id !== windowId) { return; }
	          n = 0;
	          var newId = ++windowId;
	          s.onCompleted();
	          s = new Subject();
	          observer.onNext(addRef(s, refCountDisposable));
	          createTimer(newId);
	        }));
	      }

	      observer.onNext(addRef(s, refCountDisposable));
	      createTimer(0);

	      groupDisposable.add(source.subscribe(
	        function (x) {
	          var newId = 0, newWindow = false;
	          s.onNext(x);
	          if (++n === count) {
	            newWindow = true;
	            n = 0;
	            newId = ++windowId;
	            s.onCompleted();
	            s = new Subject();
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          newWindow && createTimer(newId);
	        },
	        function (e) {
	          s.onError(e);
	          observer.onError(e);
	        }, function () {
	          s.onCompleted();
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
	   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
	   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    return this.windowWithTime(timeSpan, timeShiftOrScheduler, scheduler).flatMap(toArray);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a buffer.
	   * @param {Number} count Maximum element count of a buffer.
	   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
	    return this.windowWithTimeOrCount(timeSpan, count, scheduler).flatMap(toArray);
	  };

	  var TimeIntervalObservable = (function (__super__) {
	    inherits(TimeIntervalObservable, __super__);
	    function TimeIntervalObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimeIntervalObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TimeIntervalObserver(o, this._s));
	    };

	    return TimeIntervalObservable;
	  }(ObservableBase));

	  var TimeIntervalObserver = (function (__super__) {
	    inherits(TimeIntervalObserver, __super__);

	    function TimeIntervalObserver(o, s) {
	      this._o = o;
	      this._s = s;
	      this._l = s.now();
	      __super__.call(this);
	    }

	    TimeIntervalObserver.prototype.next = function (x) {
	      var now = this._s.now(), span = now - this._l;
	      this._l = now;
	      this._o.onNext({ value: x, interval: span });
	    };
	    TimeIntervalObserver.prototype.error = function (e) { this._o.onError(e); };
	    TimeIntervalObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TimeIntervalObserver;
	  }(AbstractObserver));

	  /**
	   *  Records the time interval between consecutive values in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timeInterval();
	   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
	   *
	   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence with time interval information on values.
	   */
	  observableProto.timeInterval = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TimeIntervalObservable(this, scheduler);
	  };

	  var TimestampObservable = (function (__super__) {
	    inherits(TimestampObservable, __super__);
	    function TimestampObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimestampObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TimestampObserver(o, this._s));
	    };

	    return TimestampObservable;
	  }(ObservableBase));

	  var TimestampObserver = (function (__super__) {
	    inherits(TimestampObserver, __super__);
	    function TimestampObserver(o, s) {
	      this._o = o;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimestampObserver.prototype.next = function (x) {
	      this._o.onNext({ value: x, timestamp: this._s.now() });
	    };

	    TimestampObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TimestampObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return TimestampObserver;
	  }(AbstractObserver));

	  /**
	   *  Records the timestamp for each value in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
	   *  2 - res = source.timestamp(Rx.Scheduler.default);
	   *
	   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
	   * @returns {Observable} An observable sequence with timestamp information on values.
	   */
	  observableProto.timestamp = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TimestampObservable(this, scheduler);
	  };

	  function sampleObservable(source, sampler) {
	    return new AnonymousObservable(function (o) {
	      var atEnd = false, value, hasValue = false;

	      function sampleSubscribe() {
	        if (hasValue) {
	          hasValue = false;
	          o.onNext(value);
	        }
	        atEnd && o.onCompleted();
	      }

	      var sourceSubscription = new SingleAssignmentDisposable();
	      sourceSubscription.setDisposable(source.subscribe(
	        function (newValue) {
	          hasValue = true;
	          value = newValue;
	        },
	        function (e) { o.onError(e); },
	        function () {
	          atEnd = true;
	          sourceSubscription.dispose();
	        }
	      ));

	      return new BinaryDisposable(
	        sourceSubscription,
	        sampler.subscribe(sampleSubscribe, function (e) { o.onError(e); }, sampleSubscribe)
	      );
	    }, source);
	  }

	  /**
	   *  Samples the observable sequence at each interval.
	   *
	   * @example
	   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
	   *  2 - res = source.sample(5000); // 5 seconds
	   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
	   *
	   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
	   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Sampled observable sequence.
	   */
	  observableProto.sample = observableProto.throttleLatest = function (intervalOrSampler, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return typeof intervalOrSampler === 'number' ?
	      sampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
	      sampleObservable(this, intervalOrSampler);
	  };

	  var TimeoutError = Rx.TimeoutError = function(message) {
	    this.message = message || 'Timeout has occurred';
	    this.name = 'TimeoutError';
	    Error.call(this);
	  };
	  TimeoutError.prototype = Object.create(Error.prototype);

	  function timeoutWithSelector(source, firstTimeout, timeoutDurationSelector, other) {
	    if (isFunction(firstTimeout)) {
	      other = timeoutDurationSelector;
	      timeoutDurationSelector = firstTimeout;
	      firstTimeout = observableNever();
	    }
	    other || (other = observableThrow(new TimeoutError()));
	    return new AnonymousObservable(function (o) {
	      var subscription = new SerialDisposable(),
	        timer = new SerialDisposable(),
	        original = new SingleAssignmentDisposable();

	      subscription.setDisposable(original);

	      var id = 0, switched = false;

	      function setTimer(timeout) {
	        var myId = id, d = new SingleAssignmentDisposable();

	        function timerWins() {
	          switched = (myId === id);
	          return switched;
	        }

	        timer.setDisposable(d);
	        d.setDisposable(timeout.subscribe(function () {
	          timerWins() && subscription.setDisposable(other.subscribe(o));
	          d.dispose();
	        }, function (e) {
	          timerWins() && o.onError(e);
	        }, function () {
	          timerWins() && subscription.setDisposable(other.subscribe(o));
	        }));
	      };

	      setTimer(firstTimeout);

	      function oWins() {
	        var res = !switched;
	        if (res) { id++; }
	        return res;
	      }

	      original.setDisposable(source.subscribe(function (x) {
	        if (oWins()) {
	          o.onNext(x);
	          var timeout = tryCatch(timeoutDurationSelector)(x);
	          if (timeout === errorObj) { return o.onError(timeout.e); }
	          setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
	        }
	      }, function (e) {
	        oWins() && o.onError(e);
	      }, function () {
	        oWins() && o.onCompleted();
	      }));
	      return new BinaryDisposable(subscription, timer);
	    }, source);
	  }

	  function timeout(source, dueTime, other, scheduler) {
	    if (isScheduler(other)) {
	      scheduler = other;
	      other = observableThrow(new TimeoutError());
	    }
	    if (other instanceof Error) { other = observableThrow(other); }
	    isScheduler(scheduler) || (scheduler = defaultScheduler);

	    return new AnonymousObservable(function (o) {
	      var id = 0,
	        original = new SingleAssignmentDisposable(),
	        subscription = new SerialDisposable(),
	        switched = false,
	        timer = new SerialDisposable();

	      subscription.setDisposable(original);

	      function createTimer() {
	        var myId = id;
	        timer.setDisposable(scheduler.scheduleFuture(null, dueTime, function () {
	          switched = id === myId;
	          if (switched) {
	            isPromise(other) && (other = observableFromPromise(other));
	            subscription.setDisposable(other.subscribe(o));
	          }
	        }));
	      }

	      createTimer();

	      original.setDisposable(source.subscribe(function (x) {
	        if (!switched) {
	          id++;
	          o.onNext(x);
	          createTimer();
	        }
	      }, function (e) {
	        if (!switched) {
	          id++;
	          o.onError(e);
	        }
	      }, function () {
	        if (!switched) {
	          id++;
	          o.onCompleted();
	        }
	      }));
	      return new BinaryDisposable(subscription, timer);
	    }, source);
	  }

	  observableProto.timeout = function () {
	    var firstArg = arguments[0];
	    if (firstArg instanceof Date || typeof firstArg === 'number') {
	      return timeout(this, firstArg, arguments[1], arguments[2]);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return timeoutWithSelector(this, firstArg, arguments[1], arguments[2]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  var GenerateAbsoluteObservable = (function (__super__) {
	    inherits(GenerateAbsoluteObservable, __super__);
	    function GenerateAbsoluteObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._timeFn = timeFn;
	      this._s = s;
	      this._first = true;
	      this._hasResult = false;
	      __super__.call(this);
	    }

	    function scheduleRecursive(self, recurse) {
	      self._hasResult && self._o.onNext(self._state);

	      if (self._first) {
	        self._first = false;
	      } else {
	        self._state = tryCatch(self._itrFn)(self._state);
	        if (self._state === errorObj) { return self._o.onError(self._state.e); }
	      }
	      self._hasResult = tryCatch(self._cndFn)(self._state);
	      if (self._hasResult === errorObj) { return self._o.onError(self._hasResult.e); }
	      if (self._hasResult) {
	        var result = tryCatch(self._resFn)(self._state);
	        if (result === errorObj) { return self._o.onError(result.e); }
	        var time = tryCatch(self._timeFn)(self._state);
	        if (time === errorObj) { return self._o.onError(time.e); }
	        recurse(self, time);
	      } else {
	        self._o.onCompleted();
	      }
	    }

	    GenerateAbsoluteObservable.prototype.subscribeCore = function (o) {
	      this._o = o;
	      return this._s.scheduleRecursiveFuture(this, new Date(this._s.now()), scheduleRecursive);
	    };

	    return GenerateAbsoluteObservable;
	  }(ObservableBase));

	  /**
	   *  GenerateAbsolutes an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithAbsoluteTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return new Date(); }
	   *  });
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new GenerateAbsoluteObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	  };

	  var GenerateRelativeObservable = (function (__super__) {
	    inherits(GenerateRelativeObservable, __super__);
	    function GenerateRelativeObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._timeFn = timeFn;
	      this._s = s;
	      this._first = true;
	      this._hasResult = false;
	      __super__.call(this);
	    }

	    function scheduleRecursive(self, recurse) {
	      self._hasResult && self._o.onNext(self._state);

	      if (self._first) {
	        self._first = false;
	      } else {
	        self._state = tryCatch(self._itrFn)(self._state);
	        if (self._state === errorObj) { return self._o.onError(self._state.e); }
	      }
	      self._hasResult = tryCatch(self._cndFn)(self._state);
	      if (self._hasResult === errorObj) { return self._o.onError(self._hasResult.e); }
	      if (self._hasResult) {
	        var result = tryCatch(self._resFn)(self._state);
	        if (result === errorObj) { return self._o.onError(result.e); }
	        var time = tryCatch(self._timeFn)(self._state);
	        if (time === errorObj) { return self._o.onError(time.e); }
	        recurse(self, time);
	      } else {
	        self._o.onCompleted();
	      }
	    }

	    GenerateRelativeObservable.prototype.subscribeCore = function (o) {
	      this._o = o;
	      return this._s.scheduleRecursiveFuture(this, 0, scheduleRecursive);
	    };

	    return GenerateRelativeObservable;
	  }(ObservableBase));

	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithRelativeTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return 500; }
	   *  );
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new GenerateRelativeObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	  };

	  var DelaySubscription = (function(__super__) {
	    inherits(DelaySubscription, __super__);
	    function DelaySubscription(source, dt, s) {
	      this.source = source;
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    DelaySubscription.prototype.subscribeCore = function (o) {
	      var d = new SerialDisposable();

	      d.setDisposable(this._s.scheduleFuture([this.source, o, d], this._dt, scheduleMethod));

	      return d;
	    };

	    function scheduleMethod(s, state) {
	      var source = state[0], o = state[1], d = state[2];
	      d.setDisposable(source.subscribe(o));
	    }

	    return DelaySubscription;
	  }(ObservableBase));

	  /**
	   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.delaySubscription(5000); // 5s
	   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
	   *
	   * @param {Number} dueTime Relative or absolute time shift of the subscription.
	   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delaySubscription = function (dueTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new DelaySubscription(this, dueTime, scheduler);
	  };

	  var SkipLastWithTimeObservable = (function (__super__) {
	    inherits(SkipLastWithTimeObservable, __super__);
	    function SkipLastWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    SkipLastWithTimeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipLastWithTimeObserver(o, this));
	    };

	    return SkipLastWithTimeObservable;
	  }(ObservableBase));

	  var SkipLastWithTimeObserver = (function (__super__) {
	    inherits(SkipLastWithTimeObserver, __super__);

	    function SkipLastWithTimeObserver(o, p) {
	      this._o = o;
	      this._s = p._s;
	      this._d = p._d;
	      this._q = [];
	      __super__.call(this);
	    }

	    SkipLastWithTimeObserver.prototype.next = function (x) {
	      var now = this._s.now();
	      this._q.push({ interval: now, value: x });
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._o.onNext(this._q.shift().value);
	      }
	    };
	    SkipLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipLastWithTimeObserver.prototype.completed = function () {
	      var now = this._s.now();
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._o.onNext(this._q.shift().value);
	      }
	      this._o.onCompleted();
	    };

	    return SkipLastWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for skipping elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
	   */
	  observableProto.skipLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipLastWithTimeObservable(this, duration, scheduler);
	  };

	  var TakeLastWithTimeObservable = (function (__super__) {
	    inherits(TakeLastWithTimeObservable, __super__);
	    function TakeLastWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    TakeLastWithTimeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeLastWithTimeObserver(o, this._d, this._s));
	    };

	    return TakeLastWithTimeObservable;
	  }(ObservableBase));

	  var TakeLastWithTimeObserver = (function (__super__) {
	    inherits(TakeLastWithTimeObserver, __super__);

	    function TakeLastWithTimeObserver(o, d, s) {
	      this._o = o;
	      this._d = d;
	      this._s = s;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastWithTimeObserver.prototype.next = function (x) {
	      var now = this._s.now();
	      this._q.push({ interval: now, value: x });
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._q.shift();
	      }
	    };
	    TakeLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeLastWithTimeObserver.prototype.completed = function () {
	      var now = this._s.now();
	      while (this._q.length > 0) {
	        var next = this._q.shift();
	        if (now - next.interval <= this._d) { this._o.onNext(next.value); }
	      }
	      this._o.onCompleted();
	    };

	    return TakeLastWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TakeLastWithTimeObservable(this, duration, scheduler);
	  };

	  /**
	   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastBufferWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now(), res = [];
	        while (q.length > 0) {
	          var next = q.shift();
	          now - next.interval <= duration && res.push(next.value);
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    }, source);
	  };

	  var TakeWithTimeObservable = (function (__super__) {
	    inherits(TakeWithTimeObservable, __super__);
	    function TakeWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, o) {
	      o.onCompleted();
	    }

	    TakeWithTimeObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(
	        this._s.scheduleFuture(o, this._d, scheduleMethod),
	        this.source.subscribe(o)
	      );
	    };

	    return TakeWithTimeObservable;
	  }(ObservableBase));

	  /**
	   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
	   */
	  observableProto.takeWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TakeWithTimeObservable(this, duration, scheduler);
	  };

	  var SkipWithTimeObservable = (function (__super__) {
	    inherits(SkipWithTimeObservable, __super__);
	    function SkipWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      this._open = false;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, self) {
	      self._open = true;
	    }

	    SkipWithTimeObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(
	        this._s.scheduleFuture(this, this._d, scheduleMethod),
	        this.source.subscribe(new SkipWithTimeObserver(o, this))
	      );
	    };

	    return SkipWithTimeObservable;
	  }(ObservableBase));

	  var SkipWithTimeObserver = (function (__super__) {
	    inherits(SkipWithTimeObserver, __super__);

	    function SkipWithTimeObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
	    SkipWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
	   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
	   *  may not execute immediately, despite the zero due time.
	   *
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
	   * @param {Number} duration Duration for skipping elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
	   */
	  observableProto.skipWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipWithTimeObservable(this, duration, scheduler);
	  };

	  var SkipUntilWithTimeObservable = (function (__super__) {
	    inherits(SkipUntilWithTimeObservable, __super__);
	    function SkipUntilWithTimeObservable(source, startTime, scheduler) {
	      this.source = source;
	      this._st = startTime;
	      this._s = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, state) {
	      state._open = true;
	    }

	    SkipUntilWithTimeObservable.prototype.subscribeCore = function (o) {
	      this._open = false;
	      return new BinaryDisposable(
	        this._s.scheduleFuture(this, this._st, scheduleMethod),
	        this.source.subscribe(new SkipUntilWithTimeObserver(o, this))
	      );
	    };

	    return SkipUntilWithTimeObservable;
	  }(ObservableBase));

	  var SkipUntilWithTimeObserver = (function (__super__) {
	    inherits(SkipUntilWithTimeObserver, __super__);

	    function SkipUntilWithTimeObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipUntilWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
	    SkipUntilWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipUntilWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipUntilWithTimeObserver;
	  }(AbstractObserver));


	  /**
	   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
	   *
	   * @examples
	   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
	   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
	   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
	   */
	  observableProto.skipUntilWithTime = function (startTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipUntilWithTimeObservable(this, startTime, scheduler);
	  };

	  /**
	   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
	   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
	   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
	   */
	  observableProto.takeUntilWithTime = function (endTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return new BinaryDisposable(
	        scheduler.scheduleFuture(o, endTime, function (_, o) { o.onCompleted(); }),
	        source.subscribe(o));
	    }, source);
	  };

	  /**
	   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
	   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
	   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
	   * @returns {Observable} An Observable that performs the throttle operation.
	   */
	  observableProto.throttle = function (windowDuration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    var duration = +windowDuration || 0;
	    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var lastOnNext = 0;
	      return source.subscribe(
	        function (x) {
	          var now = scheduler.now();
	          if (lastOnNext === 0 || now - lastOnNext >= duration) {
	            lastOnNext = now;
	            o.onNext(x);
	          }
	        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
	      );
	    }, source);
	  };

	  var TransduceObserver = (function (__super__) {
	    inherits(TransduceObserver, __super__);
	    function TransduceObserver(o, xform) {
	      this._o = o;
	      this._xform = xform;
	      __super__.call(this);
	    }

	    TransduceObserver.prototype.next = function (x) {
	      var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
	      if (res === errorObj) { this._o.onError(res.e); }
	    };

	    TransduceObserver.prototype.error = function (e) { this._o.onError(e); };

	    TransduceObserver.prototype.completed = function () {
	      this._xform['@@transducer/result'](this._o);
	    };

	    return TransduceObserver;
	  }(AbstractObserver));

	  function transformForObserver(o) {
	    return {
	      '@@transducer/init': function() {
	        return o;
	      },
	      '@@transducer/step': function(obs, input) {
	        return obs.onNext(input);
	      },
	      '@@transducer/result': function(obs) {
	        return obs.onCompleted();
	      }
	    };
	  }

	  /**
	   * Executes a transducer to transform the observable sequence
	   * @param {Transducer} transducer A transducer to execute
	   * @returns {Observable} An Observable sequence containing the results from the transducer.
	   */
	  observableProto.transduce = function(transducer) {
	    var source = this;
	    return new AnonymousObservable(function(o) {
	      var xform = transducer(transformForObserver(o));
	      return source.subscribe(new TransduceObserver(o, xform));
	    }, source);
	  };

	  /**
	   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	   * Observables that come in between subscriptions will be dropped on the floor.
	   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	   */
	  observableProto.switchFirst = function () {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var hasCurrent = false,
	        isStopped = false,
	        m = new SingleAssignmentDisposable(),
	        g = new CompositeDisposable();

	      g.add(m);

	      m.setDisposable(sources.subscribe(
	        function (innerSource) {
	          if (!hasCurrent) {
	            hasCurrent = true;

	            isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));

	            var innerSubscription = new SingleAssignmentDisposable();
	            g.add(innerSubscription);

	            innerSubscription.setDisposable(innerSource.subscribe(
	              function (x) { o.onNext(x); },
	              function (e) { o.onError(e); },
	              function () {
	                g.remove(innerSubscription);
	                hasCurrent = false;
	                isStopped && g.length === 1 && o.onCompleted();
	            }));
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          isStopped = true;
	          !hasCurrent && g.length === 1 && o.onCompleted();
	        }));

	      return g;
	    }, this);
	  };

	observableProto.flatMapFirst = observableProto.selectManyFirst = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
	};

	Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	};
	  /** Provides a set of extension methods for virtual time scheduling. */
	  var VirtualTimeScheduler = Rx.VirtualTimeScheduler = (function (__super__) {
	    inherits(VirtualTimeScheduler, __super__);

	    /**
	     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
	     *
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function VirtualTimeScheduler(initialClock, comparer) {
	      this.clock = initialClock;
	      this.comparer = comparer;
	      this.isEnabled = false;
	      this.queue = new PriorityQueue(1024);
	      __super__.call(this);
	    }

	    var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;

	    VirtualTimeSchedulerPrototype.now = function () {
	      return this.toAbsoluteTime(this.clock);
	    };

	    VirtualTimeSchedulerPrototype.schedule = function (state, action) {
	      return this.scheduleAbsolute(state, this.clock, action);
	    };

	    VirtualTimeSchedulerPrototype.scheduleFuture = function (state, dueTime, action) {
	      var dt = dueTime instanceof Date ?
	        this.toRelativeTime(dueTime - this.now()) :
	        this.toRelativeTime(dueTime);

	      return this.scheduleRelative(state, dt, action);
	    };

	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    VirtualTimeSchedulerPrototype.add = notImplemented;

	    /**
	     * Converts an absolute time to a number
	     * @param {Any} The absolute time.
	     * @returns {Number} The absolute time in ms
	     */
	    VirtualTimeSchedulerPrototype.toAbsoluteTime = notImplemented;

	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    VirtualTimeSchedulerPrototype.toRelativeTime = notImplemented;

	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.schedulePeriodic = function (state, period, action) {
	      var s = new SchedulePeriodicRecursive(this, state, period, action);
	      return s.start();
	    };

	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelative = function (state, dueTime, action) {
	      var runAt = this.add(this.clock, dueTime);
	      return this.scheduleAbsolute(state, runAt, action);
	    };

	    /**
	     * Starts the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.start = function () {
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	      }
	    };

	    /**
	     * Stops the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.stop = function () {
	      this.isEnabled = false;
	    };

	    /**
	     * Advances the scheduler's clock to the specified time, running all work till that point.
	     * @param {Number} time Absolute time to advance the scheduler's clock to.
	     */
	    VirtualTimeSchedulerPrototype.advanceTo = function (time) {
	      var dueToClock = this.comparer(this.clock, time);
	      if (this.comparer(this.clock, time) > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) { return; }
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null && this.comparer(next.dueTime, time) <= 0) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	        this.clock = time;
	      }
	    };

	    /**
	     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.advanceBy = function (time) {
	      var dt = this.add(this.clock, time),
	          dueToClock = this.comparer(this.clock, dt);
	      if (dueToClock > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) {  return; }

	      this.advanceTo(dt);
	    };

	    /**
	     * Advances the scheduler's clock by the specified relative time.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.sleep = function (time) {
	      var dt = this.add(this.clock, time);
	      if (this.comparer(this.clock, dt) >= 0) { throw new ArgumentOutOfRangeError(); }

	      this.clock = dt;
	    };

	    /**
	     * Gets the next scheduled item to be executed.
	     * @returns {ScheduledItem} The next scheduled item.
	     */
	    VirtualTimeSchedulerPrototype.getNext = function () {
	      while (this.queue.length > 0) {
	        var next = this.queue.peek();
	        if (next.isCancelled()) {
	          this.queue.dequeue();
	        } else {
	          return next;
	        }
	      }
	      return null;
	    };

	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsolute = function (state, dueTime, action) {
	      var self = this;

	      function run(scheduler, state1) {
	        self.queue.remove(si);
	        return action(scheduler, state1);
	      }

	      var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
	      this.queue.enqueue(si);

	      return si.disposable;
	    };

	    return VirtualTimeScheduler;
	  }(Scheduler));

	  /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
	  Rx.HistoricalScheduler = (function (__super__) {
	    inherits(HistoricalScheduler, __super__);

	    /**
	     * Creates a new historical scheduler with the specified initial clock value.
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function HistoricalScheduler(initialClock, comparer) {
	      var clock = initialClock == null ? 0 : initialClock;
	      var cmp = comparer || defaultSubComparer;
	      __super__.call(this, clock, cmp);
	    }

	    var HistoricalSchedulerProto = HistoricalScheduler.prototype;

	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    HistoricalSchedulerProto.add = function (absolute, relative) {
	      return absolute + relative;
	    };

	    HistoricalSchedulerProto.toAbsoluteTime = function (absolute) {
	      return new Date(absolute).getTime();
	    };

	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @memberOf HistoricalScheduler
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    HistoricalSchedulerProto.toRelativeTime = function (timeSpan) {
	      return timeSpan;
	    };

	    return HistoricalScheduler;
	  }(Rx.VirtualTimeScheduler));

	function OnNextPredicate(predicate) {
	    this.predicate = predicate;
	}

	OnNextPredicate.prototype.equals = function (other) {
	  if (other === this) { return true; }
	  if (other == null) { return false; }
	  if (other.kind !== 'N') { return false; }
	  return this.predicate(other.value);
	};

	function OnErrorPredicate(predicate) {
	  this.predicate = predicate;
	}

	OnErrorPredicate.prototype.equals = function (other) {
	  if (other === this) { return true; }
	  if (other == null) { return false; }
	  if (other.kind !== 'E') { return false; }
	  return this.predicate(other.error);
	};

	var ReactiveTest = Rx.ReactiveTest = {
	  /** Default virtual time used for creation of observable sequences in unit tests. */
	  created: 100,
	  /** Default virtual time used to subscribe to observable sequences in unit tests. */
	  subscribed: 200,
	  /** Default virtual time used to dispose subscriptions in unit tests. */
	  disposed: 1000,

	  /**
	   * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
	   *
	   * 1 - ReactiveTest.onNext(200, 42);
	   * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
	   *
	   * @param ticks Recorded virtual time the OnNext notification occurs.
	   * @param value Recorded value stored in the OnNext notification or a predicate.
	   * @return Recorded OnNext notification.
	   */
	  onNext: function (ticks, value) {
	    return typeof value === 'function' ?
	      new Recorded(ticks, new OnNextPredicate(value)) :
	      new Recorded(ticks, Notification.createOnNext(value));
	  },
	  /**
	   * Factory method for an OnError notification record at a given time with a given error.
	   *
	   * 1 - ReactiveTest.onNext(200, new Error('error'));
	   * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
	   *
	   * @param ticks Recorded virtual time the OnError notification occurs.
	   * @param exception Recorded exception stored in the OnError notification.
	   * @return Recorded OnError notification.
	   */
	  onError: function (ticks, error) {
	    return typeof error === 'function' ?
	      new Recorded(ticks, new OnErrorPredicate(error)) :
	      new Recorded(ticks, Notification.createOnError(error));
	  },
	  /**
	   * Factory method for an OnCompleted notification record at a given time.
	   *
	   * @param ticks Recorded virtual time the OnCompleted notification occurs.
	   * @return Recorded OnCompleted notification.
	   */
	  onCompleted: function (ticks) {
	    return new Recorded(ticks, Notification.createOnCompleted());
	  },
	  /**
	   * Factory method for a subscription record based on a given subscription and disposal time.
	   *
	   * @param start Virtual time indicating when the subscription was created.
	   * @param end Virtual time indicating when the subscription was disposed.
	   * @return Subscription object.
	   */
	  subscribe: function (start, end) {
	    return new Subscription(start, end);
	  }
	};

	  /**
	   * Creates a new object recording the production of the specified value at the given virtual time.
	   *
	   * @constructor
	   * @param {Number} time Virtual time the value was produced on.
	   * @param {Mixed} value Value that was produced.
	   * @param {Function} comparer An optional comparer.
	   */
	  var Recorded = Rx.Recorded = function (time, value, comparer) {
	    this.time = time;
	    this.value = value;
	    this.comparer = comparer || defaultComparer;
	  };

	  /**
	   * Checks whether the given recorded object is equal to the current instance.
	   *
	   * @param {Recorded} other Recorded object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */
	  Recorded.prototype.equals = function (other) {
	    return this.time === other.time && this.comparer(this.value, other.value);
	  };

	  /**
	   * Returns a string representation of the current Recorded value.
	   *
	   * @returns {String} String representation of the current Recorded value.
	   */
	  Recorded.prototype.toString = function () {
	    return this.value.toString() + '@' + this.time;
	  };

	  /**
	   * Creates a new subscription object with the given virtual subscription and unsubscription time.
	   *
	   * @constructor
	   * @param {Number} subscribe Virtual time at which the subscription occurred.
	   * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
	   */
	  var Subscription = Rx.Subscription = function (start, end) {
	    this.subscribe = start;
	    this.unsubscribe = end || Number.MAX_VALUE;
	  };

	  /**
	   * Checks whether the given subscription is equal to the current instance.
	   * @param other Subscription object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */
	  Subscription.prototype.equals = function (other) {
	    return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
	  };

	  /**
	   * Returns a string representation of the current Subscription value.
	   * @returns {String} String representation of the current Subscription value.
	   */
	  Subscription.prototype.toString = function () {
	    return '(' + this.subscribe + ', ' + (this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe) + ')';
	  };

	  var MockDisposable = Rx.MockDisposable = function (scheduler) {
	    this.scheduler = scheduler;
	    this.disposes = [];
	    this.disposes.push(this.scheduler.clock);
	  };

	  MockDisposable.prototype.dispose = function () {
	    this.disposes.push(this.scheduler.clock);
	  };

	  var MockObserver = (function (__super__) {
	    inherits(MockObserver, __super__);

	    function MockObserver(scheduler) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.messages = [];
	    }

	    var MockObserverPrototype = MockObserver.prototype;

	    MockObserverPrototype.onNext = function (value) {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
	    };

	    MockObserverPrototype.onError = function (e) {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(e)));
	    };

	    MockObserverPrototype.onCompleted = function () {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
	    };

	    return MockObserver;
	  })(Observer);

	  function MockPromise(scheduler, messages) {
	    var self = this;
	    this.scheduler = scheduler;
	    this.messages = messages;
	    this.subscriptions = [];
	    this.observers = [];
	    for (var i = 0, len = this.messages.length; i < len; i++) {
	      var message = this.messages[i],
	          notification = message.value;
	      (function (innerNotification) {
	        scheduler.scheduleAbsolute(null, message.time, function () {
	          var obs = self.observers.slice(0);

	          for (var j = 0, jLen = obs.length; j < jLen; j++) {
	            innerNotification.accept(obs[j]);
	          }
	          return disposableEmpty;
	        });
	      })(notification);
	    }
	  }

	  MockPromise.prototype.then = function (onResolved, onRejected) {
	    var self = this;

	    this.subscriptions.push(new Subscription(this.scheduler.clock));
	    var index = this.subscriptions.length - 1;

	    var newPromise;

	    var observer = Rx.Observer.create(
	      function (x) {
	        var retValue = onResolved(x);
	        if (retValue && typeof retValue.then === 'function') {
	          newPromise = retValue;
	        } else {
	          var ticks = self.scheduler.clock;
	          newPromise = new MockPromise(self.scheduler, [Rx.ReactiveTest.onNext(ticks, undefined), Rx.ReactiveTest.onCompleted(ticks)]);
	        }
	        var idx = self.observers.indexOf(observer);
	        self.observers.splice(idx, 1);
	        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
	      },
	      function (err) {
	        onRejected(err);
	        var idx = self.observers.indexOf(observer);
	        self.observers.splice(idx, 1);
	        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
	      }
	    );
	    this.observers.push(observer);

	    return newPromise || new MockPromise(this.scheduler, this.messages);
	  };

	  var HotObservable = (function (__super__) {
	    inherits(HotObservable, __super__);

	    function HotObservable(scheduler, messages) {
	      __super__.call(this);
	      var message, notification, observable = this;
	      this.scheduler = scheduler;
	      this.messages = messages;
	      this.subscriptions = [];
	      this.observers = [];
	      for (var i = 0, len = this.messages.length; i < len; i++) {
	        message = this.messages[i];
	        notification = message.value;
	        (function (innerNotification) {
	          scheduler.scheduleAbsolute(null, message.time, function () {
	            var obs = observable.observers.slice(0);

	            for (var j = 0, jLen = obs.length; j < jLen; j++) {
	              innerNotification.accept(obs[j]);
	            }
	            return disposableEmpty;
	          });
	        })(notification);
	      }
	    }

	    HotObservable.prototype._subscribe = function (o) {
	      var observable = this;
	      this.observers.push(o);
	      this.subscriptions.push(new Subscription(this.scheduler.clock));
	      var index = this.subscriptions.length - 1;
	      return disposableCreate(function () {
	        var idx = observable.observers.indexOf(o);
	        observable.observers.splice(idx, 1);
	        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
	      });
	    };

	    return HotObservable;
	  })(Observable);

	  var ColdObservable = (function (__super__) {
	    inherits(ColdObservable, __super__);

	    function ColdObservable(scheduler, messages) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.messages = messages;
	      this.subscriptions = [];
	    }

	    ColdObservable.prototype._subscribe = function (o) {
	      var message, notification, observable = this;
	      this.subscriptions.push(new Subscription(this.scheduler.clock));
	      var index = this.subscriptions.length - 1;
	      var d = new CompositeDisposable();
	      for (var i = 0, len = this.messages.length; i < len; i++) {
	        message = this.messages[i];
	        notification = message.value;
	        (function (innerNotification) {
	          d.add(observable.scheduler.scheduleRelative(null, message.time, function () {
	            innerNotification.accept(o);
	            return disposableEmpty;
	          }));
	        })(notification);
	      }
	      return disposableCreate(function () {
	        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
	        d.dispose();
	      });
	    };

	    return ColdObservable;
	  })(Observable);

	  /** Virtual time scheduler used for testing applications and libraries built using Reactive Extensions. */
	  Rx.TestScheduler = (function (__super__) {
	    inherits(TestScheduler, __super__);

	    function baseComparer(x, y) {
	      return x > y ? 1 : (x < y ? -1 : 0);
	    }

	    function TestScheduler() {
	      __super__.call(this, 0, baseComparer);
	    }

	    /**
	     * Schedules an action to be executed at the specified virtual time.
	     *
	     * @param state State passed to the action to be executed.
	     * @param dueTime Absolute virtual time at which to execute the action.
	     * @param action Action to be executed.
	     * @return Disposable object used to cancel the scheduled action (best effort).
	     */
	    TestScheduler.prototype.scheduleAbsolute = function (state, dueTime, action) {
	      dueTime <= this.clock && (dueTime = this.clock + 1);
	      return __super__.prototype.scheduleAbsolute.call(this, state, dueTime, action);
	    };
	    /**
	     * Adds a relative virtual time to an absolute virtual time value.
	     *
	     * @param absolute Absolute virtual time value.
	     * @param relative Relative virtual time value to add.
	     * @return Resulting absolute virtual time sum value.
	     */
	    TestScheduler.prototype.add = function (absolute, relative) {
	      return absolute + relative;
	    };
	    /**
	     * Converts the absolute virtual time value to a DateTimeOffset value.
	     *
	     * @param absolute Absolute virtual time value to convert.
	     * @return Corresponding DateTimeOffset value.
	     */
	    TestScheduler.prototype.toAbsoluteTime = function (absolute) {
	      return new Date(absolute).getTime();
	    };
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     *
	     * @param timeSpan TimeSpan value to convert.
	     * @return Corresponding relative virtual time value.
	     */
	    TestScheduler.prototype.toRelativeTime = function (timeSpan) {
	      return timeSpan;
	    };
	    /**
	     * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
	     *
	     * @param create Factory method to create an observable sequence.
	     * @param created Virtual time at which to invoke the factory to create an observable sequence.
	     * @param subscribed Virtual time at which to subscribe to the created observable sequence.
	     * @param disposed Virtual time at which to dispose the subscription.
	     * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
	     */
	    TestScheduler.prototype.startScheduler = function (createFn, settings) {
	      settings || (settings = {});
	      settings.created == null && (settings.created = ReactiveTest.created);
	      settings.subscribed == null && (settings.subscribed = ReactiveTest.subscribed);
	      settings.disposed == null && (settings.disposed = ReactiveTest.disposed);

	      var observer = this.createObserver(), source, subscription;

	      this.scheduleAbsolute(null, settings.created, function () {
	        source = createFn();
	        return disposableEmpty;
	      });

	      this.scheduleAbsolute(null, settings.subscribed, function () {
	        subscription = source.subscribe(observer);
	        return disposableEmpty;
	      });

	      this.scheduleAbsolute(null, settings.disposed, function () {
	        subscription.dispose();
	        return disposableEmpty;
	      });

	      this.start();

	      return observer;
	    };

	    /**
	     * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
	     * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */
	    TestScheduler.prototype.createHotObservable = function () {
	      var len = arguments.length, args;
	      if (Array.isArray(arguments[0])) {
	        args = arguments[0];
	      } else {
	        args = new Array(len);
	        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	      }
	      return new HotObservable(this, args);
	    };

	    /**
	     * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
	     * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */
	    TestScheduler.prototype.createColdObservable = function () {
	      var len = arguments.length, args;
	      if (Array.isArray(arguments[0])) {
	        args = arguments[0];
	      } else {
	        args = new Array(len);
	        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	      }
	      return new ColdObservable(this, args);
	    };

	    /**
	     * Creates a resolved promise with the given value and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} value The value to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which fulfills with the given value.
	     */
	    TestScheduler.prototype.createResolvedPromise = function (ticks, value) {
	      return new MockPromise(this, [Rx.ReactiveTest.onNext(ticks, value), Rx.ReactiveTest.onCompleted(ticks)]);
	    };

	    /**
	     * Creates a rejected promise with the given reason and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} reason The reason for rejection to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which rejects with the given reason.
	     */
	    TestScheduler.prototype.createRejectedPromise = function (ticks, reason) {
	      return new MockPromise(this, [Rx.ReactiveTest.onError(ticks, reason)]);
	    };

	    /**
	     * Creates an observer that records received notification messages and timestamps those.
	     * @return Observer that can be used to assert the timing of received notifications.
	     */
	    TestScheduler.prototype.createObserver = function () {
	      return new MockObserver(this);
	    };

	    return TestScheduler;
	  })(VirtualTimeScheduler);

	  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
	    inherits(AnonymousObservable, __super__);

	    // Fix subscriber to check for undefined or function returned to decorate as Disposable
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }

	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.__subscribe).call(self, ado);
	      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
	      ado.setDisposable(fixSubscriber(sub));
	    }

	    function AnonymousObservable(subscribe, parent) {
	      this.source = parent;
	      this.__subscribe = subscribe;
	      __super__.call(this);
	    }

	    AnonymousObservable.prototype._subscribe = function (o) {
	      var ado = new AutoDetachObserver(o), state = [ado, this];

	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.schedule(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    };

	    return AnonymousObservable;

	  }(Observable));

	  var AutoDetachObserver = (function (__super__) {
	    inherits(AutoDetachObserver, __super__);

	    function AutoDetachObserver(observer) {
	      __super__.call(this);
	      this.observer = observer;
	      this.m = new SingleAssignmentDisposable();
	    }

	    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

	    AutoDetachObserverPrototype.next = function (value) {
	      var result = tryCatch(this.observer.onNext).call(this.observer, value);
	      if (result === errorObj) {
	        this.dispose();
	        thrower(result.e);
	      }
	    };

	    AutoDetachObserverPrototype.error = function (err) {
	      var result = tryCatch(this.observer.onError).call(this.observer, err);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };

	    AutoDetachObserverPrototype.completed = function () {
	      var result = tryCatch(this.observer.onCompleted).call(this.observer);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };

	    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
	    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };

	    AutoDetachObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.m.dispose();
	    };

	    return AutoDetachObserver;
	  }(AbstractObserver));

	  var UnderlyingObservable = (function (__super__) {
	    inherits(UnderlyingObservable, __super__);
	    function UnderlyingObservable(m, u) {
	      this._m = m;
	      this._u = u;
	      __super__.call(this);
	    }

	    UnderlyingObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(this._m.getDisposable(), this._u.subscribe(o));
	    };

	    return UnderlyingObservable;
	  }(ObservableBase));

	  var GroupedObservable = (function (__super__) {
	    inherits(GroupedObservable, __super__);
	    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
	      __super__.call(this);
	      this.key = key;
	      this.underlyingObservable = !mergedDisposable ?
	        underlyingObservable :
	        new UnderlyingObservable(mergedDisposable, underlyingObservable);
	    }

	    GroupedObservable.prototype._subscribe = function (o) {
	      return this.underlyingObservable.subscribe(o);
	    };

	    return GroupedObservable;
	  }(Observable));

	  /**
	   *  Represents an object that is both an observable sequence as well as an observer.
	   *  Each notification is broadcasted to all subscribed observers.
	   */
	  var Subject = Rx.Subject = (function (__super__) {
	    inherits(Subject, __super__);
	    function Subject() {
	      __super__.call(this);
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.observers = [];
	      this.hasError = false;
	    }

	    addProperties(Subject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.observers.push(o);
	          return new InnerSubscription(this, o);
	        }
	        if (this.hasError) {
	          o.onError(this.error);
	          return disposableEmpty;
	        }
	        o.onCompleted();
	        return disposableEmpty;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onCompleted();
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.error = error;
	          this.hasError = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onNext(value);
	          }
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });

	    /**
	     * Creates a subject from the specified observer and observable.
	     * @param {Observer} observer The observer used to send messages to the subject.
	     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	     * @returns {Subject} Subject implemented using the given observer and observable.
	     */
	    Subject.create = function (observer, observable) {
	      return new AnonymousSubject(observer, observable);
	    };

	    return Subject;
	  }(Observable));

	  /**
	   *  Represents the result of an asynchronous operation.
	   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	   */
	  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
	    inherits(AsyncSubject, __super__);

	    /**
	     * Creates a subject that can only receive one value and that value is cached for all future observations.
	     * @constructor
	     */
	    function AsyncSubject() {
	      __super__.call(this);
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasValue = false;
	      this.observers = [];
	      this.hasError = false;
	    }

	    addProperties(AsyncSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);

	        if (!this.isStopped) {
	          this.observers.push(o);
	          return new InnerSubscription(this, o);
	        }

	        if (this.hasError) {
	          o.onError(this.error);
	        } else if (this.hasValue) {
	          o.onNext(this.value);
	          o.onCompleted();
	        } else {
	          o.onCompleted();
	        }

	        return disposableEmpty;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        checkDisposed(this);
	        return this.observers.length > 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	       */
	      onCompleted: function () {
	        var i, len;
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          var os = cloneArray(this.observers), len = os.length;

	          if (this.hasValue) {
	            for (i = 0; i < len; i++) {
	              var o = os[i];
	              o.onNext(this.value);
	              o.onCompleted();
	            }
	          } else {
	            for (i = 0; i < len; i++) {
	              os[i].onCompleted();
	            }
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the error.
	       * @param {Mixed} error The Error to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.hasError = true;
	          this.error = error;

	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	       * @param {Mixed} value The value to store in the subject.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        this.hasValue = true;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.error = null;
	        this.value = null;
	      }
	    });

	    return AsyncSubject;
	  }(Observable));

	  /**
	   *  Represents a value that changes over time.
	   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	   */
	  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
	    inherits(BehaviorSubject, __super__);
	    function BehaviorSubject(value) {
	      __super__.call(this);
	      this.value = value;
	      this.observers = [];
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasError = false;
	    }

	    addProperties(BehaviorSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.observers.push(o);
	          o.onNext(this.value);
	          return new InnerSubscription(this, o);
	        }
	        if (this.hasError) {
	          o.onError(this.error);
	        } else {
	          o.onCompleted();
	        }
	        return disposableEmpty;
	      },
	      /**
	       * Gets the current value or throws an exception.
	       * Value is frozen after onCompleted is called.
	       * After onError is called always throws the specified exception.
	       * An exception is always thrown after dispose is called.
	       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	       */
	      getValue: function () {
	          checkDisposed(this);
	          if (this.hasError) {
	              throw this.error;
	          }
	          return this.value;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onCompleted();
	        }

	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.hasError = true;
	        this.error = error;

	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onError(error);
	        }

	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onNext(value);
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.value = null;
	        this.error = null;
	      }
	    });

	    return BehaviorSubject;
	  }(Observable));

	  /**
	   * Represents an object that is both an observable sequence as well as an observer.
	   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	   */
	  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {

	    var maxSafeInteger = Math.pow(2, 53) - 1;

	    function createRemovableDisposable(subject, observer) {
	      return disposableCreate(function () {
	        observer.dispose();
	        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
	      });
	    }

	    inherits(ReplaySubject, __super__);

	    /**
	     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	     */
	    function ReplaySubject(bufferSize, windowSize, scheduler) {
	      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
	      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
	      this.scheduler = scheduler || currentThreadScheduler;
	      this.q = [];
	      this.observers = [];
	      this.isStopped = false;
	      this.isDisposed = false;
	      this.hasError = false;
	      this.error = null;
	      __super__.call(this);
	    }

	    addProperties(ReplaySubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        var so = new ScheduledObserver(this.scheduler, o), subscription = createRemovableDisposable(this, so);

	        this._trim(this.scheduler.now());
	        this.observers.push(so);

	        for (var i = 0, len = this.q.length; i < len; i++) {
	          so.onNext(this.q[i].value);
	        }

	        if (this.hasError) {
	          so.onError(this.error);
	        } else if (this.isStopped) {
	          so.onCompleted();
	        }

	        so.ensureActive();
	        return subscription;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        return this.observers.length > 0;
	      },
	      _trim: function (now) {
	        while (this.q.length > this.bufferSize) {
	          this.q.shift();
	        }
	        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
	          this.q.shift();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        var now = this.scheduler.now();
	        this.q.push({ interval: now, value: value });
	        this._trim(now);

	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onNext(value);
	          observer.ensureActive();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.error = error;
	        this.hasError = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onError(error);
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onCompleted();
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });

	    return ReplaySubject;
	  }(Observable));

	  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
	    inherits(AnonymousSubject, __super__);
	    function AnonymousSubject(observer, observable) {
	      this.observer = observer;
	      this.observable = observable;
	      __super__.call(this);
	    }

	    addProperties(AnonymousSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        return this.observable.subscribe(o);
	      },
	      onCompleted: function () {
	        this.observer.onCompleted();
	      },
	      onError: function (error) {
	        this.observer.onError(error);
	      },
	      onNext: function (value) {
	        this.observer.onNext(value);
	      }
	    });

	    return AnonymousSubject;
	  }(Observable));

	  /**
	  * Used to pause and resume streams.
	  */
	  Rx.Pauser = (function (__super__) {
	    inherits(Pauser, __super__);
	    function Pauser() {
	      __super__.call(this);
	    }

	    /**
	     * Pauses the underlying sequence.
	     */
	    Pauser.prototype.pause = function () { this.onNext(false); };

	    /**
	    * Resumes the underlying sequence.
	    */
	    Pauser.prototype.resume = function () { this.onNext(true); };

	    return Pauser;
	  }(Subject));

	  if (true) {
	    root.Rx = Rx;

	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Rx;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = Rx).Rx = Rx;
	    } else {
	      freeExports.Rx = Rx;
	    }
	  } else {
	    // in a browser or Rhino
	    root.Rx = Rx;
	  }

	  // All code before this point will be filtered from stack traces.
	  var rEndingLine = captureLine();

	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);