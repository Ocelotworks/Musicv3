import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";


export default class Songs extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Song.getAll(0)));
        this.router.get('/:id/info', Middleware.getValidEntity(Song), (req, res)=>res.json({
            id: res.locals.song.id,
            artist: res.locals.song.artistID,
            album: res.locals.song.albumID,
            duration: res.locals.song.duration,
            unused: null,
            path: res.locals.song.path,
            mbid: res.locals.song.mbid,
            title: res.locals.song.title,
            addedby: res.locals.song.userID,
            timestamp: res.locals.song.timestamp,
        }));

        this.router.get('/:id/details', Middleware.getValidEntity(Song), async (req, res)=>{
            let album = await res.locals.song.getAlbum();
            let owner = await res.locals.song.getOwner();
            let genre = await res.locals.song.getGenre();
            res.json({
                song_id: res.locals.song.id,
                artist_id: res.locals.song.artistID,
                album_id: res.locals.song.albumID,
                duration: res.locals.song.duration,
                title: res.locals.song.title,
                artist_name: res.locals.song.artist.name,
                album_name: album.name,
                genre_name: genre.name,
                username: owner.username,
                avatar: owner.avatar,
                userlevel: owner.level,
                path: res.locals.song.path,
            })}
        );

        this.router.get(['/:key/play/:id/:manual','/play/:id/:manual'], Middleware.getValidEntity(Song), async(req, res)=>{
            //this shit is so tedious
        })

    }

    getBase(): string {
        return "/song";
    }

    getName(): string {
        return "Legacy Song API";
    }

}