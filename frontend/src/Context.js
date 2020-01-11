/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Context
 *  ════╝
 */

import React from 'react';

export const PlayerContext = React.createContext({
    data: {
        song : null,
        volume: 100,
        elapsed: 0,
        playing: false,
        buffering: false,
        autoplay: true,
        shuffle: true,
        casting: false,
        castConnected: false,
        repeat: 0,
        repeatNow: false,
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
        nextTrack: ()=>null,
        clearQueue: ()=>null,
        saveQueue: ()=>null,
        playTrack: ()=>console.log("oh no"),
        addToQueue: ()=>null,
        queueNext: ()=>null,
    },
});

export const HomeContext = React.createContext({
    recommended: [],
    recent: [],
    loading: true,
});