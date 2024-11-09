const path = require('path');

module.exports = {
    entry: './src/quickjs.js',
    output: {
        filename: 'quickjs.js',
        path: path.resolve(__dirname, 'docs/dist'),
    },
    mode: 'production'
};
