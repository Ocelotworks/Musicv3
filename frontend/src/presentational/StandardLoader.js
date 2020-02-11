import {Link} from "react-router-dom";
import User from "./User";
import React from "react";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) StandardLoader
 *  ════╝
 */
export default function({array, noneText = "Nothing here", mapFunction}){
    if(!array)
        return <div>Loading...</div>;
    if(array.length === 0)
        return <div>{noneText}</div>;
    return array.map(mapFunction);
}