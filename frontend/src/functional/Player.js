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
    };

    toggleValue(value){
        return () => this.setState({[value]:!this.state[value]})
    }

    constructor(props){
        super(props);
        this.controls = {
            seekTrack: (event, seek)=>{
                const elapsed = this.state.song.duration * (seek/100);
                console.log("Seeking to ", elapsed);
                if(this.state.castSession){
                    this.state.castSession.getMediaSession().seek({currentTime: elapsed}, console.log, console.error);
                    this.state.castController.seek();
                }else{
                    this._audio.currentTime = elapsed;
                }

                this.setState({elapsed})
            },
            setVolume: (event, volume)=>this.setState({volume}),
            togglePlaying: ()=>{
                /*eslint-disable */
                if(this.state.castSession) {
                    this.state.castController.playOrPause();
                }else{
                    this._audio[!this.state.playing ? "play":"pause"]();
                }
                /*eslint-enable*/

                this.setState({
                    playing: !this.state.playing,
                });

                if(window.localStorage){
                    this.saveCurrentSong();
                }
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
            playTrack: (song, isHistory = false, isCast = false, skipElapsedUpdate = false, origin = "shuffleQueue")=>{
                if(this.state.song && this.state.song.id && this.state.elapsed > this.state.song.duration/2){
                    axios.put(`http://localhost:3000/api/v2/song/${this.state.song.id}/play?origin=${this.state.song.origin}`)
                }

                if(!isCast) {
                    this.setState((state) => {
                        if (state.song) {
                            if (isHistory) {
                                state[song.origin || "shuffleQueue"].unshift(state.song);
                            } else {
                                state.history.push(state.song)
                            }
                        }
                        song.origin = origin;
                        state.song = song;
                        state.playing = true;
                        if(!skipElapsedUpdate)
                            state.elapsed = 0;
                        state.buffering = !this.state.castSession;
                        return state;
                    });
                }

                if(this.stateUpdater)
                    clearInterval(this.stateUpdater);

                /*eslint-disable */
                if(this.state.castSession) {
                    let mediaInfo = new chrome.cast.media.MediaInfo(`https://unacceptableuse.com/petify/song/${song.id}`, "audio/mpeg");
                    mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
                    mediaInfo.metadata.artist = song.artist.name;
                    mediaInfo.metadata.songName = song.title;
                    mediaInfo.metadata.title = song.title;
                    mediaInfo.metadata.images = [new chrome.cast.Image(`https://unacceptableuse.com/petify/album/${song.albumID}`)];
                    let request = new chrome.cast.media.LoadRequest(mediaInfo);
                    this.state.castSession.loadMedia(request).then(()=>console.log('Load succeed'), (errorCode)=>console.log('Error code: ' + errorCode));

                    this.stateUpdater = setInterval(()=>{
                        if(!this.state.castSession)
                            return clearInterval(this.stateUpdater);
                        if(this.state.castSession.getMediaSession())
                            this.setState({elapsed: this.state.castSession.getMediaSession().getEstimatedTime()});
                        if(this.state.elapsed >= this.state.song.duration-1) //Cast doesnt reach the exact end of the song so fuck it
                            this.controls.nextTrack();
                    }, 500); //todo
                }else{
                    this._audio.autoplay = true;
                    this._audio.src = `https://unacceptableuse.com/petify/song/${song.id}`;
                    this.stateUpdater = setInterval(()=>{
                        if(this._audio.currentTime % 5 < 1){
                            this.saveCurrentSong();
                        }
                        this.setState({elapsed: this._audio.currentTime})
                    }, 500);
                }
                /*eslint-enable */
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
            setCurrentUser: (user)=>{
                //I hate myself
                console.log(user);
                this.setState({user})
            }
        }
    }

    saveCurrentSong() {
        if (!window.localStorage) return;

        window.localStorage.setItem("playing", JSON.stringify({song: this.state.song, elapsed: this.state.elapsed, playing: this.state.playing}));
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
                    this.setState({playing: playingData.playing});
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
            navigator.mediaSession.setActionHandler('play', this.controls.togglePlaying);
            navigator.mediaSession.setActionHandler('pause', this.controls.togglePlaying);
            navigator.mediaSession.setActionHandler('previoustrack', this.controls.previousTrack);
            navigator.mediaSession.setActionHandler('nexttrack', this.controls.nextTrack);
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

                    }else if(data.castState === cast.framework.CastState.NOT_CONNECTED){
                        this.setState({castSession: null});
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