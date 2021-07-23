/*
 * Only item ids are entered and sent to the server. This is for testing purposes.
 * An actual site will make use of a cart system or something.
 * The amount is also manual manually calculated based on my knowledge of initial values in 
 * the ledger. The chaincode makes use of the stored price values, not what is passed in.
 * Again, this is just for testing purposes
 * */


// react imports
import React, { Component } from "react";

// interface and enum imports
import { IFrame, ITransaction } from "../connection";

interface IState {
    id: string,
    buyer: string,
    nrItems: string,
    amount: string,
    itemToAdd: string,
    items: string[]
}
interface IProps {
    addTran(tran: ITransaction): Promise<boolean>
}

enum INPUT_TYPE {
    ID = 0,
    BUYER = 1,
    ITEM = 2,
    NR_ITEMS = 3,
    AMOUNT = 4
}

class AddTranSection extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            id: "",
            buyer: "",
            nrItems: "1",
            amount: "",
            itemToAdd: "",
            items: ["SUBROSA_MR"]
        }
    }

    componentDidUpdate() {
        //console.log(this.state);
    }

    handleInput = (ev: React.ChangeEvent<HTMLInputElement>, attr: INPUT_TYPE) => {
        switch (attr) {
            case INPUT_TYPE.ID:
                this.setState({ id: ev.target.value });
                break;
            case INPUT_TYPE.BUYER:
                this.setState({ buyer: ev.target.value });
                break;
            case INPUT_TYPE.ITEM:
                this.setState({ itemToAdd: ev.target.value });
                break;
            case INPUT_TYPE.NR_ITEMS:
                this.setState({ nrItems: this.state.items.length.toString() });
                break;
            case INPUT_TYPE.AMOUNT:
                this.setState({ amount: ev.target.value });
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <div id="addTranContainer">
                <div className="addTranDetails">
                    <h3 className="addTranDetailsTitle">TxID</h3>
                    <input className="addTranDetailsValue" type="text" placeholder="enter id" onChange={(ev) => this.handleInput(ev, INPUT_TYPE.ID)} />
                </div>
                <div className="addTranDetails">
                    <h3 className="addTranDetailsTitle">Buyer</h3>
                    <input className="addTranDetailsValue" type="text" placeholder="enter buyer name" onChange={(ev) => this.handleInput(ev, INPUT_TYPE.BUYER)} />
                </div>

                <div id="addTranDetailsAddItem" className="addTranDetails">
                    <div id="addTranAddItem">
                        <h3 className="addTranDetailsTitle">Items</h3>
                        <input id="addTranAddItemIn" className="addTranDetailsValue" type="text" value={this.state.itemToAdd} placeholder="enter item ID" onChange={(ev) => this.handleInput(ev, INPUT_TYPE.ITEM)} />
                        <div id="addTranAddItemAdd" onClick={() => {
                            let items = this.state.items.slice();
                            let nrItems = this.state.nrItems;
                            items.push(this.state.itemToAdd);
                            nrItems = items.length.toString();

                            this.setState({ itemToAdd: "", items: items, nrItems: nrItems });
                        }}>
                            <h3>Add</h3>
                        </div>
                    </div>
                    {this.state.items.map((item) => {
                        return (
                            <p className="addTranItem">{item}</p>
                        );
                    })

                    }
                </div>

                <div className="addTranDetails">
                    <h3 className="addTranDetailsTitle">Nr Items</h3>
                    <input className="addTranDetailsValue" type="number" value={this.state.items.length} onChange={() => { }} />
                </div>
                <div className="addTranDetails">
                    <h3 className="addTranDetailsTitle">Amount</h3>
                    <input className="addTranDetailsValue" type="number" placeholder="enter total amount" onChange={(ev) => this.handleInput(ev, INPUT_TYPE.AMOUNT)} />
                </div>
                <br></br>
                <div className="addTranDetails" id="submitTran" onClick={async () => {
                    /*
                     * chaincode will handle frame details based on id.
                     * Frame and tran interfaces are kept the same to prevent communication 
                     * issues between front and back end.
                     * Transaction stage is also handled by chaincode but interface is kept 
                     * the same for the above reason
                    * */

                    // convert arr of strings to arr of frames to send to server
                    let items: IFrame[] = [];
                    this.state.items.forEach((item) => {
                        let frame: IFrame = {
                            id: item,
                            size: 0,
                            color: "",
                            price: 0
                        }
                        items.push(frame);
                    });

                    let tran: ITransaction = {
                        txID: this.state.id,
                        buyer: this.state.buyer,
                        stage: "",
                        items: items,
                        numOfItems: parseInt(this.state.nrItems),
                        amount: parseFloat(this.state.amount)
                    }

                    let res = await this.props.addTran(tran);
                    if (res) {
                        alert("successfully added transaction");
                    } else {
                        alert("failed to add transaction");
                    }
                }}>
                    <h3 id="addTranSubmitVal">Submit</h3>
                </div>
            </div>
        );
    }
}

export default AddTranSection;
