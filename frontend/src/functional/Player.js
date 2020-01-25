/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 10/01/2020
 * ╚════ ║   (music3) Player
 *  ════╝
 */
import * as React from "react";
import {PlayerContext} from "../Context";
import Sidebar from "../presentational/Sidebar";
import HomeController from "./pages/Home";
import {Redirect, Route, Switch} from "react-router";
import Artist from "./pages/Artist";
import StupidReact from "../presentational/pages/StupidReact";
import Album from "./pages/Album";
import ModalContainer from "../presentational/Modal";
import Play from "./pages/Play";
import Playlists from "./pages/Playlists";
import Playlist from "./pages/Playlist";
import User from "./pages/User";
import Add from "./pages/Add";

export default class Player extends React.Component {
    state = {
        song : {
            id: "",
            albumID: "",
            name: "Nothing",
            artist: {
                name: "Nobody",
                id: ""
            },
            length: 0,
        },
        volume: 100,
        elapsed: 0,
        playing: false,
        buffering: false,
        autoplay: true,
        shuffle: true,
        casting: false,
        castConnected: false,
        repeat: 0,
        repeatNow: false,
        history:[],
        queue: [],
        shuffleQueue: [],
        modalIsOpen: false,
        closeRequested: false,
        returnUrl: "/",
    };

    toggleValue(value){
        return () => this.setState({[value]:!this.state[value]})
    }

