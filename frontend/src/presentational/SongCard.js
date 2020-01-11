/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) SongCard
 *  ════╝
 */

import {ContextMenuTrigger} from "react-contextmenu";
import React from "react";
import '../css/SongCard.css';
import {PlayerContext} from "../Context";


export default function({song, contextMenu}){
    function collect(){
        return {song};
    }
    return (<ContextMenuTrigger id={contextMenu ? contextMenu : "songContextMenu"} collect={collect}>
        <PlayerContext.Consumer>{player =>
                <div className="songCard" onClick={()=>player.control.playTrack(song)}>
                    <img src={`http://localhost:3000/api/v2/album/${song.albumID}/image`} alt={song.name}/>
                    <span> {song.artist.name} - {song.title.replace(/ /g, "\u00a0") /*non breaking space*/}</span>
                </div>
        }</PlayerContext.Consumer>
    </ContextMenuTrigger>)
}