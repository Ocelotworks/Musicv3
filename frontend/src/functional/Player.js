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
import {Route, Switch} from "react-router";
import Artist from "./pages/Artist";
import StupidReact from "../presentational/pages/StupidReact";
import Album from "./pages/Album";


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
            length: 120,
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
                // this._audio.src = `http://localhost:3000/api/v2/song/${song.id}/play`
            },
            clearQueue: ()=>this.setState({queue:[]}),
            saveQueue: ()=>null,
            addToQueue: (song)=>{
                if (Array.isArray(song))
                    return song.forEach((s)=>this.controls.addToQueue(s));
                song.origin = "queue";
                this.setState(state=>state.queue.push(song))
            },
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.volume <= 0){
            this._audio.volume = 0;
        }else {
            this._audio.volume = this.state.volume / 100;
        }
    }

    componentDidMount(){
      // this._audio.src = "http://localhost:3000/api/v2/song/87026859-1ea0-4e21-9d8a-14279d09a584/play";

        this._audio.onstalled = ()=>this.setState({buffering: true});

        this._audio.onplaying = ()=>{
            this.setState({buffering: false});
            if(this.stateUpdater)
                clearInterval(this.stateUpdater);
            this.stateUpdater = setInterval(()=>{this.setState({elapsed: this._audio.currentTime})}, 1000);
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
    }

    render() {
        return (<PlayerContext.Provider value={{data: this.state, control: this.controls}}>
            <audio ref={(a)=>this._audio=a} crossOrigin="anonymous"/>
            <Sidebar/>
            <div id="page">
                <Switch>
                    <Route path="/artist/:id">
                        <StupidReact Target={Artist}/>
                    </Route>
                    <Route path="/album/:id">
                        <StupidReact Target={Album}/>
                    </Route>
                    <Route path="/" children={<HomeController/>}/>
                </Switch>
            </div>
        </PlayerContext.Provider>);
    }
}