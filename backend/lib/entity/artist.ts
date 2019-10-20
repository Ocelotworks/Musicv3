import {App} from "../app";
import Song from "./song";
import Album from "./album";

export default class Artist {
    static TABLE = "artists";
    id: string;
    name: string;

    constructor(obj){
        this.id = obj.id;
        this.name = obj.name;
    }

    static async create(id: String): Promise<Artist>{
        const query = await (App.getDB().select("id","name").where({id}).from(Artist.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Artist(query[0]);
    }

    async getImage(): Promise<object> {
        const query = await (App.getDB().select("image").where({id: this.id}).from(Artist.TABLE).limit(1));
        return query[0].image;
    }

    async getSongs(): Promise<Song[]>{
        const query = await (App.getDB().select().where({artist: this.id}).from(Song.TABLE));
        return query.map((obj)=>new Song(obj));
    }

    async getAlbums(): Promise<Album[]>{
        const query = await (App.getDB().select().where({artist: this.id}).from(Album.TABLE));
        return query.map((obj)=>new Album(obj));
    }

}