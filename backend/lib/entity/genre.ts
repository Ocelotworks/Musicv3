import {App} from "../app";
import Song from "./song";

export default class Genre {
    static TABLE = "genres";

    id: string;
    name: string;

    constructor(obj){
        this.id = obj.id;
        this.name = obj.name;
    }

    static async create(id: string): Promise<Genre>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Genre(query[0]);
    }

    async getSongs(): Promise<Song[]>{
        const query = await (App.getDB().select().where({genre: this.id}).from(Song.TABLE));
        return query.map((obj)=>new Song(obj));
    }

    async getImage(): Promise<Object>{
        const query = await (App.getDB().select("image").where({id: this.id}).from(Genre.TABLE).limit(1));
        return query[0].image;
    }
}