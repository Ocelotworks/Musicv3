import React from 'react';
import ReactDOM from 'react-dom';
import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import Header from "../presentational/header.jsx";

class App extends React.Component {
    render() {
        return (
            <Header/>
        );
    }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : false;