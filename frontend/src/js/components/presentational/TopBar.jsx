import React from 'react';
import {MenuContext} from '../Context.jsx';
import {TopAppBar, TopAppBarActionItem, TopAppBarRow, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarTitle, TopAppBarFixedAdjust} from 'rmwc';
import '@material/top-app-bar/mdc-top-app-bar.scss';

export const TopBar = () => (
    <MenuContext.Consumer>
        {({setOpen}) => (
            <>
                <TopAppBar>
                    <TopAppBarRow>
                        <TopAppBarSection alignStart>
                            <TopAppBarNavigationIcon icon="menu" onClick={setOpen}/>
                            <TopAppBarTitle>Petify</TopAppBarTitle>
                        </TopAppBarSection>
                        <TopAppBarSection alignEnd>
                            <TopAppBarActionItem icon="favorite" />
                            <TopAppBarActionItem icon="star" />
                            <TopAppBarActionItem icon="mood" />
                        </TopAppBarSection>
                    </TopAppBarRow>
                </TopAppBar>
            </>
        )}
    </MenuContext.Consumer>
);