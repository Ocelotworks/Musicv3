import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as Knex from "knex";
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
        this.app.use(cors({preflightContinue: true}));
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(function(err, req, res, next){
           res.setHeader("Access-Control-Allow-Origin", "*");
           next();
        });

        new Base(this, this.app);
        this.app.use(express.static('../frontend/public'));

        this.app.use(function(err, req, res, next){
            res.status(500).json(err);
            console.log(err.stack);
        });

        this.app.listen(3000);

    }

    public static getDB(): Knex{
        return this.db;
    }

}

export default new App().app;