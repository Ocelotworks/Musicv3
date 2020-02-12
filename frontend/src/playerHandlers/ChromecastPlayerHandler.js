/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) ChromecastPlayerHandler
 *  ════╝
 */
import DefaultPlayerHandler from "./DefaultPlayerHandler";
import axios from "axios";

export default class ChromecastPlayerHandler extends DefaultPlayerHandler {

    playTrack(song, isHistory = false, isCast = false, skipElapsedUpdate = false, origin = "shuffleQueue") {
        this.playTrackSetup(song);

        /*eslint-disable*/
        let mediaInfo = new chrome.cast.media.MediaInfo(`https://unacceptableuse.com/petify/song/${song.id}`, "audio/mpeg");
        mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
        mediaInfo.metadata.artist = song.artist.name;
        mediaInfo.metadata.songName = song.title;
        mediaInfo.metadata.title = song.title;
        mediaInfo.metadata.images = [new chrome.cast.Image(`https://unacceptableuse.com/petify/album/${song.albumID}`)];
        let request = new chrome.cast.media.LoadRequest(mediaInfo);
        this.player.state.castSession.loadMedia(request).then(() => console.log('Load succeed'), (errorCode) => console.log('Error code: ' + errorCode));

        this.player.stateUpdater = setInterval(() => {
            if (!this.player.state.castSession)
                return clearInterval(this.player.stateUpdater);
            if (this.player.state.castSession.getMediaSession())
                this.player.setState({elapsed: this.player.state.castSession.getMediaSession().getEstimatedTime()});
            if (this.player.state.elapsed >= this.player.state.song.duration - 1) //Cast doesnt reach the exact end of the song so fuck it
                this.nextTrack();
        }, 500); //todo
        /*eslint-enable*/
    }

    togglePlaying(){
        /*eslint-disable */
        this.player.state.castController.playOrPause();
        /*eslint-enable */

        this.player.setState({
            playing: !this.player.state.playing,
        });

        if (window.localStorage) {
            this.player.saveCurrentSong();
        }
    }

    seekTrack(event, seek) {
        const elapsed = this.player.state.song.duration * (seek / 100);
        /* eslint-disable*/
        this.player.state.castSession.getMediaSession().seek({currentTime: elapsed}, console.log, console.error);
        this.player.state.castController.seek();
        /*eslint-enable*/

        this.player.setState({elapsed});
    }
}