import React from 'react';
import Header from "./presentational/Header";
import Player from "./functional/Player";
import HomeController from "./functional/Home";

import './css/App.css';

function App() {
  return (
    <>
        <Header/>
        <Player/>
        <div id="page">
            <HomeController/>
        </div>
    </>
  );
}

export default App;
