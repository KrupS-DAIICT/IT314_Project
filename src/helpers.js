// helpers.js

const handlebars = require('handlebars');

handlebars.registerHelper('equal', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

module.exports = handlebars;