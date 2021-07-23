import React, { Component } from "react";
import { ERROR, ITransaction } from "../connection";

interface IState {
    transaction: ITransaction,
    searchInput: string
}
interface IProps {
    getTran(txID: string): Promise<any>
}

class ViewTransaction extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            transaction: {
                txID: "",
                buyer: "",
                stage: "",
                items: [],
                numOfItems: 0,
                amount: 0
            },
            searchInput: ""
        }
    }

    componentDidUpdate() {
        console.log(this.state.transaction);
    }

    render() {
        return (
            <div id="viewTranContainer">
                <div className="viewTranDetails">
                    <h3 className="viewTranDetailsTitle">TxID:</h3>
                    <h3 className="viewTranDetailsValue">{this.state.transaction.txID}</h3>
                </div>
                <div className="viewTranDetails">
                    <h3 className="viewTranDetailsTitle">Buyer:</h3>
                    <h3 className="viewTranDetailsValue">{this.state.transaction.buyer}</h3>
                </div>
                <div className="viewTranDetails">
                    <h3 className="viewTranDetailsTitle">Stage:</h3>
                    <h3 className="viewTranDetailsValue">{this.state.transaction.stage}</h3>
                </div>
                <div className="viewTranDetails" id="viewTranItems">
                    <h3 className="viewTranDetailsTitle">Items:</h3>
                    {this.state.transaction.items.map((item) => {
                        return (
                            <p>{item.id}</p>
                        );
                    })}
                </div>
                <div className="viewTranDetails">
                    <h3 className="viewTranDetailsTitle">Nr Items:</h3>
                    <h3 className="viewTranDetailsValue">{this.state.transaction.numOfItems}</h3>
                </div>
                <div className="viewTranDetails">
                    <h3 className="viewTranDetailsTitle">Amount:</h3>
                    <h3 className="viewTranDetailsValue">{this.state.transaction.amount}</h3>
                </div>
                <br></br>
                <div className="viewTranDetails">
                    <h3 className="viewTranDetailsTitle">Search:</h3>
                    <input id="viewTranSearch" placeholder="Enter txID" onChange={(ev) => { this.setState({ searchInput: ev.target.value }) }} />
                    <div id="viewTranSearchBtn" onClick={async () => {
                        let res = await this.props.getTran(this.state.searchInput);
                        if (res === ERROR) {
                            alert("Transaction not found");
                        } else {
                            this.setState({ transaction: res })
                        }
                    }}>
                        <h3>Find</h3>
                    </div>
                </div>
            </div >
        );
    }
}

export default ViewTransaction;
