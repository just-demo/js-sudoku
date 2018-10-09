import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';

class AppBanks extends Component {
    fetchBankRates() {
        fetch('bank-rates.json')
            .then(rates => rates.json())
            .then(rates => this.initState(rates));
    }

    initState(rates) {
        // const date = '2018-07-01';
        // for (let date in rates) {
        //     const banks = rates[date];
        //     console.log(date);
        //     console.log(banks);
        // }

        const bankIds = new Set();
        _.forOwn(rates, (dateRates, date) => {
            // console.log(date);
            // console.log(bankRates);
            _.forOwn(dateRates, (companyRates, bankId) => {
                bankIds.add(bankId);
            });

        });
        console.log(bankIds);
        console.log(Array.from(bankIds).map(bankId => parseInt(bankId)).sort((a, b) => (a - b)));
    }

    render() {
        this.fetchBankRates();

        return (
            <div className="Banks">
                It works!!!
            </div>
        );
    }
}

export default AppBanks;
