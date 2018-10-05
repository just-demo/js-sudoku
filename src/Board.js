import React, {Component} from "react";
import Square from "./Square";
import Utils from "./solver/Utils";

class Board extends Component {
    constructor(props) {
        super(props);
        this.source = Utils.parseSimpleString(props.source);
        this.target = Utils.parseSimpleString(props.target);
        this.size = Math.sqrt(this.target.length);
        this.state = {
            values: this.source
        }
    }


    renderSquare(i) {
        //<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>
        return (
            <Square value={i} onClick={() => this.props.onClick(i)}/>
        );
    }

    render() {
        return (
            <div className="board">
                {this.state.values.map(row => (
                    <div className="board-row">
                        {row.map(col => (
                            <Square value={col}/>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

export default Board;
