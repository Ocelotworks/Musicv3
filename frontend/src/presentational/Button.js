import React from "react";
import '../css/Button.css';
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) Button
 *  ════╝
 */

export default function({text, onClick, Icon}){
    return (<button onClick={onClick}>
        <Icon/>
        <span>{text}</span>
    </button>)
}