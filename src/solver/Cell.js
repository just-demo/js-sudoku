import _ from 'lodash';
import Value from './Value';
import Solver from "./Solver";
import Utils from "./Utils";

class Cell {
    constructor(sudoku: Solver, row: number, col: number, block: number) {
        this.sudoku = sudoku;
        this.row = row;
        this.col = col;
        this.block = block;
        this.value = null; // Value
        this.candidates = []; // Collection<Value>
    }

    setCandidates(candidates : Value[]) {
        this.candidates = candidates;
    }

    open(value: Value) {
        this.value = value;
        this.candidates.forEach(candidate => candidate.removeCandidate(this));
        this.candidates = [];
        value.open(this);
        // TODO: reduce coupling
        Utils.remove(this.sudoku.pendingCells, this);
        this.sudoku.pendingCells
            .filter(cell => this.isRelated(cell))
            .forEach(cell => cell.removeCandidate(value));
    }

    isRelated(cell: Cell) : boolean {
        return this.row === cell.row || this.col === cell.col || this.block === cell.block;
    }

    removeCandidate(value: Value) {
        value.removeCandidate(this);
        this.candidates = _.without(this.candidates, value);
    }

    countCandidates() : number {
        return this.candidates.length;
    }

    getCandidate() : Value {
        return this.candidates[0];
    }

    getCandidates() : Value[] {
        return this.candidates;
    }

    getValue() : number {
        return this.value ? this.value.getValue() : 0;
    }
}

export default Cell;