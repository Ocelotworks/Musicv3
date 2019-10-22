import {App} from "../app";
import Song from "./song";

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

    async getSongs(): Promise<Song[]> {
        const query = await (App.getDB().select().where({addedby: this.id}).from(Song.TABLE));
        return query.map((obj)=>new Song(obj));
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
    USER,
    MODERATOR,
    ADMIN,
    GOD = 100
}