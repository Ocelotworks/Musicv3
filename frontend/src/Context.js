/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Context
 *  ════╝
 */

import React from 'react';

export const PlayerContext = React.createContext({
    data: {
        song : {
            id: "",
            albumID: "",
            name: "Nothing",
            artist: {
                name: "Nobody",
                id: ""
            },
            length: 120,
        },
        volume: 100,
        elapsed: 0,
        playing: false,
        buffering: false,
        autoplay: true,
        shuffle: true,
        casting: false,
        repeat: 0,
        queue: [],
    },
    control: {
        seekTrack: ()=>null,
        setVolume: ()=>null,
        toggleAutoplay: ()=>null,
        togglePlaying: ()=>console.log,
        toggleShuffle: ()=>null,
        toggleCasting: ()=>null,
        setRepeat: ()=>null,
        previousTrack: ()=>null,
        nextTrack: ()=>null
    },
});