import User, {UserLevel} from "../entity/user";

export default class Middleware{

    static getValidEntity(Entity, parameter = "id"): any{
        return async function(req, res, next){
            const entity = await Entity.create(req.params[parameter]);
            if(!entity)
                return res.status(404).json({error: "No Such Entity"});
            res.locals[entity.constructor.name.toLowerCase()] = entity;
            next();
        };
    }


    static async authenticate(req, res, next){
        if(!req.headers['Authorization'])
            return next();
        let parts = req.headers['Authorization'].split(" ");
        if(parts[0] !== "Bearer")
            return next();

        let user = await User.getFromApiKey(parts[1]);

        if(!user)
            return next();

        res.locals.user = user;
        next();
    }


    static async requireAuthentication(req, res, next){
        if(res.locals.user)
            return next();
        res.status(401).json({error: "Authorisation Required"});
    }

    static async requireLevel(level: UserLevel){
        return function(req, res, next){
            if(res.locals.user.level >= level)
                return next();
            res.status(403).json({error: "Forbidden"});
        }
    }

    static async requireUser(id: string, denyExistence: boolean = false){
        return function(req, res, next){
            if(res.locals.user.level >= UserLevel.MODERATOR || res.locals.user.id === id)
                return next();
            if(denyExistence)
                res.status(404).json({error: "No Such Entity"});
            else
                res.status(403).json({error: "Forbidden"});
        }
    }
}