import {PlayerContext} from "../Context.jsx";
import React from "react";
import MaterialIcon from '@material/react-material-icon';
import IconButton,{IconToggle} from '@material/react-icon-button';
export const Player = () => (
    <PlayerContext.Consumer>
        {({song, playing, elapsed, autoplay, shuffle, loop}) => (
        <div id='nowPlaying'>
            <img id='nowPlayingArt' src={song.album.url} alt={song.album.name}/>
            <span id='nowPlayingName'>Song Name</span>
            <span id='nowPlayingArtist'>Artist</span>
            <div id='nowPlayingControls'>
                <IconButton>
                    <MaterialIcon icon='fast_rewind' />
                </IconButton>
                <IconButton>
                    <MaterialIcon icon={playing ? 'play_arrow' : 'pause'} />
                </IconButton>
                <IconButton>
                    <MaterialIcon icon='fast_forward' />
                </IconButton>
                <div id='nowPlayingSubControls'>
                    <IconButton>
                        <IconToggle>
                            <MaterialIcon icon='repeat' />
                        </IconToggle>
                    </IconButton>
                    <IconButton>
                        <IconToggle isOn={shuffle}>
                            <MaterialIcon icon='shuffle' />
                        </IconToggle>
                    </IconButton>
                    <IconButton>
                        <IconToggle isOn={autoplay}>
                            <MaterialIcon icon='play_circle_outline' />
                        </IconToggle>
                    </IconButton>
                </div>
            </div>
        </div>
    )}
    </PlayerContext.Consumer>
);