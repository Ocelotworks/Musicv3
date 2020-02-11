/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 09/01/2020
 * ╚════ ║   (music3) Sidebar
 *  ════╝
 */

import React from 'react';
import '../css/Sidebar.css'
import {
    PlayArrow,
    FastForward,
    FastRewind,
    Pause,
    Repeat,
    RepeatOne,
    PlayCircleOutlineOutlined,
    Shuffle,
    Cast,
    CastConnected,
    Delete,
    VolumeDown,
    VolumeUp,
    PlaylistAdd,
    ArrowDropUp,
    ArrowDropDown,
    Info, Radio,
} from '@material-ui/icons';
import Slider from '@material-ui/core/Slider';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import {PlayerContext} from "../Context";
import Song from "./Song";
import {ContextMenu, MenuItem} from "react-contextmenu";
import {Link} from "react-router-dom";

const TrackSlider = withStyles({
    root: {
        color: '#1ed760',
        height: 8,
    },
    thumb: {
        height: 12,
        width: 12,
        backgroundColor: '#343434',
        border: '2px solid currentColor',
        marginTop: -2,
        marginLeft: -6,
        transition: 'opacity 0.3s',
        'transition-delay': "0.5s",
        opacity: 0,
        '&:hover': {
            opacity: 1,
            'transition-delay': "0s",
        },
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const VolumeSlider = withStyles({
    root: {
        color: '#1ed760',
    },
})(Slider);


function formatTime(totalSeconds){
    if(isNaN(totalSeconds))return "00:00";
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let output = "";
    if(hours > 0){
        output =  `${hours < 10 ? "0":""}${hours}:${output}`
    }

    output += `${minutes < 10 ? "0":""}${minutes}:${seconds < 10 ? "0":""}${seconds}`;

    return output;
}

export default function(){
    return (
        <PlayerContext.Consumer>{
                player => (
                <div id="sideBar">
                    <div className="sidebarElement">
                        <img className="albumArt" src={player.data.song && player.data.song.albumID ? `http://localhost:3000/api/v2/album/${player.data.song.albumID}/image` : "http://localhost:3000/img/album.png"} alt={player.data.song.name}/>
                        <p className="nowPlayingSong">{player.data.song.title || "Nothing"}</p>
                        <Link className="nowPlayingArtist" to={`/artist/${player.data.song ? player.data.song.artist.id : ""}`}>{player.data.song.artist.name || "Νοbody"}</Link>
                    </div>
                    <div className="sidebarElement" id="trackProgress">
                        {formatTime(player.data.elapsed)}/{formatTime(player.data.song.duration)}
                        <TrackSlider value={(player.data.elapsed/player.data.song.duration)*100} className={player.data.buffering ? "buffering" : ""} onChange={player.control.seekTrack}/>
                    </div>
                    <div className="sidebarElement" id="controls">
                        <div id="primaryControls">
                            <FastRewind onClick={player.control.previousTrack}/>
                            {player.data.playing ? <Pause onClick={player.control.togglePlaying}/> : <PlayArrow onClick={player.control.togglePlaying}/>}
                            <FastForward  onClick={player.control.nextTrack}/>
                        </div>
                        <div id="secondaryControls">
                            {player.data.repeat === 1 ? <RepeatOne onClick={player.control.setRepeat} className="enabled"/> : <Repeat className={player.data.repeat > 1 ? "enabled" : ""}  onClick={player.control.setRepeat}/>}
                            <PlayCircleOutlineOutlined onClick={player.control.toggleAutoplay} className={player.data.autoplay ? "enabled" : ""}/>
                            <Shuffle onClick={player.control.toggleShuffle} className={player.data.shuffle ? "enabled" : ""}/>
                            <google-cast-launcher/>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item>
                                <VolumeDown onClick={()=>player.control.setVolume(null,0)}/>
                            </Grid>
                            <Grid item xs>
                                <VolumeSlider value={player.data.volume} onChange={player.control.setVolume}/>
                            </Grid>
                            <Grid item>
                                <VolumeUp onClick={()=>player.control.setVolume(null, 100)}/>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`sidebarElement ${!player.data.radio ? "hidden" : ""}`} id="currentRadio">
                    {
                        player.data.radio ? <Link to={`/radio/${player.data.radio.id}`}><Radio/>{player.data.radio.name}</Link> : ""
                    }
                    </div>
                    <div className="sidebarElement" id="queue">
                        <div id="queueHeader">
                            <span>{player.data.radio ? 'Queue' : `Queue (${player.data.queue.length})`}</span>
                            <div className={player.data.radio ? "hidden" : ""}>
                                <PlaylistAdd onClick={player.control.saveQueue}/>
                                <Delete onClick={player.control.clearQueue}/>
                            </div>
                        </div>
                        <ContextMenu id='queueContextMenu'>
                            <MenuItem>
                                <ArrowDropUp/><span>Move to Top</span>
                            </MenuItem>
                            <MenuItem>
                                <Shuffle/><span>Randomise Position</span>
                            </MenuItem>
                            <MenuItem>
                                <ArrowDropDown/><span>Move to Bottom</span>
                            </MenuItem>
                            <MenuItem>
                                <Info/><span>Song Info</span>
                            </MenuItem>
                        </ContextMenu>
                        <ul className="songList">
                            {player.data.queue.map((song)=><Song song={song} contextMenu='queueContextMenu'/>)}
                        </ul>
                    </div>
                </div>
                )
        }</PlayerContext.Consumer>)
}