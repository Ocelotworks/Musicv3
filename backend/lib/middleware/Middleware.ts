import User, {UserLevel} from "../entity/user";

export default class Middleware{

    static getValidEntity(Entity, parameter = "id", passAnyway = false): any{
        return async function(req, res, next){
            const entity = await Entity.create(req.params[parameter]);
            if(!entity && !passAnyway)
                return res.status(404).json({error: "No Such Entity"});
            if(entity)
                res.locals[entity.constructor.name.toLowerCase()] = entity;
            next();
        };
    }


    static async authenticate(req, res, next){
        if(!req.headers['authorization'])
            return next();
        let parts = req.headers['authorization'].split(" ");
        if(parts[0] !== "Bearer")
            return next();

        let user = await User.getFromApiKey(parts[1]);

        if(!user)
            return next();

        //This might be a problem later
        res.locals.user = user;
        res.locals.loggedInUser = user;
        next();
    }


    static async requireAuthentication(req, res, next){
        if(res.locals.user)
            return next();
        res.status(401).json({error: "Authorisation Required"});
    }


    static requireOwner(Entity, owner = "ownerID", userLevelOverride = UserLevel.ADMIN){
        return function(req, res, next){
            let entityName = Entity.name.toLowerCase();
            let entity = res.locals[entityName];
            if(entity.private === false)
                return next();
            console.log(entity);
            if(res.locals.loggedInUser && (res.locals.loggedInUser.level >= userLevelOverride || entity[owner] && entity[owner] === res.locals.user.id))
                return next();

            res.status(404).json({error: "No Such Entity"});
        }
    }

    static requireLevel(level: UserLevel){
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