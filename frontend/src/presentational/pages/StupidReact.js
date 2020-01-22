import React from "react";
import {useParams} from "react-router-dom";
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) StupidReact
 *  ════╝
 */
export default function({Target, props}){
    //For some reason required to stop react from crashing
    return<Target data={useParams()} extraData={props}/>
}