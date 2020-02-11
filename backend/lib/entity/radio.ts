import User from "./user";
import Artist from "./artist";
import Album from "./album";
import Playlist from "./playlist";
import {App} from "../app";

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

}