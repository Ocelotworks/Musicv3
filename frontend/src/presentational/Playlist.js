import React from "react";
import {Link} from "react-router-dom";
import User from "./User";
import {VisibilityOff} from "@material-ui/icons";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 17/01/2020
 * ╚════ ║   (music3) Playlist
 *  ════╝
 */


function formatSeconds(seconds){
    let amount = 0;
    let unit = "";
    if(seconds < 60){
        amount = seconds;
        unit = "second";
    }else if(seconds < 3600){
        amount = (seconds/60);
        unit = "minute";
    }else if(seconds < 86400){
        amount = (seconds/3600);
        unit = "hour";
    }else if(seconds < 604800){
        amount = (seconds/86400);
        unit = "day";
    }else if(seconds < 31556926){
        amount = (seconds/604800);
        unit = "week";
    }else{
        amount = (seconds/31556926);
        unit = "year";
    }

    amount = Math.round(amount);

    if(amount !== 1)
        unit += "s";

    return amount + " " + unit;
}

export default function({playlist}){
    return (
        <Link to={`/playlist/${playlist.id}`} className='playlistContainer'>
            <li className="playlist">
                <span className='playlistName'>{playlist.private && <VisibilityOff titleAccess="Private"/>} {playlist.name}</span>
                <span className='playlistInfo'>{playlist.count} Songs | {formatSeconds(playlist.runtime)}</span>
                <User user={playlist.owner}/>
            </li>
        </Link>
    )

}