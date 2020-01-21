import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";
import User from "../../../entity/user";

export default class Users extends Route {

    createRoutes() {
        // this.router.get("/", async (req, res)=> res.json(await Song.getAll(req.query.page)));
        //this.router.get("/latest", async (req, res)=> res.json(await Song.getLastAdded()));
        //this.router.get("/since/:time", async (req, res)=> res.json(await Song.getUpdatedSince(req.params.time)));

        this.router.get('/:id', Middleware.getValidEntity(User), (req, res)=>res.json(res.locals.user));
        this.router.get('/:id/songs', Middleware.getValidEntity(User), async (req, res)=>res.json(await Song.getByUser(res.locals.user)));
    }

    getBase(): string {
        return "/user";
    }

    getName(): string {
        return "User API";
    }

}