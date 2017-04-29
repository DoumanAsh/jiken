"use strict";

import test from 'ava';
import './helpers/babel.js';
import {Jiken} from '../src/jiken.js';

test('Jiken instance validation', t => {
    const jiken = new Jiken();
    t.is(jiken.on, jiken.addListener);
    t.deepEqual(jiken._events, {});
});

test('Jiken add events', async t => {
    const jiken = new Jiken();
    const event = {
        name: "waifu",
        listener: function() { }
    };

    const event2 = {
        name: "waifu2",
        listener: function() { }
    };

    ///Add some listeners
    jiken.on(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 1);
    t.is(jiken.listenerCount(event.name), 1);
    t.is(jiken._events[event.name][0], event.listener);
    t.deepEqual(jiken.eventNames(), [event.name]);
    t.deepEqual(jiken.listeners(event.name), [event.listener]);

    jiken.on(event2.name, event2.listener);
    t.true(event2.name in jiken._events);
    t.is(jiken._events[event2.name].length, 1);
    t.is(jiken.listenerCount(event2.name), 1);
    t.is(jiken._events[event2.name][0], event2.listener);
    t.deepEqual(jiken.eventNames(), [event.name, event2.name]);
    t.deepEqual(jiken.listeners(event2.name), [event2.listener]);

    jiken.on(event.name, event2.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 2);
    t.is(jiken.listenerCount(event.name), 2);
    t.is(jiken._events[event.name][1], event2.listener);
    t.deepEqual(jiken.eventNames(), [event.name, event2.name]);
    t.deepEqual(jiken.listeners(event.name), [event.listener, event2.listener]);

    jiken.once(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 3);
    t.is(jiken.listenerCount(event.name), 3);
    t.deepEqual(jiken._events[event.name][2], {once: true, inner: event.listener});
    t.deepEqual(jiken.eventNames(), [event.name, event2.name]);
    t.deepEqual(jiken.listeners(event.name), [event.listener, event2.listener, event.listener]);

    jiken.prependListener(event.name, event2.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 4);
    t.is(jiken.listenerCount(event.name), 4);
    t.deepEqual(jiken._events[event.name][0], event2.listener);
    t.deepEqual(jiken.eventNames(), [event.name, event2.name]);
    t.deepEqual(jiken.listeners(event.name), [event2.listener, event.listener, event2.listener, event.listener]);

    jiken.prependOnceListener(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 5);
    t.is(jiken.listenerCount(event.name), 5);
    t.deepEqual(jiken._events[event.name][0], {once:true, inner:event.listener});
    t.deepEqual(jiken.eventNames(), [event.name, event2.name]);
    t.deepEqual(jiken.listeners(event.name), [event.listener, event2.listener, event.listener, event2.listener, event.listener]);


    ///Try to work with bad listeners
    let error = await t.throws(() => jiken.on(event.name, 'lolka'), TypeError);
    t.is(error.message, "listener must be a function!");
    error = await t.throws(() => jiken.prependListener(event.name, 'lolka'), TypeError);
    t.is(error.message, "listener must be a function!");
    error = await t.throws(() => jiken.once(event.name, 'lolka'), TypeError);
    t.is(error.message, "listener must be a function!");
    error = await t.throws(() => jiken.prependOnceListener(event.name, 'lolka'), TypeError);
    t.is(error.message, "listener must be a function!");
    error = await t.throws(() => jiken.removeListener(event.name, 'lolka'), TypeError);
    t.is(error.message, "listener must be a function!");

    ///Remove listeners
    jiken.removeListener(event.name, event.listener);
    jiken.removeListener(event.name, event2.listener);
    jiken.removeListener(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 2);
    t.is(jiken.listenerCount(event.name), 2);
    t.deepEqual(jiken.listeners(event.name), [event2.listener, event.listener]);

    jiken.removeListener(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 1);
    t.is(jiken.listenerCount(event.name), 1);
    t.deepEqual(jiken.listeners(event.name), [event2.listener]);

    jiken.removeListener(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 1);
    t.is(jiken.listenerCount(event.name), 1);
    t.deepEqual(jiken.listeners(event.name), [event2.listener]);

    jiken.removeAllListeners(event2.name);
    t.false(event2.name in jiken._events);
    t.deepEqual(jiken.listeners(event2.name), []);

    jiken.on(event2.name, event2.listener);
    t.true(event2.name in jiken._events);
    t.is(jiken._events[event2.name].length, 1);
    t.is(jiken.listenerCount(event2.name), 1);
    t.is(jiken._events[event2.name][0], event2.listener);
    t.deepEqual(jiken.eventNames(), [event.name, event2.name]);

    jiken.removeAllListeners();
    t.false(event.name in jiken._events);
    t.false(event2.name in jiken._events);
    t.deepEqual(jiken.listeners(event.name), []);
    t.deepEqual(jiken.listeners(event2.name), []);

    //Should do nothing
    jiken.removeListener(event2.name, event2.listener);
});

