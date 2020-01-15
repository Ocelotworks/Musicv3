/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 14/01/2020
 * ╚════ ║   (music3) SongOverride
 *  ════╝
 */

import * as React from "react";
import axios from 'axios';
import {PlayerContext} from "../../Context";
import {Redirect} from "react-router";
import ContextMenuWrapper from "../../presentational/ContextMenuWrapper";
import Button from "../../presentational/Button";
import {PlayArrow, Shuffle} from "@material-ui/icons";
import Song from "../../presentational/Song";

export default class HomeController extends React.Component {
    state = {
        song: null,
        complete: false,
    };

    constructor(props){
        super(props);
        axios.get(`http://localhost:3000/api/v2/song/${props.data.id}`).then((res)=>{
            this.setState({
                song: res.data,
            })
        }).catch((error)=>this.setState({error: error.toString()}))
    }

    render() {
        if(this.state.song)
            return (<PlayerContext.Consumer>{player =>(
                <>
                    {player.control.playTrack(this.state.song)}
                    <Redirect to='/'/>
                </>
            )}</PlayerContext.Consumer>);
        return <div>Loading...</div>
    }
}