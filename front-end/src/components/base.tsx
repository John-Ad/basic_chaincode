// react imports
import React, { Component } from "react";

// component imports
import Navbar from "./navbar";
import AddPartSection from "./addPartSection";
import ViewPartSection from "./viewPartSection";

// interface and enum imports
import { SECTIONS } from "./navbar"

interface IState {
    currentSection: number,
}

class Base extends Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentSection: SECTIONS.VIEW_PART
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
    addPart = (args: string[]): void => {       // Add a new part
        console.log(args);
    }
    searchPart = (id: string): void => {        // search for existing part
        console.log(id);
    }

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
                </div>
            </div>
        );
    }
}

export default Base;