test.cb('Jiken fire event async', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.not_sync(1);
    jiken.on(event.name, event.listener);

    t.true(jiken.emit(event.name, args[0], args[1], args[2]));
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 1);
    t.is(jiken.listenerCount(event.name), 1);
    t.is(jiken._events[event.name][0], event.listener);
    t.deepEqual(jiken.eventNames(), [event.name]);

});

test.cb('Jiken fire events async reverse order', t => {
    let first_called = false;
    const jiken = new Jiken();
    const event1 = {
        name: "waifu1",
        listener: function() {
            first_called = true;
            t.pass();
            t.end();
        }
    };
    const event2 = {
        name: "waifu2",
        listener: function() {
            t.false(first_called);
            t.pass();
        }
    };

    jiken.on(event1.name, event1.listener)
         .on(event2.name, event2.listener)
         .not_sync(5)
         .trigger(event1.name)
         .not_sync(2)
         .trigger(event2.name);

});

test.cb('Jiken fire events async order', t => {
    let first_called = false;
    const jiken = new Jiken();
    const event1 = {
        name: "waifu1",
        listener: function() {
            first_called = true;
            t.pass();
        }
    };
    const event2 = {
        name: "waifu2",
        listener: function() {
            t.true(first_called);
            t.pass();
            t.end();
        }
    };

    jiken.on(event1.name, event1.listener)
         .on(event2.name, event2.listener)
         .not_sync(1)
         .trigger(event1.name)
         .not_sync(2)
         .trigger(event2.name);
});

test.cb('Jiken trigger event sync', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.on(event.name, event.listener);

    jiken.trigger(event.name, args[0], args[1], args[2]);
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 1);
    t.is(jiken.listenerCount(event.name), 1);
    t.is(jiken._events[event.name][0], event.listener);
    t.deepEqual(jiken.eventNames(), [event.name]);
});

test.cb('Jiken fire event sync', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.on(event.name, event.listener);

    t.true(jiken.emit(event.name, args[0], args[1], args[2]));
    t.true(event.name in jiken._events);
    t.is(jiken._events[event.name].length, 1);
    t.is(jiken.listenerCount(event.name), 1);
    t.is(jiken._events[event.name][0], event.listener);
    t.deepEqual(jiken.eventNames(), [event.name]);
});

test.cb('Jiken fire event once async', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.not_sync();
    jiken.once(event.name, event.listener);

    t.true(jiken.emit(event.name, args[0], args[1], args[2]));
    t.false(event.name in jiken._events);
    t.deepEqual(jiken.eventNames(), []);
    t.is(jiken.listenerCount(event.name), 0);
    t.false(jiken.emit(event.name, args[0], args[1], args[2]));
});

test.cb('Jiken fire event once sync', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.once(event.name, event.listener);

    t.true(jiken.emit(event.name, args[0], args[1], args[2]));
    t.false(event.name in jiken._events);
    t.deepEqual(jiken.eventNames(), []);
    t.is(jiken.listenerCount(event.name), 0);
    t.false(jiken.emit(event.name, args[0], args[1], args[2]));
});

test.cb('Jiken trigger event once sync', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.once(event.name, event.listener);

    jiken.trigger(event.name, args[0], args[1], args[2]);
    t.false(event.name in jiken._events);
    t.deepEqual(jiken.eventNames(), []);
    t.is(jiken.listenerCount(event.name), 0);
    t.false(jiken.emit(event.name, args[0], args[1], args[2]));
});

test.cb('Jiken trigger 2 events once sync', t => {
    const jiken = new Jiken();
    const args = [1, 2, 3];
    const event = {
        name: "waifu",
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
        }
    };
    const event2 = {
        name: event.name,
        listener: function(arg1, arg2) {
            t.is(arg1, args[0]);
            t.is(arg2, args[1]);
            t.pass();
            t.end();
        }
    };

    jiken.once(event.name, event.listener);
    jiken.on(event2.name, event2.listener);

    jiken.trigger(event.name, args[0], args[1], args[2]);
    t.true(event.name in jiken._events);
    t.true(event2.name in jiken._events);
    t.is(jiken.listenerCount(event.name), 1);
    t.is(jiken.listenerCount(event2.name), 1);
    t.deepEqual(jiken.eventNames(), [event2.name]);

    jiken.removeListener(event2.name, event2.listener);
    t.false(event.name in jiken._events);
    t.false(event2.name in jiken._events);
    t.is(jiken.listenerCount(event2.name), 0);
    t.deepEqual(jiken.eventNames(), []);

    jiken.once(event.name, event.listener);
    t.true(event.name in jiken._events);
    t.is(jiken.listenerCount(event.name), 1);
    t.deepEqual(jiken.eventNames(), [event.name]);

    t.true(jiken.emit(event.name, args[0], args[1], args[2]));
    t.false(event.name in jiken._events);
    t.is(jiken.listenerCount(event.name), 0);
    t.deepEqual(jiken.eventNames(), []);
});
