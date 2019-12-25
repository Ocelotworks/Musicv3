import {MenuContext} from '../Context.jsx';
import React from 'react';
import {TopBar} from "./TopBar.jsx";
import {Content} from "./Content.jsx";
import {Player} from "./Player.jsx";
import {Drawer, DrawerContent, DrawerAppContent, TopAppBarFixedAdjust} from 'rmwc';

export const Menu = () => (
    <MenuContext.Consumer>
        {({isOpen, setOpen, selectedIndex, setSelectedIndex}) => (
            <div className='drawer-container'>
                <TopBar/>
                <TopAppBarFixedAdjust className='top-app-bar-fix-adjust'>
                    <Drawer dismissible open={isOpen}>
                        <DrawerContent>
                           <Player/>
                        </DrawerContent>
                    </Drawer>
                    <DrawerAppContent className='drawer-app-content'>
                        <Content/>
                    </DrawerAppContent>
                </TopAppBarFixedAdjust>
            </div>
        )}
    </MenuContext.Consumer>
);