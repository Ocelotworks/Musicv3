export default interface SongModel{
    id: string;
    artistID: string;
    albumID: string;
    path: string;
    genreID: string;
    duration: number;
    mbid: string;
    hash: string;
    title: string;
    addedby: string;
    timestamp: Date;
}