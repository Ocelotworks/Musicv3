import React from 'react';

export const MenuContext = React.createContext({
    isOpen: false,
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
        album: 'https://placekitten.com/400/400',
        title: 'A Song',
        artist: 'An Artist'
    },
    account: '',
});