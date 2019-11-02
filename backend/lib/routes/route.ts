import {App} from "../app";
import {Router} from "express";

export abstract class Route{

    abstract getName(): string
    abstract getBase(): string
    abstract createRoutes();

    app: App;
    router: Router = Router();

    constructor(app: App, router){
        this.app = app;

        this.createRoutes();

        router.use(this.getBase(), this.router);
    }
}

