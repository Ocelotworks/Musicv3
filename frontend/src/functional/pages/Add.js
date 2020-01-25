import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import Button from "../../presentational/Button";
import {Clear, CloudDownload, Replay} from "@material-ui/icons";
import Download from "../../presentational/Download";

import '../../css/pages/Add.css'

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 25/01/2020
 * ╚════ ║   (music3) Add
 *  ════╝
 */
export default class Add extends React.Component {
    state = {
        downloads: null,
        refreshing: true,
    };

    interval = null;

    constructor(props){
        super(props);
        document.title = `Add | Petify`;
        this.update();
        this.interval = setInterval(()=>this.update(), 5000);
    }

    update(){
        if(document.hidden || document.msHidden || document.webkitHidden)return;
        this.setState({refreshing: true});
        axios.get('http://localhost:3000/api/v2/download').then((res)=>{
            this.setState({
                downloads: res.data,
                refreshing: false,
            })
        }).catch((error)=>{
            this.setState({error: error.toString(), refreshing: false})
        });
    }

    remove(that){
        //Fucking dumb ass currying shit
        return function(id){
            axios.delete(`http://localhost:3000/api/v2/download/${id}`).then((res)=>{
                console.log(res.data);
                that.update();
            }).catch(console.error)
        }
    }

    componentWillUnmount() {
        if(this.interval)
            clearInterval(this.interval);
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (
            <div>
                <h1>Add Songs</h1>
                <div id="addSongs">
                    <span>You can import songs and playlists from most popular sites such as YouTube or SoundCloud. The song must be available to stream in the servers country.</span>
                    <input id="songUrlInput" type="text" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"/>
                    <div id="advancedControls">
                        <div className="control">
                            <input id="pullSongData" type="checkbox"/><label htmlFor="pullSongData">Pull song data from last.fm</label>
                        </div>
                        <div className="control">
                            <input id="addToPlaylist" type="checkbox"/><label htmlFor="addToPlaylist">Add to playlist when complete</label>
                        </div>
                    </div>
                    <Button Icon={CloudDownload} text=" Add to Download Queue"/>
                </div>
                <h1>Import Queue</h1>
                <ul className='downloadsList'>
                    <Button Icon={Clear} text="Clear Failed"/> <Button Icon={Replay} disabled={this.state.refreshing} text="Refresh" onClick={()=>this.update()}/>
                    {this.state.downloads ? this.state.downloads.length ? this.state.downloads.map((download)=><Download key={`dl-${download.id}`} download={download} remove={this.remove(this)}/>) : <div>Nothing Queued</div> : <div>Loading...</div>}
                </ul>
            </div>);
    }
}