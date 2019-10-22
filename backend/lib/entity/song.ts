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

    private album: Album;
    private artist: Artist;
    private genre: Genre;
    private owner: User;


    constructor(obj){
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
    }

    static async create(id: String): Promise<Song>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Song(query[0]);
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
        return Genre.create(this.genreID);
    }

    async getOwner(): Promise<User> {
        if(this.owner)
            return this.owner;
        return User.create(this.userID);
    }

    async getTotalPlays(user: User = null): Promise<Number>{
        return null;
    }


}