import {MenuContext} from '../Context.jsx';
import React from 'react';
import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle} from '@material/react-drawer';
import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import {TopBar} from "./TopBar.jsx";
import {Content} from "./Content.jsx";
require('../../../css/Menu.scss');

export const Menu = () => (
    <MenuContext.Consumer>
        {({isOpen, setOpen, selectedIndex, setSelectedIndex}) => (
            <div className='drawer-container'>
                <TopBar/>
                <TopAppBarFixedAdjust className='top-app-bar-fix-adjust'>
                    <Drawer dismissible open={isOpen}>
                        <DrawerContent>
                            <List singleSelection selectedIndex={selectedIndex}>
                                <ListItem>
                                    <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
                                    <ListItemText primaryText='Mail' />
                                </ListItem>
                            </List>
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