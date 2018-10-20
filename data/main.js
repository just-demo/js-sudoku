let minfin = require('./minfin');
let fg = require('./fg');
let bankGov = require('./bank.gov');
let _ = require('lodash');
let utils = require('./utils');

// minfin.fetchAndSaveAllHtml();
// fg.fetchAndSaveAllHtml();
// bankGov.fetchAndSaveAllHtml();
// compareBanks();
console.log(bankGov.getBanks());

function compareBanks() {
    const fgBanks = fg.getBanks();
    const mfBanks = minfin.getBanks();
    const fgBankIds = Object.keys(fgBanks);
    const mfBanksIds = Object.keys(mfBanks);
    console.log(fgBankIds.length);
    console.log(mfBanksIds.length);
    console.log(_.intersection(fgBankIds, mfBanksIds).length);
    console.log(_.union(fgBankIds, mfBanksIds).length);

    const banks = _.union(fgBankIds, mfBanksIds).sort().map(id => {
        return {
            id: id,
            fg: (fgBanks[id] || {}).name,
            mf: mfBanks[id],
            site: (fgBanks[id] || {}).site
        };
    });

    utils.writeFile('./combined/banks.json', utils.toJson(banks));
}