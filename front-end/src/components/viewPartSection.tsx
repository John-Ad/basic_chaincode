// react imports
import React, { Component } from "react";
import { IFrame } from "../connection";

interface IState {
    searchInput: string
    currFrame: IFrame
}
interface IProps {
    searchPart(id: string): Promise<IFrame>
}

class ViewPartSection extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            searchInput: "",
            currFrame: {
                id: "",
                size: 0,
                color: "",
                price: 0
            }
        }
    }

    render() {
        return (
            <div id="viewPartContainer">
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">ID:</h3>
                    <h3 className="detailValue">{this.state.currFrame.id}</h3>
                </div>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Size:</h3>
                    <h3 className="detailValue">{this.state.currFrame.size}</h3>
                </div>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Color:</h3>
                    <h3 className="detailValue">{this.state.currFrame.color}</h3>
                </div>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Price:</h3>
                    <h3 className="detailValue">{this.state.currFrame.price}</h3>
                </div>
                <br></br>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Search:</h3>
                    <input onChange={(ev) => this.setState({ searchInput: ev.target.value })} id="viewPartSearchInput" type="text" placeholder="enter your search here" />
                </div>
                <br></br>
                <div className="itemDetailsDiv" id="viewPartSearchSubmitDiv" onClick={async () => {
                    let res: IFrame = await this.props.searchPart(this.state.searchInput);
                    if (res) {
                        this.setState({ currFrame: res });
                    } else {
                        alert("frame not found");
                    }
                }}>
                    <h3 className="detailTitle" id="viewPartSearchSubmit">Submit</h3>
                </div>
            </div>
        );
    }
}

export default ViewPartSection;
