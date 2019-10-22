import {App} from "../app";
import User from "./user";

export default class Device{
    static TABLE = "devices";
    id: string;
    name: string;
    userAgent: string;
    mobile: boolean;
    ownerID: string;
    lastSeen: Date;
    browser: String;
    os: String;


    private owner: User;

    constructor(obj){
        this.id = obj.id;
        this.name = obj.name;
        this.userAgent = obj.userAgent;
        this.mobile = !!obj.mobile;
        this.ownerID = obj.owner;
        this.lastSeen = obj.lastSeen;
        this.browser = obj.browser;
        this.os = obj.os;
    }

    static async create(id: string): Promise<Device>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Device(query[0]);
    }

    async getOwner(): Promise<User>{
        if(this.owner)
            return this.owner;
        return User.create(this.ownerID);
    }
}