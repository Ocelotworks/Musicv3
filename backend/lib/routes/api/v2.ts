import {Route} from "../route";
import Songs from "./v2/song";
import Albums from "./v2/album";
import Artists from "./v2/artist";
import Playlists from "./v2/playlist";
import User from "./v2/user";
import Downloads from "./v2/download";
import Radios from "./v2/radio";

const routes = [Songs, Albums, Artists, Playlists, User, Downloads, Radios];

export default class v2 extends Route{
    createRoutes() {
        routes.forEach((Route)=>new Route(this.app, this.router));
    }

    getBase(): string {
        return "/v2";
    }

    getName(): string {
        return "V2 API Base";
    }

}