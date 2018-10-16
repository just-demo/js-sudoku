let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');

writeFile('./json/test.json', JSON.stringify({"abc": "333"}));

console.log(readFile('./json/test.json'));

function writeFile(file, data) {
    mkdirp.sync(path.dirname(file));
    fs.writeFileSync(file, data, 'utf8');
}

function readFile(file) {
    return fs.readFileSync(file, 'utf8');
}
