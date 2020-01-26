import {Route} from "./route";
import API from "./api";
import Middleware from "../middleware/Middleware";

import {Strategy} from 'passport-google-oauth20';
import * as passport from 'passport';
import * as config from 'config';
import User from "../entity/user";

export default class Base extends Route {
    createRoutes() {
        passport.use(new Strategy({
                clientID: config.get("oauth.google.clientID"),
                clientSecret: config.get("oauth.google.clientSecret"),
                callbackURL: "https://unacceptableuse.com/petifyv3/api/v2/user/auth/google/callback"
            },
            async function(accessToken, refreshToken, profile, cb) {
                let user = await User.getFromAuthKey(profile.id);
                if(user != null){
                    cb(null, await user.generateSessionKey());
                }else{
                    cb(new Error("alan please add user registration"));
                }
            }
        ));
        this.router.use(passport.initialize());
        this.router.use(Middleware.authenticate);
        new API(this.app, this.router);
    }

    getBase(): string {
        return "/";
    }

    getName(): string {
        return "Base Router";
    }

}