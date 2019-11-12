import React from 'react';

export const MenuContext = React.createContext({
    isOpen: true,
    selectedIndex: 0,
    setOpen: (_open) => {},
    setSelectedIndex: (_selectedIndex) => {},
});

export const UserContext = React.createContext({
    name: '',
    account: '',
});


export const PlayerContext = React.createContext({
    song: {
        id: '',
        album: {
            id: '',
            name: 'An Album',
            url: 'https://placekitten.com/400/400',
        },
        title: 'A Song',
        artist: 'An Artist'
    },
    playing: false,
    shuffle: true,
    autoplay: true,
    loop: 0,
    next: function(){},
    prev: function(){},
    elapsed: 100,
});