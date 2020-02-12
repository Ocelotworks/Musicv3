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
import LoginController from "../presentational/LoginController";
import Header from "../presentational/Header";
import axios from "axios";
import Radios from "./pages/Radios";
import Radio from "./pages/Radio";
import DefaultPlayerHandler from "../playerHandlers/DefaultPlayerHandler";
import RadioPlayerHandler from "../playerHandlers/RadioPlayerHandler";
import ChromecastPlayerHandler from "../playerHandlers/ChromecastPlayerHandler";





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
            duration: 0,
        },
        volume: 100,
        elapsed: 0,
        playing: false,
        buffering: false,
        autoplay: true,
        shuffle: true,
        castSession: null,
        castPlayer: null,
        castController: null,
        repeat: 0,
        repeatNow: false,
        history:[],
        queue: [],
        shuffleQueue: [],
        modalIsOpen: false,
        closeRequested: false,
        returnUrl: "/",
        user: null,
        radio: null,
        radioIncrement: 0,
    };

    toggleValue(value){
        return () => this.setState({[value]:!this.state[value]})
    }

    constructor(props){
        super(props);
        this.controls = new DefaultPlayerHandler(this);
    }

    saveCurrentSong() {
        if (!window.localStorage) return;

        window.localStorage.setItem("playing", JSON.stringify({song: this.state.song, elapsed: this.state.elapsed, playing: this.state.playing, radio: this.state.radio, radioIncrement: this.state.radioIncrement}));
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

    componentWillMount() {
        if(!window.localStorage)return;
        //God this is fucking stupid jesus christ
        if(window.localStorage.getItem("key") != null){
            console.log("Found login key");
            axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem("key")}`;
            axios.get('http://localhost:3000/api/v2/user/me').then((res)=>{
                this.controls.setCurrentUser(res.data);
            }).catch((error)=>console.error(error));
        }
    }

    componentDidMount(){

        this._audio.onstalled = ()=>this.setState({buffering: true});

        this._audio.onplaying = ()=>{
            this.setState({buffering: false});
        };

        this._audio.ondurationchange = (() => {
            this.setState((state)=>{
                const length = isNaN(this._audio.duration) ? 0 :this._audio.duration;
                if(state.song)
                    state.song.duration = length;
                else
                    state.song = {length};
                return state
            })
        });

        function max(num, max, min){
            if(num > max)return max;
            if(num < min)return min;
            return Math.floor(num);
        }
        /* eslint-disable*/
/*        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = audioCtx.createAnalyser();
        let source = audioCtx.createMediaElementSource(this._audio);
        source.connect(analyser);
        source.connect(audioCtx.destination);
        analyser.fftSize = 64;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        let inter;
        let socket = new WebSocket("ws://localhost:3002");
        socket.onopen = ()=>{
            console.log("Connected!");
            if(inter)
                clearInterval(inter);
            let lowTotal = 0;
            let midTotal = 0;
            let highTotal = 0;
            let count = 0;

            inter = setInterval(()=>{
                count++;
                analyser.getByteFrequencyData(dataArray);
                let lowCount = Math.floor(dataArray.slice(0, 10).reduce((x, y)=>x+y)/10);
                let midCount = Math.floor(dataArray.slice(10, 20).reduce((x, y)=>x+y)/10);
                let highCount = max(Math.floor(dataArray.slice(20).reduce((x, y)=>x+y)/10), 254, 0);

                let highest = lowCount;
                if(midCount > highest)highest = midCount;
                if(highCount > highest)highest = highCount;

                if(highest === midCount)
                    socket.send(JSON.stringify([2, 0, 0, highest, 0]));
                else if(highest === lowCount)
                    socket.send(JSON.stringify([2, 0, highest, 0, 0]));
                else
                    socket.send(JSON.stringify([2, 0, 0, 0, highest]));
            }, 25);
        };*/
        /* eslint-enable*/

        if(window.localStorage){
            if(window.localStorage.getItem("queue") != null) {
                try {
                    let queue = JSON.parse(window.localStorage.getItem("queue"));
                    if (Array.isArray(queue))
                        this.setState({queue});
                    else
                        window.localStorage.removeItem("queue")
                } catch (e) {
                    window.localStorage.removeItem("queue")
                }
            }

            if(window.localStorage.getItem("playing") != null){
                try {
                    let playingData = JSON.parse(window.localStorage.getItem("playing"));
                    this.setState({
                        elapsed: playingData.elapsed
                    });
                    this._audio.currentTime = playingData.elapsed;
                    this.controls.playTrack(playingData.song, false, false, true);
                    this.setState({playing: playingData.playing, radio: playingData.radio, radioIncrement: playingData.radioIncrement});
                    if(playingData.radio){
                        this.controls.setPlayerHandler(new RadioPlayerHandler(this, playingData.radio, true))
                    }
                    if(!playingData.playing) {
                        this._audio.pause()
                    }
                }catch(e){
                    console.error(e);
                    window.localStorage.removeItem("playing");
                }
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

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', ()=>this.controls.togglePlaying());
            navigator.mediaSession.setActionHandler('pause', ()=>this.controls.togglePlaying());
            navigator.mediaSession.setActionHandler('previoustrack', ()=>this.controls.previousTrack());
            navigator.mediaSession.setActionHandler('nexttrack', ()=>this.controls.nextTrack());
            navigator.mediaSession.setActionHandler('seekbackward', ()=>this.controls.seekTrack(null, this.state.elapsed-10));
            navigator.mediaSession.setActionHandler('seekforward', ()=>this.controls.seekTrack(null, this.state.elapsed+10));
        }

        window['__onGCastApiAvailable'] = (isAvailable) =>{
            /* eslint-disable*/
            if (isAvailable) {
                if(!cast)return;
                cast.framework.CastContext.getInstance().setOptions({
                    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                });

                let hasConnected = false;
                cast.framework.CastContext.getInstance().addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, (data)=>{
                    if(data.castState === cast.framework.CastState.CONNECTED){
                        let castPlayer = new cast.framework.RemotePlayer();
                        let castController = new cast.framework.RemotePlayerController(castPlayer);

                        this.setState({
                            castPlayer,
                            castController,
                            castSession: cast.framework.CastContext.getInstance().getCurrentSession(),
                        });

                        if(this.state.playing){
                            this._audio.pause();
                            this.controls.playTrack(this.state.song, false, true);
                            this.controls.seekTrack(null, this._audio.currentTime);
                        }
                        hasConnected = true;

                        this.controls.setPlayerHandler(new ChromecastPlayerHandler(this));

                    }else if(data.castState === cast.framework.CastState.NOT_CONNECTED){
                        this.setState({castSession: null});
                        if(hasConnected) {
                            hasConnected = false;
                            this.controls.setPlayerHandler(new DefaultPlayerHandler(this));
                        }
                    }
                })

            }
            /* eslint-enable */
        };
    }

    render() {
        return (<PlayerContext.Provider value={{data: this.state, control: this.controls}}>
            <Header/>
            <audio ref={(a)=>this._audio=a} crossOrigin="anonymous"/>
            <Sidebar/>
            {this.state.closeRequested && <Redirect to={this.state.returnUrl}>{this.setState({closeRequested: false})}</Redirect>}
            <div id="page">
                <Switch>
                    <Route path="/artist/:id" children={<StupidReact Target={Artist}/>}/>
                    <Route path="/album/:id" children={<StupidReact Target={Album}/>}/>
                    <Route path="/playlist/:id" children={<StupidReact Target={Playlist}/>}/>
                    <Route path="/playlist" children={<Playlists/>}/>
                    <Route path="/radio/:id" children={<StupidReact Target={Radio}/>}/>
                    <Route path="/radio" children={<Radios/>}/>
                    <Route path="/user/:id" children={<StupidReact Target={User}/>}/>
                    <Route path="/add" children={<Add/>}/>
                    <Route path={["/play/:id", "/play/:id/:seo"]} children={<StupidReact Target={Play}/>}/>
                    <Route path="/cast" children={<HomeController/>}/>
                    <Route path="/login/:key" children={<LoginController setCurrentUser={this.controls.setCurrentUser}/>}/>
                    <Route path="/" children={<HomeController/>}/>
                </Switch>
            </div>
            <ModalContainer modalIsOpen={this.state.modalIsOpen} setIsOpen={this.controls.setIsOpen} returnUrl={this.state.returnUrl} requestClose={this.controls.requestClose}/>
        </PlayerContext.Provider>);
    }
}