import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";
import Play from "../../../entity/plays";
import {UserLevel} from "../../../entity/user";

export default class Songs extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Song.getAll(req.query.page)));
        this.router.get("/latest", async (req, res)=> res.json(await Song.getLastAdded(6, parseInt(req.query.offset))));
        this.router.get("/recommended", async (req, res)=> res.json(await Song.getRecommended(res.locals.user)));
        this.router.get("/since/:time", async (req, res)=> res.json(await Song.getUpdatedSince(req.params.time)));

        this.router.get('/:id', Middleware.getValidEntity(Song), (req, res)=>res.json(res.locals.song));
        this.router.get('/:id/play', Middleware.getValidEntity(Song), (req, res)=>{
            res.header("Cache-Control", "public, max-age=999999");
            res.sendFile(res.locals.song.path.replace("/home/peter/music/songs", "G:\\Earth Backup\\peter\\music\\songs\\"));
        });

        this.router.put('/:id/play', Middleware.getValidEntity(Song), async (req, res)=>{
            let play = new Play({
                user: res.locals.user.id,
                song: req.params.id,
                manual: req.query.origin && req.query.origin === ""
            });
            await play.insert();
            res.status(204).send();
        });


        this.router.options('/:id', Middleware.getValidEntity(Song, "id", true), (req, res)=>{
            let options = ["OPTIONS", "GET", "HEAD"];
            if(res.locals.song && res.locals.user && (res.locals.user.level > UserLevel.MODERATOR || res.locals.user.id === res.locals.song.owner.id)){
               options.push("DELETE", "PATCH")
            }
            res.header('Access-Control-Expose-Headers', 'Allow');
            res.header('Access-Control-Allow-Methods', options.join(", "));
            res.header("Allow", options.join(", ")).send();
        });
        this.router.delete('/:id', Middleware.getValidEntity(Song), Middleware.requireOwner(Song, "userID"), async (req, res)=>{await res.locals.song.delete(); res.status(204).send()});

        this.router.get('/:id/related', Middleware.getValidEntity(Song), async (req, res)=>res.json(await res.locals.song.getRelated()));

        this.router.get('/:id/info', Middleware.getValidEntity(Song), async (req, res)=>{await res.locals.song.getAll();res.json(res.locals.song)});
        this.router.get('/:id/album',  Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/album/'+res.locals.song.albumID));
        this.router.get('/:id/artist', Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/artist/'+res.locals.song.artistID));
        this.router.get('/:id/genre',  Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/genre/'+res.locals.song.genreID));
        this.router.get('/:id/owner',  Middleware.getValidEntity(Song), (req, res)=>res.redirect('/api/v2/user/'+res.locals.song.userID));
    }

    getBase(): string {
        return "/song";
    }

    getName(): string {
        return "Song API";
    }

}