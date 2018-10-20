let minfin = require('./minfin');
let fg = require('./fg');
let bankGov = require('./bank.gov');
let _ = require('lodash');
let utils = require('./utils');

// minfin.fetchAndSaveAllHtml();
// fg.fetchAndSaveAllHtml();
// bankGov.fetchAndSaveAllHtml();

// compareBanks();
compareGovBanks();
// console.log(bankGov.getBanks());

function compareBanks() {
    const bgBanks = bankGov.getBanks();
    const fgBanks = fg.getBanks();
    const mfBanks = minfin.getBanks();
    const bgBankIds = Object.keys(bgBanks);
    const fgBankIds = Object.keys(fgBanks);
    const mfBanksIds = Object.keys(mfBanks);
    console.log(bgBankIds.length);
    console.log(fgBankIds.length);
    console.log(mfBanksIds.length);
    console.log(_.intersection(bgBankIds, fgBankIds, mfBanksIds).length);
    console.log(_.union(bgBankIds, fgBankIds, mfBanksIds).length);

    const banks = _.union(bgBankIds, fgBankIds, mfBanksIds).sort().map(id => {
        return {
            id: id,
            bg: (bgBanks[id] || {}).name,
            fg: (fgBanks[id] || {}).name,
            mf: mfBanks[id],
            site: (fgBanks[id] || {}).site
        };
    });

    utils.writeFile('../public/banks.json', utils.toJson(banks));
}

function compareGovBanks() {
    const bgBanks = bankGov.getBanks();
    const fgBanks = fg.getBanks();
    const bgBankIds = Object.keys(bgBanks);
    const fgBankIds = Object.keys(fgBanks);
    console.log(bgBankIds.length);
    console.log(fgBankIds.length);
    console.log(_.intersection(bgBankIds, fgBankIds).length);
    console.log(_.union(bgBankIds, fgBankIds).length);
}