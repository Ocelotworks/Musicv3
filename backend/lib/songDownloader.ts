import {App} from "./app";
import QueuedDownload from "./entity/queuedDownload";
import * as config from 'config';
import * as ytdl from 'youtube-dl';

//No regexing for now
//const songRegex = /[{\[\('"].*["'\]\)}]|"|lyric(?s)|official|(music )?video|hd|.*\|\|/ig;

export default class SongDownloader {
    app: App;
    constructor(app){
        this.app = app;
    }


    async downloadOneSong() {
        const download = await QueuedDownload.getNextWaitingDownload();
        if (!download)
            return null;

        const dlConfig = config.get("download");

        const dlOptions = ["--ignore-errors"];

        if (dlConfig.get("proxy"))
            dlOptions.push("--proxy=" + dlConfig.get("proxy"));

        if (dlConfig.get("forceIpv4"))
            dlOptions.push("--force-ipv4");

        if (dlConfig.get("allowPlaylists"))
            dlOptions.push("--yes-playlist", "--flat-playlist");
        else
            dlOptions.push("--no-playlist");
    }

    async getVideoInfo(download: QueuedDownload, dlOptions: string[]){
        return new Promise((fulfill, reject)=>{
            ytdl.getInfo(download.url, dlOptions, async (err, info)=>{
                if(err)
                    return reject(err);

                if(!info)
                    return reject("No info found");

                //URL is a playlist, remove the playlist and add its contents
                if(info[0]){
                    await download.delete();
                    for (let i in info) {
                        if(!info.hasOwnProperty(i))continue;
                        //Copy the playlist object to preserve destination/addedby/etc
                        let newItem = new QueuedDownload(download.asOriginal());
                        newItem.url = info[i].url;
                        await newItem.insert();
                    }
                    return fulfill();
                }


                // @ts-ignore
                if(info.fulltitle) {
                    //Remove common crap from the title
                    // @ts-ignore
                    const fixedTitle = info.fulltitle;

                    //Attempt to split the title into song and artist using · or - or :
                    const titleSplit = fixedTitle.split(fixedTitle.includes("·") ? "·" : fixedTitle.includes(":") ? ":" : "-");

                    //Set the artist name as these for now
                    let artistName = (titleSplit[0] || "Unknown").trim();
                    let title = (titleSplit[1] || "Unknown").trim();

                    //If there is no good split in the name, just go with the whole thing
                    if(titleSplit.length !== 2){
                        title = fixedTitle;
                        // @ts-ignore
                        artistName = info.uploader;
                    }

                    //If there is a proper artist for the song provided, use that
                    // @ts-ignore
                    if(info.creator) {
                        // @ts-ignore
                        artistName = info.creator;
                    }

                    //If there is a proper title for the song provided, use that
                    //@ts-ignore
                    if(info.alt_title){
                        //@ts-ignore
                        title = info.alt_title
                    }

                    //Funky bandcamp shit
                    // @ts-ignore
                    if(!artistName && info.extractor === "Bandcamp" && info.webpage_url){
                        // @ts-ignore
                        artistName = info.webpage_url.split(".")[0].split("/")[2];
                    }



                }
            })
        })
    }


}