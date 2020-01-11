/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) SongContextMenu
 *  ════╝
 */
import {ContextMenu, MenuItem} from "react-contextmenu";
import React from "react";
import {
    Queue,
    QueuePlayNext,
    PlaylistAdd,
    Share,
    Album,
    Person,
    Info
} from "@material-ui/icons";
import {PlayerContext} from "../Context";
import {Redirect} from "react-router";


export default class SongContextMenu extends React.Component {
    state = {
       redirect: null,
    };

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect}/>
        return (<PlayerContext.Consumer>{(player)=>(
                <ContextMenu id='songContextMenu'>
                    <MenuItem onClick={(evt,data)=>player.control.addToQueue(data.song)}>
                        <Queue/><span>Add To Queue</span>
                    </MenuItem>
                    <MenuItem onClick={(evt,data)=>player.control.queueNext(data.song)}>
                        <QueuePlayNext/><span>Play Next</span>
                    </MenuItem>
                    <MenuItem>
                        <PlaylistAdd/><span>Add to Playlist</span>
                    </MenuItem>
                    <MenuItem>
                        <Share/><span>Copy Link</span>
                    </MenuItem>
                    <MenuItem onClick={(event, data)=>this.setState({redirect:`/album/${data.song.albumID}`})}>
                        <Album/><span>Go To Album</span>
                    </MenuItem>
                    <MenuItem onClick={(event, data)=>this.setState({redirect:`/artist/${data.song.artist.id}`})}>
                        <Person/><span>Go To Artist</span>
                    </MenuItem>
                    <MenuItem>
                        <Info/><span>Song Info</span>
                    </MenuItem>
                </ContextMenu>
            )}</PlayerContext.Consumer>
        )
    }
}
