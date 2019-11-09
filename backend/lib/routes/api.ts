import {Route} from "./route";
import v2 from "./api/v2";
import Middleware from "../middleware/Middleware";

export default class API extends Route {
    createRoutes() {
        new v2(this.app, this.router);
    }

    getBase(): string {
        return "/api";
    }

    getName(): string {
        return "API Base";
    }
}