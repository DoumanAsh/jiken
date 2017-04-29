(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.jiken = global.jiken || {})));
}(this, (function (exports) { 'use strict';

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * Browser EventEmitter
 *
 * Mimics API of node.js [EventEmitter]{@link https://nodejs.org/api/events.html}
 * And gives you some extra features.
 *
 * ## Usage
 *
 * ### Extend class:
 * ```
   const Jiken = require('jiken').Jiken;
   class MySuperEmitter extends Jiken {
       constructor() {
           super()
           this.on('some-event', () => console.log('trigger some-event'));
       }
   }

   const emitter = new MySuperEmitter();
   emitter.emit('some-event');
 * ```
 *
 * ### Use instance:
 * ```
   const Jiken = require('jiken').Jiken;

   const test = new Jiken();

   test.on('lolka', () => console.log('lol'));
 * ```
 */

var Jiken = function () {
    /**
     * Creates new instance.
     */
    function Jiken() {
        

        this._events = {};

        this.addListener = this.on;
        this.sync();
    }

    /**
     * Sets synchronous execution for listeners.
     * @returns {this} Itself for chain.
     */


    createClass(Jiken, [{
        key: "sync",
        value: function sync() {
            var _this = this;

            this._invoke_listener = function (listener, args) {
                return listener.apply(_this, args);
            };
            return this;
        }

        /**
         * Sets asynchronous execution for listeners.
         *
         * Under hood it uses [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} method to schedule execution of listeners.
         * While it is likely that order of execution will be preserved, it is not guaranteed.
         * Therefore you SHOULD not rely on your listeners to be executed in order they are set.
         *
         * @param {Integer} timeout Timeout. Optional. Default is 0.
         * @returns {this} Itself for chain.
         */

    }, {
        key: "not_sync",
        value: function not_sync(timeout) {
            var _this2 = this;

            this._invoke_listener = function (listener, args) {
                return setTimeout(function () {
                    return listener.apply(_this2, args);
                }, timeout || 0);
            };
            return this;
        }

        /**
         * Validator of listener. Throws if invalid.
         * @private
         * @param {Function} listener Event listener to invoke.
         * @returns {void}
         */

    }, {
        key: "_throw_on_invalid_listener",
        value: function _throw_on_invalid_listener(listener) {
            if (typeof listener !== "function") throw new TypeError("listener must be a function!");
        }

        /**
         * Initializes event array if required
         * @private
         * @param {Any} name Event name.
         * @returns {this} Itself for chain.
         */

    }, {
        key: "_init_event_if",
        value: function _init_event_if(name) {
            if (this._events[name] === undefined) this._events[name] = [];

            return this;
        }

        /**
         * Invokes event.
         *
         * @param {Any} name Event name.
         * @param {Any} args Arguments for listener.
         * @returns {Boolean} True if there are any listeners. False otherwise.
         */

    }, {
        key: "emit",
        value: function emit(name) {
            var event = this._events[name];

            if (!event || event.length === 0) return false;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            for (var idx = 0; idx < event.length; idx += 1) {
                var listener = event[idx];
                if (listener.once) {
                    listener = listener.inner;
                    event.splice(idx, 1);
                    idx -= 1;
                }

                this._invoke_listener(listener, args);
            }

            if (event.length === 0) delete this._events[name];

            return true;
        }

        /**
         * Invokes event.
         *
         * The same as [emit]{@link Jiken#emit}, but returns self for chain.
         *
         * @param {Any} name Event name.
         * @param {Any} args Arguments for listener.
         * @returns {this} Itself for chain.
         */

    }, {
        key: "trigger",
        value: function trigger(name) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            this.emit.apply(this, [name].concat(args));
            return this;
        }

        /**
         * Retrieves array of events for which there are registered listeners.
         *
         * @returns {Array} Array of event names.
         */

    }, {
        key: "eventNames",
        value: function eventNames() {
            return Object.keys(this._events);
        }

        /**
         * Retrieves number of registered listeners for the event.
         *
         * @param {Any} name Event name.
         *
         * @returns {Integer} Number of listeners.
         */

    }, {
        key: "listenerCount",
        value: function listenerCount(name) {
            return this._events[name] ? this._events[name].length : 0;
        }

        /**
         * Retrieves array of listeners for the event.
         *
         * @param {Any} name Event name.
         *
         * @returns {Array} Listeners.
         */

    }, {
        key: "listeners",
        value: function listeners(name) {
            return this._events[name] || [];
        }

        /**
         * Registers new event listener.
         *
         * Note that no check are made.
         * Listener is appended regardless if it is present or not.
         *
         * @param {Any} name Event name.
         * @param {Function} listener Event listener to invoke.
         *
         * @returns {this} Itself for chain.
         */

    }, {
        key: "on",
        value: function on(name, listener) {
            this._throw_on_invalid_listener(listener);

            this._init_event_if(name);

            this._events[name].push(listener);

            return this;
        }

        /**
         * Registers new event listener and  adds it before any other.
         *
         * @param {Any} name Event name.
         * @param {Function} listener Event listener to invoke.
         *
         * @returns {this} Itself for chain.
         */

    }, {
        key: "prependListener",
        value: function prependListener(name, listener) {
            this._throw_on_invalid_listener(listener);

            this._init_event_if(name);

            this._events[name].unshift(listener);

            return this;
        }

        /**
         * Registers new event listener to be executed ONCE.
         *
         * @param {Any} name Event name.
         * @param {Function} listener Event listener to invoke.
         *
         * @returns {this} Itself for chain.
         */

    }, {
        key: "once",
        value: function once(name, listener) {
            this._throw_on_invalid_listener(listener);

            this._init_event_if(name);

            this._events[name].push({
                once: true,
                inner: listener
            });

            return this;
        }

        /**
         * Registers new event listener to be executed ONCE and adds it before any other.
         *
         * @param {Any} name Event name.
         * @param {Function} listener Event listener to invoke.
         *
         * @returns {this} Itself for chain.
         */

    }, {
        key: "prependOnceListener",
        value: function prependOnceListener(name, listener) {
            this._throw_on_invalid_listener(listener);

            this._init_event_if(name);

            this._events[name].unshift({
                once: true,
                inner: listener
            });

            return this;
        }

        /**
         * Removes all listeners for all events or particular one..
         *
         * @param {Any} name Event name. Optional.
         *
         * @returns {this} Itself for chain.
         */

    }, {
        key: "removeAllListeners",
        value: function removeAllListeners(name) {
            name === undefined ? this._events = {} : delete this._events[name];

            return this;
        }

        /**
         * Removes particular listener for the event.
         *
         * It removes at most one listener.
         *
         * @param {Any} name Event name.
         * @param {Function} listener Event listener to invoke.
         *
         * @returns {this} Itself for chain.
         */

    }, {
        key: "removeListener",
        value: function removeListener(name, listener) {
            this._throw_on_invalid_listener(listener);

            var event = this._events[name];
            if (event) {
                for (var idx = 0; idx < event.length; idx += 1) {
                    var event_listener = event[idx];
                    if (event_listener.once && event_listener.inner === listener || event_listener === listener) {
                        event.splice(idx, 1);
                        return this;
                    }
                }
            }

            return this;
        }
    }]);
    return Jiken;
}();

exports.Jiken = Jiken;

Object.defineProperty(exports, '__esModule', { value: true });

})));
