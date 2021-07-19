import React, { Component } from "react";

enum PART_TYPES {
    NONE = 0,
    FRAME = 1
}

enum INPUT_TYPE {
    ID = 0,
    COLOR = 1,
    SIZE = 2,
    PRICE = 3
}

interface IState {
    partType: PART_TYPES,
    id: string,
    color: string,
    size: string,
    price: string
}

class AddPartSection extends Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            partType: PART_TYPES.NONE,
            id: "",
            color: "",
            size: "",
            price: "",
        }
    }

    // handle input
    handleInput = (ev: React.ChangeEvent<HTMLInputElement>, attr: INPUT_TYPE) => {
        switch (attr) {
            case INPUT_TYPE.ID:
                this.setState({ id: ev.target.value });
                break;
            case INPUT_TYPE.SIZE:
                this.setState({ size: ev.target.value });
                break;
            case INPUT_TYPE.COLOR:
                this.setState({ color: ev.target.value });
                break;
            case INPUT_TYPE.PRICE:
                this.setState({ price: ev.target.value });
                break;
            default:
                return;
        }
    }

    chooseType = (pType: PART_TYPES) => {
        switch (pType) {
            case PART_TYPES.NONE:
                break;
            case PART_TYPES.FRAME:
                break;
            default:
                return;
        }

        this.setState({ partType: pType })
    }

    render() {
        return (
            <div id="sectionContainerDiv">
                {this.state.partType === PART_TYPES.NONE &&
                    <React.Fragment>
                        <div className="partOpts" onClick={() => this.chooseType(PART_TYPES.FRAME)}>Add Frame</div>
                        <div className="partOpts" onClick={() => this.chooseType(PART_TYPES.NONE)}>Add Bar</div>
                        <div className="partOpts" onClick={() => this.chooseType(PART_TYPES.NONE)}>Add Fork</div>
                    </React.Fragment>
                }
                {this.state.partType === PART_TYPES.FRAME &&
                    <React.Fragment>
                        <label htmlFor="idLbl" className="partLbl">ID</label>
                        <input onChange={(ev) => this.handleInput(ev, INPUT_TYPE.ID)} id="idLbl" className="partInput" type="text" placeholder="example_eg" />
                        <label htmlFor="sizeLbl" className="partLbl">SIZE</label>
                        <input onChange={(ev) => this.handleInput(ev, INPUT_TYPE.SIZE)} id="sizeLbl" className="partInput" type="text" placeholder="21.00" />
                        <label htmlFor="colLbl" className="partLbl">COLOUR</label>
                        <input onChange={(ev) => this.handleInput(ev, INPUT_TYPE.COLOR)} id="colLbl" className="partInput" type="text" placeholder="black" />
                        <label htmlFor="priceLbl" className="partLbl">PRICE</label>
                        <input onChange={(ev) => this.handleInput(ev, INPUT_TYPE.PRICE)} id="priceLbl" className="partInput" type="text" placeholder="300.00" />
                        <button id="addFramebtn">Add</button>
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default AddPartSection;
