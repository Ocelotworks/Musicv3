import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";
import Album from "../../../entity/album";
import Playlist from "../../../entity/playlist";
import Endware from "../../../middleware/Endware";

export default class Albums extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Album.getAll(req.query.page)));

        this.router.get('/:id', Middleware.getValidEntity(Album), (req, res)=>res.json(res.locals.album));

        this.router.get('/:id/artist', Middleware.getValidEntity(Album), (req, res)=>res.redirect('/api/v2/artist/'+res.locals.album.artistID));
        this.router.get('/:id/songs',  Middleware.getValidEntity(Album), async (req, res)=>res.json(await res.locals.album.getSongs()));
        this.router.get('/:id/image',  Middleware.getValidEntity(Album), async (req, res)=>{
            const image = await res.locals.album.getImage();
            if(image)
                return res.header('Content-Type', 'image/png')
                            .header("Cache-Control", "public, max-age=60000")
                            .end(image);
            res.header('Content-Type', 'image/png')
                .header("Cache-Control", "public, max-age=60000")
                .redirect('/img/album.png');
        });

        this.router.options('/:id', Middleware.getValidEntity(Album, "id", true), Endware.GetOptionsForEntity("album"));
    }

    getBase(): string {
        return "/album";
    }

    getName(): string {
        return "Album API";
    }

}