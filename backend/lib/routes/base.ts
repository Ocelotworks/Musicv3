import {Route} from "./route";
import API from "./api";
import Middleware from "../middleware/Middleware";

export default class Base extends Route {
    createRoutes() {
        this.router.use(Middleware.authenticate);
        new API(this.app, this.router);
    }

    getBase(): string {
        return "/";
    }

    getName(): string {
        return "Base Router";
    }

}