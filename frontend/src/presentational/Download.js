import User from "./User";
import React from "react";
import '../css/Download.css';
import Button from "./Button";
import {Delete, Replay} from "@material-ui/icons";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 25/01/2020
 * ╚════ ║   (music3) Download
 *  ════╝
 */
export default function({download, remove}){

    let inner;
    if(download.status === "PROCESSING"){
        inner = <div className={`downloadProgress ${download.status.toLowerCase()}`}>
            <span>{download.status}</span>
        </div>
    }else{
        inner = <div className={`downloadProgress ${download.status.toLowerCase()}`}>
            <div className='downloadControl'><Delete onClick={()=>remove(download.id)}/></div>
            <div className='downloadControl'><Replay/></div>
            <span>{download.status}</span>
        </div>
    }

    return (
        <li className="download">
            <img className="downloadImage" src={`http://localhost:3000/api/v2/album/${download.albumID}/image`} alt={download.title}/>
            <div className="downloadInfo">
                <span className="downloadTitle">{download.artist.name} - {download.title}</span>
                <span className="downloadLink">Source: {download.url}</span>
                {inner}
                <User user={download.owner}/>
            </div>
        </li>
    )
}