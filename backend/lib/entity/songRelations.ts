import Song from "./song";
import {App} from "../app";

export default class SongRelations {

    static TABLE = "song_relations";

    id: number;
    songID: string;
    relation: Relation;
    relatedSongID: string;
    direction: string;

    relatedSong: Song;

    constructor(obj, direction = "forwards"){
        if(obj.songs){
            this.relatedSong = new Song(obj);
            obj = obj.song_relations;
        }

        this.id = obj.id;
        this.songID = obj.song;
        this.relation = obj.relation;
        this.relatedSongID = obj.related;
        this.direction = direction;
    }


    static async getForSong(song: Song): Promise<SongRelations[]>{
        let forwardsQuery = App.getDB()
            .from(SongRelations.TABLE)
            .options({nestTables: true})
            .select("songs.*","song_relations.*","artists.name","artists.id")
            .innerJoin("songs", "song_relations.related", "songs.id")
            .innerJoin("artists", "artists.id", "songs.artist")
            .where({song: song.id});

        let backwardsQuery =  App.getDB()
            .from(SongRelations.TABLE)
            .options({nestTables: true})
            .select("songs.*","song_relations.*","artists.name","artists.id")
            .innerJoin("songs", "song_relations.song", "songs.id")
            .innerJoin("artists", "artists.id", "songs.artist")
            .where({related: song.id});


        //console.log(result);
        return (await forwardsQuery).map(sr => new SongRelations(sr, "forwards")).concat((await backwardsQuery).map(sr => new SongRelations(sr, "backwards")));
    }
}

export enum Relation {
    SAMPLES = "SAMPLES",
    COPIES = "COPIES",
    REMIX = "REMIX",
    ALTERNATE = "ALTERNATE",
    MASHUP = "MASHUP",
    REFERENCES = "REFERENCES",
    COVER = "COVER",
    DUPLICATE = "DUPLICATE",
}