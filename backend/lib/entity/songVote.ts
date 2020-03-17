import Song from "./song";
import User from "./user";

export default class SongVote {

    static TABLE = "votes";

    id: number;
    songID: string;
    ownerID: string;
    up: boolean;
    timestamp: Date;

    song: Song;
    owner: User;

    constructor(obj){
        this.id = obj.id;
        this.songID = obj.song;
        this.ownerID = obj.owner;
        this.up = !!obj.up;
        this.timestamp = new Date(obj.timestamp);
    }


}

