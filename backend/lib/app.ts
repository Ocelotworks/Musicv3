import * as express from "express";
import * as bodyParser from "body-parser";
import Song from "./entity/song";
import * as Knex from "knex";
import Album from "./entity/album";

export class App {

    private static db: Knex = Knex(require('../knexfile.js'));
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();

        (async function() {
            let song: Song = await Song.create("e62744c3-8e74-40be-aad0-20c16b250142");
            let album: Album = await song.getAlbum();
            let songs = await album.getSongs();
            console.log(songs);
        })();
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(express.static('../frontend'));
    }

    public static getDB(): Knex{
        return this.db;
    }

}

export default new App().app;