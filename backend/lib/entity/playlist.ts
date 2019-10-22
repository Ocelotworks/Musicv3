import {App} from "../app";
import PlaylistEntry from "./playlistEntry";
import User from "./user";
import Song from "./song";


export default class Playlist{
    static TABLE = "playlists";
    id: string;
    name: string;
    private: boolean;
    ownerID: string;

    private owner: User;

    constructor(obj){
        this.id = obj.id;
        this.name = obj.name;
        this.private = !!obj.private;
        this.ownerID = obj.owner;
    }


    static async create(id): Promise<Playlist>{
        const query = await (App.getDB().select().where({id}).from(Playlist.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Playlist(query[0]);
    }

    async getOwner(): Promise<User> {
        if(this.owner)
            return this.owner;
        return User.create(this.ownerID);
    }

    async getSongs(): Promise<PlaylistEntry[]>{
        const query = await (App.getDB().select().where({playlist_id: this.id}).from(PlaylistEntry.TABLE).innerJoin(Song.TABLE, "id", "song_id"));
        return query.map((obj)=>new PlaylistEntry(obj));
    }
}

