import React from "react";
import SongCard from "./SongCard";
import '../css/SongCarousel.css';
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import SongCardLoading from "./SongCardLoading";
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/01/2020
 * ╚════ ║   (music3) SongCarousel
 *  ════╝
 */

export default function({songs}){
    return (<div className="songCarousel">
        <ChevronLeft/>
        {songs.map((song)=>song.id ? <SongCard song={song}/> : <SongCardLoading/>)}
        <ChevronRight/>
    </div>)
};


