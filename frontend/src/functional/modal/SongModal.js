/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 12/01/2020
 * ╚════ ║   (music3) SongModal
 *  ════╝
 */

import * as React from "react";
import axios from "axios";
import '../../css/modal/SongModal.css';
import User from "../../presentational/User";
import {Link, NavLink} from "react-router-dom";
import {
    PlaylistPlay,
    Link as LinkIcon,
    Edit,
    Delete
} from "@material-ui/icons";
import {Route, Router, Switch} from "react-router";
import StupidReact from "../../presentational/pages/StupidReact";
import Artist from "../pages/Artist";
import Album from "../pages/Album";
import Related from "./song/Related";

const links = [
    {icon: PlaylistPlay, href: "playlists", name: "Playlists"},
    {icon: LinkIcon, href: "related", name: "Related"},
    {icon: Edit, href: "edit", name: "Edit"},
    {icon: Delete, href: "delete", name: "Delete"},
];


export default class SongModal extends React.Component {
    state = {
        song: null,
    };

    currentUrl = "";

    constructor(props){
        super(props);
        let id = props.data.id;
        this.currentUrl = `${props.extraData.returnUrl}/modal/song/${id}/`;

        console.log(props);

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
                <div className="songInfoColumn">
                    <div className="songInfoElement">
                        <h1>{this.state.song.title}</h1>
                    </div>
                    <div className="songInfoElement">
                        <h2><Link to={`/artist/${this.state.song.artist.id}`}>{this.state.song.artist.name}</Link> (<Link to={`/genre/${this.state.song.genre.id}`}>{this.state.song.genre.name}</Link>)</h2>
                    </div>
                    <div className="songInfoElement">
                        <div>Played {this.state.song.plays} {this.state.song.plays === 1 ? "time" : "times"} | Added: {new Date(this.state.song.timestamp).toLocaleDateString()}</div>
                        Added By <User user={this.state.song.owner}/>
                    </div>
                </div>
            </div>
            <div id="songModalNav">
                {links.map((link)=><NavLink key={link.name} to={this.currentUrl+link.href} exact={link.exact || false} className="navLink"><link.icon/><div>{link.name}</div></NavLink>)}
            </div>
            <div id="songModalTabContainer">
                <Switch>
                    <Route path={`${this.currentUrl}related`} children={<Related song={this.state.song}/>}/>
                </Switch>
            </div>
        </div>);
    }
}