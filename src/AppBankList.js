import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css'

class AppBankList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banks: []
        };

        fetch('banks.json')
            .then(banks => banks.json())
            .then(banks => this.setState({banks: banks}));
    }

    render() {
        return (
            <div>
                <table className="banks">
                    <tbody>
                    <tr>
                        {/*<th>&nbsp;</th>*/}
                        <th>FG</th>
                        <th>Minfin</th>
                    </tr>
                    {this.state.banks.filter(bank => !bank.fg || !bank.mf).map(bank => (
                        <tr key={bank.id} style={this.styleForBank(bank)}>
                            {/*<td>{bank.id}</td>*/}
                            <td>{bank.fg}</td>
                            <td>{bank.mf}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    styleForBank(bank) {
        let color = bank.fg ? 'yellow' : 'orange';
        return {backgroundColor: color};
    }
}

export default AppBankList;
