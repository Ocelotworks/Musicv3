import {Route} from "../route";

import Songs from "./v1/song";

const routes = [Songs];

export default class v1 extends Route{
    createRoutes() {
        routes.forEach((Route)=>new Route(this.app, this.router));
    }

    getBase(): string {
        return "/v1";
    }

    getName(): string {
        return "V1 API Base";
    }

}