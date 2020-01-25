import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";
import QueuedDownload from "../../../entity/queuedDownload";

export default class Downloads extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await QueuedDownload.getAll(req.query.page)));
        this.router.get('/:id', Middleware.getValidEntity(QueuedDownload), (req, res)=>res.json(res.locals.queueddownload));
        this.router.delete('/:id', Middleware.getValidEntity(QueuedDownload), (req, res)=>res.json(res.locals.queueddownload.delete()));
        this.router.get('/:id/album',  Middleware.getValidEntity(QueuedDownload), (req, res)=>res.redirect('/api/v2/album/'+res.locals.queueddownload.albumID));
        this.router.get('/:id/artist', Middleware.getValidEntity(QueuedDownload), (req, res)=>res.redirect('/api/v2/artist/'+res.locals.queueddownload.artistID));
        this.router.get('/:id/owner',  Middleware.getValidEntity(QueuedDownload), (req, res)=>res.redirect('/api/v2/user/'+res.locals.queueddownload.userID));
    }

    getBase(): string {
        return "/download";
    }

    getName(): string {
        return "Downloads API";
    }

}