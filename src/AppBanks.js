import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css'

class AppBanks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banks: {},
            ratings: {}
        };

        //"js-s62"

        fetch('banks.json')
            .then(banks => banks.json())
            .then(banks => this.setState({banks: banks}));


        fetch('bank-ratings.json')
            .then(ratings => ratings.json())
            .then(ratings => this.setState({ratings: ratings}));
    }

    render() {
        const dates = Object.keys(this.state.ratings).sort().reverse();
        const latestRating = {};
        _.forOwn(this.state.ratings, (dateRating, date) => {
            _.forOwn(dateRating, (bankRating, bankId) => {
                if (!latestRating[bankId] || latestRating[bankId].date < date) {
                    latestRating[bankId] = {
                        date: date,
                        rating: bankRating
                    };
                }
            });
        });

        // Sort by latest rating in reverse order
        const bankIds = Object.keys(this.state.banks).sort((a, b) => {
            const aRating = latestRating[a];
            const bRating = latestRating[b];

            if (aRating && bRating) {
                if (aRating.date !== bRating.date) {
                    return aRating.date > bRating.date ? 1 : -1;
                }
                if (aRating.rating !== bRating.rating) {
                    return aRating.rating > bRating.rating ? 1 : -1;
                }
                return 0;
            }
            return aRating ? 1 : (bRating ? -1 : 0);
        }).reverse();

        return (
            <div>
                <table className="banks">
                    <tbody>
                    <tr>
                        <th>&nbsp;</th>
                        {dates.map(date => (
                            <th>{date}</th>
                        ))}
                    </tr>
                    {bankIds.map(bankId => (
                        <tr key={bankId}>
                            <td>{this.state.banks[bankId]} ({bankId})</td>
                            {dates.map(date => (
                                <td style={this.styleForRating(this.state.ratings[date][bankId])}>{this.state.ratings[date][bankId] || '-'}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    styleForRating(rating) {
        if (!rating) {
            return {};
        }

        // TODO: make yellow in the middle!!!
        // 2 - red, 5 - green
        let points = Math.max(0, Math.min(5, rating) - 2);
        points = Math.round(points * 3) / 3; // TODO: make it configurable in UI!!!, show range matrix with color=from-to

        const red = Math.round(255 * ((3 - points) / 3));
        const green = Math.round(255 * (points / 3));
        const blue = 0;
        return {backgroundColor: `rgb(${red}, ${green}, ${blue})`};
    }
}

export default AppBanks;
