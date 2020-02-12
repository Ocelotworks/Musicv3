import {App} from "../app";
import Song from "./song";
import apiKey from "./apiKey";
import ApiKey from "./apiKey";

export default class User {
    static TABLE = "users";
    id: string;
    authType: AuthType;
    authKey: string;
    username: string;
    avatar: string;
    level: UserLevel;
    showSongInUrl: boolean;
    showSongInTitle: boolean;
    shuffle: boolean;
    autoplay: boolean;
    repeat: boolean;
    shuffleMode: ShuffleMode;
    debugMode: boolean;


    constructor(obj){
        Object.defineProperty(this, 'authKey', {value: 'static', writable: true});
        Object.defineProperty(this, 'authType', {value: 'static', writable: true});
        //todo: privacy for this shit
        this.id = obj.id;
        this.authType = obj.authtype;
        this.authKey = obj.authkey;
        this.username = obj.username;
        this.avatar = obj.avatar;
        this.level = obj.userlevel;
        this.showSongInUrl = !!obj.showSongInUrl;
        this.showSongInTitle = !!obj.showSongInTitle;
        this.shuffle = !!obj.shuffle;
        this.autoplay = !!obj.autoplay;
        this.repeat = !!obj.repeat;
        this.shuffleMode = obj.shuffleMode;
        this.debugMode = obj.debugMode;
    }

    static async create(id: String): Promise<User>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new User(query[0]);
    }

    static async getFromApiKey(key: String): Promise<User>{
        const query = await (App.getDB().select().from("api_keys").where({'api_keys.id': key, revoked: 0}).limit(1).innerJoin(User.TABLE, "owner", User.TABLE+".id"));
        if(!query[0])
            return null;
        return new User(query[0]);
    }

    static async getFromAuthKey(key: String): Promise<User>{
        const query = await (App.getDB().select().from(User.TABLE).where({'authkey': key}).limit(1));
        if(!query[0])
            return null;
        return new User(query[0]);
    }

    async getSongs(): Promise<Song[]> {
        const query = await (App.getDB().select().where({addedby: this.id}).from(Song.TABLE));
        return query.map((obj)=>new Song(obj));
    }

    async generateSessionKey(): Promise<ApiKey>{
        let key = new ApiKey({
            owner: this.id,
            session: true,
        });
        await key.insert();
        return key;
    }


    asOriginal(){
        return {
            id: this.id,
            authtype: this.authType,
            authkey: this.authKey,
            username: this.username,
            userlevel: this.level,
            avatar: this.avatar,
            showSongInTitle: this.showSongInTitle,
            showSongInUrl: this.showSongInUrl,
            shuffle: this.shuffle,
            autoplay: this.autoplay,
            repeat: this.repeat,
            shuffleMode: this.shuffleMode,
            debugMode: this.debugMode,
        };
    }

    async update(){
        return (App.getDB().update(this.asOriginal()).into(User.TABLE).where({id: this.id}).limit(1))
    }
}


export enum AuthType {
    GOOGLE = "GOOGLE",
    BOT = "BOT",
    TWITTER = "TWITTER",
    STEAM = "STEAM"
}

export enum ShuffleMode {
    FAVOUR_LIKED = "FAVOUR_LIKED",
    FAVOUR_UNHEARD = "FAVOUR_UNHEAD",
    RANDOM = "RANDOM"
}

export enum UserLevel {
    BANNED = -1,
    GUEST,
    USER,
    MODERATOR,
    ADMIN,
    GOD = 100
}