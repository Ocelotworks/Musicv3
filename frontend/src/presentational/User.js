import React from "react";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 14/01/2020
 * ╚════ ║   (music3) User
 *  ════╝
 */

import '../css/User.css';
import {Link} from "react-router-dom";
export default function({user}){
    return (<div className={`user level-${user.level}`}>
        <Link to={`/user/${user.id}`}><img src={user.avatar} alt={`${user.username}'s Avatar`}/><span>{user.username}</span></Link>
    </div>)
}