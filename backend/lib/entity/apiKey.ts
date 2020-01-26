
import {App} from "../app";
import * as short from "short-uuid";

export default class ApiKey{
    static TABLE = "api_keys";
    id: string;
    owner: string;
    revoked: boolean;
    expires: Date;
    session: boolean;

    constructor(obj){
        let generator = short();
        if(!obj.id){
            obj.id = generator.fromUUID(obj.owner)+generator.generate();
        }
        this.id = obj.id;
        this.owner = obj.owner;

        if(!obj.expires) {
            let expiry = new Date();
            expiry.setFullYear(expiry.getFullYear()+1);
            obj.expires = expiry;
        }

        this.expires = obj.expires;
        this.revoked = !!obj.revoked;
        this.session = !!obj.session;
    }

    static async create(id: string): Promise<ApiKey>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new ApiKey(query[0]);
    }

    async insert(){
        return (App.getDB().insert(this).into(ApiKey.TABLE))
    }
}