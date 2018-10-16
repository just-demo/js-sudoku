let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');
let request = require('sync-request');

module.exports = {

    writeFile: function(file, data) {
        mkdirp.sync(path.dirname(file));
        fs.writeFileSync(file, data, 'utf8');
    },

    readFile: function(file) {
        return fs.readFileSync(file, 'utf8');
    },

    readURL: function(url) {
        return request('GET', url, {
            headers: {
                'User-Agent': 'javascript'
            }
        }).getBody('utf8');
    }
};