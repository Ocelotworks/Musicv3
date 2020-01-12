import React from "react";
import '../css/Song.css';
import {ContextMenuTrigger } from "react-contextmenu";
import {PlayerContext} from "../Context";
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Song
 *  ════╝
 */


export default function({song, contextMenu}){
    function collect(){
        return {song};
    }
    return (<ContextMenuTrigger id={contextMenu ? contextMenu : "songContextMenu"} collect={collect}>
        <PlayerContext.Consumer>{player =>
            <li className="song" onClick={()=>player.control.playTrack(song)}>
                {song.artist.name} - {song.title}
            </li>
        }</PlayerContext.Consumer>
    </ContextMenuTrigger>)
}