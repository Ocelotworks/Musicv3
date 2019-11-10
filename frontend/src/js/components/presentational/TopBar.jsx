import React from 'react';
import TopAppBar, {
    TopAppBarIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
} from '@material/react-top-app-bar';
import {DrawerAppContent} from '@material/react-drawer';
import MaterialIcon from '@material/react-material-icon';
import {MenuContext} from '../Context.jsx';
import {Content} from "./Content.jsx";
export const TopBar = () => (
    <MenuContext.Consumer>
        {({setOpen}) => (
            <TopAppBar>
                <TopAppBarRow>
                    <TopAppBarSection align='start'>
                        <TopAppBarIcon navIcon tabIndex={0}>
                            <MaterialIcon
                                hasRipple
                                icon='menu'
                                onClick={() => setOpen()}
                            />
                        </TopAppBarIcon>
                        <TopAppBarTitle className='title'>
                            Material Components React
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection align='end'>
                        <a rel='noopener noreferrer' target='_blank' href='https://google.com'>
                            <TopAppBarIcon actionItem tabIndex={0}>
                                <MaterialIcon aria-label='code' hasRipple icon='code' />
                            </TopAppBarIcon>
                        </a>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
        )}
    </MenuContext.Consumer>
);