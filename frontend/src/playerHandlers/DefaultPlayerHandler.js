import axios from "axios";
/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) DefaultPlayerHandler
 *  ════╝
 */


export default class DefaultPlayerHandler {
    
    player;
    
    constructor(player) {
        this.player = player;

        if(this.player.state.radio){
            console.log("Clearing radio");
            this.setRadio(null);
        }
    }
    
    shuffleArray(originalArray) {
        let array = [].concat(originalArray);
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    
    seekTrack(event, seek) {
        const elapsed = this.player.state.song.duration * (seek / 100);
        this.player._audio.currentTime = elapsed;
        this.player.setState({elapsed});
    }

    setVolume(event, volume){
        this.player.setState({volume})
    }

    togglePlaying() {
        this.player._audio[!this.player.state.playing ? "play" : "pause"]();

        this.player.setState({
            playing: !this.player.state.playing,
        });

        if (window.localStorage) {
            this.player.saveCurrentSong();
        }
    }

    toggleAutoplay() {
        this.player.toggleValue("autoplay")()
    }

    toggleShuffle() {
        this.player.toggleValue("shuffle")()
    }

    toggleCasting() {
        this.player.toggleValue("casting")()
    }

    setRepeat() {
        this.player.setState({repeat: (this.player.state.repeat + 1) % 3, repeatNow: this.player.state.repeat <= 1})
    }

    previousTrack() {
        if (this.player.state.history.length > 0)
            this.playTrack(this.player.state.history.pop(), true);
    }

    nextTrack() {
        if (this.player.state.repeat) {
            this.player.setState({repeatNow: true})
        }
        if (this.player.state.queue.length > 0) {
            this.playTrack(this.player.state.queue.shift());
        } else if (this.player.state.shuffleQueue.length > 0) {
            this.playTrack(this.player.state.shuffleQueue.shift());
        } else {
            this.player.setState({
                playing: false,
            })
        }
    }

    playTrackSetup(song){
        if (this.player.state.song && this.player.state.song.id && this.player.state.elapsed > this.player.state.song.duration / 2) {
            axios.put(`http://localhost:3000/api/v2/song/${this.player.state.song.id}/play?origin=${this.player.state.song.origin}`)
        }

        if (this.player.stateUpdater)
            clearInterval(this.player.stateUpdater);

        if ('mediaSession' in navigator) {
            /* eslint-disable-next-line */
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist.name,
                artwork: [
                    {
                        src: `http://localhost:3000/api/v2/album/${song.albumID}/image`,
                        sizes: '300x300',
                        type: 'image/png'
                    },
                ]
            });
        }
    }

    playTrack(song, isHistory = false, isCast = false, skipElapsedUpdate = false, origin = "shuffleQueue") {
        this.playTrackSetup(song);
        if (!isCast) {
            this.player.setState((state) => {
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
                if (!skipElapsedUpdate)
                    state.elapsed = 0;
                state.buffering = !this.player.state.castSession;
                return state;
            });
        }

        this.player._audio.autoplay = true;
        this.player._audio.src = `https://unacceptableuse.com/petify/song/${song.id}`;
        this.player.stateUpdater = setInterval(() => {
            if (this.player._audio.currentTime % 5 < 1) {
                this.player.saveCurrentSong();
            }
            this.player.setState({elapsed: this.player._audio.currentTime})
        }, 500);
    }

    clearQueue() {
        this.player.setState({queue: []})
    }

    saveQueue() {
    }

    addToQueue(song) {
        if (Array.isArray(song))
            return song.forEach((s) => this.addToQueue(s));
        song.origin = "queue";
        this.player.setState(state => state.queue.push(song));
    }

    shuffleToQueue(song) {
        this.addToQueue(this.shuffleArray(song));
    }

    queueNext(song) {
        if (Array.isArray(song))
            return song.forEach((s) => this.queueNext(s));
        song.origin = "queue";
        this.player.setState(state => state.queue.unshift(song));
    }

    setIsOpen(modalIsOpen, returnUrl = this.player.state.returnUrl) {
        this.player.setState({modalIsOpen, returnUrl})
    }

    requestClose() {
        this.player.setState({closeRequested: true, modalIsOpen: false})
    }

    setCurrentUser(user) {
        //I hate myself
        this.player.setState({user})
    }

    setRadio(radio) {
        this.clearQueue();
        this.player.setState({radio, radioIncrement: 2});
    }

    //Memory leak time?
    setPlayerHandler(handler){
        this.player.controls = handler;
    }

    getPlayer(){
        return this.player
    }
}

