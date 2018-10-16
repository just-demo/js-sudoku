let utils = require('./utils');

utils.writeFile('./json/test.json', JSON.stringify({"abc": "333"}));

console.log(utils.readFile('./json/test.json'));
