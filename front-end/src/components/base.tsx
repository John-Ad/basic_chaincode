// react imports
import React, { Component } from "react";

// component imports
import Navbar from "./navbar";
import AddPartSection from "./addPartSection";

// interface and enum imports
import { SECTIONS } from "./navbar"

interface IState {
    currentSection: number,
}

class Base extends Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentSection: SECTIONS.ADD_PART
        }
    }

    goToSection = (section: number) => {
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

    render() {
        return (
            <div id="containerDiv">
                <Navbar goToSection={this.goToSection} />
                <div id="contentDiv">
                    {this.state.currentSection === SECTIONS.HOME &&
                        <h3>add some filler content here</h3>
                    }
                    {this.state.currentSection === SECTIONS.ADD_PART &&
                        <AddPartSection />
                    }
                </div>
            </div>
        );
    }
}

export default Base;
