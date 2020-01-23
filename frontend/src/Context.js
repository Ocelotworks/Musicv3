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
        modalIsOpen: false,
    },
    control: {
        seekTrack: ()=>console.log("oh no"),
        setVolume: ()=>console.log("oh no"),
        toggleAutoplay: ()=>console.log("oh no"),
        togglePlaying: ()=>console.log("oh no"),
        toggleShuffle: ()=>console.log("oh no"),
        toggleCasting: ()=>console.log("oh no"),
        setRepeat: ()=>console.log("oh no"),
        previousTrack: ()=>console.log("oh no"),
        nextTrack: ()=>console.log("oh no"),
        clearQueue: ()=>console.log("oh no"),
        saveQueue: ()=>console.log("oh no"),
        playTrack: ()=>console.log("oh no"),
        addToQueue: ()=>console.log("oh no"),
        queueNext: ()=>console.log("oh no"),
        setIsOpen: ()=>console.log("oh no"),
    },
});

export const HomeContext = React.createContext({
    recommended: [],
    recent: [],
    loading: true,
});


export const ModalContext = React.createContext({
    setIsOpen: ()=>null,
});

export const UserContext = React.createContext({
    user: {},
    token: null,
});