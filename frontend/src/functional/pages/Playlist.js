import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import {PlayerContext} from "../../Context";
import ContextMenuWrapper from "../../presentational/ContextMenuWrapper";
import Button from "../../presentational/Button";
import {PlayArrow, Shuffle} from "@material-ui/icons";
import Song from "../../presentational/Song";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 17/01/2020
 * ╚════ ║   (music3) Playlist
 *  ════╝
 */
function shuffleArray(originalArray) {
    let array = [].concat(originalArray);
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export default class Artist extends React.Component {
    state = {
    };

    constructor(props){
        super(props);
        let id = props.data.id;
        document.title = `Playlist | Petify`;
        axios.get(`http://localhost:3000/api/v2/playlist/${id}`).then((res)=>{
            document.title = `${res.data.name} | Petify`;
            this.setState(res.data)
        }).catch((error)=>this.setState({error: error.toString()}));

    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        if(!this.state.songs)
            return <div>Loading</div>;
        return (<PlayerContext.Consumer>{player =>(
            <>
                <ContextMenuWrapper/>
                <div id="artistInfo">
                    <div>
                        <h2>{this.state.name}</h2>
                        <Button Icon={PlayArrow} text="Play" onClick={()=>{player.control.addToQueue(this.state.songs)}}/>
                        <Button Icon={Shuffle} text="Shuffle" onClick={()=>{player.control.addToQueue(shuffleArray(this.state.songs))}}/>
                    </div>
                </div>
                <ul className='songList'>
                    {this.state.songs.map((song)=>{
                        return <Song song={song} key={song.id}/>
                    })}
                </ul>
            </>
        )}</PlayerContext.Consumer>);
    }
}