    constructor(props){
        super(props);
        this.controls = {
            seekTrack: (event, seek)=>{
                const elapsed = this.state.song.length * (seek/100);
                console.log("Seeking to ", elapsed);
                this._audio.currentTime = elapsed;
                this.setState({elapsed})
            },
            setVolume: (event, volume)=>this.setState({volume}),
            togglePlaying: ()=>{
                this._audio[!this.state.playing ? "play":"pause"]();
                this.setState({
                    playing: !this.state.playing,
                })
            },
            toggleAutoplay: this.toggleValue("autoplay"),
            toggleShuffle: this.toggleValue("shuffle"),
            toggleCasting: this.toggleValue("casting"),
            setRepeat: ()=>this.setState({repeat: (this.state.repeat + 1) % 3, repeatNow: this.state.repeat <= 1}),
            previousTrack: ()=>{
                if(this.state.history.length > 0)
                    this.controls.playTrack(this.state.history.pop(), true);
            },
            nextTrack: ()=>{
                if(this.state.repeat){
                    this.setState({repeatNow: true})
                }
                if(this.state.queue.length > 0){
                    this.controls.playTrack(this.state.queue.shift());
                }else if(this.state.shuffleQueue.length > 0){
                    this.controls.playTrack(this.state.shuffleQueue.shift());
                }else{
                    this.setState({
                        playing: false,
                    })
                }
            },
            playTrack: (song, isHistory = false)=>{
                this.setState((state)=>{
                    if(state.song) {
                        if(isHistory){
                            state[song.origin || "shuffleQueue"].unshift(state.song);
                        }else{
                            state.history.push(state.song)
                        }
                    }
                    state.song = song;
                    state.playing = true;
                    state.elapsed = 0;
                    state.buffering = true;
                    return state;
                });
                this._audio.autoplay = true;
                this._audio.src = `https://unacceptableuse.com/petify/song/${song.id}`;
                if ('mediaSession' in navigator) {
                    /* eslint-disable-next-line */
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song.title,
                        artist: song.artist.name,
                        artwork: [
                            {src: `http://localhost:3000/api/v2/album/${song.albumID}/image`, sizes: '300x300', type: 'image/png'},
                        ]
                    });
                }
            },
            clearQueue: ()=>this.setState({queue:[]}),
            saveQueue: ()=>null,
            addToQueue: (song)=>{
                if (Array.isArray(song))
                    return song.forEach((s)=>this.controls.addToQueue(s));
                song.origin = "queue";
                this.setState(state=>state.queue.push(song));

            },
            queueNext: (song)=>{
                if (Array.isArray(song))
                    return song.forEach((s)=>this.controls.queueNext(s));
                song.origin = "queue";
                this.setState(state=>state.queue.unshift(song));



            },
            setIsOpen: (modalIsOpen, returnUrl = this.state.returnUrl)=>this.setState({modalIsOpen, returnUrl}),
            requestClose: ()=>this.setState({closeRequested: true, modalIsOpen: false}),
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.volume <= 0){
            this._audio.volume = 0;
        }else {
            this._audio.volume = this.state.volume / 100;
        }
        if(localStorage)
            localStorage.setItem("queue", JSON.stringify(this.state.queue));
    }

    componentDidMount(){
      // this._audio.src = "http://localhost:3000/api/v2/song/87026859-1ea0-4e21-9d8a-14279d09a584/play";

        this._audio.onstalled = ()=>this.setState({buffering: true});

        this._audio.onplaying = ()=>{
            this.setState({buffering: false});
            if(this.stateUpdater)
                clearInterval(this.stateUpdater);
            this.stateUpdater = setInterval(()=>{this.setState({elapsed: this._audio.currentTime})}, 500);
        };
        this._audio.onpause = ()=>{
            if(this.stateUpdater)
                clearInterval(this.stateUpdater);
        };
        this._audio.ondurationchange = (() => {
            this.setState((state)=>{
                const length = isNaN(this._audio.duration) ? 0 :this._audio.duration;
                if(state.song)
                    state.song.length = length;
                else
                    state.song = {length};
                return state
            })
        });

        if(window.localStorage && window.localStorage.getItem("queue") != null){
            try {
                let queue = JSON.parse(window.localStorage.getItem("queue"));
                if(Array.isArray(queue))
                    this.setState({queue});
                else
                    window.localStorage.removeItem("queue")
            }catch(e){
                window.localStorage.removeItem("queue")
            }
        }

        this._audio.loop = false;

        this._audio.onended = ()=>{
            if(!this.state.autoplay)return this.setState({playing: false});
            if(this.state.repeatNow){
                this.setState({
                    repeatNow: (this.state.repeat === 1 && this.state.repeatNow) ? false : this.state.repeatNow,
                    playing: true,
                    elapsed: 0,
                });
                this._audio.currentTime = 0;
                this._audio.play();
            }else{
                this.controls.nextTrack()
            }
        };

        if(this._audio.remote) {
            this._audio.remote.onconnect = ()=>{this.setState({casting: true, castConnected: true})};
            this._audio.remote.onconnecting = ()=>{this.setState({casting: true})};
            this._audio.remote.ondisconnect = ()=>{this.setState({casting: false, castConnected: false})}
        }

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', this.controls.togglePlaying);
            navigator.mediaSession.setActionHandler('pause', this.controls.togglePlaying);
            navigator.mediaSession.setActionHandler('previoustrack', this.controls.previousTrack);
            navigator.mediaSession.setActionHandler('nexttrack', this.controls.nextTrack);
            navigator.mediaSession.setActionHandler('seekbackward', ()=>this.controls.seekTrack(null, this.state.elapsed-10));
            navigator.mediaSession.setActionHandler('seekforward', ()=>this.controls.seekTrack(null, this.state.elapsed+10));
        }
    }

    render() {
        return (<PlayerContext.Provider value={{data: this.state, control: this.controls}}>
            <audio ref={(a)=>this._audio=a} crossOrigin="anonymous"/>
            <Sidebar/>
            {this.state.closeRequested && <Redirect to={this.state.returnUrl}>{this.setState({closeRequested: false})}</Redirect>}
            <div id="page">
                <Switch>
                    <Route path="/artist/:id" children={<StupidReact Target={Artist}/>}/>
                    <Route path="/album/:id" children={<StupidReact Target={Album}/>}/>
                    <Route path="/playlist/:id" children={<StupidReact Target={Playlist}/>}/>
                    <Route path="/playlist" children={<Playlists/>}/>
                    <Route path="/user/:id" children={<StupidReact Target={User}/>}/>
                    <Route path="/add" children={<Add/>}/>
                    <Route path={["/play/:id", "/play/:id/:seo"]} children={<StupidReact Target={Play}/>}/>
                    <Route path="/cast" children={<HomeController/>}/>
                    <Route path="/" children={<HomeController/>}/>
                </Switch>
            </div>
            <ModalContainer modalIsOpen={this.state.modalIsOpen} setIsOpen={this.controls.setIsOpen} returnUrl={this.state.returnUrl} requestClose={this.controls.requestClose}/>
        </PlayerContext.Provider>);
    }
}