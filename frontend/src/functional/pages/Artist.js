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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export default class Artist extends React.Component {
    state = {
        songs: [],
        artist: {
            id: "",
            name: ""
        },
    };

    constructor(props){
        super(props);
        let id = props.data.id;
        document.title = `Artist | Petify`;
        axios.get(`http://localhost:3000/api/v2/artist/${id}`).then((res)=>{
            document.title = `${res.data.name} | Petify`;
            this.setState({
                artist: res.data,
            })
        });

        axios.get(`http://localhost:3000/api/v2/artist/${id}/songs`).then((res)=>{
            this.setState({
                songs: res.data,
            })
        })
    }

    render() {
        return (<PlayerContext.Consumer>{player =>(
            <>
                <ContextMenuWrapper/>
                <div id="artistInfo">
                    {this.state.artist.id && <img src={`http://localhost:3000/api/v2/artist/${this.state.artist.id}/image`} alt={this.state.artist.name}/>}
                    <div>
                        <h2>{this.state.artist.name}</h2>
                        <Button Icon={PlayArrow} text="Play Artist" onClick={()=>{player.control.addToQueue(this.state.songs)}}/>
                        <Button Icon={Shuffle} text="Shuffle Artist" onClick={()=>{
                            let songs =[].concat(this.state.songs);
                            shuffleArray(songs);
                            player.control.addToQueue(songs);
                        }}/>
                    </div>
                </div>
                <ul className='songList'>
                    {this.state.songs.map((song)=>{
                        song.artist = this.state.artist; //Saving time on the database side here, kind of
                        return <Song song={song} key={song.id}/>
                    })}
                </ul>
            </>
        )}</PlayerContext.Consumer>);
    }
}