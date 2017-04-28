# 事件(jiken)

[![Build Status](https://travis-ci.org/DoumanAsh/jiken.svg?branch=master)](https://travis-ci.org/DoumanAsh/jiken)
[![Coverage Status](https://coveralls.io/repos/github/DoumanAsh/jiken/badge.svg?branch=master)](https://coveralls.io/github/DoumanAsh/jiken?branch=master)
[![Package version](https://img.shields.io/npm/v/jiken.svg)](https://npmjs.org/package/jiken)

Simple EventEmitter for Browser.

## Documentation

* [API](https://doumanash.github.io/jiken)

## Overview

This package's goal is to emulate node.js EventEmitter.

### Install

#### npm

```
npm install jiken
```

#### Browser

Alternatevly you can grab built copy from repository:
```
<script src="https://raw.githubusercontent.com/DoumanAsh/jiken/master/dist/jiken.min.js">
```

### Usage

#### Extend Class

```js
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

#### Directly Create Instance

```js
const Jiken = require('jiken').Jiken;

const test = new Jiken();

test.on('lolka', () => console.log('lol'));
test.emit('lolka');
```
