import React from 'react';
import {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import {Cell, Grid, Row} from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import {MenuContext} from '../Context.jsx';
export const Content = () => (
    <MenuContext.Consumer>
        {({selectedIndex}) => (
            <Grid>
                <Row>
                    <Cell>
                        SHIT
                    </Cell>
                    <Cell>
                        CUNT
                    </Cell>
                    <Cell>
                        FUCK
                    </Cell>
                    <Cell>
                        WHORE
                    </Cell>
                    <Cell>
                        CUNT
                    </Cell>
                </Row>
            </Grid>
        )}
    </MenuContext.Consumer>
);