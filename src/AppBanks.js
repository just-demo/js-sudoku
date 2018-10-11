import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css'

class AppBanks extends Component {
    constructor(props) {
        super(props);
        this.state = {banks: {}};
        fetch('banks.json')
            .then(banks => banks.json())
            .then(banks => this.setState({banks: banks}));
    }

    fetchBankRatings() {
        fetch('bank-ratings.json')
            // .then(ratings => ratings.json())
            .then(ratings => this.initState(ratings));
    }

    initState(ratings) {
        // const date = '2018-07-01';
        // for (let date in ratings) {
        //     const banks = ratings[date];
        //     console.log(date);
        //     console.log(banks);
        // }

        const bankIds = new Set();
        _.forOwn(ratings, (dateRatings, date) => {
            // console.log(date);
            // console.log(bankRatings);
            _.forOwn(dateRatings, (companyRatings, bankId) => {
                bankIds.add(bankId);
            });

        });
        console.log(bankIds);
        console.log(Array.from(bankIds).map(bankId => parseInt(bankId)).sort((a, b) => (a - b)));
    }

    render() {
        return (
            <div>
                <ul className="banks">
                    {Object.keys(this.state.banks).map(bankId => (
                        <li key={bankId} className="bank">
                            {bankId} - {this.state.banks[bankId]}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default AppBanks;
