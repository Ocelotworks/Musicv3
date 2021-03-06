/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 17/01/2020
 * ╚════ ║   (music3) Playlists
 *  ════╝
 */
import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import Playlist from "../../presentational/Playlist";
import '../../css/pages/Playlists.css';
import {PlaylistAdd, Visibility, VisibilityOff} from "@material-ui/icons";
import Button from "../../presentational/Button";
import StandardLoader from "../../presentational/StandardLoader";
import Radio from "../../presentational/Radio";


export default class Playlists extends React.Component {
    state = {
        playlists: [],
        viewPrivate: false,
    };

    constructor(props){
        super(props);
        document.title = `Playlists | Petify`;
        axios.get('http://localhost:3000/api/v2/playlist').then((res)=>{
            this.setState({
                playlists: res.data,
            })
        }).catch((error)=>this.setState({error: error.toString()}));
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (
            <div>
                <h1>Playlists</h1>
                <Button Icon={PlaylistAdd} text="New"/><Button Icon={this.state.viewPrivate ? Visibility : VisibilityOff} text={this.state.viewPrivate ? "View All" : "View Private"} onClick={()=>this.setState({viewPrivate: !this.state.viewPrivate})}/>
                <ul className='playlistList'>
                    <StandardLoader array={this.state.playlists.filter((playlist)=>!this.state.viewPrivate || playlist.private)} mapFunction={(playlist)=><Playlist playlist={playlist}/>} noneText={this.state.viewPrivate ? "No private playlists. You've got nothing to hide, huh?" : "There are no Playlists yet (that you can see)."}/>
                </ul>
        </div>);
    }
}