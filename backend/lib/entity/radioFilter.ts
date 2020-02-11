import Radio from "./radio";
import {App} from "../app";
import {QueryInterface} from "knex";
import PlaylistEntry from "./playlistEntry";

export default class RadioFilter {

    static TABLE = "radio_filters";
    id: number;
    radioID: string;
    exclude: boolean;
    and: boolean;
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
        this.exclude = !!obj.exclude;
        this.and = !!obj.and;
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


    constructQuery(query){
        let operator = this.and ? "and" : "or";
        let func = this.exclude ? "WhereNot" : "Where";
        let data;
        switch(this.filterType){
            case FilterType.ALBUM:
                data = {"album": this.filterData};
                break;
            case FilterType.ARTIST:
                data = {"artist": this.filterData};
                break;
            case FilterType.GENRE:
                data = {"genre": this.filterData};
                break;
            case FilterType.KEYWORD:
                data = App.getDB().raw('title LIKE ?', [`%${this.filterData}%`]);
                break;
            case FilterType.PLAYLIST:
                func = "WhereIn";
                data = ['songs.id', App.getDB().select("song_id").from(PlaylistEntry.TABLE).where({playlist_id: this.filterData})];
                break;
            case FilterType.USER:
                data = {"addedby": this.filterData};
                break;
        }
        if(!data)
            return query;
        if(data[0])
            return query[operator+func](...data);
        return query[operator+func](data);
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