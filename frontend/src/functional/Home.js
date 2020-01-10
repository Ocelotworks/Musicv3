/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Home
 *  ════╝
 */

import * as React from "react";
import {HomeContext} from "../Context";
import Home from "../presentational/pages/Home";

export default class HomeController extends React.Component {
    state = {};

    constructor(props){
        super(props);
    }

    render() {
        return (<HomeContext.Provider value={{}}>
            <Home/>
        </HomeContext.Provider>);
    }
}