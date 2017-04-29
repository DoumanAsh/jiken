<a name="Jiken"></a>

# Jiken
Browser EventEmitter

Mimics API of node.js [EventEmitter](https://nodejs.org/api/events.html)
And gives you some extra features.

## Usage

### Extend class:
```
   const Jiken = require('jiken').Jiken;
   class MySuperEmitter extends Jiken {
       constructor() {
           super()
           this.on('some-event', () => console.log('trigger some-event'));
       }
   }

   const emitter = new MySuperEmitter();
   emitter.emit('some-event');
```

### Use instance:
```
   const Jiken = require('jiken').Jiken;

   const test = new Jiken();

   test.on('lolka', () => console.log('lol'));
```

**Kind**: global class  

* [Jiken](#Jiken)
    * [new Jiken()](#new_Jiken_new)
    * [.sync()](#Jiken+sync) ⇒ <code>this</code>
    * [.not_sync(timeout)](#Jiken+not_sync) ⇒ <code>this</code>
    * [.emit(name, ...args)](#Jiken+emit) ⇒ <code>Boolean</code>
    * [.trigger(name, ...args)](#Jiken+trigger) ⇒ <code>this</code>
    * [.eventNames()](#Jiken+eventNames) ⇒ <code>Array</code>
    * [.listenerCount(name)](#Jiken+listenerCount) ⇒ <code>Integer</code>
    * [.listeners(name)](#Jiken+listeners) ⇒ <code>Array</code>
    * [.on(name, listener)](#Jiken+on) ⇒ <code>this</code>
    * [.prependListener(name, listener)](#Jiken+prependListener) ⇒ <code>this</code>
    * [.once(name, listener)](#Jiken+once) ⇒ <code>this</code>
    * [.prependOnceListener(name, listener)](#Jiken+prependOnceListener) ⇒ <code>this</code>
    * [.removeAllListeners(name)](#Jiken+removeAllListeners) ⇒ <code>this</code>
    * [.removeListener(name, listener)](#Jiken+removeListener) ⇒ <code>this</code>

<a name="new_Jiken_new"></a>

## new Jiken()
Creates new instance.

<a name="Jiken+sync"></a>

## jiken.sync() ⇒ <code>this</code>
Sets synchronous execution for listeners.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  
<a name="Jiken+not_sync"></a>

## jiken.not_sync(timeout) ⇒ <code>this</code>
Sets asynchronous execution for listeners.

Under hood it uses [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) method to schedule execution of listeners.
While it is likely that order of execution will be preserved, it is not guaranteed.
Therefore you SHOULD not rely on your listeners to be executed in order they are set.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| timeout | <code>Integer</code> | Timeout. Optional. Default is 0. |

<a name="Jiken+emit"></a>

## jiken.emit(name, ...args) ⇒ <code>Boolean</code>
Invokes event.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>Boolean</code> - True if there are any listeners. False otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| ...args | <code>Any</code> | Arguments for listener. |

<a name="Jiken+trigger"></a>

## jiken.trigger(name, ...args) ⇒ <code>this</code>
Invokes event.

The same as [emit](#Jiken+emit), but returns self for chain.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| ...args | <code>Any</code> | Arguments for listener. |

<a name="Jiken+eventNames"></a>

## jiken.eventNames() ⇒ <code>Array</code>
Retrieves array of events for which there are registered listeners.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>Array</code> - Array of event names.  
<a name="Jiken+listenerCount"></a>

## jiken.listenerCount(name) ⇒ <code>Integer</code>
Retrieves number of registered listeners for the event.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>Integer</code> - Number of listeners.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |

<a name="Jiken+listeners"></a>

## jiken.listeners(name) ⇒ <code>Array</code>
Retrieves array of listeners for the event.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>Array</code> - Listeners.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |

<a name="Jiken+on"></a>

## jiken.on(name, listener) ⇒ <code>this</code>
Registers new event listener.

Note that no check are made.
Listener is appended regardless if it is present or not.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| listener | <code>function</code> | Event listener to invoke. |

<a name="Jiken+prependListener"></a>

## jiken.prependListener(name, listener) ⇒ <code>this</code>
Registers new event listener and  adds it before any other.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| listener | <code>function</code> | Event listener to invoke. |

<a name="Jiken+once"></a>

## jiken.once(name, listener) ⇒ <code>this</code>
Registers new event listener to be executed ONCE.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| listener | <code>function</code> | Event listener to invoke. |

<a name="Jiken+prependOnceListener"></a>

## jiken.prependOnceListener(name, listener) ⇒ <code>this</code>
Registers new event listener to be executed ONCE and adds it before any other.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| listener | <code>function</code> | Event listener to invoke. |

<a name="Jiken+removeAllListeners"></a>

## jiken.removeAllListeners(name) ⇒ <code>this</code>
Removes all listeners for all events or particular one..

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. Optional. |

<a name="Jiken+removeListener"></a>

## jiken.removeListener(name, listener) ⇒ <code>this</code>
Removes particular listener for the event.

It removes at most one listener.

**Kind**: instance method of [<code>Jiken</code>](#Jiken)  
**Returns**: <code>this</code> - Itself for chain.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>Any</code> | Event name. |
| listener | <code>function</code> | Event listener to invoke. |

