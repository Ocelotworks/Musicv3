import {Route} from "../route";
import Songs from "./v2/song";
import Albums from "./v2/album";
import Artists from "./v2/artist";
import Playlists from "./v2/playlist";
import User from "./v2/user";
import Downloads from "./v2/download";

export default class v2 extends Route{
    createRoutes() {
        new Songs(this.app, this.router);
        new Albums(this.app, this.router);
        new Artists(this.app, this.router);
        new Playlists(this.app, this.router);
        new User(this.app, this.router);
        new Downloads(this.app, this.router);
    }

    getBase(): string {
        return "/v2";
    }

    getName(): string {
        return "V2 API Base";
    }

}