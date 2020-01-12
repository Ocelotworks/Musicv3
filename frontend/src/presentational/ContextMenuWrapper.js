import React from "react";
import SongContextMenu from "../functional/SongContextMenu";
import {useRouteMatch} from "react-router-dom"
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 12/01/2020
 * ╚════ ║   (music3) ContextMenuWrapper
 *  ════╝
 */
export default function(){
    //For some reason required to stop react from crashing
    return<SongContextMenu data={useRouteMatch()}/>
}