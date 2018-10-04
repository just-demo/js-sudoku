import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Sudoku from './sudoku/Sudoku.js'
import Utils from "./sudoku/Utils";

class App extends Component {

    solve(lines) {
        let maxTime = -1;
        lines.split("\n").filter(line => line).forEach(line => {
            const parts = line.split(' | ');
            const input = parts[0];
            const output = parts[1];

            const initialValues = Utils.parseSimpleString(input);
            // const startTime = performance.now();
            const startTime = new Date().getTime();
            const solution = new Sudoku(initialValues).solve();
            // const endTime = performance.now();
            const endTime = new Date().getTime();
            const time = endTime - startTime;
            if (time > maxTime) {
                maxTime = time;
                // console.log('Max time: ' + maxTime);
            }
            console.log('Time: ' + time);
            if (Utils.asSimpleString(solution) !== output) {
                console.log('===================== different =====================');
                console.log(input);
                console.log(output);
                console.log(Utils.asSimpleString(solution));
                console.log('=====================================================');
            }

        });
        console.log('Max time: ' + maxTime);
    }

    render() {

        fetch('data-simple.txt')
            .then(data => data.text())
            .then(data => this.solve(data));

        const input = '....7.26.........4......39....1.....4.9.8.7.....2.6.18693........45....1.5.9.....';
        const output = '938471265527639184146852397862147539419385726375296418693714852284563971751928643';

        // const initialValues = Utils.parseSimpleString(input);
        // console.log(initialValues);
        // const solution = new Sudoku(initialValues).solve();
        // console.log(Utils.asSimpleString(solution));
        // console.log(output == );

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    It works!
                </p>
            </div>
        );
    }
}

export default App;
