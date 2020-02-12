import {Route} from "../../route";
import Middleware from "../../../middleware/Middleware";
import Radio from "../../../entity/radio";
import RadioFilter from "../../../entity/radioFilter";
import User, {UserLevel} from "../../../entity/user";
import Endware from "../../../middleware/Endware";

export default class Radios extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Radio.getAll(req.query.page, 50)));
        this.router.get('/:id', Middleware.getValidEntity(Radio), async (req, res)=>res.json(res.locals.radio));

        this.router.options('/:id', Middleware.getValidEntity(Radio, "id", true), Endware.GetOptionsForEntity("radio"));

        this.router.patch('/:id',  Middleware.getValidEntity(Radio), Middleware.requireOwner(Radio, 'addedby'), Endware.UpdateEntity("radio", ["name", "desc"]));

        this.router.get('/:id/filters', Middleware.getValidEntity(Radio), async (req, res)=>res.json(await RadioFilter.getForRadio(res.locals.radio)));
        this.router.get('/:id/songs', Middleware.getValidEntity(Radio), async (req, res)=>res.json(await res.locals.radio.getSongs(req.query.page)));
    }

    getBase(): string {
        return "/radio";
    }

    getName(): string {
        return "Radio API";
    }

}