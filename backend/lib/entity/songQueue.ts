import {App} from "../app";
import User from "./user";
import Song from "./song";

export default class SongQueue {
    static TABLE = "song_queue";

    id: number;
    userID: string;
    songID: string;

    song: Song;

    constructor(obj){
        if(obj.songs){
            this.song = new Song(obj.songs);
            obj = obj.song_queue;
        }
        this.id = obj.id;
        this.userID = obj.user;
        this.songID = obj.song;
    }

    asOriginal(){
        return {
            id: this.id,
            user: this.userID,
            song: this.songID,
        }
    }

    static async getAll(page: number, songsPerPage: number = 50): Promise<SongQueue[]>{
        let query = App.getDB().select().from(SongQueue.TABLE);
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        return (await query).map((obj)=>new SongQueue(obj));
    }

    static async getForUser(user: User, offset: number = 0, limit: number = 10): Promise<SongQueue[]>{
        let query = App.getDB().select().from(SongQueue.TABLE).where({user: user.id}).innerJoin("songs", "songs.id", "song_queue.song").options({nestTables: true}).limit(limit);
        if(offset)
            query = query.offset(offset);
        return (await query).map((obj)=>new SongQueue(obj));
    }




}