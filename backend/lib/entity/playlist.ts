import {App} from "../app";
import PlaylistEntry from "./playlistEntry";
import User from "./user";
import Song from "./song";
import Artist from "./artist";


export default class Playlist{
    static TABLE = "playlists";
    id: string;
    name: string;
    private: boolean;
    ownerID: string;
    count: number;
    runtime: number;

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
        this.count = obj['count'];
        this.runtime = obj.runtime;
    }

    static async getAll(page: number, songsPerPage: number = 50, user: User = null): Promise<Playlist[]>{
        let query = App.getDB().select().from(Playlist.TABLE).innerJoin(User.TABLE, `${User.TABLE}.id`, `${Playlist.TABLE}.owner`).where({private: false}).options({nestTables: true});
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        if(user !== null)
            query = query.orWhere({owner: user.id});
        return (await query).map((obj)=>new Playlist(obj));
    }



    static async create(id): Promise<Playlist>{
        const query = await (App.getDB().select().where({id}).from(Playlist.TABLE).limit(1));
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
        const query = await (App.getDB().select(App.getDB().raw("playlist_data.*, songs.*, artists.name AS 'artistName'"))
            .where({playlist_id: this.id})
            .from(PlaylistEntry.TABLE)
            .innerJoin(Song.TABLE, "songs.id", "song_id")
            .innerJoin(Artist.TABLE, "artists.id", "songs.artist")
        );
        return this.songs = query.map((obj)=>new PlaylistEntry(obj, this));
    }
}

