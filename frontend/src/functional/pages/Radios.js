/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) Radio
 *  ════╝
 */
import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import Playlist from "../../presentational/Playlist";
import '../../css/pages/Playlists.css';
import {PlaylistAdd} from "@material-ui/icons";
import Button from "../../presentational/Button";
import Radio from "../../presentational/Radio";
import StandardLoader from "../../presentational/StandardLoader";


export default class Radios extends React.Component {
    state = {
        radios: null,
    };

    constructor(props){
        super(props);
        document.title = `Radios | Petify`;
        axios.get('http://localhost:3000/api/v2/radio').then((res)=>{
            this.setState({
                radios: res.data,
            })
        }).catch((error)=>this.setState({error: error.toString()}));
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (
            <div>
                <h1>Radios</h1>
                <h3>Radios are basically automatic playlists that you can listen to with other people.</h3>
                <Button Icon={PlaylistAdd} text="New"/>
                <ul className='playlistList'>
                    <StandardLoader array={this.state.radios} mapFunction={(radio)=><Radio radio={radio}/>} noneText="There are no Radios yet."/>
                </ul>
            </div>);
    }
}