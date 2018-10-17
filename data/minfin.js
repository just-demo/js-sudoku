let utils = require('./utils');
let path = require('path');

module.exports = {
    dates: [
        '2018-07-01', '2018-05-14', '2018-03-07',
        '2017-12-07', '2017-08-18', '2017-05-21', '2017-01-01',
        '2016-10-01', '2016-07-01', '2016-04-01', '2016-01-01',
        '2015-10-01', '2015-07-01', '2015-04-01', '2015-01-01',
        '2014-10-01', '2014-07-01', '2014-04-01', '2014-01-01',
        '2013-10-01', '2013-07-01', '2013-04-01', '2013-01-01',
    ],

    ////////// html \\\\\\\\\\
    fetchAndSaveAllHtml: function(){
        this.fetchAndSaveBanks();
        this.fetchAndSaveRatings();
        this.extractAndSaveBankNames();
        this.fetchAndSaveBankDetails();
        this.extractAndSaveBankDetails();
        this.extractAndSaveBankRatings();
        this.extractAndSaveBankRatingDetails();
    },

    fetchAndSaveBanks: function() {
        utils.writeFile(this.htmlBanksFile(), utils.readURL('https://minfin.com.ua/banks/all/'));
    },

    fetchAndSaveRatings: function() {
        this.dates.forEach(date => this.fetchAndSaveRating(date));
    },

    fetchAndSaveRating(date) {
        utils.writeFile(this.htmlRatingsFile(date), utils.readURL('https://minfin.com.ua/banks/rating/?date=' + date));
    },

    fetchAndSaveBankDetails: function() {
        const banks = this.extractBankNames();
        Object.values(banks).forEach(bank => {
            console.log(bank.alias);
            const file = this.htmlBankFile(bank.alias);
            if (!utils.fileExists(file)) {
                utils.writeFile(file, utils.readURL("https://minfin.com.ua/ua/company/" + bank.alias + '/'));
            }
        });
    },

    ////////// json \\\\\\\\\\
    extractAndSaveBankNames: function() {
        utils.writeFile(this.jsonBanksFile(), JSON.stringify(this.extractBankNames(), null, 2));
    },

    extractAndSaveBankDetails: function() {
        const banks = this.extractBankNames();
        Object.values(banks).forEach(bank => {
            const html = utils.readFile(this.htmlBankFile(bank.alias));
            const regex = /<div class="item-title">Офіційний сайт<\/div>[\S\s]+?<a.*? href="(.+?)" target="_blank">/g;
            let matches;
            while (matches = regex.exec(html)) {
                bank.site = matches[1];
            }
        });
        utils.writeFile(this.jsonBankDetailsFile(), JSON.stringify(banks, null, 2));
    },

    extractBankNames: function() {
        const html = utils.readFile(this.htmlBanksFile());
        const banks = {};
        const regex = /class="bank-emblem--desktop"[\S\s]+?\/company\/(.+?)\/[\S\s]+?<a href="\/company\/(.+?)\/">(.+?)<\/a>/g;
        let matches;
        while (matches = regex.exec(html)) {
            banks[matches[1]] = {
                alias: matches[2],
                name: matches[3]
            };
        }
        return banks;
    },

    /*
    ...
    <td class="sustain-rating--table-td number-column" data-id="58">
    <div style="height: 0; width: 0;" id="place1"></div>
    ...
    </td>
    <td class="sustain-rating--table-td" data-title="Общий рейтинг"><span class="fixedNumber">4.56</span>
    &nbsp;<div class="sustain-rating--table-stars" data-sort="1">
    ...
    </td>
    <td class="sustain-rating--table-td" data-title="Стрессо-устойчивость">4.6</td>
    <td class="sustain-rating--table-td" data-title="Лояльность вкладчиков">4.4</td>
    <td class="sustain-rating--table-td" data-title="Оценкааналитиков">4.82</td>
    <td class="sustain-rating--table-td more" data-title="Место в рэнкинге по депозитам физлиц ">
    <span>5
    <div title="Нажмите, чтобы увидеть дополнительную информацию"></div>
    </span>
    ...
    Overall rating
    Stress resistance
    Depositors loyalty
    */
    extractAndSaveBankRatings: function() {
        const ratings = {};
        this.dates.forEach(date => {
            const dateRatings = {};
            const html = utils.readFile(this.htmlRatingsFile(date));
            const regex = /data-id="(.+?)"[\S\s]+?data-title="Общий рейтинг"><span.*?>(.+?)<\/span>/g;
            let matches;
            while (matches = regex.exec(html)) {
                dateRatings[matches[1]] = matches[2];
            }
            ratings[date] = dateRatings;
        });
        utils.writeFile(this.jsonRatingsFile(), JSON.stringify(ratings, null, 2));
    },

    extractAndSaveBankRatingDetails: function() {
        const ratings = {};
        this.dates.forEach(date => {
            const html = utils.readFile(this.htmlRatingsFile(date));
            const regex = /<script>\s*data\s*=([^;]+);\s*<\/script>/g;
            let matches;
            while (matches = regex.exec(html)) {
                ratings[date] = JSON.parse(matches[1].replace(/(\d+):/g, '"$1":').replace(/'/g, '"'));
            }
        });
        utils.writeFile(this.jsonRatingDetailsFile(), JSON.stringify(ratings, null, 2));
    },

    ////////// files \\\\\\\\\\
    htmlRatingsFile: function(date) {
        return path.resolve(this.htmlFolder(), 'ratings', date + '.html');
    },

    htmlBanksFile : function(){
        return path.resolve(this.htmlFolder(), 'banks.html');
    },

    htmlBankFile : function(alias){
        return path.resolve(this.htmlFolder(), 'banks', alias + '.html');
    },

    jsonRatingDetailsFile: function (){
        return path.resolve(this.jsonFolder(), 'bank-rating-details.json');
    },

    jsonRatingsFile: function (){
        return path.resolve(this.jsonFolder(), 'bank-ratings.json');
    },

    jsonBanksFile: function (){
        return path.resolve(this.jsonFolder(), 'banks.json');
    },

    jsonBankDetailsFile: function (){
        return path.resolve(this.jsonFolder(), 'bank-details.json');
    },

    htmlFolder: function() {
        return path.resolve(this.dataFolder(), 'html');
    },

    jsonFolder: function() {
        return path.resolve(this.dataFolder(), 'json');
    },

    dataFolder: function() {
        return path.resolve('.', 'minfin');
    }
};