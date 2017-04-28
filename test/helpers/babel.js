import babel_register from 'babel-register';

babel_register({
    babelrc: false,
    presets: ["es2015"],
    plugins: ["transform-object-rest-spread"]
});
