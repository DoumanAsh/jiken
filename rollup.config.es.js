"use strict";
import base from './rollup.config.js';

base.plugins.splice(-2);
base.targets = [
    { dest: 'dist/jiken.es.js', format: 'es' },
]

export default base
