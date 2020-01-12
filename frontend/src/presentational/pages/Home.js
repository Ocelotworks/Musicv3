/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Home
 *  ════╝
 */

import React from 'react';
import {HomeContext, PlayerContext} from "../../Context";
import SongCarousel from "../SongCarousel";
import '../../css/pages/Home.css';
import ContextMenuWrapper from "../ContextMenuWrapper";

export default function(){
    document.title = "Home | Petify";
    return (
        <HomeContext.Consumer>{
            home => (<>
                <ContextMenuWrapper/>
                <h1>Recommended</h1>
                <SongCarousel songs={home.recent} class='homeCarousel'/>
                <h1>Latest Additions</h1>
                <SongCarousel songs={home.recent} class='homeCarousel'/>
            </>)
        }</HomeContext.Consumer>
    )
}