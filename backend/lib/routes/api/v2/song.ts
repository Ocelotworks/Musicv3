import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";

export default class Songs extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Song.getAll(req.query.page)));

        this.router.get('/:id', Middleware.getValidEntity(Song), (req, res)=>res.json(res.locals.song));

        this.router.get('/:id/play', Middleware.getValidEntity(Song), (req, res)=>{
            res.header("Cache-Control", "public, max-age=999999");
            res.sendFile(res.locals.song.path);
        });

        this.router.get('/:id/album', Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/album/'+res.locals.song.albumID));
        this.router.get('/:id/artist', Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/artist/'+res.locals.song.artistID));
        this.router.get('/:id/genre', Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/genre/'+res.locals.song.genreID));
        this.router.get('/:id/owner', Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/user/'+res.locals.song.userID));
    }

    getBase(): string {
        return "/song";
    }

    getName(): string {
        return "Song API";
    }

}