// react imports
import React, { Component } from "react";

interface IState {
    searchInput: string
}
interface IProps {
    searchPart(id: string): void
}

class ViewPartSection extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            searchInput: ""
        }
    }

    render() {
        return (
            <div id="viewPartContainer">
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">ID:</h3>
                    <h3 className="detailValue">skdlfjjsjakfln</h3>
                </div>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Size:</h3>
                    <h3 className="detailValue">skdlfjjsjakfln</h3>
                </div>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Color:</h3>
                    <h3 className="detailValue">skdlfjjsjakfln</h3>
                </div>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Price:</h3>
                    <h3 className="detailValue">skdlfjjsjakfln</h3>
                </div>
                <br></br>
                <div className="itemDetailsDiv">
                    <h3 className="detailTitle">Search:</h3>
                    <input onChange={(ev) => this.setState({ searchInput: ev.target.value })} id="viewPartSearchInput" type="text" placeholder="enter your search here" />
                </div>
                <br></br>
                <div className="itemDetailsDiv" id="viewPartSearchSubmitDiv">
                    <h3 onClick={() => this.props.searchPart(this.state.searchInput)} className="detailTitle" id="viewPartSearchSubmit">Submit</h3>
                </div>
            </div>
        );
    }
}

export default ViewPartSection;
