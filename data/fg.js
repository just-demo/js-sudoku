let utils = require('./utils');
let path = require('path');

module.exports = {
    ////////// html \\\\\\\\\\
    fetchAndSaveAllHtml: function(){
        // this.fetchAndSaveActiveBanks();
        // this.extractAndSaveActiveBanks();
        // this.fetchAndSaveNotPayingBanks();
        this.extractAndSaveNotPayingBanks();
    },

    fetchAndSaveActiveBanks: function () {
        utils.writeFile(this.htmlActiveBanksFile(), utils.readURL('http://www.fg.gov.ua/uchasnyky-fondu'));
    },

    fetchAndSaveNotPayingBanks: function () {
        utils.writeFile(this.htmlNotPayingBanksFile(), utils.readURL('http://www.fg.gov.ua/not-paying'));
    },

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
        utils.writeFile(this.jsonNotPayingBanksFile(), utils.toJson(banks));
    },

    ////////// files \\\\\\\\\\
    htmlActiveBanksFile: function() {
        return path.resolve(this.htmlFolder(), 'banks-active.html');
    },

    htmlNotPayingBanksFile: function() {
        return path.resolve(this.htmlFolder(), 'banks-not-paying.html');
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