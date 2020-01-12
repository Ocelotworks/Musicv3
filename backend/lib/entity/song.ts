import Album from "./album";
import Artist from "./artist";
import Genre from "./genre";
import {App} from "../app";
import User from "./user";

export default class Song{
    static TABLE: string = "songs";
    userID: string;
    albumID: string;
    artistID: string;
    duration: number;
    genreID: string;
    hash: string;
    id: string;
    mbid: string;
    path: string;
    timestamp: Date;
    title: string;
    plays: number;

    album: Album;
    artist: Artist;
    genre: Genre;
    owner: User;


    constructor(obj){
        Object.defineProperty(this, 'path', {value: 'static', writable: true}); //Hide path from JSON
        this.userID = obj.addedby;
        this.albumID = obj.album;
        this.artistID = obj.artist;
        this.duration = obj.duration;
        this.genreID = obj.genre;
        this.hash = obj.hash;
        this.id = obj.id;
        this.mbid = obj.mbid;
        this.path = obj.path;
        this.timestamp = obj.timestamp;
        this.title = obj.title;

        if(obj.artistName){
            this.artist = new Artist({id: this.artistID, name: obj.artistName});
        }
    }


    static async getAll(page: number, songsPerPage: number = 50): Promise<Song[]>{
        let query = App.getDB().select().from(Song.TABLE);
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        return (await query).map((obj)=>new Song(obj));
    }


    static async getUpdatedSince(since): Promise<Song[]>{
        let query = App.getDB()
            .select(App.getDB().raw("songs.*, artists.name AS 'artistName'"))
            .from(Song.TABLE)
            .orderBy("updated", "DESC")
            .where("updated", ">=", new Date(since))
            .innerJoin("artists", "artists.id", "songs.artist");
        return (await query).map((obj)=>new Song(obj));
    }

    static async getLastAdded(count: number = 6): Promise<Song[]>{
        let query = App.getDB()
            .select(App.getDB().raw("songs.*, artists.name AS 'artistName'"))
            .from(Song.TABLE)
            .limit(count)
            .orderBy("timestamp", "DESC")
            .innerJoin("artists", "artists.id", "songs.artist");
        return (await query).map((obj)=>new Song(obj));
    }

    static async create(id: String): Promise<Song>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Song(query[0]);
    }

    async getAll(){
        await Promise.all([
            this.getAlbum(),
            this.getArtist(),
            this.getGenre(),
            this.getOwner(),
            this.getTotalPlays()
        ]);
    }

    async getAlbum(): Promise<Album>{
        if(this.album)
            return this.album;
        return this.album = await Album.create(this.albumID);
    }

    async getArtist(): Promise<Artist>{
        if(this.artist)
            return this.artist;
        return this.artist = await Artist.create(this.artistID);
    }

    async getGenre(): Promise<Genre> {
        if(this.genre)
            return this.genre;
        return this.genre = await Genre.create(this.genreID);
    }

    async getOwner(): Promise<User> {
        if(this.owner)
            return this.owner;
        return this.owner = await User.create(this.userID);
    }

    async getTotalPlays(user: User = null): Promise<Number>{
        if(user === null && this.plays != undefined){
            return this.plays
        }
        let query = App.getDB().select(App.getDB().raw("COUNT(*)")).from('plays').where({song: this.id});
        if(user)
            query = query.andWhere({user: user.id});
        const result = await query;
        if(!result[0])
            return 0;
        if(!user)
            this.plays = result[0]['COUNT(*)'];
        return result[0]['COUNT(*)'];
    }
}