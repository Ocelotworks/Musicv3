import {Route} from "../../route";
import Playlist from "../../../entity/playlist";
import Middleware from "../../../middleware/Middleware";
import Radio from "../../../entity/radio";
import RadioFilter from "../../../entity/radioFilter";
import Song from "../../../entity/song";
import {UserLevel} from "../../../entity/user";

export default class Radios extends Route {

    createRoutes() {
        this.router.get("/", async (req, res)=> res.json(await Radio.getAll(req.query.page, 50)));
        this.router.get('/:id', Middleware.getValidEntity(Radio), async (req, res)=>res.json(res.locals.radio));

        this.router.options('/:id', Middleware.getValidEntity(Radio, "id", true), (req, res)=>{
            let options = ["OPTIONS", "GET", "HEAD"];
            if(res.locals.radio && res.locals.user && (res.locals.user.level > UserLevel.MODERATOR || res.locals.user.id === res.locals.radio.user.id)){
                options.push("DELETE", "PATCH")
            }
            res.header('Access-Control-Expose-Headers', 'Allow');
            res.header('Access-Control-Allow-Methods', options.join(", "));
            res.header("Allow", options.join(", ")).send();
        });

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