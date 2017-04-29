"use strict";

import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-re';

export default {
    entry: 'src/jiken.js',
    format: 'es',
    moduleName: 'jiken',
    plugins: [
        eslint(),
        babel(),
        replace({
            patterns: [
                {
                    match: /jiken.js$/,
                    test: 'babelHelpers.classCallCheck(this, Jiken);',
                    replace: ''
                }
            ]
        })
    ],
    targets: [
        { dest: 'dist/jiken.cjs.js', format: 'cjs' },
        { dest: 'dist/jiken.js', format: 'umd' },
    ]
};
