import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sudoku from './sudoku/Sudoku.js'

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
      console.log(initialValues);
      const solver = new Sudoku(initialValues);
      const solution = solver.solve();
      console.log(solution);

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
