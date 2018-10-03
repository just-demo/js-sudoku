
/*
"8 . . . . . . . .\n" +
". . 3 6 . . . . .\n" +
". 7 . . 9 . 2 . .\n" +
". 5 . . . 7 . . .\n" +
". . . . 4 5 7 . .\n" +
". . . 1 . . . 3 .\n" +
". . 1 . . . . 6 8\n" +
". . 8 5 . . . 1 .\n" +
". 9 . . . . 4 . ."

"8 1 2 7 5 3 6 4 9\n" +
"9 4 3 6 8 2 1 7 5\n" +
"6 7 5 4 9 1 2 8 3\n" +
"1 5 4 2 3 7 8 9 6\n" +
"3 6 9 8 4 5 7 2 1\n" +
"2 8 7 1 6 9 5 3 4\n" +
"5 2 1 9 7 4 3 6 8\n" +
"4 3 8 5 2 6 9 1 7\n" +
"7 9 6 3 1 8 4 5 2"
*/

import _ from 'lodash';
import Cell from "./Cell";
import Value from "./Value";

class Sudoku {
    constructor(initialValues: number[][]){
        this.size = initialValues.length;
        this.allCells = []; // List<Cell>
        this.pendingCells = []; // List<Cell>
        this.pendingValues = []; // List<Value>

        const blockSize = Math.sqrt(this.size);
        const valueMap = _.range(this.size).map(value => new Value(this, value + 1)); //Map<Integer, Value>
        const openCells = new Map(); //  Map<Cell, Value>

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const block = blockSize * Math.floor(row / blockSize) + Math.floor(col / blockSize);
                const cell = new Cell(this, row, col, block);
                this.allCells.push(cell);
                const value = initialValues[row][col]; // Integer
                if (value) {
                    openCells.set(cell, valueMap[value - 1]);
                }
            }
        }

        this.pendingCells.push(...this.allCells);
        this.pendingValues.push(...valueMap);
        this.pendingCells.forEach(cell => cell.setCandidates(this.pendingValues));
        this.pendingValues.forEach(value => value.setCandidates(this.pendingCells));
        openCells.forEach((value, cell) => cell.open(value));
    }

    solve(): number[][] {
        while (this.pendingCells.length) {
            if (!this.pendingValues.length) {
                throw new NoSolutionException();
            }

            const cell = _.minBy(this.pendingCells, c => c.countCandidates()); // Cell
            if (cell.countCandidates() === 1) {
                cell.open(cell.getCandidate());
                continue;
            }

            const value = _.minBy(this.pendingValues, v => v.countCandidates()); // Value
            if (value.countCandidates() === 1) {
                value.getCandidate().open(value);
                continue;
            }

            if (cell.countCandidates() === 0 || value.countCandidates() === 0) {
                throw new NoSolutionException();
            }

            return this.solveWithGuess(cell, value);
        }

        return this.copyState();
    }

    solveWithGuess(cell : Cell, value: Value): number[][] {
        let guessCells; // Collection<Cell>
        let guessValues; // Collection<Value>
        if (cell.countCandidates() <= value.countCandidates()) {
            guessCells = [cell];
            guessValues = cell.getCandidates();
        } else {
            guessCells = value.getCandidates();
            guessValues = [value];
        }

        const solutions = []; // List<Integer[][]>
        guessCells.forEach(guessCell => {
            guessValues.forEach(guessValue => {
                const nextGuess = this.copyState(); // Integer[][]
                nextGuess[guessCell.row][guessCell.col] = guessValue.getValue();
                try {
                    solutions.push(new Sudoku(nextGuess).solve());
                } catch (error) {
                    // (error instanceof NoSolutionException) does not work for some reason...
                    if (error.name !== NoSolutionException.name) {
                        throw error;
                    }
                    // Our guess did not work, let's try another one
                }
                if (solutions.length > 1) {
                    throw new MultipleSolutionsException();
                }
            });
        });

        if (!solutions.length) {
            throw new NoSolutionException();
        }

        return solutions[0];
    }

    copyState() : number[][] {
        const state = []; // Integer[][]
        this.allCells.forEach(cell => {
            state[cell.row] = state[cell.row] || [];
            state[cell.row][cell.col] = cell.getValue();
        });
        return state;
    }
}

class NoSolutionException extends Error {
    constructor() {
        super();
        this.name = NoSolutionException.name;
    }
}

class MultipleSolutionsException extends Error {
    constructor() {
        super();
        this.name = MultipleSolutionsException.name;
    }
}

export default Sudoku;