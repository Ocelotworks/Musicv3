import React from "react";
import '../css/Song.css';
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Song
 *  ════╝
 */


export default function({song}){
    return (<li className="song">
        {song.artist.name} - {song.name}
    </li>)
}