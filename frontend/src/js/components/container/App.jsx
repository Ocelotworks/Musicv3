import React from 'react';
import ReactDOM from 'react-dom';
import {TopBar} from "../presentational/TopBar.jsx";
import {MenuContext, UserContext} from "../Context.jsx";
import {Menu} from "../presentational/Menu.jsx";
import {Content} from "../presentational/Content.jsx";
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import {Snackbar} from '@material/react-snackbar';

class App extends React.Component {

    state = {
        menu: {
            isOpen: true,
            selectedIndex: 0,
        },
    };

    setOpen = (isOpen) => {
        const menu = this.state.menu;
        this.setState({
            menu: {
                ...menu,
                isOpen: isOpen !== undefined ? isOpen : !menu.isOpen,
            },
        });
    };

    setSelectedIndex = (selectedIndex) => {
        const menu = this.state.menu;
        this.setState({
            menu: {
                ...menu,
                selectedIndex: menu.selectedIndex = selectedIndex,
            },
        });
    };

    render() {
        const {isOpen, selectedIndex} = this.state.menu;

        return (
            <MenuContext.Provider
                value={{
                    isOpen,
                    selectedIndex,
                    setOpen: this.setOpen,
                    setSelectedIndex: this.setSelectedIndex,
                }}
            >
                <UserContext.Provider
                    value={{
                        name: 'Anonymous',
                        account: 'unknown@example.com',
                    }}
                >
                    <Menu />
                    <Snackbar
                        timeoutMs={10000}
                        message='You became a programmer!'
                        actionText='dismiss'
                    />
                </UserContext.Provider>
            </MenuContext.Provider>
        );
    }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : false;