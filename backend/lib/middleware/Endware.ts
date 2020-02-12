//Alright, if it's not called Endware, what is it called?
import {UserLevel} from "../entity/user";

export default class Endware {

    static GetOptionsForEntity(entityName, owner = "ownerID", userLevelOverride = UserLevel.MODERATOR){
        return (req, res)=>{
            let options = ["OPTIONS", "GET", "HEAD"];
            if(res.locals.user && res.locals[entityName] && (res.locals.user.level > userLevelOverride|| res.locals[entityName][owner] === res.locals.user.id)){
                options.push("DELETE", "PATCH")
            }
            res.header('Access-Control-Expose-Headers', 'Allow');
            res.header('Access-Control-Allow-Methods', '*');
            res.header("Allow", options.join(", ")).send();
        }
    }

    static UpdateEntity(entityName: string, fields: string[]){
        return async (req, res)=>{
            if(!req.body)return res.status(400).json({err: "Bad Request"});
            fields.forEach((field)=>{
                if(req.body[field])
                    res.locals[entityName][field] = req.body[field]
            });
            await res.locals[entityName].update();
            res.status(202).json(res.locals[entityName]);
        }
    }
}