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
    Delete as DeleteIcon,
} from "@material-ui/icons";
import {Route, Switch} from "react-router";
import Related from "./song/Related";
import Delete from "./song/Delete";

const links = [
    {icon: PlaylistPlay, href: "playlists", name: "Playlists"},
    {icon: LinkIcon, href: "related", name: "Related"},
    {icon: Edit, href: "edit", name: "Edit", requireHeader: "PATCH", className: "gold"},
    {icon: DeleteIcon, href: "delete", name: "Delete", requireHeader: "DELETE", className: "red"},
];


export default class SongModal extends React.Component {
    state = {
        song: null,
        allowedHeaders: [],
    };

    currentUrl = "";

    constructor(props){
        super(props);
        console.log(props.extraData.controls);
        let id = props.data.id;
        this.currentUrl = `${props.extraData.returnUrl}/modal/song/${id}/`;

        console.log(props);

        axios.get(`http://localhost:3000/api/v2/song/${id}/info`).then((res)=>{
            this.setState({
                song: res.data,
            })
        });

        axios.options(`http://localhost:3000/api/v2/song/${id}`).then((res)=>{
            if(!res.headers.allow)return;
            this.setState({allowHeaders: res.headers["allow"].split(", ")});
        });
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
                {links.filter((link)=>!link.requireHeader||this.state.allowHeaders.includes(link.requireHeader)).map((link)=><NavLink key={link.name} to={this.currentUrl+link.href} exact={link.exact || false} className={"navLink "+(link.className || "")}><link.icon/><div>{link.name}</div></NavLink>)}
            </div>
            <div id="songModalTabContainer">
                <Switch>
                    <Route path={`${this.currentUrl}related`} children={<Related song={this.state.song}/>}/>
                    <Route path={`${this.currentUrl}delete`} children={<Delete song={this.state.song} controls={this.props.extraData.controls}/>}/>
                </Switch>
            </div>
        </div>);
    }
}