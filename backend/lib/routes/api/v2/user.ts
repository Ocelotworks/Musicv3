import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";
import User, {UserLevel} from "../../../entity/user";

import * as passport from "passport";
import Radio from "../../../entity/radio";
import Endware from "../../../middleware/Endware";

export default class Users extends Route {

    createRoutes() {
        this.router.get('/auth/google', passport.authenticate('google', {scope: ['profile'], session: false}));

        this.router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login-failed', session: false}), (req, res)=>{
            // @ts-ignore
            res.redirect(`http://localhost:3001/#/login/${req.user.id}`)
        });

        this.router.get('/me', Middleware.requireAuthentication, (req, res)=>res.json(res.locals.user));
        this.router.get('/:id', Middleware.getValidEntity(User), (req, res)=>res.json(res.locals.user));

        this.router.get('/me/votes', Middleware.requireAuthentication, async (req, res)=>res.json(await res.locals.user.getVotes()));
        this.router.get('/:id/votes', Middleware.getValidEntity(User), async (req, res)=>res.json(await res.locals.user.getVotes()));

        this.router.get('/me/session', Middleware.requireAuthentication, async (req, res)=>res.json(await res.locals.user.getSessions()));

        this.router.options('/me', Endware.GetOptionsForEntity("loggedInUser", "id", UserLevel.ADMIN));
        this.router.options('/:id', Middleware.getValidEntity(User, "id", true), Endware.GetOptionsForEntity("loggedInUser", "id", UserLevel.ADMIN));

        this.router.patch('/me',  Middleware.requireAuthentication, Endware.UpdateEntity("user", ["shuffleMode", "showSongInTitle", "debugMode"]));
        this.router.patch('/:id',  Middleware.getValidEntity(User), Middleware.requireOwner(User, 'id'), Endware.UpdateEntity("user", ["shuffleMode", "showSongInTitle", "debugMode"]));

        this.router.get('/:id/songs', Middleware.getValidEntity(User), async (req, res)=>res.json(await Song.getByUser(res.locals.user, req.query.page)));
    }

    getBase(): string {
        return "/user";
    }

    getName(): string {
        return "User API";
    }

}