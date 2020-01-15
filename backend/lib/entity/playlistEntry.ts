import Playlist from "./playlist";
import Song from "./song";

export default class PlaylistEntry extends Song {
    static TABLE = "playlist_data";
    position: Number;
    playlistID: string;

    private playlist: Playlist;

    constructor(obj, playlist){
        super(obj);
        //Stop circular json
        Object.defineProperty(this, 'playlist', {value: 'static', writable: true});
        this.position = obj.position;
        this.playlistID = obj.playlist_id;

        if(playlist != null)
            this.playlist = playlist;
    }

    async getPlaylist(): Promise<Playlist>{
        if(this.playlist)
            return this.playlist;
        return this.playlist = await Playlist.create(this.playlistID);
    }
}
