import React from 'react';
import {MenuContext} from '../Context.jsx';
import {SongTiles} from "./SongTiles.jsx";
export const Content = () => (
    <MenuContext.Consumer>
        {({selectedIndex}) => (
            <SongTiles/>
        )}
    </MenuContext.Consumer>
);