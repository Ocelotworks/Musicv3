import User from "./user";
import Artist from "./artist";
import Album from "./album";
import Playlist from "./playlist";
import {App} from "../app";
import {DownloadStatus} from "./queuedDownload";

export default class Play{
    static TABLE = "plays";

    id: number;
    userID: string;
    songID: string;
    timestamp: Date;
    manual: boolean;


    constructor(obj) {
        this.id = obj.id;
        this.userID = obj.user;
        this.songID = obj.song;
        this.timestamp = obj.timestamp;
        this.manual = !!obj.manual;
    }


    private asOriginal(){
        return {
            id: this.id,
            user: this.userID,
            song: this.songID,
            timestamp: this.timestamp,
            manual: this.manual,
        }
    }

    static async create(id: string): Promise<Play>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new Play(query[0]);
    }

    insert(){
        return (App.getDB().insert(this.asOriginal()).into(Play.TABLE))
    }

    //XXX: not yet implemented
    static async getAll(page: number, songsPerPage: number = 50): Promise<Play[]>{
        let query = App.getDB()
            .select()
            .options({nestTables: true})
            .from(Play.TABLE)
            .innerJoin("artists", "artists.id", "queue.artist")
            .innerJoin("albums", "albums.id", "queue.album")
            .innerJoin("users", "users.id", "queue.addedby")
            .leftJoin("playlists", "playlists.id", "queue.playlist")
            .orderBy("queue.id", "DESC");
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        return (await query).map((obj)=>new Play(obj));
    }
}