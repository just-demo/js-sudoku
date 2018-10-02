import _ from 'lodash';
import Cell from './Cell';

class Value {
    constructor(value) {
        this.cells = []; //Collection<Cell>
        this.candidates = []; //Collection<Collection<Cell>>
        this.value = value; // Integer
    }

    setCandidates(candidates: Cell[]) {
        this.candidates.push(..._.values(_.groupBy(candidates, (cell) => cell.row)));
        this.candidates.push(..._.values(_.groupBy(candidates, (cell) => cell.col)));
        this.candidates.push(..._.values(_.groupBy(candidates, (cell) => cell.block)));
    }

    removeCandidate(cell : Cell) {
        this.candidates = this.candidates
            .map((group) => _.without(group, cell))
            .filter((group) => group.length);
        this.candidates.sort((group1, group2) => group1.length - group2.length);
    }

    open(cell: Cell) : number {
        this.removeCandidate(cell);
        this.cells.push(cell);
        // TODO: move it outside Value class?
        // if (cells.size() == size) {
        //     this.pendingValues.remove(this);
        // }
        return this.cells.length;
    }

    getValue() { // Integer
        return this.value;
    }

    countCandidates(): number {
        return this.getCandidates().length;
    }

    getCandidate() : Cell {
        return this.getCandidates()[0];
    }

    getCandidates() : Cell[] {
        return this.candidates[0] || [];
    }
}

export default Value;