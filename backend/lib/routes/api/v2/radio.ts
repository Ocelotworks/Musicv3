import {Route} from "../../route";
import Playlist from "../../../entity/playlist";
import Middleware from "../../../middleware/Middleware";
import Radio from "../../../entity/radio";
import RadioFilter from "../../../entity/radioFilter";

export default class Radios extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Radio.getAll(req.query.page, 50)));
        this.router.get('/:id', Middleware.getValidEntity(Radio), async (req, res)=>res.json(res.locals.radio));
        this.router.get('/:id/filters', Middleware.getValidEntity(Radio), async (req, res)=>res.json(await RadioFilter.getForRadio(res.locals.radio)));
    }

    getBase(): string {
        return "/radio";
    }

    getName(): string {
        return "Radio API";
    }

}