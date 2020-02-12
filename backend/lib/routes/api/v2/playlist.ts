import {Route} from "../../route";
import Playlist from "../../../entity/playlist";
import Middleware from "../../../middleware/Middleware";
import User from "../../../entity/user";
import Endware from "../../../middleware/Endware";

export default class Playlists extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Playlist.getAll(req.query.page, 50, res.locals.user)));
        this.router.get('/:id', Middleware.getValidEntity(Playlist), Middleware.requireOwner(Playlist), async (req, res)=>res.json(await res.locals.playlist.getAll()));
        this.router.get('/:id/info', Middleware.getValidEntity(Playlist), Middleware.requireOwner(Playlist), async (req, res)=>res.json(res.locals.playlist));

        this.router.options('/:id', Middleware.getValidEntity(Playlist, "id", true), Endware.GetOptionsForEntity("playlist"));

    }

    getBase(): string {
        return "/playlist";
    }

    getName(): string {
        return "Playlist API";
    }

}