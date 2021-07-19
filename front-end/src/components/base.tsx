// react imports
import React, { Component } from "react";

class Base extends Component<{}, {}>{
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <div>Hello world</div>
            </div>
        );
    }
}

export default Base;
