import Playlist from "./playlist";
import Song from "./song";

export default class PlaylistEntry extends Song {
    static TABLE = "playlist_data";
    position: Number;
    playlistID: string;

    private playlist: Playlist;

    constructor(obj){
        super(obj);
        this.position = obj.position;
        this.playlistID = obj.playlist_id;
    }

    async getPlaylist(): Promise<Playlist>{
        if(this.playlist)
            return this.playlist;
        return this.playlist = await Playlist.create(this.playlistID);
    }
}
