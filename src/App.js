import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sudoku from './sudoku/Sudoku.js'
import Utils from "./sudoku/Utils";

class App extends Component {
  render() {
      let initialValues = ("8 . . . . . . . .\n" +
      ". . 3 6 . . . . .\n" +
      ". 7 . . 9 . 2 . .\n" +
      ". 5 . . . 7 . . .\n" +
      ". . . . 4 5 7 . .\n" +
      ". . . 1 . . . 3 .\n" +
      ". . 1 . . . . 6 8\n" +
      ". . 8 5 . . . 1 .\n" +
      ". 9 . . . . 4 . .").split("\n").map(line => line
          .replace(/\./g, '0')
          .split(' ')
          .map(cell => parseInt(cell)));
      initialValues = [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 3, 4, 1],
          [0, 0, 0, 0],
      ];

      // const input  = '.......1.6.8...9.59.......6..9.7.......132.5....8.64.2...3.......46.183.3.2..4...';
      // const output = '745269318628713945931548726269475183487132659153896472816357294594621837372984561';
      const input  = '....7.26.........4......39....1.....4.9.8.7.....2.6.18693........45....1.5.9.....';
      const output = '938471265527639184146852397862147539419385726375296418693714852284563971751928643';

      initialValues = Utils.parseSimpleString(input);
      console.log(initialValues);
      const solver = new Sudoku(initialValues);
      const solution = solver.solve();
      console.log(Utils.asSimpleString(solution));
      console.log(output);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
