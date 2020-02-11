import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import ContextMenuWrapper from "../../presentational/ContextMenuWrapper";
import Song from "../../presentational/Song";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 21/01/2020
 * ╚════ ║   (music3) User
 *  ════╝
 */
export default class User extends React.Component {
    state = {
        user: {},
        songs: null,
    };

    constructor(props){
        super(props);
        let id = props.data.id;
        axios.get(`http://localhost:3000/api/v2/user/${id}`).then((res)=>{
            document.title = `${res.data.name} | Petify`;
            this.setState({user: res.data});
        }).catch((error)=>this.setState({error: error.toString()}));

        axios.get(`http://localhost:3000/api/v2/user/${id}/songs`).then((res)=>{
            this.setState({songs: res.data});
        }).catch((error)=>this.setState({error: error.toString()}));
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (
            <>
                <ContextMenuWrapper/>
                <div id="artistInfo">
                    {this.state.user.id && <img src={this.state.user.avatar} alt={this.state.user.username}/>}
                    <div>
                        <h2>{this.state.user.username}</h2>
                    </div>
                </div>
                <ul className='songList'>
                    {this.state.songs ? this.state.songs.length > 0 ? this.state.songs.map((song)=> <Song song={song} key={song.id}/>) : <div>This user has not uploaded any songs.</div> : <div>Loading...</div>}
                </ul>
            </>);
    }
}