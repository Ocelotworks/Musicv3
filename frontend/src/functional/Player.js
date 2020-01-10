/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Player
 *  ════╝
 */
import * as React from "react";
import {PlayerContext} from "../Context";
import Sidebar from "../presentational/Sidebar";


export default class Player extends React.Component {
    state = {
        song : {
            id: "",
            albumID: "",
            name: "Nothing",
            artist: {
                name: "Nobody",
                id: ""
            },
            length: 120,
        },
        volume: 100,
        elapsed: 0,
        playing: false,
        buffering: false,
        autoplay: true,
        shuffle: true,
        casting: false,
        repeat: 0,
        history:[],
        queue: [
            {
                id: "",
                albumID: "",
                name: "Nothing",
                artist: {
                    name: "Nobody",
                    id: ""
                },
                length: 120,
            },
            {
                id: "",
                albumID: "",
                name: "Nothing",
                artist: {
                    name: "Nobody",
                    id: ""
                },
                length: 120,
            }
        ],
        shuffleQueue: [],
    };

    toggleValue(value){
        return () => this.setState({[value]:!this.state[value]})
    }

    constructor(props){
        super(props);
        this.controls = {
            seekTrack: (event, seek)=>this.setState({elapsed: this.state.song.length * (seek/100)}),
            setVolume: (event, volume)=>this.setState({volume}),
            togglePlaying: ()=>{
                console.log(this.state.playing);
                this.setState({
                    playing: !this.state.playing,
                })
            },
            toggleAutoplay: this.toggleValue("autoplay"),
            toggleShuffle: this.toggleValue("shuffle"),
            toggleCasting: this.toggleValue("casting"),
            setRepeat: ()=>this.setState({repeat: (this.state.repeat + 1) % 3}),
            previousTrack: ()=>null,
            nextTrack: ()=>null,
            clearQueue: ()=>this.setState({queue:[]}),
            saveQueue: ()=>null,
        }
    }


    render() {
        return (<PlayerContext.Provider value={{data: this.state, control: this.controls}}>
            <Sidebar/>
        </PlayerContext.Provider>);
    }
}