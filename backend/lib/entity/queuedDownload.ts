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
    id: number;

    private owner: User;
    private artist: Artist;
    private album: Album;
    private playlist: Playlist;

    constructor(obj){
        if(obj.artists){
            this.artist = new Artist(obj.artists);
            this.album = new Album(obj.albums);
            this.owner = new User(obj.users);
            if(obj.playlists && obj.playlists.id) {
                this.playlist = new Playlist(obj.playlists)
            }
            obj = obj.queue;
        }

        this.id = obj.id;
        this.url = obj.url;
        this.destination = obj.destination;
        this.userID = obj.user;
        this.artistID = obj.artist;
        this.title = obj.title;
        this.albumID = obj.album;
        this.playlistID = obj.playlist;
        this.status = obj.status;
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
        return this.owner = await User.create(this.userID);
    }

    async delete(): Promise<boolean>{
        let query = App.getDB().delete().from(QueuedDownload.TABLE).where({id: this.id}).limit(1);
        return await query > 0;
    }

    static async getAll(page: number, songsPerPage: number = 50): Promise<QueuedDownload[]>{
        let query = App.getDB()
            .select()
            .options({nestTables: true})
            .from(QueuedDownload.TABLE)
            .innerJoin("artists", "artists.id", "queue.artist")
            .innerJoin("albums", "albums.id", "queue.album")
            .innerJoin("users", "users.id", "queue.addedby")
            .leftJoin("playlists", "playlists.id", "queue.playlist")
            .orderBy("queue.id", "DESC");
        if(page)
            query = query.offset(page*songsPerPage).limit(songsPerPage);
        return (await query).map((obj)=>new QueuedDownload(obj));
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