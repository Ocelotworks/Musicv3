import React from "react";
import SongCard from "./SongCard";
import '../css/SongCarousel.css';
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import SongCardLoading from "./SongCardLoading";
import {HomeContext} from "../Context";
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) SongCarousel
 *  ════╝
 *  songs.slice(home[offset],home[offset]+6).map((song)=>song.id ? <SongCard key={song.id} song={song}/> : <SongCardLoading key={Math.random()}/>)}
 */

export default function({songs, isRecommended}){
    let offset = isRecommended?"recommendedOffset":"recentOffset";

    function generateSongElements(offset){
        let songElements = [];

        for(let i = offset; i < offset+6; i++){
            songElements.push(songs[i] ? <SongCard key={isRecommended+"home"+songs[i].id+i} song={songs[i]}/> : <SongCardLoading key={isRecommended+"hloading"+i}/>)
        }
        return songElements;
    }

    return (
        <HomeContext.Consumer>{home => (<div className="songCarousel">
            <ChevronLeft onClick={()=>home.updateOffset(-6, isRecommended)}/>
            {generateSongElements(home[offset])}
            <ChevronRight onClick={()=>home.updateOffset(6, isRecommended)}/>
        </div>)}</HomeContext.Consumer>)
}


