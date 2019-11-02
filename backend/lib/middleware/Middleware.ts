import Song from "../entity/song";
import Album from "../entity/album";

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
}