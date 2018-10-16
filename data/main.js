let utils = require('./utils');
let minfin = require('./minfin');

// utils.writeFile('./json/test.json', JSON.stringify({"abc": "333"}));
// console.log(utils.readFile('./json/test.json'));
// console.log(utils.readURL('https://minfin.com.ua/ua/banks/rating/'));

// console.log(htmlMinfin.htmlBanksFile());

minfin.fetchAndSaveAllHtml();