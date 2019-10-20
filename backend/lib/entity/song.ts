import Album from "./album";
import Artist from "./artist";
import Genre from "./genre";
import User from "./user";
import SongModel from "../model/song";
import * as Knex from "knex";
import Entity from "./entity";

export default class Song extends Entity implements SongModel{
    static TABLE: string = "songs";
    addedby: string;
    albumID: string;
    artistID: string;
    duration: number;
    genreID: string;
    hash: string;
    id: string;
    mbid: string;
    path: string;
    timestamp: Date;
    title: string;
    private static queryBuilder: Knex.QueryBuilder = new Knex.QueryBuilder();


    static async getSongFromID(id: int): Promise<Song>{
        const query = await (this.queryBuilder.select().from(this.TABLE).limit(1)) as Song[];

        return query[0];
    }

    async getAlbum(): Promise<Album>{
        return null
    }
    async getArtist(): Promise<Artist>{
        return null
    }
    async getGenre(): Promise<Genre> {
        return null;
    }
    async getUser(): Promise<User> {
        return null;
    }
    async getTotalPlays(user: User = null): Promise<Number>{
        return null;
    }


}