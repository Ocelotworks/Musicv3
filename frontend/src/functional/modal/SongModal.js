/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 12/01/2020
 * ╚════ ║   (music3) SongModal
 *  ════╝
 */

import * as React from "react";
import axios from "axios";


export default class SongModal extends React.Component {
    state = {
        song: null,
    };

    constructor(props){
        super(props);
        let id = props.data.id;
        axios.get(`http://localhost:3000/api/v2/song/${id}/info`).then((res)=>{
            this.setState({
                song: res.data,
            })
        });

        // axios.get(`http://localhost:3000/api/v2/artist/${id}/songs`).then((res)=>{
        //     this.setState({
        //         songs: res.data,
        //     })
        // })
    }

    render() {
        if(!this.state.song){
            return (<div>Loading...</div>)
        }
        return (<div id="songModal">
            <div id="songModalHeader">
                {<img src={`http://localhost:3000/api/v2/album/${this.state.song.album.id}/image`} alt={this.state.song.album.name}/>}
                <div className="songInfoElement">
                    <h1>{this.state.song.title} ({this.state.song.genre.name})</h1>
                </div>
                <div className="songInfoElement">
                    <h2>{this.state.song.artist.name}</h2>
                </div>
                <div className="songInfoElement">
                    <h3>{this.state.song.plays} plays</h3>
                    <h3>Added: {this.state.song.timestamp} </h3>
                </div>
            </div>
        </div>);
    }
}