import React from 'react';
import ReactDOM from 'react-dom';
import {MenuContext, UserContext} from "../Context.jsx";
import {Menu} from "../presentational/Menu.jsx";

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
                </UserContext.Provider>
            </MenuContext.Provider>
        );
    }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : false;