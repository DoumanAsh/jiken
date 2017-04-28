'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
 */

var Jiken = function () {
    /**
     * Creates new instance.
     */
    function Jiken() {
        

        this._events = {};

        this.addListener = this.on;
    }

    /**
     * Validator of listener. Throws if invalid.
     * @private
     * @param {Function} listener Event listener to invoke.
     * @returns {void}
     */


    createClass(Jiken, [{
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

                listener.apply(this, args);
            }

            if (event.length === 0) delete this._events[name];

            return true;
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
         * @note It removes at most one listener.
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
