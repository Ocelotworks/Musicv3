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
    Delete,
    VolumeDown,
    VolumeUp,
    PlaylistAdd
} from '@material-ui/icons';
import Slider from '@material-ui/core/Slider';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import {PlayerContext} from "../Context";
import Song from "./Song";

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
                        <img className="albumArt" src="https://placekitten.com/1024/1024" alt="Album!"/>
                        <p className="nowPlayingSong">Nothing</p>
                        <p className="nowPlayingArtist">Nobody</p>
                    </div>
                    <div className="sidebarElement" id="trackProgress">
                        {formatTime(player.data.elapsed)}/{formatTime(player.data.song.length)}
                        <TrackSlider value={(player.data.elapsed/player.data.song.length)*100} onChange={player.control.seekTrack}/>
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
                            <Cast onClick={player.control.toggleCasting} className={player.data.casting ? "enabled" : ""}/>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item>
                                <VolumeDown />
                            </Grid>
                            <Grid item xs>
                                <VolumeSlider defaultValue={player.data.volume} onChange={player.control.setVolume}/>
                            </Grid>
                            <Grid item>
                                <VolumeUp />
                            </Grid>
                        </Grid>
                    </div>
                    <div className="sidebarElement" id="queue">
                        <div id="queueHeader">
                            <span>Queue ({player.data.queue.length})</span>
                            <div>
                                <PlaylistAdd/>
                                <Delete/>
                            </div>
                        </div>
                        <ul className="songList">
                            {player.data.queue.map((song)=><Song song={song}/>)}
                        </ul>
                    </div>
                </div>
                )
        }</PlayerContext.Consumer>)
}