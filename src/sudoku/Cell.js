import _ from 'lodash';
import Value from './Value';

class Cell {
    constructor(row, col, block) {
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
        this.candidates.forEach((candidate) => candidate.removeCandidate(this));
        this.candidates = [];
        value.open(this);
        // TODO: move outside?
        // pendingCells.remove(this);
        // pendingCells.stream()
        // .filter(this::isRelated)
        // .forEach(pendingCell -> pendingCell.removeCandidate(value));
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

    getValue() { // Integer
        return this.value ? this.value.getValue() : 0;
    }
}

export default Cell;