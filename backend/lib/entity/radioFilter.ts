import Radio from "./radio";
import {App} from "../app";

export default class RadioFilter {

    static TABLE = "radio_filters";
    id: number;
    radioID: string;
    filterType: FilterType;
    filterData: string;

    radio: Radio;

    constructor(obj){
        if(obj.radios){
            this.radio = new Radio(obj.radios);
            obj = obj.radio_filters;
        }

        this.id = obj.id;
        this.radioID = obj.radio;
        this.filterType = obj.filtertype;
        this.filterData = obj.filterdata;
    }


    static async create(id: string): Promise<RadioFilter>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new RadioFilter(query[0]);
    }

    static async getForRadio(radio: Radio): Promise<RadioFilter[]> {
        const query = await (App.getDB().select().where({radio: radio.id}).from(this.TABLE));
        if(!query[0])
            return [];
        return query.map((rf)=>new RadioFilter(rf));
    }

}


enum FilterType {
    ARTIST = "ARTIST",
    ALBUM = "ALBUM",
    SONG = "SONG",
    GENRE = "GENRE",
    PLAYLIST = "PLAYLIST",
    USER = "USER",
    KEYWORD = "KEYWORD",
    DJ = "DJ",
}