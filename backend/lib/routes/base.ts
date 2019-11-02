import {Route} from "./route";
import API from "./api";

export default class Base extends Route {
    createRoutes() {
        new API(this.app, this.router);
    }

    getBase(): string {
        return "/";
    }

    getName(): string {
        return "Base Router";
    }

}