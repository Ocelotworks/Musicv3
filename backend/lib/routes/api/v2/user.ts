import {Route} from "../../route";
import Song from "../../../entity/song";
import Middleware from "../../../middleware/Middleware";
import User from "../../../entity/user";

import * as passport from "passport";

export default class Users extends Route {

    createRoutes() {
        this.router.get('/auth/google', passport.authenticate('google', {scope: ['profile'], session: false}));

        this.router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login-failed', session: false}), (req, res)=>{
            // @ts-ignore
            res.redirect(`http://localhost:3000/#!/login/${req.user.id}`)
        });

        this.router.get('/me', Middleware.requireAuthentication, (req, res)=>res.json(res.locals.user));
        this.router.get('/:id', Middleware.getValidEntity(User), (req, res)=>res.json(res.locals.user));
        this.router.get('/:id/songs', Middleware.getValidEntity(User), async (req, res)=>res.json(await Song.getByUser(res.locals.user, req.query.page)));
    }

    getBase(): string {
        return "/user";
    }

    getName(): string {
        return "User API";
    }

}