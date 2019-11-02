import * as express from "express";
import * as bodyParser from "body-parser";
import Song from "./entity/song";
import * as Knex from "knex";
import Album from "./entity/album";
import Base from "./routes/base";

export class App {

    private static db: Knex = Knex(require('../knexfile.js'));
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        try {
            require('source-map-support').install();
        }catch(e){
            console.log(e);
        }
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        new Base(this, this.app);

        this.app.use(express.static('../frontend'));

        this.app.listen(3000);

    }

    public static getDB(): Knex{
        return this.db;
    }

}

export default new App().app;