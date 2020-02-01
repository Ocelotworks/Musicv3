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
import Error from "../../presentational/Error";

export default class HomeController extends React.Component {
    state = {
        recent: [],
        recommended: [],
        error: null,
        recommendedOffset: 0,
        recentOffset: 0,
    };


    loadLatest(offset = 0){
        console.log("Loading latest");
        axios.get(`http://localhost:3000/api/v2/song/latest?offset=${offset}`).then((res)=>{
            if(offset) {
                this.setState((state)=>state.recent.push(...res.data));
            }else{
                this.setState({recent: res.data});
            }
        }).catch((error)=>this.setState({error: error.toString()}));
    }

    loadRecommended(offset = 0){
        console.log("Loading recommended");
        axios.get('http://localhost:3000/api/v2/song/recommended').then((res)=>{
            if(offset) {
                this.setState((state)=>state.recommended.push(...res.data));
            }else{
                this.setState({recommended: res.data});
            }
        }).catch((error)=>this.setState({error: error.toString()}));
    }

    constructor(props){
        super(props);

        this.loadLatest();
        this.loadRecommended();

        this.updateOffset = (delta, recommended)=>{
            //This bit makes most of my code pointless
            if(recommended){
                this.setState({recommended: []});
                this.loadRecommended(1); //I love writing really shitty code and then jerryrigging it with even worse code because the original code was so bad
                return;
            }
            const newOffset = this.state.recentOffset+delta;
            if(newOffset<0)return;
            this.setState({recentOffset: newOffset});
            if(!this.state.recent[newOffset]){
                this.loadLatest(newOffset);
            }
        }
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (<HomeContext.Provider value={{...this.state, updateOffset: this.updateOffset}}>
            <Home/>
        </HomeContext.Provider>);
    }
}