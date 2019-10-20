import {App} from "../app";

export abstract class Route{

    abstract getName(): string
    abstract getBase(): string

    app: App;

    __constructor(app: App){
        this.app = app;
    }
}

