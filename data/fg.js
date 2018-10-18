let utils = require('./utils');
let path = require('path');

module.exports = {
    getBanks: function() {
        const banks = {};
        utils.fromJson(utils.readFile(this.jsonActiveBanksFile())).forEach(bank => {
            const id = bank.toLowerCase();
            if (banks[id]) {
                console.log(id + ': ' + bank + ' != ' + banks[id]);
            }
            banks[id] = bank;
        });

        utils.fromJson(utils.readFile(this.jsonNotPayingBanksFile())).forEach(bank => {
            const id = bank.name.toLowerCase();
            if (banks[id]) {
                console.log(id + ': ' + bank.name + ' != ' + banks[id]);
            }
            banks[id] = bank.name;
        });
        return banks;
    },

    ////////// html \\\\\\\\\\
    fetchAndSaveAllHtml: function(){
        // this.fetchAndSaveActiveBanks();
        // this.extractAndSaveActiveBanks();
        // this.fetchAndSaveNotPayingBanks();
        // this.extractAndSaveNotPayingBanks();
        this.fetchAndSaveBankDetails();
    },

    fetchAndSaveActiveBanks: function () {
        utils.writeFile(this.htmlActiveBanksFile(), utils.readURL('http://www.fg.gov.ua/uchasnyky-fondu'));
    },

    fetchAndSaveNotPayingBanks: function () {
        utils.writeFile(this.htmlNotPayingBanksFile(), utils.readURL('http://www.fg.gov.ua/not-paying'));
    },

    fetchAndSaveBankDetails: function () {
        this.extractNotPayingBanks().forEach(bank => {
            console.log(bank.name);
            const file = this.htmlBankFile(this.buildBankId(bank.name.toLowerCase()));
            if (!utils.fileExists(file)) {
                utils.writeFile(file, utils.readURL('http://www.fg.gov.ua' + bank.link));
            }
        })
    },

    ////////// json \\\\\\\\\\
    extractAndSaveActiveBanks: function () {
        const banks = [];
        const html = utils.readFile(this.htmlActiveBanksFile());
        const regex = /<td>(.+?)<\/td>/g;
        let matches;
        while ((matches = regex.exec(html))) {
            banks.push(this.extractBankPureName(matches[1]));
        }
        utils.writeFile(this.jsonActiveBanksFile(), utils.toJson(banks));
    },

    extractBankPureName(bankFullName) {
        const match = bankFullName.match(/.*["«](.+?)["»]/);
        if (!match) {
            console.log(bankFullName);
            return bankFullName;
        }
        return match[1];
    },

    extractAndSaveNotPayingBanks: function () {
        utils.writeFile(this.jsonNotPayingBanksFile(), utils.toJson(this.extractNotPayingBanks()));
    },

    extractNotPayingBanks: function () {
        const banks = [];
        const html = utils.readFile(this.htmlNotPayingBanksFile());
        const regex = /<h3 class="item-title"><a href="(\/.+?\/.+?\/.+?)">[\S\s]+?(.+?)<\/a>/g;
        let matches;
        while ((matches = regex.exec(html))) {
            banks.push({
                name: this.extractBankPureName(matches[2]),
                link: matches[1]
            });
        }
        return banks;
    },

    buildBankId(name) {
        return name.toLowerCase();
    },

    ////////// files \\\\\\\\\\
    htmlActiveBanksFile: function() {
        return path.resolve(this.htmlFolder(), 'banks-active.html');
    },

    htmlNotPayingBanksFile: function() {
        return path.resolve(this.htmlFolder(), 'banks-not-paying.html');
    },

    htmlBankFile: function(name) {
        return path.resolve(this.htmlFolder(), 'banks', name + '.html');
    },

    jsonActiveBanksFile: function() {
        return path.resolve(this.jsonFolder(), 'banks-active.json');
    },

    jsonNotPayingBanksFile: function() {
        return path.resolve(this.jsonFolder(), 'banks-not-paying.json');
    },

    htmlFolder: function() {
        return path.resolve(this.dataFolder(), 'html');
    },

    jsonFolder: function() {
        return path.resolve(this.dataFolder(), 'json');
    },

    dataFolder: function() {
        return path.resolve('.', 'fg');
    }
};