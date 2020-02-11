/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) Radio
 *  ════╝
 */


import {Link} from "react-router-dom";
import User from "./User";
import React from "react";

export default function({radio}){
    return (
        <Link to={`/radio/${radio.id}`} className='playlistContainer'>
            <li className="playlist">
                <span className='playlistName'>{radio.name}</span>
                <span className='playlistInfo'>{radio.desc}</span>
                <User user={radio.owner}/>
            </li>
        </Link>
    )
}