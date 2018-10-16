let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');

module.exports = {

    writeFile: function(file, data) {
        mkdirp.sync(path.dirname(file));
        fs.writeFileSync(file, data, 'utf8');
    },

    readFile: function(file) {
        return fs.readFileSync(file, 'utf8');
    }
};