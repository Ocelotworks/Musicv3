import React from "react";
import '../css/Song.css';
import {ContextMenuTrigger } from "react-contextmenu";
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Song
 *  ════╝
 */


export default function({song, contextMenu}){

    return (<ContextMenuTrigger id={contextMenu ? contextMenu : "songContextMenu"}>
            <li className="song">
                {song.artist.name} - {song.title}
            </li>
    </ContextMenuTrigger>)
}