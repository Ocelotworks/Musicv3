import {Route} from "../../route";
import Playlist from "../../../entity/playlist";
import Middleware from "../../../middleware/Middleware";

export default class Playlists extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Playlist.getAll(req.query.page, 50, res.locals.user)));
        this.router.get('/:id', Middleware.getValidEntity(Playlist), Middleware.requireOwner(Playlist), async (req, res)=>res.json(await res.locals.playlist.getAll()));
    }

    getBase(): string {
        return "/playlist";
    }

    getName(): string {
        return "Playlist API";
    }

}