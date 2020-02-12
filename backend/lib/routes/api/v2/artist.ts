import {Route} from "../../route";
import Middleware from "../../../middleware/Middleware";
import Artist from "../../../entity/artist";
import Playlist from "../../../entity/playlist";
import Endware from "../../../middleware/Endware";

export default class Artists extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Artist.getAll(req.query.page)));

        this.router.get('/:id', Middleware.getValidEntity(Artist), (req, res)=>res.json(res.locals.artist));

        this.router.get('/:id/image', Middleware.getValidEntity(Artist), async (req, res)=>{
            const image = await res.locals.artist.getImage();
            if(image)
                return res.end(image);
            res.header('Content-Type', 'image/png')
                .header("Cache-Control", "public, max-age=60000")
                .redirect('/img/album.png');
        });

        this.router.get('/:id/albums', Middleware.getValidEntity(Artist), async (req, res)=>res.json(await res.locals.artist.getAlbums()));
        this.router.get('/:id/songs',  Middleware.getValidEntity(Artist), async (req, res)=>res.json(await res.locals.artist.getSongs()));

        this.router.options('/:id', Middleware.getValidEntity(Artist, "id", true), Endware.GetOptionsForEntity("artist"));
    }

    getBase(): string {
        return "/artist";
    }

    getName(): string {
        return "Artist API";
    }

}