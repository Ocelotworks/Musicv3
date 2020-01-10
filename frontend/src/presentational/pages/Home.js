/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Home
 *  ════╝
 */

import React from 'react';
import {HomeContext} from "../../Context";

export default function(){
    return (
        <HomeContext.Consumer>{
            home => (
                <div>Homey home home</div>
            )
        }</HomeContext.Consumer>
    )
}