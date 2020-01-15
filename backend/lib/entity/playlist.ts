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

    songs: PlaylistEntry[];

    constructor(obj){
        if(obj.playlists){
            this.owner = new User(obj.users);
            obj = obj.playlists;
        }

        this.id = obj.id;
        this.name = obj.name;
        this.private = !!obj.private;
        this.ownerID = obj.owner;
    }

    static async getAll(page: number, songsPerPage: number = 50): Promise<Playlist[]>{
        let query = App.getDB().select().from(Playlist.TABLE).innerJoin(User.TABLE, `${User.TABLE}.id`, `${Playlist.TABLE}.owner`).options({nestTables: true});
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        return (await query).map((obj)=>new Playlist(obj));
    }

    static async create(id): Promise<Playlist>{
        const query = await (App.getDB().select().where({id, private: false}).from(Playlist.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Playlist(query[0]);
    }


    async getAll(): Promise<Playlist> {
        await Promise.all([this.getOwner(), this.getSongs()]);
        return this;
    }

    async getOwner(): Promise<User> {
        return this.owner || (this.owner = await User.create(this.ownerID));
    }

    async getSongs(): Promise<PlaylistEntry[]>{
        const query = await (App.getDB().select().where({playlist_id: this.id}).from(PlaylistEntry.TABLE).innerJoin(Song.TABLE, "songs.id", "song_id"));
        return this.songs = query.map((obj)=>new PlaylistEntry(obj, this));
    }
}

