import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import ContextMenuWrapper from "../../presentational/ContextMenuWrapper";
import Song from "../../presentational/Song";
import StandardLoader from "../../presentational/StandardLoader";
import "../../css/pages/User.css"

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
            document.title = `${res.data.username} | Petify`;
            this.setState({user: res.data});
        }).catch((error)=>this.setState({error: error.toString()}));

        axios.get(`http://localhost:3000/api/v2/user/${id}/songs`).then((res)=>{
            this.setState({songs: res.data});
        }).catch((error)=>this.setState({error: error.toString()}));

        axios.options(`http://localhost:3000/api/v2/user/${id}`).then((res)=>{
            if (!res.headers.allow) return;
            this.setState({allowHeaders: res.headers["allow"].split(", ")});

            if(res.headers["allow"].indexOf("PATCH") > -1){
                axios.get(`http://localhost:3000/api/v2/user/me/session`).then((res)=>{
                    console.log(res.data);
                    this.setState({sessions: res.data});
                }).catch((error)=>this.setState({error: error.toString()}));
            }
        }).catch((error)=>this.setState({error: error.toString()}));


        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount(){
        document.addEventListener("petifyDeleteSong", this.handleSongDelete, true, true);
    }

    componentWillUnmount() {
        document.removeEventListener("petifyDeleteSong", this.handleSongDelete);
    }

    handleDelete(event){
        if(this.state.songs) {
            this.setState({
                songs: this.state.songs.filter((song) => song.id !== event.detail.songId)
            });
        }
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        let settings = "";
        let sessions = "";

        if(this.state.allowHeaders && this.state.allowHeaders.includes("PATCH")){
            settings = <div id="userSettings">
                <div className="setting">
                    <span className="settingTitle">Show Song In Title</span>
                    <input type="checkbox" value={this.state.user.showSongInTitle}/>
                </div>
                <div className="setting">
                    <span className="settingTitle">Debug Mode</span>
                    <span className="settingSubtitle">Show Debug Features</span>
                    <input type="checkbox" value={this.state.user.debugMode}/>
                </div>
                <div className="setting">
                    <span className="settingTitle">Shuffle Mode</span>
                    <select value={this.state.user.shuffleMode}>
                        <option value="RANDOM">Random</option>
                        <option value="FAVOUR_UNHEARD">Favour Unheard</option>
                        <option value="FAVOUR_LIKED">Favour Liked</option>
                    </select>
                </div>
                <div className="setting">
                    <span className="settingTitle">Recommended Mode</span>
                    <select value={this.state.user.shuffleMode}>
                        <option value="RANDOM">Random</option>
                        <option value="RANDOM_NOT_DISLIKED">Not disliked</option>
                        <option value="PLAYED">Played</option>
                        <option value="UNPLAYED">Unplayed</option>
                        <option value="LIKED">Liked</option>
                    </select>
                </div>
            </div>;

            if(this.state.sessions){
                sessions = <div>
                    {this.state.sessions.map((session)=>
                        <div>{session.id}</div>
                    )}
                </div>
            }
        }

        return (
            <>
                <ContextMenuWrapper/>
                <div id="userContainer">
                    <div id="userInfo">
                        {this.state.user.id && <img src={this.state.user.avatar} alt={this.state.user.username}/>}
                        <div>
                            <h2>{this.state.user.username}</h2>
                            <span id="memberSince">Member since <time dateTime={this.state.user.timestamp} title={this.state.user.timestamp}>{new Date(this.state.user.timestamp).toLocaleDateString()}</time></span>
                        </div>
                    </div>
                    {settings}{sessions}
                </div>
                <ul className='songList'>
                    <StandardLoader array={this.state.songs} mapFunction={(song)=><Song key={song.id} song={song}/>} noneText="This user has not uploaded any songs."/>
                </ul>
            </>);
    }
}