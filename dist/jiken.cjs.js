'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
class Jiken {
    /**
     * Creates new instance.
     */
    constructor() {
        this._events = {};

        /**
         * Alias to [on]{@link Jiken#on}.
         *
         * @memberof Jiken#
         * @method addListener
         *
         * @param {Any} name Event name.
         * @param {Function} listener Event listener to invoke.
         *
         * @returns {this} Itself for chain.
         */
        this.addListener = this.on;
        this.sync();
    }

    /**
     * Sets synchronous execution for listeners.
     * @returns {this} Itself for chain.
     */
    sync() {
        this._invoke_listener = (listener, args) => listener.apply(this, args);
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
    not_sync(timeout) {
        this._invoke_listener = (listener, args) => setTimeout(() => listener.apply(this, args), timeout || 0);
        return this;
    }

    /**
     * Validator of listener. Throws if invalid.
     * @private
     * @param {Function} listener Event listener to invoke.
     * @returns {void}
     */
    _throw_on_invalid_listener(listener) {
        if (typeof listener !== "function") throw new TypeError("listener must be a function!");
    }

    /**
     * Initializes event array if required
     * @private
     * @param {Any} name Event name.
     * @returns {this} Itself for chain.
     */
    _init_event_if(name) {
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
    emit(name, ...args) {
        const event = this._events[name];

        //We should delete even completely once all listeners are removed.
        if (!event) return false;

        for (let idx = 0; idx < event.length; idx += 1) {
            let listener = event[idx];
            if (listener.once) {
                listener = listener.inner;
                event.splice(idx, 1);
                idx -= 1;

                this._invoke_listener(listener, args);
                if (event.length === 0) {
                    delete this._events[name];
                    break;
                }
            }
            else this._invoke_listener(listener, args);
        }

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
    trigger(name, ...args) {
        this.emit(name, ...args);
        return this;
    }

    /**
     * Retrieves array of events for which there are registered listeners.
     *
     * @returns {Array} Array of event names.
     */
    eventNames() {
        return Object.keys(this._events);
    }

    /**
     * Retrieves number of registered listeners for the event.
     *
     * @param {Any} name Event name.
     *
     * @returns {Integer} Number of listeners.
     */
    listenerCount(name) {
        return this._events[name] ? this._events[name].length : 0;
    }

    /**
     * Retrieves array of listeners for the event.
     *
     * @param {Any} name Event name.
     *
     * @returns {Array} Listeners.
     */
    listeners(name) {
        const event = this._events[name];

        if (event) {
            return event.map((listener) => listener.once ? listener.inner : listener);
        }
        else {
            return [];
        }
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
    on(name, listener) {
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
    prependListener(name, listener) {
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
    once(name, listener) {
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
    prependOnceListener(name, listener) {
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
    removeAllListeners(name) {
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
    removeListener(name, listener) {
        this._throw_on_invalid_listener(listener);

        const event = this._events[name];
        if (event) {
            for (let idx = 0; idx < event.length; idx += 1) {
                const event_listener = event[idx];
                if ((event_listener.once && event_listener.inner === listener) || event_listener === listener) {
                    event.splice(idx, 1);
                    if (event.length === 0) delete this._events[name];
                    return this;
                }
            }
        }

        return this;
    }
}

exports.Jiken = Jiken;
