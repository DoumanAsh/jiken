"use strict";
const path = require('path');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown')

const src_dir = path.join(__dirname, '..', 'src', 'jiken.js')
const options = {
    files: src_dir,
    "heading-depth": 1
};
const result_file_path = path.join(__dirname, '..', 'docs', 'API.md');
const result_file = fs.createWriteStream(result_file_path);
jsdoc2md.render(options).then((output) => {
    result_file.write(output);
});
