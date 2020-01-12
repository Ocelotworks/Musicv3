/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Home
 *  ════╝
 */

import * as React from "react";
import {HomeContext} from "../../Context";
import Home from "../../presentational/pages/Home";
import axios from 'axios';

export default class HomeController extends React.Component {
    state = {
        recent: [0,0,0,0,0,0],
        recommended: [0,0,0,0,0,0],
    };

    constructor(props){
        super(props);
        axios.get('http://localhost:3000/api/v2/song/latest').then((res)=>{
            this.setState({
                recent: res.data,
            })
        })
    }

    render() {
        return (<HomeContext.Provider value={this.state}>
            <Home/>
        </HomeContext.Provider>);
    }
}