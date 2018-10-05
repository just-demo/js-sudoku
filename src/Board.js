import React, {Component} from "react";
import Square from "./Square";
import Utils from "./solver/Utils";
import Modal from 'react-modal';
import ReactModal from 'react-modal';

class Board extends Component {
    constructor(props) {
        super(props);
        this.source = Utils.parseSimpleString(props.source);
        this.target = Utils.parseSimpleString(props.target);
        this.size = Math.sqrt(this.target.length);
        this.state = {
            values: this.source,
            modalOpened: false
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState(prevState => ({modalOpened: !prevState.modalOpened}));
    }


    renderSquare(i) {
        //<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>
        return (
            <Square value={i} onClick={() => this.props.onClick(i)}/>
        );
    }

    render() {
        return (
            <div>
                <div className="board">
                    {this.state.values.map(row => (
                        <div className="board-row">
                            {row.map(col => (
                                <Square value={col}/>
                            ))}
                        </div>
                    ))}
                </div>
                <button onClick={this.toggleModal}>
                    Toggle Modal
                </button>
                <Modal
                    isOpen={this.state.modalOpened}
                    onRequestClose={this.toggleModal}
                    contentLabel="Modal with something"
                >AAAA</Modal>
            </div>
        );
    }
}

export default Board;
