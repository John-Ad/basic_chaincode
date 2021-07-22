// react imports
import React, { Component } from "react";

// component imports
import Navbar from "./navbar";
import AddPartSection from "./addPartSection";
import ViewPartSection from "./viewPartSection";
import AddTranSection from "./addTransaction";

// connection imports
import Connection from "../connection";

// interface and enum imports
import { GET_REQ_TYPES, POST_REQ_TYPES, IFrame, ITransaction } from "../connection";

// interface and enum imports
import { SECTIONS } from "./navbar"

interface IState {
    connection: Connection,
    currentSection: number
}

class Base extends Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            connection: new Connection(),
            currentSection: SECTIONS.ADD_TRAN
        }
    }

    goToSection = (section: number): void => {
        switch (section) {
            case SECTIONS.HOME:
                break;
            case SECTIONS.ADD_PART:
                break;
            case SECTIONS.VIEW_PART:
                break;
            case SECTIONS.ADD_TRAN:
                break;
            case SECTIONS.VIEW_TRAN:
                break;
            default:
                return;
        }
        this.setState({ currentSection: section })
    }

    //########################################################
    //###   chaincode query handling
    //########################################################
    addPart = async (frame: IFrame): Promise<boolean> => {       // Add a new part
        let res = await this.state.connection.postReq(POST_REQ_TYPES.ADD_FRAME, frame);
        return res === 0;
    }
    searchPart = async (id: string): Promise<IFrame> => {        // search for existing part
        let res: IFrame = await this.state.connection.getReq(GET_REQ_TYPES.GET_FRAME, id);
        return res;
    }
    addTran = async (tran: ITransaction): Promise<boolean> => {
        let res = await this.state.connection.postReq(POST_REQ_TYPES.ADD_TRAN, tran);
        return res === 0;
    }
    //########################################################


    //########################################################
    //###   render method
    //########################################################
    render(): JSX.Element {
        return (
            <div id="containerDiv">
                <Navbar goToSection={this.goToSection} />
                <div id="contentDiv">
                    {this.state.currentSection === SECTIONS.HOME &&
                        <h3>Add some filler content here</h3>
                    }
                    {this.state.currentSection === SECTIONS.ADD_PART &&
                        <AddPartSection addPart={this.addPart} />
                    }
                    {this.state.currentSection === SECTIONS.VIEW_PART &&
                        <ViewPartSection searchPart={this.searchPart} />
                    }
                    {this.state.currentSection === SECTIONS.ADD_TRAN &&
                        <AddTranSection addTran={this.addTran} />
                    }
                </div>
            </div>
        );
    }
    //########################################################
}

export default Base;
