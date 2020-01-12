import React from 'react';
import Header from "./presentational/Header";
import Player from "./functional/Player";
import { HashRouter } from "react-router-dom";
import './css/App.css';

function App() {
  return (
    <HashRouter>
        <Header/>
        <Player/>
    </HashRouter>
  );
}
export default App;
