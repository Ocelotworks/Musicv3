/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Home
 *  ════╝
 */

import React from 'react';
import {HomeContext} from "../../Context";
import SongCarousel from "../SongCarousel";
import SongContextMenu from "../../functional/SongContextMenu";
import '../../css/pages/Home.css';

export default function(){
    return (
        <HomeContext.Consumer>{
            home => (<>
                <SongContextMenu/>
                <h1>Recommended</h1>
                <SongCarousel songs={home.recent} class='homeCarousel'/>
                <h1>Latest Additions</h1>
                <SongCarousel songs={home.recent} class='homeCarousel'/>
            </>)
        }</HomeContext.Consumer>
    )
}