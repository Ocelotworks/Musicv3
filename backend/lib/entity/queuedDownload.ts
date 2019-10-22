import {App} from "../app";
import User from "./user";
import Artist from "./artist";
import Album from "./album";
import Playlist from "./playlist";
import Genre from "./genre";

export default class QueuedDownload{
    static TABLE = "queue";
    url: string;
    destination: string;
    userID: string;
    artistID: string;
    title: string;
    albumID: string;
    playlistID: string;
    status: DownloadStatus;

    private owner: User;
    private artist: Artist;
    private album: Album;
    private playlist: Playlist;

    constructor(obj){
        this.url = obj.url;
        this.destination = obj.destination;
        this.userID = obj.user;
        this.artistID = obj.artist;
        this.title = obj.title;
        this.albumID = obj.album;
        this.playlistID = obj.playlist;
        this.status = obj.playlist;
    }

    static async create(id: string): Promise<QueuedDownload>{
        const query = await (App.getDB().select().where({id}).from(this.TABLE).limit(1));
        if(!query[0])
            return null;
        return new QueuedDownload(query[0]);
    }

    async getArtist(): Promise<Artist>{
        if(this.artist)
            return this.artist;
        return this.artist = await Artist.create(this.artistID);
    }

    async getAlbum(): Promise<Album>{
        if(this.album)
            return this.album;
        return this.album = await Album.create(this.albumID);
    }

    async getPlaylist(): Promise<Playlist>{
        if(this.playlist)
            return this.playlist;
        return this.playlist = await Playlist.create(this.playlistID);
    }

    async getOwner(): Promise<User> {
        if(this.owner)
            return this.owner;
        return User.create(this.userID);
    }
}

export enum DownloadStatus {
    QUEUED = "QUEUED",
    WAITING = "WAITING",
    PROCESSING = "PROCESSING",
    DUPLICATE = "DUPLICATE",
    FAILED = "FAILED",
    OTHER = "OTHER",
}