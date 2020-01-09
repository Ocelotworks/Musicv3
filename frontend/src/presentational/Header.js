/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 09/01/2020
 * ╚════ ║   (music3) Header
 *  ════╝
 */
import React from 'react';
import '../css/Header.css'

export default function(){
    return (<div id="topBar">

        <span>Petify</span>
        <div id="topBarUserContainer">
            <div className="user">
                <img src="https://placekitten.com/16/16"/>
                <span>User stub</span>
            </div>
        </div>
    </div>)
}