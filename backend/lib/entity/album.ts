import Artist from "./artist";
import {App} from "../app";
import Song from "./song";

export default class Album{
    static TABLE: string =  "albums";
    id: string;
    artistID: string;
    name: string;


    constructor(obj){
        this.id = obj.id;
        this.artistID = obj.id;
        this.name = obj.name;
    }

    static async create(id: String): Promise<Album>{
        const query = await (App.getDB().select("id", "artist", "name").where({id}).from(Album.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Album(query[0]);
    }

    async getImage(): Promise<object> {
        const query = await (App.getDB().select("image").where({id: this.id}).from(Album.TABLE).limit(1));
        return query[0].image;
    }

    async getArtist(): Promise<Artist> {
        return null;
    }

    async getSongs(): Promise<Song[]>{
        const query = await (App.getDB().select().where({album: this.id}).from(Song.TABLE));
        return query.map((obj)=>new Song(obj));
    }


}