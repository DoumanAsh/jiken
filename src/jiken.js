"use strict";

/**
 * Browser EventEmitter
 */
class Jiken {
    /**
     * Creates new instance.
     */
    constructor() {
        this._events = {};

        this.addListener = this.on;
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

        if (!event || event.length === 0) return false;

        for (let idx = 0; idx < event.length; idx += 1) {
            let listener = event[idx];
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
     * @note It removes at most one listener.
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
                    return this;
                }
            }
        }

        return this;
    }
}

export {Jiken};
