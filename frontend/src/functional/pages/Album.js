/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) Artist
 *  ════╝
 */

import * as React from "react";
import axios from "axios";
import Song from "../../presentational/Song";
import Button from "../../presentational/Button";
import '../../css/pages/Artist.css';
import {PlayArrow, Shuffle} from "@material-ui/icons";
import {PlayerContext} from "../../Context";
import ContextMenuWrapper from "../../presentational/ContextMenuWrapper";
import Error from "../../presentational/Error";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export default class Album extends React.Component {
    state = {
        songs: [],
        album: {
            id: "",
            name: "",
            artist: {
                id: "",
                name:""
            }
        },
    };

    constructor(props){
        super(props);
        let id = props.data.id;
        document.title = `Album | Petify`;
        axios.get(`http://localhost:3000/api/v2/album/${id}`).then((res)=>{
            document.title = `${res.data.name} | Petify`;
            this.setState({
                album: res.data,
            })
        }).catch((error)=>this.setState({error: error.toString()}));

        axios.get(`http://localhost:3000/api/v2/album/${id}/songs`).then((res)=>{
            this.setState({
                songs: res.data,
            })
        }).catch((error)=>this.setState({error: error.toString()}));
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (<PlayerContext.Consumer>{player =>(
            <>
                <ContextMenuWrapper/>
                <div id="artistInfo">
                    {this.state.album.id && <img src={`http://localhost:3000/api/v2/album/${this.state.album.id}/image`} alt={this.state.album.name}/>}
                    <div>
                        <h2>{this.state.album.name}</h2>
                        <h3>{this.state.album.artist.name}</h3>
                        <Button Icon={PlayArrow} text="Play Album" onClick={()=>{player.control.addToQueue(this.state.songs)}}/>
                        <Button Icon={Shuffle} text="Shuffle Album" onClick={()=>{
                            let songs =[].concat(this.state.songs);
                            shuffleArray(songs);
                            player.control.addToQueue(songs);
                        }}/>
                    </div>
                </div>
                <ul className='songList'>
                    {this.state.songs.map((song)=>{
                        return <Song key={song.id} song={song}/>
                    })}
                </ul>
            </>
        )}</PlayerContext.Consumer>);
    }
}