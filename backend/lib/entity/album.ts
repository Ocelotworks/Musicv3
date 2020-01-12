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
        this.artistID = obj.artist;
        this.name = obj.name;

        if(obj.artistName){
            this.artist = new Artist({id: this.artistID, name: obj.artistName});
        }
    }

    static async create(id: String): Promise<Album>{
        let query = await App.getDB().select(App.getDB().raw("albums.id, artist, albums.name, artists.name AS 'artistName'"))
            .join("artists", "artists.id", "albums.artist")
            .where({'albums.id':id}).from(Album.TABLE);
        if(!query[0])
            return null;
        return new Album(query[0]);
    }

    static async getAll(page: number, albumsPerPage: number = 50): Promise<Album[]>{
        let query = App.getDB().select("albums.id", "artist", "albums.name", App.getDB().raw("artists.name AS 'artistName'")).innerJoin("artists", "artists.id", "albums.artist").from(Album.TABLE);
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
        let query = App.getDB()
            .select(App.getDB().raw("songs.*, artists.name AS 'artistName'"))
            .from(Song.TABLE)
            .where({album: this.id})
            .innerJoin("artists", "artists.id", "songs.artist");
        return (await query).map((obj)=>new Song(obj));
    }


}