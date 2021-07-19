import React, { Component } from "react";

export enum SECTIONS {
    HOME = 0,
    ADD_PART = 1,
    VIEW_PART = 2,
    ADD_TRAN = 3,
    VIEW_TRAN = 4
}

interface IProps {
    goToSection(section: number): void
}

class NavBar extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div id="navContainerDiv">
                <h3 className="navOpts" onClick={() => this.props.goToSection(SECTIONS.HOME)}>Home</h3 >
                <h3 className="navOpts" onClick={() => this.props.goToSection(SECTIONS.ADD_PART)}>Add Parts</h3>
                <h3 className="navOpts" onClick={() => this.props.goToSection(SECTIONS.VIEW_PART)}>View Parts</h3>
                <h3 className="navOpts" onClick={() => this.props.goToSection(SECTIONS.ADD_TRAN)}>Add transactions</h3>
                <h3 className="navOpts" onClick={() => this.props.goToSection(SECTIONS.VIEW_TRAN)}>View transactions</h3>
            </div >
        );
    }
}

export default NavBar;
