import User from "./user";
import {App} from "../app";
import RadioFilter from "./radioFilter";
import Song from "./song";
import {QueryInterface} from "knex";

export default class Radio {

    static TABLE = "radios";

    id: string;
    ownerID: string;
    name: string;
    desc: string;

    private owner: User;


    constructor(obj?){
        if(!obj)return;

        if(obj.users){
            this.owner = new User(obj.users);

            obj = obj.radios;
        }

        this.id = obj.id;
        this.ownerID = obj.owner;
        this.name = obj.name;
        this.desc = obj.desc;
    }

    static async create(id: string): Promise<Radio>{
        const query = await (App.getDB().select().where({'radios.id': id}).from(this.TABLE).limit(1)
            .innerJoin("users", "users.id", "radios.addedby").options({nestTables: true}));
        if(!query[0])
            return null;
        return new Radio(query[0]);
    }


    static async getAll(page: number, songsPerPage: number = 50): Promise<Radio[]>{
        let query = App.getDB().select().from(Radio.TABLE).innerJoin("users", "users.id", "radios.addedby").options({nestTables: true});
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        return (await query).map((obj)=>new Radio(obj));
    }

    async getSongs(page: number = 1): Promise<Song[]>{
        let filters = await RadioFilter.getForRadio(this);
        let query = App.getDB().select().from(Song.TABLE).innerJoin("artists", "artists.id", "songs.artist").limit(50).offset(50*(page-1)).options({nestTables: true});
        filters.forEach((filter)=>query = filter.constructQuery(query));
        return (await query).map((obj)=>new Song(obj));
    }

}