import Artist from "./artist";
import {App} from "../app";
import Song from "./song";

export default class Album{
    static TABLE: string =  "albums";
    id: string;
    artistID: string;
    name: string;

    private artist: Artist;


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

    static async getAll(page: number, albumsPerPage: number = 50): Promise<Album[]>{
        let query = App.getDB().select("id", "artist", "name").from(Album.TABLE);
        if(page && page > 0)
            query = query.offset(page*albumsPerPage).limit(albumsPerPage);
        return (await query).map((obj)=>new Album(obj));
    }

    async getImage(): Promise<object> {
        const query = await (App.getDB().select("image").where({id: this.id}).from(Album.TABLE).limit(1));
        return query[0].image;
    }

    async getArtist(): Promise<Artist> {
        if(this.artist)
            return this.artist;
        return this.artist = await Artist.create(this.artistID);
    }

    async getSongs(): Promise<Song[]>{
        const query = await (App.getDB().select().where({album: this.id}).from(Song.TABLE));
        return query.map((obj)=>new Song(obj));
    }


}